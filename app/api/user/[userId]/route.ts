import { NextRequest, NextResponse } from "next/server";
import { dbConnect, isDbConnected } from "@/src/lib/db/server";
import { UserModel, memoryFallbackStore } from "@/src/lib/db/models";

const cache = new Map<string, { data: any; at: number }>();
const TTL = 5 * 60 * 1000;

function getCached(id: string) {
  const e = cache.get(id);
  return e && Date.now() - e.at < TTL ? e.data : null;
}
function setCached(id: string, data: any) {
  cache.set(id, { data, at: Date.now() });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await params;

    const cached = getCached(userId);
    if (cached)
      return NextResponse.json({ user: cached, isDatabaseConnected: true, fromCache: true });

    if (isDbConnected()) {
      let user = await UserModel.findById(userId);
      if (!user) {
        user = await UserModel.create({
          _id: userId,
          displayName: "Astro Seeker",
          gender: "other",
          birthDate: "2000-01-01",
          birthTime: "12:00",
          freeCredits: 150,
          paidCredits: 0,
        });
      }
      const userObj = user.toObject();
      setCached(userId, userObj);
      return NextResponse.json({ user: userObj, isDatabaseConnected: true, fromCache: false });
    }

    const user = memoryFallbackStore.getUser(userId);
    setCached(userId, user);
    return NextResponse.json({ user, isDatabaseConnected: false, fromCache: false });
  } catch (err: any) {
    console.error("User fetch error:", err);
    const user = memoryFallbackStore.getUser("default_user");
    return NextResponse.json({ user, isDatabaseConnected: false });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await params;
    const updates = await request.json();

    if (isDbConnected()) {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, upsert: true }
      );
      cache.delete(userId);
      return NextResponse.json({ success: true, user });
    }

    const user = memoryFallbackStore.getUser(userId);
    Object.assign(user, updates);
    cache.delete(userId);
    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
