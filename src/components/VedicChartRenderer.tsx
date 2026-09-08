import { useState } from "react";
import { Compass, Sparkles, Layers, Info } from "lucide-react";
import type { KundliData, WhyThisConclusionData } from "../types";
import type { PlanetPosition } from "../lib/vedicEngine/calculationEngine";

interface VedicChartRendererProps {
  kundli: KundliData;
  selectedHouse: number;
  onSelectHouse: (houseNum: number) => void;
  onShowWhy?: (data: WhyThisConclusionData) => void;
}

const RASHI_ABBR = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const PLANET_SHORT_CODES: Record<string, string> = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa",
  Rahu: "Ra",
  Ketu: "Ke",
};

export default function VedicChartRenderer({
  kundli,
  selectedHouse,
  onSelectHouse,
}: VedicChartRendererProps) {
  const [chartStyle, setChartStyle] = useState<"north" | "south">("north");
  const [chartDivision, setChartDivision] = useState<"D1" | "D9">("D1");

  // Determine Lagna Rashi index (0 to 11)
  const lagnaRashiIdx = kundli.lagnaDetailed ? kundli.lagnaDetailed.rashiIndex : 5; // default Virgo (5)

  // Calculate Navamsha sign for each planet and Lagna if D9 selected
  const getNavamshaHouse = (planet: PlanetPosition, lagnaNavamshaIdx: number) => {
    const pNavIdx = (planet.nakshatraIndex * 4 + (planet.pada - 1)) % 12;
    return ((pNavIdx - lagnaNavamshaIdx + 12) % 12) + 1;
  };

  const lagnaNavamshaIdx = kundli.lagnaDetailed
    ? (kundli.lagnaDetailed.nakshatraIndex * 4 + (kundli.lagnaDetailed.pada - 1)) % 12
    : 1;

  // Build house occupants map
  const getHouseOccupants = (hNum: number) => {
    if (!kundli.planetsDetailed) {
      const hObj = kundli.houses.find((h) => h.house === hNum);
      return (hObj?.planets || []).map((p) => ({
        code: p.slice(0, 2),
        name: p,
        retro: false,
        deg: "",
      }));
    }

    if (chartDivision === "D1") {
      return kundli.planetsDetailed
        .filter((p) => p.house === hNum)
        .map((p) => ({
          code: PLANET_SHORT_CODES[p.name] || p.name.slice(0, 2),
          name: p.vedicName,
          retro: p.isRetrograde,
          deg: p.formattedDegree.split(" ")[0],
        }));
    } else {
      // D9 Navamsha
      return kundli.planetsDetailed
        .filter((p) => getNavamshaHouse(p, lagnaNavamshaIdx) === hNum)
        .map((p) => ({
          code: PLANET_SHORT_CODES[p.name] || p.name.slice(0, 2),
          name: p.vedicName,
          retro: p.isRetrograde,
          deg: `P${p.pada}`,
        }));
    }
  };

  // Get Rashi number (1..12) for a given house
  const getHouseRashiNum = (hNum: number) => {
    const baseIdx = chartDivision === "D1" ? lagnaRashiIdx : lagnaNavamshaIdx;
    return ((baseIdx + (hNum - 1)) % 12) + 1;
  };

  // House polygons for North Indian Diamond Chart (400x400 viewBox)
  const northHousePolygons: Record<number, { points: string; textX: number; textY: number; labelX: number; labelY: number }> = {
    1: { points: "200,0 100,100 200,200 300,100", textX: 200, textY: 105, labelX: 200, labelY: 45 },
    2: { points: "0,0 200,0 100,100", textX: 100, textY: 40, labelX: 140, labelY: 25 },
    3: { points: "0,0 0,200 100,100", textX: 40, textY: 100, labelX: 25, labelY: 140 },
    4: { points: "0,200 100,100 200,200 100,300", textX: 100, textY: 200, labelX: 45, labelY: 200 },
    5: { points: "0,200 0,400 100,300", textX: 40, textY: 300, labelX: 25, labelY: 260 },
    6: { points: "0,400 200,400 100,300", textX: 100, textY: 360, labelX: 140, labelY: 375 },
    7: { points: "200,200 100,300 200,400 300,300", textX: 200, textY: 295, labelX: 200, labelY: 355 },
    8: { points: "200,400 400,400 300,300", textX: 300, textY: 360, labelX: 260, labelY: 375 },
    9: { points: "400,200 400,400 300,300", textX: 360, textY: 300, labelX: 375, labelY: 260 },
    10: { points: "200,200 300,100 400,200 300,300", textX: 300, textY: 200, labelX: 355, labelY: 200 },
    11: { points: "400,0 400,200 300,100", textX: 360, textY: 100, labelX: 375, labelY: 140 },
    12: { points: "200,0 400,0 300,100", textX: 300, textY: 40, labelX: 260, labelY: 25 },
  };

  // South Indian Chart signs layout (Fixed 4x4 Grid)
  // [Pisces(12), Aries(1), Taurus(2), Gemini(3)]
  // [Aquarius(11), (center), (center), Cancer(4)]
  // [Capricorn(10), (center), (center), Leo(5)]
  // [Sagittarius(9), Scorpio(8), Libra(7), Virgo(6)]
  const southSignsGrid = [
    { rashiNum: 12, row: 0, col: 0 },
    { rashiNum: 1, row: 0, col: 1 },
    { rashiNum: 2, row: 0, col: 2 },
    { rashiNum: 3, row: 0, col: 3 },
    { rashiNum: 11, row: 1, col: 0 },
    { rashiNum: 4, row: 1, col: 3 },
    { rashiNum: 10, row: 2, col: 0 },
    { rashiNum: 5, row: 2, col: 3 },
    { rashiNum: 9, row: 3, col: 0 },
    { rashiNum: 8, row: 3, col: 1 },
    { rashiNum: 7, row: 3, col: 2 },
    { rashiNum: 6, row: 3, col: 3 },
  ];

  return (
    <div id="vedic-chart-component" className="space-y-4">
      {/* Controls & Mode Toggles */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {/* North vs South Style */}
          <div className="inline-flex rounded-lg border border-[#d9cda7] p-0.5 bg-[#fbf6e8]">
            <button
              type="button"
              onClick={() => setChartStyle("north")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                chartStyle === "north"
                  ? "bg-[#c8531c] text-white shadow-2xs"
                  : "text-[#786a55] hover:text-[#1b1612]"
              }`}
            >
              North Indian (Diamond)
            </button>
            <button
              type="button"
              onClick={() => setChartStyle("south")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                chartStyle === "south"
                  ? "bg-[#c8531c] text-white shadow-2xs"
                  : "text-[#786a55] hover:text-[#1b1612]"
              }`}
            >
              South Indian (Square)
            </button>
          </div>

          {/* D1 Rashi vs D9 Navamsha */}
          <div className="inline-flex rounded-lg border border-[#d9cda7] p-0.5 bg-[#fbf6e8]">
            <button
              type="button"
              onClick={() => setChartDivision("D1")}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                chartDivision === "D1"
                  ? "bg-[#1f5f5b] text-white shadow-2xs"
                  : "text-[#786a55] hover:text-[#1b1612]"
              }`}
            >
              D1 (Rashi)
            </button>
            <button
              type="button"
              onClick={() => setChartDivision("D9")}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                chartDivision === "D9"
                  ? "bg-[#1f5f5b] text-white shadow-2xs"
                  : "text-[#786a55] hover:text-[#1b1612]"
              }`}
            >
              D9 (Navamsha)
            </button>
          </div>
        </div>

        <span className="text-[11px] text-[#786a55] flex items-center gap-1 font-medium">
          <Info size={12} className="text-[#c8531c]" />
          Click any house to inspect Bhava details
        </span>
      </div>

      {/* Chart Canvas */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-4 rounded-2xl bg-[#fffdfa] border border-[#d9cda7] shadow-inner">
        {chartStyle === "north" ? (
          /* NORTH INDIAN DIAMOND CHART (SVG) */
          <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-square">
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full drop-shadow-sm select-none"
              style={{ backgroundColor: "#fefcf6" }}
            >
              <defs>
                <filter id="houseGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#c8531c" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* 12 House Polygons */}
              {Object.entries(northHousePolygons).map(([hStr, cfg]) => {
                const hNum = parseInt(hStr, 10);
                const isSelected = selectedHouse === hNum;
                const rashiNum = getHouseRashiNum(hNum);
                const occupants = getHouseOccupants(hNum);

                return (
                  <g
                    key={hNum}
                    className="cursor-pointer transition-all duration-150"
                    onClick={() => onSelectHouse(hNum)}
                  >
                    <polygon
                      points={cfg.points}
                      fill={isSelected ? "#fae6cf" : hNum === 1 ? "#fff8ee" : "#fefcf6"}
                      stroke={isSelected ? "#c8531c" : "#bca984"}
                      strokeWidth={isSelected ? "2.5" : "1.2"}
                      className="hover:fill-[#fae6cf]/80 transition-colors"
                    />

                    {/* Rashi Number in Roman / Dev / Indic digit */}
                    <text
                      x={cfg.labelX}
                      y={cfg.labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[11px] font-mono font-bold fill-[#8b7355] pointer-events-none"
                    >
                      {rashiNum}
                    </text>

                    {/* House Identifier Tag (H1, H2, etc) */}
                    <text
                      x={cfg.labelX + (hNum === 1 ? 0 : hNum === 7 ? 0 : hNum === 4 ? 20 : hNum === 10 ? -20 : 0)}
                      y={cfg.labelY + (hNum === 1 ? 16 : hNum === 7 ? -16 : 0)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[9px] font-mono font-semibold fill-[#c8531c] pointer-events-none opacity-80"
                    >
                      H{hNum}
                    </text>

                    {/* Planetary Occupants */}
                    <g className="pointer-events-none">
                      {occupants.map((occ, idx) => {
                        const total = occupants.length;
                        const row = Math.floor(idx / 2);
                        const col = idx % 2;
                        const xOffset = total === 1 ? 0 : col === 0 ? -16 : 16;
                        const yOffset = (row - (Math.ceil(total / 2) - 1) / 2) * 14;

                        return (
                          <g key={idx} transform={`translate(${cfg.textX + xOffset}, ${cfg.textY + yOffset})`}>
                            <rect
                              x="-14"
                              y="-8"
                              width="28"
                              height="15"
                              rx="3"
                              fill="#1b1612"
                              fillOpacity="0.85"
                            />
                            <text
                              x="0"
                              y="2"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="text-[10px] font-bold fill-[#fffdfa]"
                            >
                              {occ.code}
                              {occ.retro ? "*" : ""}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  </g>
                );
              })}

              {/* Chart Central Emblem / Lagna Indicator */}
              <circle
                cx="200"
                cy="200"
                r="16"
                fill="#fae6cf"
                stroke="#c8531c"
                strokeWidth="1.5"
              />
              <text
                x="200"
                y="201"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[10px] font-bold fill-[#c8531c]"
              >
                {chartDivision}
              </text>
            </svg>
          </div>
        ) : (
          /* SOUTH INDIAN SQUARE CHART (4x4 Grid) */
          <div className="w-full max-w-[380px] sm:max-w-[420px] aspect-square grid grid-cols-4 grid-rows-4 gap-1 p-2 bg-[#f4ebd0] border-2 border-[#bca984] rounded-xl select-none">
            {southSignsGrid.map((cell) => {
              // Calculate which house this Rashi corresponds to
              const baseIdx = chartDivision === "D1" ? lagnaRashiIdx : lagnaNavamshaIdx;
              // RashiNum is 1..12
              const rashiIdx = cell.rashiNum - 1;
              const hNum = ((rashiIdx - baseIdx + 12) % 12) + 1;
              const isSelected = selectedHouse === hNum;
              const occupants = getHouseOccupants(hNum);
              const isLagna = hNum === 1;

              return (
                <div
                  key={cell.rashiNum}
                  onClick={() => onSelectHouse(hNum)}
                  style={{
                    gridRow: cell.row + 1,
                    gridColumn: cell.col + 1,
                  }}
                  className={`relative p-1.5 rounded border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#fae6cf] border-[#c8531c] shadow-xs"
                      : isLagna
                      ? "bg-[#fff8ee] border-[#c8531c]/60"
                      : "bg-[#fffdfa] border-[#d9cda7] hover:bg-[#fbf6e8]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-[#1b1612]">
                      {RASHI_ABBR[cell.rashiNum - 1].slice(0, 3)}
                    </span>
                    <span className="font-mono text-[9px] font-bold text-[#c8531c]">
                      {isLagna ? "ASC" : `H${hNum}`}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-0.5 my-auto">
                    {occupants.map((occ, idx) => (
                      <span
                        key={idx}
                        className="px-1 py-0.2 rounded bg-[#1b1612] text-[#fffdfa] text-[9px] font-bold"
                      >
                        {occ.code}
                        {occ.retro ? "*" : ""}
                      </span>
                    ))}
                  </div>

                  <div className="text-right text-[8px] text-[#8b7355] font-mono">
                    Sign {cell.rashiNum}
                  </div>
                </div>
              );
            })}

            {/* Empty Center Box (2x2) with Chart Title */}
            <div
              style={{
                gridRow: "2 / span 2",
                gridColumn: "2 / span 2",
              }}
              className="bg-[#fbf6e8] border border-[#d9cda7] rounded-lg p-3 flex flex-col items-center justify-center text-center space-y-1"
            >
              <span className="px-2 py-0.5 rounded-full bg-[#fae6cf] text-[#c8531c] text-[10px] font-bold uppercase tracking-wider">
                {chartDivision === "D1" ? "Rashi (D1)" : "Navamsha (D9)"}
              </span>
              <p className="font-display font-bold text-xs text-[#1b1612]">
                {kundli.name}
              </p>
              <span className="text-[10px] text-[#786a55]">
                Lagna: {kundli.lagna.split(" ")[0]}
              </span>
            </div>
          </div>
        )}

        {/* Selected House Quick Legend */}
        <div className="w-full md:w-60 space-y-3 shrink-0">
          <div className="p-3.5 rounded-xl bg-[#f6efdc] border border-[#d9cda7] space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-[#e6d9b7] pb-1.5">
              <span className="font-bold text-[#1b1612]">
                Selected: House {selectedHouse}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#fae6cf] text-[#c8531c] font-mono font-bold">
                {kundli.houses[selectedHouse - 1]?.sign}
              </span>
            </div>

            <div className="space-y-1 text-[#3d342a]">
              <div className="flex justify-between">
                <span className="text-[#786a55]">Bhava Lord:</span>
                <span className="font-bold">{kundli.houses[selectedHouse - 1]?.signLord}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#786a55]">Occupant Grahas:</span>
                <span className="font-bold text-[#c8531c]">
                  {getHouseOccupants(selectedHouse).length > 0
                    ? getHouseOccupants(selectedHouse).map((o) => o.code).join(", ")
                    : "None"}
                </span>
              </div>

              {kundli.houses[selectedHouse - 1]?.aspectedBy && (
                <div className="flex justify-between">
                  <span className="text-[#786a55]">Incoming Drishti:</span>
                  <span className="font-bold text-[#1f5f5b]">
                    {kundli.houses[selectedHouse - 1].aspectedBy.length > 0
                      ? kundli.houses[selectedHouse - 1].aspectedBy.join(", ")
                      : "None"}
                  </span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#786a55] pt-1.5 border-t border-[#e6d9b7] italic leading-snug">
              {kundli.houses[selectedHouse - 1]?.significations || "Significations of this bhava."}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#fffdfa] border border-[#d9cda7] text-[10px] text-[#786a55] space-y-1">
            <span className="font-bold text-[#1b1612] block">Chart Legend:</span>
            <div className="grid grid-cols-3 gap-1 font-mono">
              <span>Su = Sun</span>
              <span>Mo = Moon</span>
              <span>Ma = Mars</span>
              <span>Me = Mercury</span>
              <span>Ju = Jupiter</span>
              <span>Ve = Venus</span>
              <span>Sa = Saturn</span>
              <span>Ra = Rahu</span>
              <span>Ke = Ketu</span>
            </div>
            <p className="pt-1 text-[#c8531c] font-sans">* indicates Vakri (Retrograde) motion</p>
          </div>
        </div>
      </div>
    </div>
  );
}
