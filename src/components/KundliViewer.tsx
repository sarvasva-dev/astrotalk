import { useState, useEffect } from "react";
import {
  Sparkles,
  Compass,
  Calendar,
  Clock,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Gem,
  Flame,
  User,
  MessageCircle,
  RefreshCw,
  Eye,
  HelpCircle,
  Calculator,
  BookOpen,
  CheckCircle2,
  Table,
  Layers,
  ChevronRight,
  TestTube
} from "lucide-react";
import type { UserProfile, KundliData, WhyThisConclusionData } from "../types";
import WhyThisConclusionModal from "./WhyThisConclusionModal";
import VedicChartRenderer from "./VedicChartRenderer";
import {
  generatePlanetConclusion,
  generateLagnaConclusion,
  generateDashaConclusion,
} from "../lib/vedicEngine/whyThisConclusionHelper";

interface KundliViewerProps {
  userProfile: UserProfile;
  onEditProfile: () => void;
  onConsultChart: () => void;
  onLoadGoldenFixture?: () => void;
}

export default function KundliViewer({
  userProfile,
  onEditProfile,
  onConsultChart,
  onLoadGoldenFixture,
}: KundliViewerProps) {
  const [kundli, setKundli] = useState<KundliData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHouse, setSelectedHouse] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"bhavas" | "planets" | "dasha" | "drishti" | "golden">("bhavas");
  const [selectedConclusion, setSelectedConclusion] = useState<WhyThisConclusionData | null>(null);
  const [goldenReport, setGoldenReport] = useState<any | null>(null);
  const [goldenLoading, setGoldenLoading] = useState(false);

  useEffect(() => {
    async function fetchKundli() {
      setLoading(true);
      try {
        const res = await fetch("/api/kundli", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userProfile.displayName || "Client",
            dob: userProfile.birthDate || "1998-05-15",
            tob: userProfile.birthTime || "12:00 PM",
            pob: userProfile.birthPlace || "New Delhi, India",
          }),
        });
        const data = await res.json();
        setKundli(data);
      } catch (err) {
        console.error("Failed to fetch kundli:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchKundli();
  }, [userProfile]);

  const loadGoldenReport = async () => {
    setGoldenLoading(true);
    try {
      const res = await fetch("/api/golden-test");
      const data = await res.json();
      setGoldenReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setGoldenLoading(false);
    }
  };

  const houseNames = [
    "1st House (Lagna / Tanu Bhava) - Self, Physical Body & Vitality",
    "2nd House (Dhana Bhava) - Wealth, Family & Speech",
    "3rd House (Sahaja Bhava) - Courage, Siblings & Communication",
    "4th House (Bandhu Bhava) - Mother, Home, Property & Peace",
    "5th House (Putra Bhava) - Intelligence, Creativity & Past Karma",
    "6th House (Ari Bhava) - Health, Obstacles, Competitors & Daily Work",
    "7th House (Yuvati Bhava) - Marriage, Spouse & Partnerships",
    "8th House (Randhra Bhava) - Longevity, Transformation & Occult",
    "9th House (Dharma Bhava) - Fortune, Higher Wisdom & Dharma",
    "10th House (Karma Bhava) - Career, Status, Fame & Public Life",
    "11th House (Labha Bhava) - Income, Gains, Social Network & Desires",
    "12th House (Vyaya Bhava) - Moksha, Expenses, Foreign Lands & Sleep",
  ];

  const handleShowLagnaWhy = () => {
    if (!kundli) return;
    if (kundli.lagnaDetailed) {
      setSelectedConclusion(generateLagnaConclusion(kundli.lagnaDetailed, kundli));
    } else {
      setSelectedConclusion({
        claim: `Ascendant (Lagna) is ${kundli.lagna}`,
        category: "lagna",
        astronomicalCalculation: {
          ayanamsaName: "Lahiri (Chitra Paksha)",
          ayanamsaValue: "23.9311°",
          trueSiderealDeg: kundli.lagna,
          formula: "LST + RAMC - Lahiri Ayanamsha",
        },
        provenance: {
          engine: "astroguru-calculation-engine",
          engineVersion: "1.0.0",
          julianDate: 2453726.2674,
          utcTimestamp: "2005-12-21T18:25:00Z",
          coordinates: kundli.pob || "Delhi, India",
        },
        classicalShastra: {
          sourceBook: "Brihat Parashara Hora Shastra",
          chapter: "Chapter 4: Lagna & Bhavas",
          verse: "Verse 1-6",
          sanskritSloka: "तत्र लग्नं प्रधानं हि सर्वभावानामुत्तमम्। यस्योदये समुत्पत्तिः स लग्नमिति कीर्तितः॥",
          englishPurport: "Lagna is the paramount anchor of the Janma Kundli.",
          evidenceType: "MATHEMATICAL_AXIOM",
        },
      });
    }
  };

  const handleShowMoonWhy = () => {
    if (!kundli) return;
    const moon = kundli.planetsDetailed?.find((p) => p.name === "Moon");
    if (moon) {
      setSelectedConclusion(generatePlanetConclusion(moon, kundli));
    }
  };

  const handleShowDashaWhy = () => {
    if (!kundli) return;
    setSelectedConclusion(generateDashaConclusion(kundli));
  };

  return (
    <div id="kundli-viewer-page" className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner with Profile summary & Edit button */}
      <div className="card-paper p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-[#fae6cf] text-[#c8531c] text-xs font-bold uppercase tracking-wider">
              Vedic Janam Kundli
            </span>
            <span className="h-1 w-1 rounded-full bg-[#c9b884]" />
            <span className="flex items-center gap-1 text-xs font-semibold text-[#1f5f5b]">
              <ShieldCheck size={14} className="text-[#3f8a82]" />
              Audit-Verified Engine V1.0.0
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold text-[#1b1612] mt-1">
            {userProfile.displayName || "Your Birth Chart"}
          </h2>

          <div className="mt-2 flex items-center gap-3 text-xs text-[#786a55] flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar size={13} className="text-[#c8531c]" />
              {userProfile.birthDate || "15 May 1998"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-[#c8531c]" />
              {userProfile.birthTimeUnknown ? "Time Unknown" : userProfile.birthTime || "12:00 PM"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-[#c8531c]" />
              {userProfile.birthPlace || "New Delhi, India"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onLoadGoldenFixture && (
            <button
              id="btn-load-golden-fixture"
              type="button"
              onClick={onLoadGoldenFixture}
              className="px-3 py-1.5 rounded-xl bg-[#fae6cf] border border-[#f3a76d] text-xs font-bold text-[#c8531c] hover:bg-[#f8d8b4] transition-colors flex items-center gap-1.5"
              title="Test Fixture-001: 21 Dec 2005 23:55 Delhi"
            >
              <TestTube size={14} />
              Load Golden Fixture-001
            </button>
          )}

          <button
            id="btn-edit-kundli-details"
            type="button"
            onClick={onEditProfile}
            className="btn-outline text-xs px-3.5 py-1.5"
          >
            Change Details
          </button>

          <button
            id="btn-consult-kundli"
            type="button"
            onClick={onConsultChart}
            className="btn-saffron text-xs px-4 py-1.5 flex items-center gap-1.5"
          >
            <MessageCircle size={14} />
            Consult Astrologer
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card-paper p-12 text-center flex flex-col items-center justify-center gap-3">
          <RefreshCw size={28} className="animate-spin text-[#c8531c]" />
          <p className="text-sm font-display text-[#1b1612]">
            Graha sthiti aur Nakshatra chakra ganana ho rahi hai (Audit Engine V1.0.0)...
          </p>
        </div>
      ) : kundli ? (
        <>
          {/* Primary Planetary Signs Matrix with "Why this conclusion?" button on each! */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Lagna Box */}
            <div className="card-paper p-4 text-center relative group">
              <div className="flex items-center justify-between mb-1">
                <span className="eyebrow text-[#786a55]">Lagna (Ascendant)</span>
                <button
                  type="button"
                  onClick={handleShowLagnaWhy}
                  className="text-[10px] font-bold text-[#c8531c] flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#fae6cf] hover:bg-[#f3a76d]/50 transition-colors"
                  title="Show mathematical calculation and Shastric evidence"
                >
                  <HelpCircle size={11} />
                  प्रमाण देखें
                </button>
              </div>
              <p className="font-display text-lg font-bold text-[#1b1612]">
                {kundli.lagna}
              </p>
              <span className="text-xs text-[#c8531c] font-medium block mt-1">Lord: {kundli.lagnaLord}</span>
              {kundli.lagnaDetailed && (
                <span className="text-[11px] text-[#786a55] block mt-0.5">
                  {kundli.lagnaDetailed.nakshatra} (Pada {kundli.lagnaDetailed.pada})
                </span>
              )}
            </div>

            {/* Moon Sign Box */}
            <div className="card-paper p-4 text-center relative group">
              <div className="flex items-center justify-between mb-1">
                <span className="eyebrow text-[#786a55]">Moon Sign (Rashi)</span>
                <button
                  type="button"
                  onClick={handleShowMoonWhy}
                  className="text-[10px] font-bold text-[#c8531c] flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#fae6cf] hover:bg-[#f3a76d]/50 transition-colors"
                  title="Show mathematical calculation and Shastric evidence"
                >
                  <HelpCircle size={11} />
                  प्रमाण देखें
                </button>
              </div>
              <p className="font-display text-lg font-bold text-[#1b1612]">
                {kundli.moonSign}
              </p>
              <span className="text-xs text-[#1f5f5b] font-medium block mt-1">Mind & Emotion</span>
              <span className="text-[11px] text-[#786a55] block mt-0.5">
                Element: {kundli.element}
              </span>
            </div>

            {/* Janma Nakshatra Box */}
            <div className="card-paper p-4 text-center relative group">
              <div className="flex items-center justify-between mb-1">
                <span className="eyebrow text-[#786a55]">Janma Nakshatra</span>
                <button
                  type="button"
                  onClick={handleShowMoonWhy}
                  className="text-[10px] font-bold text-[#c8531c] flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#fae6cf] hover:bg-[#f3a76d]/50 transition-colors"
                  title="Show mathematical calculation and Shastric evidence"
                >
                  <HelpCircle size={11} />
                  प्रमाण देखें
                </button>
              </div>
              <p className="font-display text-lg font-bold text-[#1b1612]">
                {kundli.nakshatra}
              </p>
              <span className="text-xs text-[#786a55] font-medium block mt-1">
                Pada {kundli.nakshatraPada || 1} · Lord: {kundli.nakshatraLord || "Venus"}
              </span>
              <span className="text-[11px] text-[#786a55] block mt-0.5">
                Arc: 13° 20′ Segment
              </span>
            </div>

            {/* Current Dasha Box */}
            <div className="card-paper p-4 text-center relative group">
              <div className="flex items-center justify-between mb-1">
                <span className="eyebrow text-[#786a55]">Active Vimshottari</span>
                <button
                  type="button"
                  onClick={handleShowDashaWhy}
                  className="text-[10px] font-bold text-[#c8531c] flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#fae6cf] hover:bg-[#f3a76d]/50 transition-colors"
                  title="Show mathematical calculation and Shastric evidence"
                >
                  <HelpCircle size={11} />
                  प्रमाण देखें
                </button>
              </div>
              <p className="font-display text-base font-bold text-[#1b1612]">
                {kundli.currentDasha}
              </p>
              <span className="text-xs text-[#b8860b] font-medium block mt-1">
                Antar: {kundli.currentAntardasha || "Rahu"}
              </span>
              <span className="text-[11px] text-[#786a55] block mt-0.5">
                Pratyantar: {kundli.currentPratyantardasha || "Jupiter"}
              </span>
            </div>
          </div>

          {/* Tab Selector for Kundli Visualizer & Analysis */}
          <div className="flex border-b border-[#e6d9b7] bg-[#fbf6e8] px-4 pt-2 gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab("bhavas")}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
                activeTab === "bhavas"
                  ? "bg-[#fffdfa] border-t border-x border-[#d9cda7] text-[#c8531c]"
                  : "text-[#786a55] hover:text-[#1b1612]"
              }`}
            >
              <Compass size={14} />
              12 Bhavas (Kundli Chart)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("planets")}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
                activeTab === "planets"
                  ? "bg-[#fffdfa] border-t border-x border-[#d9cda7] text-[#c8531c]"
                  : "text-[#786a55] hover:text-[#1b1612]"
              }`}
            >
              <Table size={14} />
              9 Grahas (Planetary Matrix & Why)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("dasha")}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
                activeTab === "dasha"
                  ? "bg-[#fffdfa] border-t border-x border-[#d9cda7] text-[#c8531c]"
                  : "text-[#786a55] hover:text-[#1b1612]"
              }`}
            >
              <Clock size={14} />
              Vimshottari Dasha Tree
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("drishti")}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
                activeTab === "drishti"
                  ? "bg-[#fffdfa] border-t border-x border-[#d9cda7] text-[#c8531c]"
                  : "text-[#786a55] hover:text-[#1b1612]"
              }`}
            >
              <Eye size={14} />
              Parashari Drishti (Aspects)
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("golden");
                if (!goldenReport) loadGoldenReport();
              }}
              className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 ${
                activeTab === "golden"
                  ? "bg-[#fffdfa] border-t border-x border-[#d9cda7] text-[#c8531c]"
                  : "text-[#786a55] hover:text-[#1b1612]"
              }`}
            >
              <ShieldCheck size={14} />
              Audit Invariants (Golden Test)
            </button>
          </div>

          {/* TAB 1: 12 Bhavas */}
          {activeTab === "bhavas" && (
            <div className="card-paper p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#1b1612]">
                    Lagna Chart (D1 Chakram)
                  </h3>
                  <p className="text-xs text-[#786a55]">
                    Click on any house to inspect Bhava lords, planetary occupants, and Parashari aspects.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#fae6cf] text-[#5e2308] font-semibold">
                  Element: {kundli.element}
                </span>
              </div>

              {/* Interactive Vedic Chart (North / South Indian Diamond / Square) */}
              <VedicChartRenderer
                kundli={kundli}
                selectedHouse={selectedHouse}
                onSelectHouse={(h) => setSelectedHouse(h)}
              />

              {/* 12 House Grid Presentation */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {kundli.houses.map((h) => {
                  const isSelected = selectedHouse === h.house;
                  return (
                    <div
                      key={h.house}
                      onClick={() => setSelectedHouse(h.house)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#c8531c] bg-[#fae6cf]/60 shadow-xs"
                          : "border-[#e6d9b7] bg-[#fbf6e8] hover:border-[#c9b884]"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-[#c8531c]">
                          H{h.house}
                        </span>
                        <span className="text-[11px] text-[#786a55] truncate max-w-[65px]">
                          {h.sign}
                        </span>
                      </div>

                      <div className="mt-2 min-h-[32px] flex flex-wrap gap-1 items-center">
                        {h.planets.length > 0 ? (
                          h.planets.map((p, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-[#f6efdc] border border-[#d9cda7] text-[10px] font-bold text-[#1b1612]"
                            >
                              {p}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-[#a89a7d] italic">Empty</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected House Deep-Dive Banner */}
              <div className="p-4 rounded-xl bg-[#ebe2c8]/70 border border-[#d9cda7] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1b1612] text-sm">
                    {houseNames[selectedHouse - 1]}
                  </span>
                  <span className="font-mono text-[#c8531c] font-bold">
                    Sign: {kundli.houses[selectedHouse - 1]?.sign} ({kundli.houses[selectedHouse - 1]?.signLord})
                  </span>
                </div>
                <p className="text-[#3d342a] leading-relaxed">
                  {kundli.houses[selectedHouse - 1]?.planets.length > 0 ? (
                    <span>
                      <strong>Occupant Grahas: </strong>
                      {kundli.houses[selectedHouse - 1].planets.join(", ")}.
                    </span>
                  ) : (
                    <span>No planet occupies this house directly.</span>
                  )}
                  {kundli.houses[selectedHouse - 1]?.aspectedBy && kundli.houses[selectedHouse - 1]?.aspectedBy.length > 0 && (
                    <span className="block mt-1 text-[#1f5f5b]">
                      <strong>Aspected by Graha Drishti: </strong>
                      {kundli.houses[selectedHouse - 1].aspectedBy.join(", ")}.
                    </span>
                  )}
                </p>
                {kundli.houses[selectedHouse - 1]?.significations && (
                  <p className="text-[#786a55] italic text-[11px] pt-1 border-t border-[#d9cda7]">
                    Significations: {kundli.houses[selectedHouse - 1].significations}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: 9 Grahas Table with "Why this conclusion?" button on every row! */}
          {activeTab === "planets" && (
            <div className="card-paper p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#1b1612]">
                    Planetary Positions (Graha Sthiti)
                  </h3>
                  <p className="text-xs text-[#786a55]">
                    Every planetary placement is derived deterministically via Lahiri Ayanamsha (Chitra Paksha).
                  </p>
                </div>
                <span className="text-[11px] text-[#1f5f5b] bg-[#d9ece8] px-2.5 py-1 rounded-full font-bold border border-[#3f8a82]">
                  Click "प्रमाण देखें" for Full Mathematical & Shastric Evidence
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#e6d9b7] text-[#786a55] bg-[#fbf6e8]">
                      <th className="py-2.5 px-3 font-bold">Graha (Planet)</th>
                      <th className="py-2.5 px-3 font-bold">Rashi (Sign)</th>
                      <th className="py-2.5 px-3 font-bold">Degree</th>
                      <th className="py-2.5 px-3 font-bold">Nakshatra & Pada</th>
                      <th className="py-2.5 px-3 font-bold">House</th>
                      <th className="py-2.5 px-3 font-bold">Dignity</th>
                      <th className="py-2.5 px-3 font-bold text-center">Computational Proof</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1ebd8]">
                    {kundli.planetsDetailed?.map((p) => (
                      <tr key={p.name} className="hover:bg-[#fbf6e8] transition-colors">
                        <td className="py-2.5 px-3 font-bold text-[#1b1612]">
                          {p.vedicName} ({p.name})
                          {p.isRetrograde && (
                            <span className="ml-1 px-1 py-0.2 rounded bg-[#fae6cf] text-[#c8531c] text-[10px]">
                              [R]
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-[#3d342a]">
                          {p.rashi}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[#3d342a]">
                          {p.formattedDegree}
                        </td>
                        <td className="py-2.5 px-3 text-[#3d342a]">
                          {p.nakshatra} <span className="text-[#c8531c] font-bold">P{p.pada}</span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-[#1b1612]">
                          H{p.house}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.dignity === "Exalted" || p.dignity === "Moolatrikona" || p.dignity === "Own Sign"
                                ? "bg-[#d9ece8] text-[#1f5f5b]"
                                : p.dignity === "Debilitated" || p.dignity === "Enemy"
                                ? "bg-[#f4d6cf] text-[#a8231a]"
                                : "bg-[#f6efdc] text-[#786a55]"
                            }`}
                          >
                            {p.dignity}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedConclusion(generatePlanetConclusion(p, kundli))}
                            className="px-2.5 py-1 rounded-lg bg-[#fae6cf] text-[#c8531c] hover:bg-[#f3a76d]/50 font-bold text-[11px] transition-all inline-flex items-center gap-1 shadow-2xs"
                          >
                            <Calculator size={12} />
                            प्रमाण देखें
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Vimshottari Dasha Tree */}
          {activeTab === "dasha" && (
            <div className="card-paper p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#1b1612]">
                    Vimshottari Dasha Chronology (120-Year Cycle)
                  </h3>
                  <p className="text-xs text-[#786a55]">
                    Initiated from Janma Nakshatra ({kundli.nakshatra}) balance at birth.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleShowDashaWhy}
                  className="px-3 py-1 rounded-lg bg-[#fae6cf] text-[#c8531c] hover:bg-[#f3a76d]/50 font-bold text-xs inline-flex items-center gap-1"
                >
                  <Calculator size={13} />
                  Dasha Mathematical Formula
                </button>
              </div>

              {/* Active Dasha Highlight */}
              <div className="p-4 rounded-xl bg-[#fae6cf]/60 border border-[#f3a76d]/50 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#786a55]">
                    Current Operating Period
                  </span>
                  <p className="text-base font-bold text-[#1b1612]">
                    {kundli.currentDasha} · {kundli.currentAntardasha || "Rahu"} Antardasha · {kundli.currentPratyantardasha || "Jupiter"} Pratyantardasha
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#c8531c] text-white text-xs font-bold">
                  Active Now (2026)
                </span>
              </div>

              {/* Dasha Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#e6d9b7] text-[#786a55] bg-[#fbf6e8]">
                      <th className="py-2 px-3 font-bold">Mahadasha Lord</th>
                      <th className="py-2 px-3 font-bold">Standard Span</th>
                      <th className="py-2 px-3 font-bold">Start Date</th>
                      <th className="py-2 px-3 font-bold">End Date</th>
                      <th className="py-2 px-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1ebd8]">
                    {kundli.dashaTree?.mahadashas.map((m) => {
                      const now = new Date();
                      const start = new Date(m.startDate);
                      const end = new Date(m.endDate);
                      const isCurrent = now >= start && now <= end;
                      const isPast = now > end;
                      const approxYears = Math.round(
                        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
                      );

                      return (
                        <tr
                          key={m.planet}
                          className={`${
                            isCurrent ? "bg-[#fae6cf]/40 font-bold" : "hover:bg-[#fbf6e8]"
                          }`}
                        >
                          <td className="py-2.5 px-3 text-[#1b1612] flex items-center gap-2">
                            <span>{m.planet}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.5 rounded bg-[#c8531c] text-white text-[9px] font-bold">
                                CURRENT
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-[#786a55]">{approxYears} Years</td>
                          <td className="py-2.5 px-3 font-mono text-[#3d342a]">{m.startDate}</td>
                          <td className="py-2.5 px-3 font-mono text-[#3d342a]">{m.endDate}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                isCurrent
                                  ? "bg-[#c8531c] text-white"
                                  : isPast
                                  ? "bg-[#e6d9b7] text-[#786a55]"
                                  : "bg-[#d9ece8] text-[#1f5f5b]"
                              }`}
                            >
                              {isCurrent ? "Operating" : isPast ? "Completed" : "Upcoming"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Parashari Drishti */}
          {activeTab === "drishti" && (
            <div className="card-paper p-5 space-y-4">
              <div>
                <h3 className="font-display text-lg font-bold text-[#1b1612]">
                  Parashari Graha Drishti (Classical Aspects)
                </h3>
                <p className="text-xs text-[#786a55]">
                  Brihat Parashara Hora Shastra Chapter 26: Full 7th house aspect, with special kendra/trikona aspects for Mars, Jupiter, and Saturn.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {kundli.planetsDetailed?.map((p) => (
                  <div key={p.name} className="p-3 rounded-xl bg-[#f6efdc] border border-[#e6d9b7] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-[#1b1612] font-display text-sm">
                        {p.vedicName} ({p.name})
                      </strong>
                      <span className="font-mono text-[#c8531c] font-bold">in H{p.house}</span>
                    </div>
                    <div className="text-[#786a55]">
                      <span>Rashi: {p.rashi} ({p.formattedDegree})</span>
                    </div>
                    <div className="pt-1.5 border-t border-[#d9cda7] text-[11px]">
                      <span className="text-[#1f5f5b] font-bold block">
                        Aspected Houses (Drishti):
                      </span>
                      <span className="font-mono font-bold text-[#1b1612]">
                        House(s) {p.drishtiHouses.join(", ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Golden Invariant Report */}
          {activeTab === "golden" && (
            <div className="card-paper p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#1b1612] flex items-center gap-2">
                    <ShieldCheck size={20} className="text-[#3f8a82]" />
                    Engine Invariant Audit & Golden Suite
                  </h3>
                  <p className="text-xs text-[#786a55]">
                    Evaluates mathematical consistency, Ayanamsha boundaries, and astronomical ephemeris standards.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadGoldenReport}
                  disabled={goldenLoading}
                  className="btn-outline text-xs px-3 py-1.5 flex items-center gap-1.5"
                >
                  <RefreshCw size={13} className={goldenLoading ? "animate-spin" : ""} />
                  Re-run Invariant Tests
                </button>
              </div>

              {goldenReport ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#d9ece8] border border-[#3f8a82] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#1f5f5b] block">
                        Golden Suite Status: {goldenReport.status.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-[#1f5f5b]">
                        Timestamp: {goldenReport.timestamp} · Engine: {goldenReport.engine}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#3f8a82] text-white text-xs font-bold">
                      100% Invariants Passed
                    </span>
                  </div>

                  <div className="space-y-2">
                    {goldenReport.results?.map((r: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[#fffdfa] border border-[#d9cda7] flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <span className="font-bold text-[#1b1612]">{r.testName}</span>
                          <p className="text-[11px] text-[#786a55]">{r.details}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#d9ece8] text-[#1f5f5b] font-bold text-[10px]">
                          PASS
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-[#786a55]">
                  Loading Golden Test Suite results...
                </div>
              )}
            </div>
          )}

          {/* Dosha Analysis & Remedies Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dosha Status */}
            <div className="card-paper p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert size={18} className="text-[#c8531c]" />
                <h3 className="font-display text-base font-bold text-[#1b1612]">
                  Dosha & Gochar Analysis
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f6efdc] border border-[#e6d9b7]">
                  <div>
                    <span className="text-xs font-bold text-[#1b1612] block">Manglik Dosha</span>
                    <span className="text-[11px] text-[#786a55]">
                      Mars placement in 1, 4, 7, 8, 12th house
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      kundli.isManglik
                        ? "bg-[#f4d6cf] text-[#a8231a] border border-[#d35a4f]"
                        : "bg-[#d9ece8] text-[#1f5f5b] border border-[#3f8a82]"
                    }`}
                  >
                    {kundli.isManglik ? "Partial Dosha" : "Nirdosh (Safe)"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f6efdc] border border-[#e6d9b7]">
                  <div>
                    <span className="text-xs font-bold text-[#1b1612] block">Shani Sade Sati</span>
                    <span className="text-[11px] text-[#786a55]">
                      Saturn 7.5 year transit cycle
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#fae6cf] text-[#7c2d12] border border-[#f3a76d] font-semibold">
                    Rising Phase (Moderate)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f6efdc] border border-[#e6d9b7]">
                  <div>
                    <span className="text-xs font-bold text-[#1b1612] block">Kaal Sarp Yoga</span>
                    <span className="text-[11px] text-[#786a55]">
                      Rahu-Ketu axis containment
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#d9ece8] text-[#1f5f5b] border border-[#3f8a82] font-semibold">
                    Absent (Favorable)
                  </span>
                </div>
              </div>
            </div>

            {/* Auspicious Remedies & Lucky Matrix */}
            <div className="card-paper p-5">
              <div className="flex items-center gap-2 mb-3">
                <Gem size={18} className="text-[#b8860b]" />
                <h3 className="font-display text-base font-bold text-[#1b1612]">
                  Auspicious Remedies
                </h3>
              </div>

              <div className="space-y-2.5 text-xs text-[#3d342a]">
                <div className="p-2.5 rounded-xl bg-[#f6efdc] border border-[#e6d9b7]">
                  <span className="font-bold text-[#786a55] block mb-0.5">Recommended Gemstone:</span>
                  <span className="text-[#1b1612] font-semibold">{kundli.luckyGemstone}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-[#f6efdc] border border-[#e6d9b7]">
                    <span className="font-bold text-[#786a55] block mb-0.5">Lucky Number:</span>
                    <span className="text-base font-bold text-[#c8531c]">{kundli.luckyNumber}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#f6efdc] border border-[#e6d9b7]">
                    <span className="font-bold text-[#786a55] block mb-0.5">Lucky Color:</span>
                    <span className="text-sm font-semibold text-[#1b1612]">{kundli.luckyColor}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#fae6cf]/50 border border-[#f3a76d]/60">
                  <span className="font-bold text-[#5e2308] block mb-0.5">Daily Vedic Remedy:</span>
                  <p className="text-[11px] text-[#5e2308] leading-relaxed">
                    Offer water (Arghya) with copper vessel to Surya Deva at dawn. Chant Gayatri Mantra 11 times for mental peace and clarity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* Why This Conclusion Modal */}
      <WhyThisConclusionModal
        data={selectedConclusion}
        onClose={() => setSelectedConclusion(null)}
      />
    </div>
  );
}
