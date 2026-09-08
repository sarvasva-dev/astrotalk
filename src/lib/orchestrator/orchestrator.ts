import type {
  Counsellor,
  UserProfile,
  KundliData,
  OrchestratorTrace,
} from "../../types";
import { evaluateDeterministicAnswer } from "./deterministicEngine";
import { pruneAstrologyContext } from "./contextPruner";
import { astrologyCache } from "./cacheLayer";
import { quotaRouter } from "./llmRouter";
import { verifyAstrologicalClaims } from "./factChecker";

export interface PipelineExecutionResult {
  replyText: string;
  trace: OrchestratorTrace;
  creditsCharged: number;
}

/**
 * Astrotalk AI Orchestrator Master Pipeline
 */
export async function executeOrchestratorPipeline(
  userQuestion: string,
  counsellor: Counsellor,
  userProfile: UserProfile,
  kundli: KundliData | null,
  callGeminiServer: (payload: any) => Promise<string>
): Promise<PipelineExecutionResult> {
  const startTime = Date.now();
  const traceId = `trace-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const chartId = kundli ? `${kundli.lagna}_${kundli.moonSign}_${kundli.dob}` : "no_chart";

  // STEP 1: Deterministic Engine Check (Zero LLM cost, Zero Credits)
  const deterministicResult = evaluateDeterministicAnswer(userQuestion, kundli);
  if (deterministicResult.canAnswer) {
    const trace: OrchestratorTrace = {
      traceId,
      userQuestion,
      intent: "DETERMINISTIC_DIRECT",
      isDeterministic: true,
      rawTokensEstimate: 4200,
      prunedTokensSent: 0,
      tokensSavedPercentage: 100,
      matchedRules: deterministicResult.matchedRules,
      prunedFactsSummary: deterministicResult.factsSummary,
      routeDecision: {
        providerName: "Deterministic Engine",
        pool: "Deterministic",
        accountSlot: "Built-in Chart Engine",
        latencyMs: Date.now() - startTime,
        creditsCharged: 0,
        costReason: "Mathematical / Static Shastra calculation (0 LLM Tokens)",
      },
      factCheck: {
        verified: true,
        chartTruthConfirmed: true,
        verifiedClaims: ["Directly computed by local Vedic mathematical engine."],
        correctedDiscrepancies: [],
      },
      cached: false,
    };

    return {
      replyText: deterministicResult.answerText,
      trace,
      creditsCharged: 0,
    };
  }

  // STEP 2: Intent Classification & Targeted Context Pruning
  const pruningResult = pruneAstrologyContext(userQuestion, kundli);

  // STEP 3: Semantic Cache Check
  const cachedEntry = astrologyCache.get(chartId, pruningResult.intent, userQuestion);
  if (cachedEntry) {
    const trace: OrchestratorTrace = {
      traceId,
      userQuestion,
      intent: pruningResult.intent,
      isDeterministic: false,
      rawTokensEstimate: pruningResult.rawEstimatedTokens,
      prunedTokensSent: 0,
      tokensSavedPercentage: 100,
      matchedRules: pruningResult.matchedRules,
      prunedFactsSummary: pruningResult.prunedFactsSummary,
      routeDecision: {
        providerName: "Cache Layer",
        pool: "Semantic Cache",
        accountSlot: "LRU Shastra Memory Cache",
        latencyMs: 12,
        creditsCharged: 0,
        costReason: "Cache Hit: Exact chart/intent query already answered",
      },
      factCheck: {
        verified: true,
        chartTruthConfirmed: true,
        verifiedClaims: ["Replayed from verified cache."],
        correctedDiscrepancies: [],
      },
      cached: true,
    };

    return {
      replyText: cachedEntry.response,
      trace,
      creditsCharged: 0,
    };
  }

  // STEP 4: Quota-Aware LLM Router (Primary Sarvam vs Fallback Gemini)
  const routerPayload = {
    userQuestion,
    intent: pruningResult.intent,
    counsellor,
    profile: userProfile,
    prunedChartFacts: pruningResult.prunedFacts,
    matchedRules: pruningResult.matchedRules,
  };

  const routerResult = await quotaRouter.routeAndGenerate(routerPayload, callGeminiServer);

  // STEP 5: Evidence Fact-Checker (Verify against Chart Engine)
  const factCheck = verifyAstrologicalClaims(routerResult.text, kundli);

  // STEP 6: Save to Cache
  astrologyCache.set(
    chartId,
    pruningResult.intent,
    userQuestion,
    factCheck.cleanResponseText,
    pruningResult.matchedRules.map((r) => r.id)
  );

  const trace: OrchestratorTrace = {
    traceId,
    userQuestion,
    intent: pruningResult.intent,
    isDeterministic: false,
    rawTokensEstimate: pruningResult.rawEstimatedTokens,
    prunedTokensSent: pruningResult.prunedEstimatedTokens,
    tokensSavedPercentage: pruningResult.tokensSavedPercentage,
    matchedRules: pruningResult.matchedRules,
    prunedFactsSummary: pruningResult.prunedFactsSummary,
    routeDecision: {
      providerName: routerResult.providerName,
      pool: routerResult.pool,
      accountSlot: routerResult.accountSlot,
      latencyMs: routerResult.latencyMs,
      creditsCharged: routerResult.creditsCharged,
      costReason: routerResult.costReason,
    },
    factCheck: {
      verified: factCheck.verified,
      chartTruthConfirmed: factCheck.chartTruthConfirmed,
      verifiedClaims: factCheck.verifiedClaims,
      correctedDiscrepancies: factCheck.correctedDiscrepancies,
    },
    cached: false,
  };

  return {
    replyText: factCheck.cleanResponseText,
    trace,
    creditsCharged: routerResult.creditsCharged,
  };
}
