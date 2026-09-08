import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isFallback: boolean;
}

// Global cache to prevent multiple connections during Vite HMR / dev restarts
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  isFallback: false,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connects to MongoDB with connection pooling and resilient error handling.
 * If MONGODB_URI is not provided or fails to connect in local development,
 * graceful in-memory storage fallback is enabled.
 */
export async function connectToDatabase(): Promise<{ isConnected: boolean; isFallback: boolean }> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    if (!cached.isFallback) {
      console.log("[MongoDB] MONGODB_URI not provided. Running in resilient local fallback mode.");
      cached.isFallback = true;
    }
    return { isConnected: false, isFallback: true };
  }

  if (cached.conn) {
    return { isConnected: true, isFallback: false };
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        console.log("[MongoDB] Connected successfully to database cluster.");
        cached.isFallback = false;
        return m;
      })
      .catch((err) => {
        console.warn("[MongoDB] Connection error, switching to resilient fallback mode:", err.message);
        cached.isFallback = true;
        cached.promise = null;
        return null as any;
      });
  }

  try {
    cached.conn = await cached.promise;
    return { isConnected: !!cached.conn, isFallback: cached.isFallback };
  } catch {
    return { isConnected: false, isFallback: true };
  }
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
