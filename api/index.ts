import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server';
import { connectToDatabase } from '../src/lib/db/connect';

// Ensure DB is connected on cold start
let dbInitialized = false;
async function ensureDb() {
  if (!dbInitialized) {
    try {
      await connectToDatabase();
      dbInitialized = true;
    } catch (e) {
      console.error('[Vercel] DB init error:', e);
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureDb();
    // Normalize req.url if Vercel serverless passes function path
    if (req.url && req.url.startsWith("/api/index.ts")) {
      req.url = req.url.replace("/api/index.ts", "/api") || "/api";
    }
    return (app as any)(req, res);
  } catch (err: any) {
    console.error("[Vercel Handler Error]:", err);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Serverless execution error", details: err?.message || String(err) });
    }
  }
}
