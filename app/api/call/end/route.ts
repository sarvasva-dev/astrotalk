import { NextRequest, NextResponse } from "next/server";
import { dbConnect, isDbConnected } from "@/src/lib/db/server";
import { CallSessionModel } from "@/src/lib/db/models";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, transcript = [] } = await req.json();
    await dbConnect();
    if (sessionId && isDbConnected()) {
      await CallSessionModel.findByIdAndUpdate(sessionId, {
        $set: {
          endTime: new Date(),
          status: "completed",
          transcript,
        },
      });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
