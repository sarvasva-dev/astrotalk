import { NextRequest, NextResponse } from "next/server";
import { dbConnect, isDbConnected } from "@/src/lib/db/server";
import { UserModel, ChatMessageModel } from "@/src/lib/db/models";
import { routeLLMRequest } from "@/src/lib/llm/router";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, counsellor, profile, prunedFacts, matchedRules, isDeterministic, deterministicAnswer, providerHint } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 });
    }

    if (isDeterministic && deterministicAnswer) {
      return NextResponse.json({
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
      contextBlock = `PRUNED RELEVANT CHART FACTS (Calculated by Astroguru Vedic Engine - DO NOT RECALCULATE):
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
2. Reply concisely like an authentic Astroguru counsellor: 2-4 short, immersive sentences.
3. Base your explanation and synthesis strictly on the provided pruned chart facts and classical Shastra evidence. Never invent conflicting planetary placements.
4. If the client asks about career, marriage, health, or wealth, ground your answer in these facts and offer practical remedies (e.g. Surya Arghya, Gayatri japa, fasting, patience).
5. Never be fatalistic or fearful; Vedic Jyotish is a lamp of hope.
6. Do NOT output markdown tables, raw JSON, or robotic lists. Sound like a live, caring master on call/chat.`;

    const llmResponse = await routeLLMRequest(
      messages.slice(-8).map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
      {
        taskType: "chat_reply",
        systemPrompt: systemInstruction,
        temperature: 0.72,
        maxTokens: 350,
        providerHint,
      }
    );

    const replyText = llmResponse.content;
    const provider = llmResponse.provider;
    const modelName = llmResponse.model;

    // Save chat message & deduct credits if DB is connected
    try {
      const userId = body.userId || "default_user";
      await dbConnect();
      if (isDbConnected()) {
        const user = await UserModel.findById(userId);
        if (user) {
          const chatCost = 25;
          let canChat = false;

          if (user.activeTrial && user.activeTrial.isActive && user.activeTrial.expiresAt) {
            const now = new Date();
            if (now < new Date(user.activeTrial.expiresAt)) {
              canChat = true;
            } else {
              user.activeTrial.isActive = false;
            }
          }

          if (!canChat && user.freeCredits >= chatCost) {
            user.freeCredits -= chatCost;
            canChat = true;
          }

          if (!canChat && user.paidCredits >= chatCost) {
            user.paidCredits -= chatCost;
            canChat = true;
          }

          if (!canChat) {
            return NextResponse.json(
              {
                error: "Insufficient balance",
                text: "Pranam! Aapke paas credits kam hain. Kripya recharge karein ya trial pack lein.",
              },
              { status: 402 }
            );
          }
          await user.save();
        }

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

    return NextResponse.json({
      text: replyText,
      model: modelName,
      provider,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Unable to reach astrologer",
        text: "Pranam! Sampark mein thoda vilamb hua. Kripya punah prayas karein.",
      },
      { status: 500 }
    );
  }
}
