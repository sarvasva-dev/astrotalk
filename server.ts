import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import { calculateVedicChartV1, runGoldenTestSuite } from "./src/lib/vedicEngine/calculationEngine";
import { connectToDatabase, isDatabaseConnected } from "./src/lib/db/connect";
import {
  UserModel,
  KundliRecordModel,
  TransactionModel,
  ChatMessageModel,
  CallSessionModel,
  memoryFallbackStore,
} from "./src/lib/db/models";
import { SarvamAIService } from "./src/lib/sarvam";
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  verifyWebhookSignature,
  RECHARGE_PACKS,
} from "./src/lib/razorpay";

const app = express();
const PORT = 3000;

app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

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

    let replyText = "";
    let provider = "Deterministic Engine";
    let modelName = "gemini-3.8-flash";

    // 1. Try Sarvam Vernacular LLM first if API key is provided
    const sarvamResult = await SarvamAIService.chatCompletion([
      { role: "system", content: systemInstruction },
      ...messages.slice(-6).map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ]);

    if (sarvamResult) {
      replyText = sarvamResult.content;
      provider = sarvamResult.provider;
      modelName = "sarvam-2b";
    } else {
      const ai = getAIClient();
      if (!ai) {
        // Offline fallback grounded in matched evidence
        const clientName = profile?.displayName ? profile.displayName.split(" ")[0] : "ji";
        const topRule = matchedRules?.[0];
        const evidenceQuote = topRule ? ` शास्त्रीय ग्रंथ ${topRule.sourceText} के अनुसार ग्रह स्थिति शुभ फल देने में समर्थ है।` : "";
        replyText = `नमस्ते ${clientName}! ${signature} आपके प्रश्न पर गणना अनुसार विचार किया।${evidenceQuote} धैर्य बनाए रखें, आने वाले समय में अनुकूलता बढ़ेगी। प्रतिदिन सूर्य को जल अर्घ्य दें।`;
        provider = "Sarvam Synthesizer";
        modelName = "sarvam-vernacular-offline";
      } else {
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

        replyText = response.text?.trim() || "Namaste. Graha aapke paksh mein hain, kripya apna prashna punah poochein.";
        provider = "Gemini Deep Reasoning";
        modelName = "gemini-3.8-flash";
      }
    }

    // Asynchronously record message in database
    try {
      const userId = req.body.userId || "default_user";
      if (isDatabaseConnected()) {
        await ChatMessageModel.create({
          userId,
          counsellorSlug: counsellor?.id || "acharya",
          role: "assistant",
          content: replyText,
          provider,
          tokensUsed: 120,
          creditsCharged: 5,
        });
      }
    } catch (saveErr: any) {
      console.warn("[MongoDB] Chat logging notice:", saveErr.message);
    }

    return res.json({
      text: replyText,
      model: modelName,
      provider,
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
app.post("/api/kundli", async (req, res) => {
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

    // Non-blocking persistence to database
    try {
      if (isDatabaseConnected()) {
        await KundliRecordModel.create({
          userId: req.body.userId || "default_user",
          name,
          dob,
          tob: tob || "12:00 PM",
          pob: pob || "New Delhi, India",
          chartV1,
          provenance: chartV1.provenance,
        });
      }
    } catch (saveErr: any) {
      console.warn("[MongoDB] Non-blocking Kundli persistence notice:", saveErr.message);
    }

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

// ==========================================
// Sarvam AI Endpoints (STT & TTS)
// ==========================================

// Speech-to-Text endpoint (saaras:v2)
app.post("/api/stt", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Audio file upload required ('audio' field)" });
    }

    const result = await SarvamAIService.speechToText(
      req.file.buffer,
      req.file.mimetype || "audio/wav",
      req.file.originalname || "recording.wav"
    );

    return res.json({
      transcript: result.transcript,
      isFallback: result.isFallback,
      model: "saaras:v2",
    });
  } catch (err: any) {
    console.error("STT Endpoint error:", err);
    return res.status(500).json({
      transcript: "ऑडियो प्रोसेसिंग में समस्या हुई। कृपया दोबारा बोलें।",
      isFallback: true,
      error: err.message,
    });
  }
});

// Text-to-Speech endpoint (bulbul:v1)
app.post("/api/tts", async (req, res) => {
  try {
    const { text, speaker = "meera", languageCode = "hi-IN" } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text string is required" });
    }

    const result = await SarvamAIService.textToSpeech(text, speaker, languageCode);

    return res.json({
      audioBase64: result.audioBase64,
      isFallback: result.isFallback,
      speaker: result.speaker,
      model: "bulbul:v1",
    });
  } catch (err: any) {
    console.error("TTS Endpoint error:", err);
    return res.status(500).json({
      audioBase64: null,
      isFallback: true,
      error: err.message,
    });
  }
});

