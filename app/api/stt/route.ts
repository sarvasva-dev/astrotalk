import { NextRequest, NextResponse } from "next/server";
import { SarvamAIService } from "@/src/lib/sarvam";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Audio file upload required ('audio' field)" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await SarvamAIService.speechToText(
      buffer,
      file.type || "audio/wav",
      file.name || "recording.wav"
    );

    return NextResponse.json({
      transcript: result.transcript,
      isFallback: result.isFallback,
      model: "saaras:v2",
    });
  } catch (err: any) {
    console.error("STT Endpoint error:", err);
    return NextResponse.json(
      {
        transcript: "ऑडियो प्रोसेसिंग में समस्या हुई। कृपया दोबारा बोलें।",
        isFallback: true,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
