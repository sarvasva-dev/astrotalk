import { NextRequest, NextResponse } from "next/server";
import { SarvamAIService } from "@/src/lib/sarvam";

export async function POST(req: NextRequest) {
  try {
    const { text, speaker = "meera", languageCode = "hi-IN" } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text string is required" }, { status: 400 });
    }

    const result = await SarvamAIService.textToSpeech(text, speaker, languageCode);

    return NextResponse.json({
      audioBase64: result.audioBase64,
      isFallback: result.isFallback,
      speaker: result.speaker,
      model: "bulbul:v1",
    });
  } catch (err: any) {
    console.error("TTS Endpoint error:", err);
    return NextResponse.json(
      {
        audioBase64: null,
        isFallback: true,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
