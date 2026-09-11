import { NextRequest, NextResponse } from "next/server";
import { dbConnect, isDbConnected } from "@/src/lib/db/server";
import { TransactionModel } from "@/src/lib/db/models";
import { createRazorpayOrder } from "@/src/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const { amount, userId = "default_user", bonus = 0, isTrial = false } = await req.json();

    if (!amount || amount < 10) {
      return NextResponse.json({ error: "Invalid recharge amount" }, { status: 400 });
    }

    const orderData = await createRazorpayOrder({
      amountInRupees: amount,
      receipt: `rcpt_${Date.now()}_${userId.slice(0, 6)}`,
      notes: { userId, bonus: String(bonus), isTrial: String(isTrial) },
    });

    await dbConnect();
    if (isDbConnected()) {
      await TransactionModel.create({
        userId,
        razorpayOrderId: orderData.orderId,
        amount,
        bonusAmount: bonus,
        status: "created",
        currency: orderData.currency,
      });
    }

    return NextResponse.json(orderData);
  } catch (err: any) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: "Order creation failed", details: err.message }, { status: 500 });
  }
}
