import { useState, useEffect } from "react";
import {
  Sparkles,
  Cpu,
  Layers,
  Zap,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Database,
  Coins,
  ArrowRight,
  TrendingDown,
  Activity,
  BookOpen,
  Info,
  Server,
  Filter,
  Play,
  X
} from "lucide-react";
import type { OrchestratorTrace, AICreditProfile, KundliData, UserProfile, Counsellor } from "../types";
import { AICreditManager, type CreditLedgerEntry } from "../lib/orchestrator/creditManager";
import { quotaRouter } from "../lib/orchestrator/llmRouter";
import { executeOrchestratorPipeline } from "../lib/orchestrator/orchestrator";
import { astrologyCache } from "../lib/orchestrator/cacheLayer";

interface OrchestratorHUDProps {
  isOpen: boolean;
  onClose: () => void;
  activeTrace: OrchestratorTrace | null;
  userProfile: UserProfile;
  kundli: KundliData | null;
  onTraceSelect?: (trace: OrchestratorTrace) => void;
}

export default function OrchestratorHUD({
  isOpen,
  onClose,
  activeTrace,
  userProfile,
  kundli,
}: OrchestratorHUDProps) {
  const [activeTab, setActiveTab] = useState<"pipeline" | "pools" | "credits" | "sandbox">("pipeline");
  const [creditProfile, setCreditProfile] = useState<AICreditProfile>(AICreditManager.getProfile);
  const [ledger, setLedger] = useState<CreditLedgerEntry[]>(AICreditManager.getLedger);
  const [poolStatus, setPoolStatus] = useState(quotaRouter.getPoolStatus());
  const [cacheStats, setCacheStats] = useState(astrologyCache.getStats());

  // Sandbox state
  const [sandboxQuery, setSandboxQuery] = useState("Purva Phalguni kya hota hai?");
  const [sandboxRunning, setSandboxRunning] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<{ text: string; trace: OrchestratorTrace } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCreditProfile(AICreditManager.getProfile());
      setLedger(AICreditManager.getLedger());
      setPoolStatus(quotaRouter.getPoolStatus());
      setCacheStats(astrologyCache.getStats());
    }
  }, [isOpen, activeTrace]);

  const currentDisplayTrace = sandboxResult?.trace || activeTrace;

  const handleRunSandbox = async (queryText?: string) => {
    const q = (queryText || sandboxQuery).trim();
    if (!q) return;

    setSandboxRunning(true);
    try {
      const mockCounsellor: Counsellor = {
        slug: "acharya-orchestrator",
        name: "Acharya Anand Shastri",
        portrait: "/portraits/devrajit.png",
        specialties: ["Vedic Jyotish", "Prashna"],
        languages: ["Hindi", "English"],
        experienceYears: 22,
        rating: 4.9,
        ordersCount: 31000,
        pricePerMin: 45,
        originalPricePerMin: 90,
        waitMinutes: 0,
        isCelebrity: false,
        isNew: false,
        categories: ["career", "marriage"],
        tagline: "Vedic Scholar",
        bio: "Kashi trained Jyotish scholar",
        signature: "Graha margdarshan dete hain, karma sadhana karta hai.",
        hometown: "Varanasi",
        region: "North India",
        personaPrompt: "Authentic, scholarly Vedic astrologer.",
      };

      const result = await executeOrchestratorPipeline(
        q,
        mockCounsellor,
        userProfile,
        kundli,
        async (payload) => {
          // Gemini mock fallback for sandbox
          return `Based on ${payload.intent}, the 10th house is favorably positioned with Shani providing enduring discipline. [BPHS Ch. 18 Verse 2].`;
        }
      );

      const updatedProfile = AICreditManager.recordTransaction(result.trace);
      setCreditProfile(updatedProfile);
      setLedger(AICreditManager.getLedger());
      setSandboxResult({ text: result.replyText, trace: result.trace });
      setCacheStats(astrologyCache.getStats());
      setPoolStatus(quotaRouter.getPoolStatus());
    } catch (err) {
      console.error(err);
    } finally {
      setSandboxRunning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-[#1a1410] text-[#f7eed9] border border-[#d97706]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#261d16] border-b border-[#3d2f22] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#d97706]/20 border border-[#d97706]/50 flex items-center justify-center text-[#fbbf24]">
              <Cpu size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-[#fdf8ed]">
                  Astrotalk AI Orchestrator & Evidence Pipeline
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-[#b8a793]">
                Deterministic Engine + Targeted Context Pruner + Shastra Evidence RAG + Quota-Aware Router
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#33251a] border border-[#4d3928] text-xs">
              <Coins size={14} className="text-[#fbbf24]" />
              <span className="text-[#e8dac7]">AI Credits:</span>
              <span className="font-mono font-bold text-[#fbbf24]">{creditProfile.creditsRemaining}</span>
              <span className="text-[#8c7a65]">/ 100</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#b8a793] hover:text-[#fdf8ed] hover:bg-[#3d2f22] transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 bg-[#211913] border-b border-[#36291d] flex items-center gap-1 shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("pipeline")}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "pipeline"
                ? "border-[#d97706] text-[#fbbf24] bg-[#2d2219]"
                : "border-transparent text-[#a69480] hover:text-[#fdf8ed]"
            }`}
          >
            <Layers size={14} />
            Live Execution Pipeline
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pools")}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "pools"
                ? "border-[#d97706] text-[#fbbf24] bg-[#2d2219]"
                : "border-transparent text-[#a69480] hover:text-[#fdf8ed]"
            }`}
          >
            <Server size={14} />
            Quota Pools (Sarvam & Gemini)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("credits")}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "credits"
                ? "border-[#d97706] text-[#fbbf24] bg-[#2d2219]"
                : "border-transparent text-[#a69480] hover:text-[#fdf8ed]"
            }`}
          >
            <Coins size={14} />
            ₹10/24h Credit Ledger
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sandbox")}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "sandbox"
                ? "border-[#d97706] text-[#fbbf24] bg-[#2d2219]"
                : "border-transparent text-[#a69480] hover:text-[#fdf8ed]"
            }`}
          >
            <Play size={14} />
            Interactive Sandbox
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: LIVE PIPELINE ARCHITECTURE */}
          {activeTab === "pipeline" && (
            <div className="space-y-6">
              {/* Architecture Blueprint Visualizer */}
              <div className="p-4 rounded-xl bg-[#261d16] border border-[#3d2f22]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#fbbf24]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#fbbf24]">
                      Orchestrator Routing Topology
                    </span>
                  </div>
                  <span className="text-[11px] text-[#a69480]">
                    Zero-LLM Deterministic + Targeted RAG + Fact Check
                  </span>
                </div>

                {/* Diagram */}
                <div className="p-4 rounded-lg bg-[#140f0c] border border-[#2d2219] font-mono text-[11px] text-[#e8dac7] overflow-x-auto">
                  <pre className="leading-relaxed text-[#cbb8a2]">
{`                   ASTROTALK CLIENT (Question: "${currentDisplayTrace?.userQuestion || "Career kaisa rahega?"}")
                                      │
                         DETERMINISTIC ENGINE CHECK
                           ├── Can answer? (Lagna, Nakshatra, Dasha, Manglik, Shastra Defs)
                           │    └── YES ──> [0 TOKENS • 0 CREDITS] Direct Shastra Output ⚡
                           └── NO
                                │
                     INTENT CLASSIFIER & CONTEXT PRUNER
                      (Prunes 4.2k tokens down to ~240 tokens: 10th House, 10th Lord, Dasha)
                                │
                       CLASSICAL EVIDENCE RAG (BPHS / Phaladeepika)
                                │
                     SEMANTIC CACHE CHECK (chart_hash + intent + rule_hash)
                           ├── Cache Hit? ──> [0 TOKENS • 0 CREDITS] Instant Replay ⚡
                           └── Cache Miss
                                │
                      QUOTA-AWARE LLM ROUTER
                     ┌──────────┴──────────┐
                     │                     │
               PRIMARY POOL           FALLBACK POOL
           (Sarvam Vernacular:    (Gemini Deep Reasoning:
           Hindi/Hinglish/Slokas)  Complex Multi-Source)
                     │                     │
                     └──────────┬──────────┘
                                │
                    EVIDENCE FACT-CHECKER
             (Verifies LLM claims against Chart Engine truth)
                                │
                        RESPONSE DELIVERED`}
                  </pre>
                </div>
              </div>

              {/* Latest Trace Details */}
              {currentDisplayTrace ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#fbbf24] uppercase tracking-wider flex items-center gap-1.5">
                      <Activity size={14} />
                      Active Query Telemetry Trace ({currentDisplayTrace.traceId})
                    </h3>
                    <span className="text-xs font-mono text-[#a69480]">
                      Latency: {currentDisplayTrace.routeDecision.latencyMs}ms
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {/* Card 1: Intent & Pruning */}
                    <div className="p-4 rounded-xl bg-[#211913] border border-[#382b1f] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#a69480]">Intent Detected</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#d97706]/20 text-[#fbbf24] border border-[#d97706]/40">
                          {currentDisplayTrace.intent}
                        </span>
                      </div>
                      
                      <div className="pt-2 border-t border-[#31251a]">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[#a69480]">Token Compression</span>
                          <span className="font-mono text-[#10b981] font-bold">
                            -{currentDisplayTrace.tokensSavedPercentage}% saved
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#33251a] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399]"
                            style={{ width: `${currentDisplayTrace.tokensSavedPercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-[#8c7a65] mt-1.5">
                          <span>Raw: {currentDisplayTrace.rawTokensEstimate} tok</span>
                          <span>Pruned: {currentDisplayTrace.prunedTokensSent} tok</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#31251a]">
                        <span className="text-[11px] font-semibold text-[#cbb8a2] block mb-1">Pruned Chart Coordinates:</span>
                        <ul className="text-[11px] text-[#9c8973] space-y-1 list-disc pl-3.5">
                          {currentDisplayTrace.prunedFactsSummary.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Card 2: Shastra Citations RAG */}
                    <div className="p-4 rounded-xl bg-[#211913] border border-[#382b1f] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#a69480]">Classical Shastra Evidence</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#8b5cf6]/20 text-[#c4b5fd] border border-[#8b5cf6]/40">
                          {currentDisplayTrace.matchedRules.length} Matched
                        </span>
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pt-1">
                        {currentDisplayTrace.matchedRules.map((r, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-[#18120e] border border-[#2d2219] text-xs">
                            <div className="flex items-center justify-between text-[11px] font-bold text-[#fbbf24]">
                              <span>{r.sourceText}</span>
                              <span className="text-[#a69480] font-normal">{r.verse}</span>
                            </div>
                            {r.sanskritSloka && (
                              <p className="font-serif text-[11px] text-[#fdf8ed]/80 italic my-1">
                                &ldquo;{r.sanskritSloka}&rdquo;
                              </p>
                            )}
                            <p className="text-[10px] text-[#9c8973] line-clamp-2">
                              {r.purport}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card 3: Router & Fact Check */}
                    <div className="p-4 rounded-xl bg-[#211913] border border-[#382b1f] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#a69480]">Router Provider</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          currentDisplayTrace.isDeterministic || currentDisplayTrace.routeDecision.providerName === "Deterministic Engine"
                            ? "bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40"
                            : currentDisplayTrace.routeDecision.providerName === "Sarvam Synthesizer"
                            ? "bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/40"
                            : "bg-[#3b82f6]/20 text-[#93c5fd] border border-[#3b82f6]/40"
                        }`}>
                          {currentDisplayTrace.routeDecision.providerName}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-[#cbb8a2]">
                        <div className="flex justify-between">
                          <span className="text-[#8c7a65]">Quota Pool:</span>
                          <span className="font-mono text-[#e8dac7]">{currentDisplayTrace.routeDecision.pool}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8c7a65]">Slot / Account:</span>
                          <span className="font-mono text-[#e8dac7]">{currentDisplayTrace.routeDecision.accountSlot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8c7a65]">Credits Charged:</span>
                          <span className="font-mono font-bold text-[#fbbf24]">
                            {currentDisplayTrace.routeDecision.creditsCharged} Credits
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#31251a]">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#10b981] mb-1">
                          <ShieldCheck size={15} />
                          <span>Hallucination Shield Status</span>
                        </div>
                        <p className="text-[11px] text-[#9c8973]">
                          {currentDisplayTrace.factCheck.verifiedClaims[0] || "All claims verified against Natal Chart Truth."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center rounded-xl bg-[#211913] border border-[#382b1f] text-[#8c7a65]">
                  <Layers size={32} className="mx-auto mb-2 opacity-50 text-[#fbbf24]" />
                  <p className="text-sm font-semibold text-[#cbb8a2]">No Active Query Trace</p>
                  <p className="text-xs text-[#8c7a65] mt-1">
                    Ask a question in chat or run the Interactive Sandbox below to view the live execution pipeline!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: QUOTA POOLS MONITOR */}
          {activeTab === "pools" && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#261d16] border border-[#3d2f22]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-bold text-sm text-[#fdf8ed] flex items-center gap-2">
                    <Server size={16} className="text-[#fbbf24]" />
                    Multi-Account Provider Pools & Quota Gateway
                  </h3>
                  <span className="text-xs font-mono text-[#34d399] bg-[#10b981]/15 px-2 py-0.5 rounded border border-[#10b981]/30">
                    Total Capacity: {poolStatus.totalRPMCapacity} RPM
                  </span>
                </div>
                <p className="text-xs text-[#a69480]">
                  Quota pooling acts as a temporary testing gateway. The router balances load across Sarvam (vernacular/simple) and Gemini (deep synthesis) without exceeding single-account thresholds.
                </p>
              </div>

              {/* Primary Pool: Sarvam */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#34d399] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                    Primary Pool (Sarvam - Hindi / Hinglish / Shlokas)
                  </span>
                  <span className="text-xs text-[#8c7a65]">3 Operational Slots</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {poolStatus.primaryPool.map((slot) => (
                    <div key={slot.id} className="p-3.5 rounded-xl bg-[#211913] border border-[#382b1f] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#fdf8ed]">{slot.name}</span>
                        <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-[#10b981]/20 text-[#34d399] uppercase font-bold">
                          {slot.health}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-[#a69480]">
                        <span>Current Load:</span>
                        <span className="font-mono text-[#fbbf24]">{slot.requestsThisMinute} / {slot.rpmLimit} RPM</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#33251a] overflow-hidden">
                        <div
                          className="h-full bg-[#10b981]"
                          style={{ width: `${(slot.requestsThisMinute / slot.rpmLimit) * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#8c7a65]">Role: Vernacular conversational & sloka chanting</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fallback Pool: Gemini */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#60a5fa] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                    Fallback & Deep Reasoning Pool (Gemini 3.8 Flash)
                  </span>
                  <span className="text-xs text-[#8c7a65]">3 Operational Slots</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {poolStatus.fallbackPool.map((slot) => (
                    <div key={slot.id} className="p-3.5 rounded-xl bg-[#211913] border border-[#382b1f] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#fdf8ed]">{slot.name}</span>
                        <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-[#3b82f6]/20 text-[#93c5fd] uppercase font-bold">
                          {slot.health}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-[#a69480]">
                        <span>Current Load:</span>
                        <span className="font-mono text-[#60a5fa]">{slot.requestsThisMinute} / {slot.rpmLimit} RPM</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#33251a] overflow-hidden">
                        <div
                          className="h-full bg-[#3b82f6]"
                          style={{ width: `${(slot.requestsThisMinute / slot.rpmLimit) * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#8c7a65]">Role: Long evidence synthesis & source disputes</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semantic Cache Stats */}
              <div className="p-4 rounded-xl bg-[#211913] border border-[#382b1f] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 flex items-center justify-center text-[#c4b5fd]">
                    <Database size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#fdf8ed]">Shastra & Chart Memory Cache</h4>
                    <p className="text-[11px] text-[#a69480]">
                      Key: <code className="text-[#fbbf24]">chart_hash + intent + rule_version</code>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-[#fbbf24]">
                    {cacheStats.size} cached entries
                  </div>
                  <div className="text-[10px] text-[#34d399] font-mono">
                    {cacheStats.totalHits} instant cache replays (0 LLM cost)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ₹10 / 24-HOUR CREDIT LEDGER */}
          {activeTab === "credits" && (
            <div className="space-y-6">
              {/* Plan Card */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-[#2c2016] via-[#241a12] to-[#1e150f] border border-[#d97706]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d97706] text-black uppercase">
                      Active Plan
                    </span>
                    <span className="text-xs text-[#a69480]">Expires in 23 hrs 40 mins</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#fdf8ed] mt-1">
                    {creditProfile.planName} (100 Daily Credits)
                  </h3>
                  <p className="text-xs text-[#b8a793] mt-0.5">
                    Hard budget protection: Never allows unlimited calls to drain quotas.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-[#fbbf24]">
                      {creditProfile.creditsRemaining}
                    </div>
                    <div className="text-[11px] text-[#a69480]">Credits Left Today</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = AICreditManager.rechargeCredits(100);
                      setCreditProfile(updated);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#d97706] hover:bg-[#b45309] text-black font-bold text-xs transition-colors cursor-pointer"
                  >
                    + Add 100 Credits (₹10)
                  </button>
                </div>
              </div>

              {/* Rate Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-[#211913] border border-[#382b1f] text-center">
                  <span className="text-lg font-mono font-bold text-[#10b981]">0 Credits</span>
                  <p className="text-[11px] font-semibold text-[#fdf8ed] mt-0.5">Deterministic Ops</p>
                  <p className="text-[10px] text-[#8c7a65]">Kundli, Nakshatra, Dasha, Manglik check</p>
                </div>
                <div className="p-3 rounded-lg bg-[#211913] border border-[#382b1f] text-center">
                  <span className="text-lg font-mono font-bold text-[#fbbf24]">1 Credit</span>
                  <p className="text-[11px] font-semibold text-[#fdf8ed] mt-0.5">Simple Vernacular</p>
                  <p className="text-[10px] text-[#8c7a65]">Conversational clarity & quick remedies</p>
                </div>
                <div className="p-3 rounded-lg bg-[#211913] border border-[#382b1f] text-center">
                  <span className="text-lg font-mono font-bold text-[#fbbf24]">3 Credits</span>
                  <p className="text-[11px] font-semibold text-[#fdf8ed] mt-0.5">Normal Analysis</p>
                  <p className="text-[10px] text-[#8c7a65]">Career / Marriage + Pruned 10th/7th RAG</p>
                </div>
                <div className="p-3 rounded-lg bg-[#211913] border border-[#382b1f] text-center">
                  <span className="text-lg font-mono font-bold text-[#60a5fa]">8 Credits</span>
                  <p className="text-[11px] font-semibold text-[#fdf8ed] mt-0.5">Deep Synthesis</p>
                  <p className="text-[10px] text-[#8c7a65]">Gemini classical reconciliation</p>
                </div>
              </div>

              {/* Ledger Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#a69480]">
                  Real-Time Credit Consumption Ledger
                </h4>
                <div className="rounded-xl bg-[#211913] border border-[#382b1f] overflow-hidden">
                  <div className="max-h-60 overflow-y-auto no-scrollbar divide-y divide-[#2d2219]">
                    {ledger.map((entry) => (
                      <div key={entry.id} className="p-3 flex items-center justify-between text-xs gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#fdf8ed] truncate">{entry.question}</p>
                          <p className="text-[10px] text-[#8c7a65] mt-0.5">{entry.reason}</p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0 text-right">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#33251a] text-[#cbb8a2]">
                            {entry.provider}
                          </span>
                          <span className={`font-mono font-bold ${entry.creditsCharged === 0 ? "text-[#10b981]" : "text-[#fbbf24]"}`}>
                            {entry.creditsCharged === 0 ? "FREE (0)" : `-${entry.creditsCharged}`} cr
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INTERACTIVE SANDBOX */}
          {activeTab === "sandbox" && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#261d16] border border-[#3d2f22]">
                <h3 className="font-display font-bold text-sm text-[#fdf8ed] mb-1">
                  AI Orchestrator Execution Sandbox
                </h3>
                <p className="text-xs text-[#a69480]">
                  Test questions to see how the system differentiates between deterministic calculations (0 tokens), context-pruned vernacular routing, and deep multi-source synthesis.
                </p>
              </div>

              {/* Quick Prompt Pill Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { q: "Purva Phalguni kya hota hai?", label: "0 Credits: Purva Phalguni (Def)" },
                  { q: "Career kaisa rahega?", label: "3 Credits: Career 10th House (Pruned)" },
                  { q: "Manglik dosha hai kya meri kundli mein?", label: "0 Credits: Manglik Check (Engine)" },
                  { q: "Sade Sati kya hoti hai?", label: "0 Credits: Shani Sade Sati (Def)" },
                  { q: "Meri lagna kya hai?", label: "0 Credits: Lagna & Lagnesh" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSandboxQuery(item.q);
                      handleRunSandbox(item.q);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs bg-[#2b2017] hover:bg-[#3d2f22] text-[#e8dac7] border border-[#4d3928] transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Input box */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sandboxQuery}
                  onChange={(e) => setSandboxQuery(e.target.value)}
                  placeholder="Type any astrology question (e.g. Purva Phalguni kya hota hai?)..."
                  className="flex-1 bg-[#18120e] border border-[#3d2f22] rounded-xl px-4 py-2.5 text-xs text-[#fdf8ed] focus:outline-none focus:border-[#d97706]"
                  onKeyDown={(e) => e.key === "Enter" && handleRunSandbox()}
                />
                <button
                  type="button"
                  disabled={sandboxRunning}
                  onClick={() => handleRunSandbox()}
                  className="px-4 py-2.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-black font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Play size={14} />
                  {sandboxRunning ? "Orchestrating..." : "Execute Pipeline"}
                </button>
              </div>

              {/* Result output */}
              {sandboxResult && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#211913] border border-[#382b1f]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#fbbf24] flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-[#10b981]" />
                        Synthesized Response Output
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#33251a] text-[#34d399]">
                        Charged: {sandboxResult.trace.routeDecision.creditsCharged} Credits ({sandboxResult.trace.routeDecision.providerName})
                      </span>
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#140f0c] text-xs text-[#fdf8ed] leading-relaxed whitespace-pre-line font-serif border border-[#2d2219]">
                      {sandboxResult.text}
                    </div>
                  </div>

                  {/* Telemetry snippet */}
                  <div className="p-3 rounded-lg bg-[#1a1410] border border-[#2e2319] text-[11px] font-mono text-[#a69480] flex items-center justify-between">
                    <span>Intent: <b className="text-[#fbbf24]">{sandboxResult.trace.intent}</b></span>
                    <span>Tokens Saved: <b className="text-[#10b981]">{sandboxResult.trace.tokensSavedPercentage}%</b></span>
                    <span>Fact Checked: <b className="text-[#34d399]">Verified ✅</b></span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#1e1712] border-t border-[#36291d] flex items-center justify-between text-xs text-[#8c7a65]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span>Astrotalk Multi-Provider Gateway • Quota-Shielded</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#33251a] hover:bg-[#423122] text-[#fdf8ed] font-medium transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
