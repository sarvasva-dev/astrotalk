import { NextRequest, NextResponse } from "next/server";
import { dbConnect, isDbConnected } from "@/src/lib/db/server";
import { TransactionModel } from "@/src/lib/db/models";
import { verifyWebhookSignature } from "@/src/lib/razorpay";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-razorpay-signature") || "";
  const rawBody = await req.text();
  const isValid = verifyWebhookSignature(rawBody, signature);

  if (!isValid) {
    return new NextResponse("Invalid Webhook Signature", { status: 400 });
  }

  const body = JSON.parse(rawBody);
  const event = body.event;
  if (event === "payment.captured") {
    const payment = body.payload?.payment?.entity;
    console.log(`[Razorpay Webhook] Payment captured: ${payment?.id}, Order: ${payment?.order_id}`);
    await dbConnect();
    if (payment?.order_id && isDbConnected()) {
      await TransactionModel.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        { $set: { status: "paid", razorpayPaymentId: payment.id } }
      );
    }
  }

  return NextResponse.json({ status: "ok" });
}
