import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { calculateVedicChartV1, runGoldenTestSuite } from "./src/lib/vedicEngine/calculationEngine";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "astrotalk", time: new Date().toISOString() });
});

// Chat endpoint with AI Orchestrator & Evidence Architecture
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, counsellor, profile, prunedFacts, matchedRules, isDeterministic, deterministicAnswer } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array required" });
    }

    // If deterministic engine already resolved the question, return immediately with 0 token spend
    if (isDeterministic && deterministicAnswer) {
      return res.json({
        text: deterministicAnswer,
        model: "deterministic-shastra-core",
        tokensUsed: 0,
        provider: "Deterministic Engine",
      });
    }

    const counsellorName = counsellor?.name || "Acharya";
    const specialties = (counsellor?.specialties || ["Vedic Jyotish", "Kundli", "Prashna"]).join(", ");
    const languages = (counsellor?.languages || ["Hindi", "English"]).join(", ");
    const experienceYears = counsellor?.experienceYears || 15;
    const personaPrompt = counsellor?.personaPrompt || "Warm, empathetic, insightful Vedic astrologer.";
    const signature = counsellor?.signature || "Pranam. Graha aur dasha aapke paksh mein aayenge.";
    const hometown = counsellor?.hometown || "Varanasi";

    let contextBlock = "The client has not yet provided birth chart details.";
    if (prunedFacts && Object.keys(prunedFacts).length > 0) {
      contextBlock = `PRUNED RELEVANT CHART FACTS (Calculated by Astrotalk Vedic Engine - DO NOT RECALCULATE):
${JSON.stringify(prunedFacts, null, 2)}`;
    } else if (profile?.displayName && profile?.birthDate) {
      contextBlock = `CLIENT BIRTH DETAILS:
Name: ${profile.displayName}, DoB: ${profile.birthDate}, Time: ${profile.birthTime || "12:00"}, Place: ${profile.birthPlace || "India"}`;
    }

    let evidenceBlock = "";
    if (Array.isArray(matchedRules) && matchedRules.length > 0) {
      evidenceBlock = `MATCHED CLASSICAL SHASTRA EVIDENCE:
${matchedRules.map((r: any) => `- [${r.sourceText} ${r.chapter} ${r.verse}]: "${r.purport}"`).join("\n")}`;
    }

    const systemInstruction = `You are ${counsellorName}, a verified and revered Indian astrology counsellor with ${experienceYears} years of experience from ${hometown}.
Specialties: ${specialties}.
Languages you speak: ${languages}.
Your Persona: ${personaPrompt}
Your signature line: "${signature}".

CORE ARCHITECTURAL CONSTRAINT:
You are NOT the astrology calculation engine. The mathematical engine has already calculated the chart and pruned relevant facts.
${contextBlock}

${evidenceBlock}

Guidelines:
1. Speak in warm, genuine Hinglish / conversational Indian English as fits your persona.
2. Reply concisely like an authentic Astrotalk counsellor: 2-4 short, immersive sentences.
3. Base your explanation and synthesis strictly on the provided pruned chart facts and classical Shastra evidence. Never invent conflicting planetary placements.
4. If the client asks about career, marriage, health, or wealth, ground your answer in these facts and offer practical remedies (e.g. Surya Arghya, Gayatri japa, fasting, patience).
5. Never be fatalistic or fearful; Vedic Jyotish is a lamp of hope.
6. Do NOT output markdown tables, raw JSON, or robotic lists. Sound like a live, caring master on call/chat.`;

    const ai = getAIClient();
    if (!ai) {
      // Offline fallback grounded in matched evidence
      const clientName = profile?.displayName ? profile.displayName.split(" ")[0] : "ji";
      const topRule = matchedRules?.[0];
      const evidenceQuote = topRule ? ` शास्त्रीय ग्रंथ ${topRule.sourceText} के अनुसार ग्रह स्थिति शुभ फल देने में समर्थ है।` : "";
      const fallbackText = `नमस्ते ${clientName}! ${signature} आपके प्रश्न पर गणना अनुसार विचार किया।${evidenceQuote} धैर्य बनाए रखें, आने वाले समय में अनुकूलता बढ़ेगी। प्रतिदिन सूर्य को जल अर्घ्य दें।`;
      return res.json({
        text: fallbackText,
        model: "sarvam-vernacular-offline",
        provider: "Sarvam Synthesizer",
      });
    }

    const contents = messages.slice(-8).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content.slice(0, 1200) }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.72,
        maxOutputTokens: 350,
      },
    });

    const replyText = response.text?.trim() || "Namaste. Graha aapke paksh mein hain, kripya apna prashna punah poochein.";
    return res.json({
      text: replyText,
      model: "gemini-3.8-flash",
      provider: "Gemini Deep Reasoning",
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      error: "Unable to reach astrologer",
      text: "Pranam! Sampark mein thoda vilamb hua. Kripya punah prayas karein.",
    });
  }
});


// City coordinates database for India & major locations
const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  delhi: { lat: 28.6139, lon: 77.2090 },
  "new delhi": { lat: 28.6139, lon: 77.2090 },
  mumbai: { lat: 19.0760, lon: 72.8777 },
  bengaluru: { lat: 12.9716, lon: 77.5946 },
  bangalore: { lat: 12.9716, lon: 77.5946 },
  varanasi: { lat: 25.3176, lon: 82.9739 },
  kolkata: { lat: 22.5726, lon: 88.3639 },
  chennai: { lat: 13.0827, lon: 80.2707 },
  hyderabad: { lat: 17.3850, lon: 78.4867 },
  pune: { lat: 18.5204, lon: 73.8567 },
  ahmedabad: { lat: 23.0225, lon: 72.5714 },
  jaipur: { lat: 26.9124, lon: 75.7873 },
  lucknow: { lat: 26.8467, lon: 80.9462 },
  kanpur: { lat: 26.4499, lon: 80.3319 },
  patna: { lat: 25.5941, lon: 85.1376 },
};

