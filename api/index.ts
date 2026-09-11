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
  await ensureDb();
  return (app as any)(req, res);
}
