import { NextRequest, NextResponse } from "next/server";
import { dbConnect, isDbConnected } from "@/src/lib/db/server";
import { UserModel } from "@/src/lib/db/models";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    if (!isDbConnected()) {
      return NextResponse.json({ error: "DB down" }, { status: 503 });
    }
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const todayStr = new Date().toISOString().split("T")[0];
    if (user.lastClaimDate === todayStr) {
      return NextResponse.json({ error: "Already claimed today" }, { status: 400 });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (user.lastClaimDate === yesterdayStr) {
      user.claimStreak += 1;
    } else {
      user.claimStreak = 1;
    }

    user.lastClaimDate = todayStr;
    const isDay7 = user.claimStreak % 7 === 0;
    const bonus = isDay7 ? 20 : 5;

    user.freeCredits += bonus;
    await user.save();

    return NextResponse.json({
      success: true,
      added: bonus,
      newTotal: user.freeCredits,
      streak: user.claimStreak,
      isDay7,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Claim failed" }, { status: 500 });
  }
}
