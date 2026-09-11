import { NextResponse } from "next/server";
import { dbConnect } from "@/src/lib/db/server";

export async function GET() {
  await dbConnect();
  return NextResponse.json({
    status: "ok",
    service: "astroguru",
    time: new Date().toISOString(),
  });
}
