import { NextRequest, NextResponse } from "next/server";
import { dbConnect, isDbConnected } from "@/src/lib/db/server";
import { TransactionModel, UserModel, memoryFallbackStore } from "@/src/lib/db/models";
import { verifyRazorpaySignature } from "@/src/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      userId = "default_user",
      amount,
      bonus = 0,
      isTrial = false,
    } = await req.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing verification parameters" }, { status: 400 });
    }

    const verification = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!verification.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Signature verification failed",
          reason: verification.reason,
        },
        { status: 400 }
      );
    }

    const totalCredit = (Number(amount) || 0) + (Number(bonus) || 0);

    let updatedBalance = 0;
    await dbConnect();
    if (isDbConnected()) {
      await TransactionModel.findOneAndUpdate(
        { razorpayOrderId },
        {
          $set: {
            razorpayPaymentId,
            razorpaySignature,
            status: "paid",
          },
        },
        { upsert: true }
      );

      if (isTrial) {
        const expiresAt = new Date(Date.now() + 5 * 60 * 60 * 1000);
        const user = await UserModel.findByIdAndUpdate(
          userId,
          { $set: { "activeTrial.isActive": true, "activeTrial.expiresAt": expiresAt } },
          { new: true, upsert: true }
        );
        updatedBalance = user.paidCredits;
      } else {
        const user = await UserModel.findByIdAndUpdate(
          userId,
          { $inc: { paidCredits: totalCredit } },
          { new: true, upsert: true }
        );
        updatedBalance = user.paidCredits;
      }
    } else {
      if (!isTrial) {
        updatedBalance = memoryFallbackStore.updateWallet(userId, totalCredit);
      }
    }

    if (isTrial) {
      return NextResponse.json({
        success: true,
        message: "5-Hour Free Chat Pass activated successfully!",
        isTrialActivated: true,
        newPaidCredits: updatedBalance,
      });
    }

    return NextResponse.json({
      success: true,
      message: `₹${totalCredit} worth of Paid Credits added to your wallet!`,
      creditedAmount: totalCredit,
      newPaidCredits: updatedBalance,
    });
  } catch (err: any) {
    console.error("Verify payment error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
