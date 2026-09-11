/**
 * Next.js-safe MongoDB singleton.
 * Reuses existing connection across hot-reloads in dev and across serverless invocations.
 */
import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | null | undefined;
}

let isConnected = false;

export async function dbConnect(): Promise<void> {
  if (isConnected) return;
  if (global._mongooseConn) {
    isConnected = true;
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("[MongoDB] MONGODB_URI not set — running without DB");
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: true,
    });
    global._mongooseConn = conn;
    isConnected = true;
    console.log("[MongoDB] Connected successfully");
  } catch (err: any) {
    console.warn("[MongoDB] Connection failed:", err.message);
  }
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
