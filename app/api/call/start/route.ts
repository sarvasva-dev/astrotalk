import { NextRequest, NextResponse } from "next/server";
import { dbConnect, isDbConnected } from "@/src/lib/db/server";
import { CallSessionModel } from "@/src/lib/db/models";

export async function POST(req: NextRequest) {
  try {
    const { userId = "default_user", counsellorSlug = "acharya", ratePerMinute = 25 } = await req.json();

    await dbConnect();
    if (isDbConnected()) {
      const session = await CallSessionModel.create({
        userId,
        counsellorSlug,
        ratePerMinute,
        startTime: new Date(),
        status: "active",
      });
      return NextResponse.json({ sessionId: session._id, status: "active" });
    }

    const simId = `call_${Date.now()}`;
    return NextResponse.json({ sessionId: simId, status: "active" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
