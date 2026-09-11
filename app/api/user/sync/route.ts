import { NextRequest, NextResponse } from "next/server";
import { dbConnect, isDbConnected } from "@/src/lib/db/server";
import { UserModel, memoryFallbackStore } from "@/src/lib/db/models";

// Simple in-memory cache (per-function, resets on cold start)
const cache = new Map<string, { data: any; at: number }>();
const TTL = 5 * 60 * 1000;

function getCached(id: string) {
  const e = cache.get(id);
  return e && Date.now() - e.at < TTL ? e.data : null;
}
function setCached(id: string, data: any) {
  cache.set(id, { data, at: Date.now() });
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { userId, displayName, email } = await request.json();
    if (!userId)
      return NextResponse.json({ error: "userId required" }, { status: 400 });

    const cached = getCached(userId);
    if (cached) return NextResponse.json({ user: cached, isNew: false, fromCache: true });

    if (isDbConnected()) {
      let user = await UserModel.findById(userId);
      let isNew = false;
      if (!user) {
        isNew = true;
        user = await UserModel.create({
          _id: userId,
          displayName: displayName || "Astro Seeker",
          gender: "other",
          birthDate: "2000-01-01",
          birthTime: "12:00",
          birthTimeUnknown: true,
          birthPlace: "India",
          freeCredits: 150,
          paidCredits: 0,
          claimStreak: 0,
          lastClaimDate: null,
        });
      } else if (displayName && user.displayName === "Astro Seeker") {
        user.displayName = displayName;
        await user.save();
      }
      const userObj = user.toObject();
      setCached(userId, userObj);
      return NextResponse.json({ user: userObj, isNew, fromCache: false });
    }

    const user = memoryFallbackStore.getUser(userId);
    if (displayName) user.displayName = displayName;
    setCached(userId, user);
    return NextResponse.json({ user, isNew: false, fromCache: false });
  } catch (err: any) {
    console.error("[sync] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
