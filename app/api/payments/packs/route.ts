import { NextResponse } from "next/server";
import { RECHARGE_PACKS } from "@/src/lib/razorpay";

export async function GET() {
  return NextResponse.json({ packs: RECHARGE_PACKS });
}
