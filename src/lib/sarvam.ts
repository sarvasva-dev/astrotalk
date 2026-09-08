/**
 * Sarvam AI Service Integration
 * Vernacular LLM, Speech-to-Text (saaras:v2), and Text-to-Speech (bulbul:v1)
 */

interface SarvamSTTResponse {
  transcript: string;
  language_code?: string;
}

interface SarvamTTSResponse {
  audios: string[]; // Base64 encoded WAV audio strings
}

interface SarvamChatResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export class SarvamAIService {
  private static getApiKey(): string | null {
    return process.env.SARVAM_API_KEY || null;
  }

  /**
   * Transcribe speech audio using Sarvam saaras:v2 model
   */
  public static async speechToText(
    audioBuffer: Buffer,
    mimeType = "audio/wav",
    fileName = "input.wav"
  ): Promise<{ transcript: string; isFallback: boolean }> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      console.log("[Sarvam STT] SARVAM_API_KEY not set. Using simulated voice recognition.");
      return {
        transcript: "प्रणाम गुरु जी, मेरी कुंडली में दशा का क्या प्रभाव रहेगा?",
        isFallback: true,
      };
    }

    try {
      const formData = new FormData();
      const uint8Array = new Uint8Array(audioBuffer.buffer, audioBuffer.byteOffset, audioBuffer.byteLength);
      const blob = new Blob([uint8Array], { type: mimeType });
      formData.append("file", blob, fileName);
      formData.append("model", "saaras:v2");
      // Use 'unknown' for Sarvam auto-detecting Hindi, Hinglish, English, and regional speech
      formData.append("language_code", "unknown");
      formData.append("with_timestamps", "false");

      const res = await fetch("https://api.sarvam.ai/speech-to-text", {
        method: "POST",
        headers: {
          "api-subscription-key": apiKey,
        },
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[Sarvam STT] API error ${res.status}: ${errText}`);
        return {
          transcript: "कृपया अपनी जन्म विवरण या प्रश्न दोबारा बताएं।",
          isFallback: true,
        };
      }

      const data = (await res.json()) as SarvamSTTResponse;
      return {
        transcript: data.transcript || "",
        isFallback: false,
      };
    } catch (err: any) {
      console.error("[Sarvam STT] Request failed:", err.message);
      return {
        transcript: "नमस्ते, आवाज रिकॉर्डिंग प्राप्त हुई।",
        isFallback: true,
      };
    }
  }

  /**
   * Synthesize natural Indian speech audio using Sarvam bulbul:v3
   * Speakers for female: 'ritu', 'simran', 'priya', 'pooja'
   * Speakers for male: 'ratan', 'shubh', 'aditya', 'rahul'
   */
  public static async textToSpeech(
    text: string,
    speaker: "ritu" | "simran" | "ratan" | "shubh" | "meera" | "arvind" = "ritu",
    languageCode = "hi-IN"
  ): Promise<{ audioBase64: string | null; isFallback: boolean; speaker: string }> {
    const apiKey = this.getApiKey();

    // Clean text of markdown, citations, and non-verbal symbols
    const cleanText = text
      .replace(/[*#_`~[\]()]/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 480) // Ensure safe chunk boundary for Sarvam TTS API
      .trim();

    if (!apiKey) {
      console.log("[Sarvam TTS] SARVAM_API_KEY not set. Audio synthesis skipped in dev mode.");
      return {
        audioBase64: null,
        isFallback: true,
        speaker,
      };
    }

    // Map legacy or default speaker names to valid Sarvam bulbul:v3 speakers
    let validSpeaker = speaker as string;
    if (validSpeaker === "meera" || validSpeaker === "pavithra" || validSpeaker === "anushka") {
      validSpeaker = "ritu";
    }
    if (validSpeaker === "arvind" || validSpeaker === "maitra" || validSpeaker === "abhilash") {
      validSpeaker = "ratan";
    }

    // Auto-detect target language code based on text script (Devanagari vs Latin)
    const hasDevanagari = /[\u0900-\u097F]/.test(cleanText);
    const targetLang = hasDevanagari ? "hi-IN" : (languageCode || "hi-IN");

    try {
      const res = await fetch("https://api.sarvam.ai/text-to-speech", {
        method: "POST",
        headers: {
          "api-subscription-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: [cleanText],
          target_language_code: targetLang,
          speaker: validSpeaker,
          pitch: 0,
          pace: 0.98,
          loudness: 1.5,
          speech_sample_rate: 22050,
          enable_preprocessing: true,
          model: "bulbul:v3",
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[Sarvam TTS] API error ${res.status}: ${errText}`);
        return {
          audioBase64: null,
          isFallback: true,
          speaker,
        };
      }

      const data = (await res.json()) as SarvamTTSResponse;
      const audioBase64 = data.audios && data.audios.length > 0 ? data.audios[0] : null;

      return {
        audioBase64,
        isFallback: false,
        speaker,
      };
    } catch (err: any) {
      console.error("[Sarvam TTS] Request failed:", err.message);
      return {
        audioBase64: null,
        isFallback: true,
        speaker,
      };
    }
  }

  /**
   * Vernacular LLM chat completion using Sarvam models (sarvam-2b)
   */
  public static async chatCompletion(
    messages: Array<{ role: string; content: string }>,
    temperature = 0.4
  ): Promise<{ content: string; provider: string } | null> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      return null; // Signals caller to use primary Gemini reasoning pipeline
    }

    try {
      const res = await fetch("https://api.sarvam.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "api-subscription-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sarvam-2b",
          messages,
          temperature,
          max_tokens: 600,
        }),
      });

      if (!res.ok) {
        return null;
      }

      const data = (await res.json()) as SarvamChatResponse;
      if (data.choices && data.choices.length > 0) {
        return {
          content: data.choices[0].message.content,
          provider: "Sarvam Vernacular LLM (sarvam-2b)",
        };
      }
      return null;
    } catch {
      return null;
    }
  }
}
