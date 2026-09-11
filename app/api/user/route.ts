import { NextRequest, NextResponse } from "next/server";
import { dbConnect, isDbConnected } from "@/src/lib/db/server";
import { UserModel, memoryFallbackStore } from "@/src/lib/db/models";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = "default_user", ...updates } = body;

    const isComplete = Boolean(updates.birthDate && updates.birthPlace);
    if (isComplete) {
      updates.isProfileComplete = true;
    }

    await dbConnect();
    if (isDbConnected()) {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, upsert: true }
      );
      return NextResponse.json({ success: true, user });
    }

    const user = memoryFallbackStore.getUser(userId);
    Object.assign(user, updates);
    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