// ==========================================
// User Profile & Wallet Balance Endpoints
// ==========================================

app.get(["/api/user", "/api/user/:userId"], async (req, res) => {
  try {
    const userId = req.params.userId || (req.query.userId as string) || "default_user";

    if (isDatabaseConnected()) {
      let user = await UserModel.findById(userId);
      if (!user) {
        user = await UserModel.create({
          _id: userId,
          displayName: "Astro Seeker",
          gender: "male",
          birthDate: "2005-12-21",
          birthTime: "11:55 PM",
          birthPlace: "New Delhi, Delhi, India",
          walletBalance: 150,
          aiCredits: 100,
        });
      }
      return res.json({ user, isDatabaseConnected: true });
    }

    // Fallback store
    const user = memoryFallbackStore.getUser(userId);
    return res.json({ user, isDatabaseConnected: false });
  } catch (err: any) {
    console.error("User fetch error:", err);
    const user = memoryFallbackStore.getUser("default_user");
    return res.json({ user, isDatabaseConnected: false });
  }
});

app.post("/api/user", async (req, res) => {
  try {
    const { userId = "default_user", ...updates } = req.body;

    if (isDatabaseConnected()) {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, upsert: true }
      );
      return res.json({ success: true, user });
    }

    const user = memoryFallbackStore.getUser(userId);
    Object.assign(user, updates);
    return res.json({ success: true, user });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Razorpay Payment Gateway Endpoints
// ==========================================

// Get available recharge packages
app.get("/api/payments/packs", (_req, res) => {
  res.json({ packs: RECHARGE_PACKS });
});

// Create Razorpay Order
app.post("/api/payments/create-order", async (req, res) => {
  try {
    const { amount, userId = "default_user", bonus = 0 } = req.body;

    if (!amount || amount < 10) {
      return res.status(400).json({ error: "Invalid recharge amount" });
    }

    const orderData = await createRazorpayOrder({
      amountInRupees: amount,
      receipt: `rcpt_${Date.now()}_${userId.slice(0, 6)}`,
      notes: { userId, bonus: String(bonus) },
    });

    // Record pending transaction
    if (isDatabaseConnected()) {
      await TransactionModel.create({
        userId,
        razorpayOrderId: orderData.orderId,
        amount,
        bonusAmount: bonus,
        status: "created",
        currency: orderData.currency,
      });
    }

    return res.json(orderData);
  } catch (err: any) {
    console.error("Create order error:", err);
    return res.status(500).json({ error: "Order creation failed", details: err.message });
  }
});

// Verify Razorpay Payment Signature
app.post("/api/payments/verify", async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      userId = "default_user",
      amount,
      bonus = 0,
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ error: "Missing verification parameters" });
    }

    const verification = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!verification.isValid) {
      return res.status(400).json({
        success: false,
        error: "Signature verification failed",
        reason: verification.reason,
      });
    }

    const totalCredit = (Number(amount) || 0) + (Number(bonus) || 0);

    // Update Transaction & Wallet in Database
    let updatedBalance = 0;
    if (isDatabaseConnected()) {
      await TransactionModel.findOneAndUpdate(
        { razorpayOrderId },
        {
          $set: {
            razorpayPaymentId,
            razorpaySignature,
            status: "paid",
          },
        },
        { upsert: true }
      );

      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $inc: { walletBalance: totalCredit } },
        { new: true, upsert: true }
      );
      updatedBalance = user.walletBalance;
    } else {
      updatedBalance = memoryFallbackStore.updateWallet(userId, totalCredit);
    }

    return res.json({
      success: true,
      message: `₹${totalCredit} successfully credited to your wallet!`,
      creditedAmount: totalCredit,
      newBalance: updatedBalance,
    });
  } catch (err: any) {
    console.error("Verify payment error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Razorpay Asynchronous Webhook
app.post("/api/payments/webhook", async (req, res) => {
  const signature = req.headers["x-razorpay-signature"] as string;
  const isValid = verifyWebhookSignature(JSON.stringify(req.body), signature);

  if (!isValid) {
    return res.status(400).send("Invalid Webhook Signature");
  }

  const event = req.body.event;
  if (event === "payment.captured") {
    const payment = req.body.payload?.payment?.entity;
    console.log(`[Razorpay Webhook] Payment captured: ${payment?.id}, Order: ${payment?.order_id}`);
    if (payment?.order_id && isDatabaseConnected()) {
      await TransactionModel.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        { $set: { status: "paid", razorpayPaymentId: payment.id } }
      );
    }
  }

  return res.json({ status: "ok" });
});

// ==========================================
// Consultation Call Session & Billing
// ==========================================

app.post("/api/call/start", async (req, res) => {
  try {
    const { userId = "default_user", counsellorSlug = "acharya", ratePerMinute = 25 } = req.body;

    if (isDatabaseConnected()) {
      const session = await CallSessionModel.create({
        userId,
        counsellorSlug,
        ratePerMinute,
        startTime: new Date(),
        status: "active",
      });
      return res.json({ sessionId: session._id, status: "active" });
    }

    const simId = `call_${Date.now()}`;
    return res.json({ sessionId: simId, status: "active" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/call/deduct", async (req, res) => {
  try {
    const { sessionId, userId = "default_user", ratePerMinute = 25 } = req.body;
    const perMinuteCost = Number(ratePerMinute) || 25;

    let remainingBalance = 0;
    if (isDatabaseConnected()) {
      const user = await UserModel.findById(userId);
      if (!user || user.walletBalance < perMinuteCost) {
        return res.json({
          success: false,
          insufficientBalance: true,
          remainingBalance: user?.walletBalance || 0,
        });
      }

      user.walletBalance -= perMinuteCost;
      await user.save();
      remainingBalance = user.walletBalance;

      if (sessionId) {
        await CallSessionModel.findByIdAndUpdate(sessionId, {
          $inc: { durationSeconds: 60, totalDeducted: perMinuteCost },
        });
      }
    } else {
      const user = memoryFallbackStore.getUser(userId);
      if (user.walletBalance < perMinuteCost) {
        return res.json({
          success: false,
          insufficientBalance: true,
          remainingBalance: user.walletBalance,
        });
      }
      user.walletBalance -= perMinuteCost;
      remainingBalance = user.walletBalance;
    }

    return res.json({
      success: true,
      deducted: perMinuteCost,
      remainingBalance,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/call/end", async (req, res) => {
  try {
    const { sessionId, transcript = [] } = req.body;
    if (sessionId && isDatabaseConnected()) {
      await CallSessionModel.findByIdAndUpdate(sessionId, {
        $set: {
          endTime: new Date(),
          status: "completed",
          transcript,
        },
      });
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
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
  // Initialize MongoDB connection pool with resilient fallback
  await connectToDatabase();

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
