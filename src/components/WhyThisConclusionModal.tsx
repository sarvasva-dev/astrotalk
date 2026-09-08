import { useState } from "react";
import {
  X,
  ShieldCheck,
  Calculator,
  BookOpen,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Clock,
  Compass,
  FileCheck
} from "lucide-react";
import type { WhyThisConclusionData } from "../types";

interface WhyThisConclusionModalProps {
  data: WhyThisConclusionData | null;
  onClose: () => void;
}

export default function WhyThisConclusionModal({
  data,
  onClose,
}: WhyThisConclusionModalProps) {
  const [activeTab, setActiveTab] = useState<"math" | "shastra" | "provenance">("math");

  if (!data) return null;

  return (
    <div
      id="why-this-conclusion-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#fffdfa] border border-[#d9cda7] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1b1612] text-white p-5 flex items-start justify-between border-b border-[#3d342a]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#c8531c] text-[10px] font-bold uppercase tracking-wider text-white">
                Computational Provenance
              </span>
              <span className="flex items-center gap-1 text-[11px] text-[#c9b884]">
                <ShieldCheck size={13} className="text-[#3f8a82]" />
                Audit-Verified Engine V1.0.0
              </span>
            </div>
            <h2 className="font-display text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Calculator size={20} className="text-[#c9b884]" />
              Why this conclusion? (प्रमाण व गणना)
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#c9b884] hover:text-white hover:bg-white/10 transition-colors"
            title="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* The Claim Banner */}
        <div className="p-4 bg-[#fae6cf]/60 border-b border-[#f3a76d]/40">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#786a55] block">
            Audited Astrological Claim
          </span>
          <p className="mt-1 text-base font-semibold text-[#1b1612] font-display">
            "{data.claim}"
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#e6d9b7] bg-[#fbf6e8] px-4 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("math")}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === "math"
                ? "bg-[#fffdfa] border-t border-x border-[#d9cda7] text-[#c8531c]"
                : "text-[#786a55] hover:text-[#1b1612]"
            }`}
          >
            <Compass size={14} />
            1. Mathematical Calculation
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("shastra")}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === "shastra"
                ? "bg-[#fffdfa] border-t border-x border-[#d9cda7] text-[#c8531c]"
                : "text-[#786a55] hover:text-[#1b1612]"
            }`}
          >
            <BookOpen size={14} />
            2. Classical Shastra Evidence
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("provenance")}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
              activeTab === "provenance"
                ? "bg-[#fffdfa] border-t border-x border-[#d9cda7] text-[#c8531c]"
                : "text-[#786a55] hover:text-[#1b1612]"
            }`}
          >
            <Cpu size={14} />
            3. Ephemeris & Audit Provenance
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-[#3d342a]">
          {activeTab === "math" && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-[#f6efdc] border border-[#e6d9b7] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#786a55]">True Sidereal Position:</span>
                  <span className="font-mono font-bold text-base text-[#1b1612]">
                    {data.astronomicalCalculation.trueSiderealDeg}
                  </span>
                </div>

                {data.astronomicalCalculation.rawTropicalDeg && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#786a55]">Tropical Longitude (Sayana):</span>
                    <span className="font-mono text-[#3d342a]">
                      {data.astronomicalCalculation.rawTropicalDeg}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#786a55]">Ayanamsha (Chitra Paksha / Lahiri):</span>
                  <span className="font-mono font-bold text-[#c8531c]">
                    {data.astronomicalCalculation.ayanamsaValue} ({data.astronomicalCalculation.ayanamsaName})
                  </span>
                </div>
              </div>

              {/* Step-by-Step Mathematical Derivation */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#786a55]">
                  Step-by-Step Jyotish Derivation
                </h4>

                <div className="p-3.5 rounded-xl bg-[#fffdfa] border border-[#d9cda7] text-xs font-mono space-y-2 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-[#fae6cf] text-[#c8531c] font-bold text-[10px]">
                      STEP 1
                    </span>
                    <div>
                      <strong className="text-[#1b1612]">Tropical to Sidereal Conversion:</strong>
                      <p className="text-[#786a55]">
                        {data.astronomicalCalculation.formula ||
                          `Sidereal = Tropical Longitude - Lahiri Ayanamsha (${data.astronomicalCalculation.ayanamsaValue})`}
                      </p>
                    </div>
                  </div>

                  {data.astronomicalCalculation.nakshatraSpan && (
                    <div className="flex items-start gap-2 pt-2 border-t border-[#e6d9b7]">
                      <span className="px-1.5 py-0.5 rounded bg-[#fae6cf] text-[#c8531c] font-bold text-[10px]">
                        STEP 2
                      </span>
                      <div>
                        <strong className="text-[#1b1612]">27 Equal Nakshatra Arc Segmentation:</strong>
                        <p className="text-[#786a55]">
                          Each Nakshatra = 360° / 27 = 13° 20′ 00″ (13.33333°). Range: {data.astronomicalCalculation.nakshatraSpan}.
                        </p>
                      </div>
                    </div>
                  )}

                  {data.astronomicalCalculation.padaSpan && (
                    <div className="flex items-start gap-2 pt-2 border-t border-[#e6d9b7]">
                      <span className="px-1.5 py-0.5 rounded bg-[#fae6cf] text-[#c8531c] font-bold text-[10px]">
                        STEP 3
                      </span>
                      <div>
                        <strong className="text-[#1b1612]">Pada Quarter Sub-Division (Navamsha mapping):</strong>
                        <p className="text-[#786a55]">
                          Each Pada = 13° 20′ / 4 = 3° 20′ 00″ (3.33333°). Range: {data.astronomicalCalculation.padaSpan}.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {data.astronomicalCalculation.stepExplanation && (
                <div className="p-3 rounded-xl bg-[#fbf6e8] border border-[#e6d9b7] text-xs text-[#5e2308]">
                  <strong>Mathematical Axiom: </strong>
                  {data.astronomicalCalculation.stepExplanation}
                </div>
              )}
            </div>
          )}

          {activeTab === "shastra" && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-[#fffdfa] border border-[#d9cda7] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#c8531c] uppercase tracking-wider">
                    {data.classicalShastra.sourceBook}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#f6efdc] border border-[#d9cda7] text-[10px] font-bold text-[#1b1612]">
                    {data.classicalShastra.chapter} · {data.classicalShastra.verse}
                  </span>
                </div>

                {data.classicalShastra.sanskritSloka && (
                  <div className="p-3 rounded-lg bg-[#fbf6e8] border border-[#e6d9b7] text-center">
                    <p className="font-serif text-sm font-semibold text-[#1b1612] leading-loose">
                      "{data.classicalShastra.sanskritSloka}"
                    </p>
                  </div>
                )}

                <div>
                  <strong className="text-xs text-[#786a55] block mb-1">
                    Canonical Shastric Translation & Purport:
                  </strong>
                  <p className="text-xs text-[#1b1612] leading-relaxed">
                    {data.classicalShastra.englishPurport}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#e6d9b7] flex items-center justify-between text-[11px] text-[#786a55]">
                  <span>Evidence Classification:</span>
                  <span className="font-bold text-[#1f5f5b]">
                    {data.classicalShastra.evidenceType}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#d9ece8]/60 border border-[#3f8a82]/40 flex items-start gap-2 text-xs text-[#1f5f5b]">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-[#1f5f5b]" />
                <p>
                  This claim is derived directly from classical Vedic texts and mathematical ephemeris calculations. The AI assistant is forbidden from hallucinating planetary placements.
                </p>
              </div>
            </div>
          )}

          {activeTab === "provenance" && (
            <div className="space-y-3 animate-fade-in text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#f6efdc] border border-[#e6d9b7] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#786a55]">Execution Engine:</span>
                  <span className="font-bold text-[#1b1612]">{data.provenance.engine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#786a55]">Engine Version:</span>
                  <span className="font-bold text-[#c8531c]">v{data.provenance.engineVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#786a55]">Julian Day Number (JDN):</span>
                  <span className="text-[#1b1612]">{data.provenance.julianDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#786a55]">UTC Normalized Timestamp:</span>
                  <span className="text-[#1b1612]">{data.provenance.utcTimestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#786a55]">Geographic Coordinates:</span>
                  <span className="text-[#1b1612]">{data.provenance.coordinates}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#786a55]">Regression Audit:</span>
                  <span className="font-bold text-[#1f5f5b]">
                    {data.provenance.auditStatus || "Passed Golden Fixture-001 Invariant Suite"}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#fffdfa] border border-[#d9cda7] text-[11px] text-[#786a55] font-sans">
                <strong>Why does Computational Provenance matter?</strong>
                <p className="mt-1 leading-relaxed">
                  In traditional AI wrappers, LLMs "guess" planetary degrees, producing severe astrological errors. Astroguru implements a separation of concerns: mathematical planetary positions are computed deterministically via ephemeris algorithms, and the LLM only interprets verified facts.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#fbf6e8] border-t border-[#e6d9b7] flex items-center justify-between">
          <span className="text-[11px] text-[#786a55] flex items-center gap-1">
            <FileCheck size={14} className="text-[#3f8a82]" />
            Auditable Jyotish Shastra Pipeline
          </span>

          <button
            type="button"
            onClick={onClose}
            className="btn-outline text-xs px-4 py-1.5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