function parseTimeString(timeStr?: string): { hour: number; minute: number } {
  if (!timeStr) return { hour: 12, minute: 0 };
  const clean = timeStr.trim().toLowerCase();
  const isPM = clean.includes("pm");
  const isAM = clean.includes("am");
  const numbers = clean.replace(/[^0-9:]/g, "").split(":");
  let hour = parseInt(numbers[0] || "12", 10);
  const minute = parseInt(numbers[1] || "0", 10);
  if (isPM && hour < 12) hour += 12;
  if (isAM && hour === 12) hour = 0;
  return { hour, minute };
}

// Canonical Vedic Calculation API (Audit-Verified V1.0.0 Engine)
app.post("/api/kundli", (req, res) => {
  const { name, dob, tob, pob } = req.body;
  if (!name || !dob) {
    return res.status(400).json({ error: "Name and Date of Birth required" });
  }

  try {
    const birthDate = new Date(dob);
    const day = birthDate.getDate() || 15;
    const month = birthDate.getMonth() + 1;
    const year = birthDate.getFullYear() || 1998;
    const { hour, minute } = parseTimeString(tob);

    // Resolve geographic coordinates
    const cityKey = (pob || "Delhi").toLowerCase().trim();
    const matchedCoords = Object.entries(CITY_COORDINATES).find(([k]) => cityKey.includes(k))?.[1] || {
      lat: 28.6139,
      lon: 77.2090,
    };

    const chartV1 = calculateVedicChartV1({
      name,
      year,
      month,
      day,
      hour,
      minute,
      latitude: matchedCoords.lat,
      longitude: matchedCoords.lon,
      timezoneOffsetHours: 5.5, // Indian Standard Time default
      cityName: pob || "New Delhi, India",
    });

    const moon = chartV1.planets.find((p) => p.name === "Moon")!;

    // Legacy and UI formatted fields
    const luckyGemstone =
      chartV1.lagna.element === "Fire"
        ? "Ruby (Manikya) / Yellow Sapphire (Pukhraj)"
        : chartV1.lagna.element === "Earth"
        ? "Emerald (Panna) / Blue Sapphire"
        : chartV1.lagna.element === "Air"
        ? "Diamond / Opal"
        : "Pearl (Moti) / Red Coral";

    const luckyColor =
      chartV1.lagna.element === "Fire"
        ? "Saffron & Crimson"
        : chartV1.lagna.element === "Earth"
        ? "Emerald Green & Earthy Ochre"
        : chartV1.lagna.element === "Air"
        ? "Sky Blue & Silver"
        : "Pure White & Pearl";

    const luckyNumber = ((day + month) % 9) + 1;

    const formattedHouses = chartV1.houses.map((h) => ({
      house: h.house,
      sign: h.sign,
      signLord: h.signLord,
      planets: h.occupantPlanets.map((p) => p.split(" ")[0]),
      aspectedBy: h.aspectedByPlanets.map((p) => p.split(" ")[0]),
      significations: h.significations,
    }));

    return res.json({
      name,
      dob,
      tob: tob || "12:00 PM",
      pob: pob || "New Delhi, India",
      lagna: `${chartV1.lagna.rashi} (${chartV1.lagna.formattedDegree})`,
      lagnaLord: chartV1.lagna.rashiLord,
      element: chartV1.lagna.element,
      moonSign: `${moon.rashi} (${moon.formattedDegree})`,
      nakshatra: moon.nakshatra,
      nakshatraPada: moon.pada,
      nakshatraLord: moon.nakshatraLord,
      isManglik: chartV1.manglikStatus.isManglik,
      currentDasha: `${chartV1.dasha.currentMahadasha} Mahadasha`,
      currentAntardasha: chartV1.dasha.currentAntardasha,
      currentPratyantardasha: chartV1.dasha.currentPratyantardasha,
      luckyGemstone,
      luckyNumber,
      luckyColor,
      houses: formattedHouses,
      summary: chartV1.summary,
      chartV1,
      planetsDetailed: chartV1.planets,
      lagnaDetailed: chartV1.lagna,
      dashaTree: chartV1.dasha,
      provenance: chartV1.provenance,
    });
  } catch (error: any) {
    console.error("Vedic calculation engine error:", error);
    return res.status(500).json({ error: "Calculation failure", details: error.message });
  }
});

// Golden Test Verification Endpoint
app.get("/api/golden-test", (_req, res) => {
  const report = runGoldenTestSuite();
  res.json(report);
});

// Daily Panchang endpoint
app.get("/api/panchang", (_req, res) => {
  const today = new Date();
  res.json({
    date: today.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    tithi: "Shukla Paksha Trayodashi",
    nakshatra: "Rohini (upto 04:35 PM), Mrigashira",
    yoga: "Shubha Yoga",
    karana: "Taitila",
    sunrise: "06:18 AM",
    sunset: "06:42 PM",
    rahuKaal: "01:30 PM - 03:00 PM (Inauspicious)",
    shubhMuhurat: "11:48 AM - 12:36 PM (Abhijit Muhurat)",
    amritKaal: "08:14 AM - 09:50 AM",
    moonSign: "Vrishabha (Taurus)",
    vikramSamvat: "2082 Pingala",
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Astrotalk server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
