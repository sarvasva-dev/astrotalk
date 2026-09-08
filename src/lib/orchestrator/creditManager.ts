import type { AICreditProfile, OrchestratorTrace } from "../../types";

const CREDIT_STORAGE_KEY = "astrotalk_ai_credits_profile";
const LEDGER_STORAGE_KEY = "astrotalk_ai_credits_ledger";

export type CreditLedgerEntry = {
  id: string;
  timestamp: number;
  question: string;
  intent: string;
  creditsCharged: number;
  provider: string;
  tokensSavedPct: number;
  reason: string;
};

const DEFAULT_CREDIT_PROFILE: AICreditProfile = {
  planName: "₹10 / 24-Hour Pass",
  dailyCreditsLimit: 100,
  creditsRemaining: 86, // Active balance
  creditsUsedToday: 14,
  totalTokensSaved: 48920,
  deterministicQueriesCount: 8,
  llmQueriesCount: 3,
  expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
};

export class AICreditManager {
  public static getProfile(): AICreditProfile {
    try {
      const saved = localStorage.getItem(CREDIT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CREDIT_PROFILE;
  }

  public static saveProfile(profile: AICreditProfile): void {
    try {
      localStorage.setItem(CREDIT_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }

  public static getLedger(): CreditLedgerEntry[] {
    try {
      const saved = localStorage.getItem(LEDGER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Seed initial ledger entries for demonstration
    return [
      {
        id: "led-1",
        timestamp: Date.now() - 3600000 * 2,
        question: "Purva Phalguni kya hota hai?",
        intent: "GENERAL_SHASTRA_DEF",
        creditsCharged: 0,
        provider: "Deterministic Engine",
        tokensSavedPct: 100,
        reason: "Mathematical / Static Shastra calculation (0 LLM Tokens)",
      },
      {
        id: "led-2",
        timestamp: Date.now() - 3600000,
        question: "Career kaisa rahega?",
        intent: "CAREER_10TH_HOUSE",
        creditsCharged: 3,
        provider: "Sarvam Synthesizer",
        tokensSavedPct: 94.2,
        reason: "Normal synthesis with 10th house context pruning",
      },
      {
        id: "led-3",
        timestamp: Date.now() - 1800000,
        question: "Manglik dosha hai kya meri kundli mein?",
        intent: "DETERMINISTIC_DIRECT",
        creditsCharged: 0,
        provider: "Deterministic Engine",
        tokensSavedPct: 100,
        reason: "1/4/7/8/12 House Check (0 LLM Tokens)",
      },
      {
        id: "led-4",
        timestamp: Date.now() - 600000,
        question: "Vivah aur Mangal Shanti ka shastra praman?",
        intent: "MARRIAGE_7TH_HOUSE",
        creditsCharged: 8,
        provider: "Gemini Deep Reasoning",
        tokensSavedPct: 92.5,
        reason: "Deep synthesis & multi-source classical reconciliation",
      },
    ];
  }

  public static recordTransaction(trace: OrchestratorTrace): AICreditProfile {
    const profile = this.getProfile();
    const ledger = this.getLedger();

    const creditsToDeduct = trace.routeDecision.creditsCharged;
    profile.creditsRemaining = Math.max(0, profile.creditsRemaining - creditsToDeduct);
    profile.creditsUsedToday += creditsToDeduct;
    profile.totalTokensSaved += Math.max(0, trace.rawTokensEstimate - trace.prunedTokensSent);

    if (trace.isDeterministic || trace.routeDecision.providerName === "Deterministic Engine" || trace.cached) {
      profile.deterministicQueriesCount += 1;
    } else {
      profile.llmQueriesCount += 1;
    }

    this.saveProfile(profile);

    const newLedgerEntry: CreditLedgerEntry = {
      id: `led-${Date.now()}`,
      timestamp: Date.now(),
      question: trace.userQuestion,
      intent: trace.intent,
      creditsCharged: creditsToDeduct,
      provider: trace.routeDecision.providerName,
      tokensSavedPct: trace.tokensSavedPercentage,
      reason: trace.routeDecision.costReason,
    };

    ledger.unshift(newLedgerEntry);
    try {
      localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(ledger.slice(0, 30)));
    } catch (e) {
      console.error(e);
    }

    return profile;
  }

  public static rechargeCredits(amount: number = 100): AICreditProfile {
    const profile = this.getProfile();
    profile.creditsRemaining += amount;
    profile.dailyCreditsLimit += amount;
    profile.expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    this.saveProfile(profile);
    return profile;
  }
}
