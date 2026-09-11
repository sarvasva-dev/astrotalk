import { NextResponse } from "next/server";
import { quotaManager } from "@/src/lib/llm/quotaManager";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    states: quotaManager.getAllStates(),
  });
}
