import { NextResponse } from "next/server";
import { runGoldenTestSuite } from "@/src/lib/vedicEngine/calculationEngine";

export async function GET() {
  const report = runGoldenTestSuite();
  return NextResponse.json(report);
}
