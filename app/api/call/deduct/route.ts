import { NextRequest, NextResponse } from "next/server";
import { dbConnect, isDbConnected } from "@/src/lib/db/server";
import { UserModel, CallSessionModel, memoryFallbackStore } from "@/src/lib/db/models";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, userId = "default_user", ratePerMinute = 25 } = await req.json();
    const perMinuteCost = Number(ratePerMinute) || 25;

    let remainingBalance = 0;
    await dbConnect();
    if (isDbConnected()) {
      const user = await UserModel.findById(userId);
      if (!user || user.paidCredits < perMinuteCost) {
        return NextResponse.json({
          success: false,
          insufficientBalance: true,
          remainingBalance: user?.paidCredits || 0,
        });
      }

      user.paidCredits -= perMinuteCost;
      await user.save();
      remainingBalance = user.paidCredits;

      if (sessionId) {
        await CallSessionModel.findByIdAndUpdate(sessionId, {
          $inc: { durationSeconds: 60, totalDeducted: perMinuteCost },
        });
      }
    } else {
      const user = memoryFallbackStore.getUser(userId);
      if ((user.paidCredits || 0) < perMinuteCost) {
        return NextResponse.json({
          success: false,
          insufficientBalance: true,
          remainingBalance: user.paidCredits || 0,
        });
      }
      user.paidCredits = (user.paidCredits || 0) - perMinuteCost;
      remainingBalance = user.paidCredits;
    }

    return NextResponse.json({
      success: true,
      deducted: perMinuteCost,
      remainingBalance,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
