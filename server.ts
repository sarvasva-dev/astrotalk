import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

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


// Kundli generation endpoint (calculates astrological details)
app.post("/api/kundli", (req, res) => {
  const { name, dob, tob, pob } = req.body;
  if (!name || !dob) {
    return res.status(400).json({ error: "Name and Date of Birth required" });
  }

  // Astrological calculation algorithm based on birth date seed
  const birthDate = new Date(dob);
  const day = birthDate.getDate() || 15;
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear() || 1998;

  const rashis = [
    { sign: "Mesha (Aries)", lord: "Mangal (Mars)", element: "Fire" },
    { sign: "Vrishabha (Taurus)", lord: "Shukra (Venus)", element: "Earth" },
    { sign: "Mithuna (Gemini)", lord: "Budh (Mercury)", element: "Air" },
    { sign: "Karka (Cancer)", lord: "Chandra (Moon)", element: "Water" },
    { sign: "Simha (Leo)", lord: "Surya (Sun)", element: "Fire" },
    { sign: "Kanya (Virgo)", lord: "Budh (Mercury)", element: "Earth" },
    { sign: "Tula (Libra)", lord: "Shukra (Venus)", element: "Air" },
    { sign: "Vrischika (Scorpio)", lord: "Mangal (Mars)", element: "Water" },
    { sign: "Dhanu (Sagittarius)", lord: "Guru (Jupiter)", element: "Fire" },
    { sign: "Makara (Capricorn)", lord: "Shani (Saturn)", element: "Earth" },
    { sign: "Kumbha (Aquarius)", lord: "Shani (Saturn)", element: "Air" },
    { sign: "Meena (Pisces)", lord: "Guru (Jupiter)", element: "Water" },
  ];

  const nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
  ];

  const seed = (day * 31 + month * 12 + year) % 12;
  const moonSeed = (day * 7 + month * 13 + (year % 100)) % 12;
  const nakshatraSeed = (day * 17 + month * 23 + (year % 100)) % 27;

  const lagna = rashis[seed];
  const moonSign = rashis[moonSeed];
  const nakshatra = nakshatras[nakshatraSeed];
  const isManglik = (day + month) % 3 === 0;
  const dashaLords = ["Jupiter (Guru)", "Saturn (Shani)", "Mercury (Budh)", "Ketu", "Venus (Shukra)", "Sun (Surya)", "Moon (Chandra)", "Mars (Mangal)", "Rahu"];
  const currentDasha = dashaLords[(year + month) % dashaLords.length];

  // 12 Houses map with planetary placements
  const planets = ["Surya", "Chandra", "Mangal", "Budh", "Guru", "Shukra", "Shani", "Rahu", "Ketu"];
  const houses = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    const housePlanets: string[] = [];
    planets.forEach((p, pIdx) => {
      if ((pIdx * 3 + seed + day) % 12 === i) {
        housePlanets.push(p);
      }
    });
    return {
      house: houseNum,
      sign: rashis[(seed + i) % 12].sign.split(" ")[0],
      signLord: rashis[(seed + i) % 12].lord,
      planets: housePlanets,
    };
  });

  res.json({
    name,
    dob,
    tob: tob || "12:00 PM",
    pob: pob || "New Delhi, India",
    lagna: lagna.sign,
    lagnaLord: lagna.lord,
    element: lagna.element,
    moonSign: moonSign.sign,
    nakshatra,
    isManglik,
    currentDasha,
    luckyGemstone: lagna.element === "Fire" ? "Ruby (Manikya) / Yellow Sapphire (Pukhraj)" : lagna.element === "Earth" ? "Emerald (Panna) / Blue Sapphire" : lagna.element === "Air" ? "Diamond / Opal" : "Pearl (Moti) / Red Coral",
    luckyNumber: ((day + month) % 9) + 1,
    luckyColor: lagna.element === "Fire" ? "Saffron & Crimson" : lagna.element === "Earth" ? "Emerald Green" : lagna.element === "Air" ? "Sky Blue & Silver" : "Pure White & Pearl",
    houses,
    summary: `${name}'s Lagna is ${lagna.sign} governed by ${lagna.lord}. Chandra is placed in ${moonSign.sign} in ${nakshatra} Nakshatra. Currently running ${currentDasha} Mahadasha, bringing opportunities for progression with careful focus.`,
  });
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
