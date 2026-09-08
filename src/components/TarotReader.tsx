import { useState } from "react";
import { Sparkles, RotateCcw, Eye, Compass, Moon, Sun, Star } from "lucide-react";

interface TarotCard {
  name: string;
  arcana: string;
  symbol: string;
  planetaryAssociation: string;
  meaning: string;
  advice: string;
}

const TAROT_DECK: TarotCard[] = [
  {
    name: "The Sun",
    arcana: "Major Arcana XIX",
    symbol: "☀️",
    planetaryAssociation: "Surya (Sun) in Leo",
    meaning: "Radiance, vitality, triumph, clarity, and joyous breakthroughs in personal endeavors.",
    advice: "Step out into the light without hesitation; your authenticity dispels all doubts.",
  },
  {
    name: "The High Priestess",
    arcana: "Major Arcana II",
    symbol: "🌙",
    planetaryAssociation: "Chandra (Moon) in Cancer",
    meaning: "Intuition, sacred secrets, spiritual stillness, and subconscious revelations.",
    advice: "Listen to the quiet voice within before making commitments. The answers are already known to you.",
  },
  {
    name: "The Wheel of Fortune",
    arcana: "Major Arcana X",
    symbol: "☸️",
    planetaryAssociation: "Guru (Jupiter) in Sagittarius",
    meaning: "Karmic turning points, destiny, unexpected good fortune, and cycles of evolution.",
    advice: "Embrace the shift willingly; what felt stalled is suddenly set into motion.",
  },
  {
    name: "The Magician",
    arcana: "Major Arcana I",
    symbol: "✨",
    planetaryAssociation: "Budh (Mercury) in Gemini",
    meaning: "Manifestation power, resourcefulness, articulate skill, and inspired creation.",
    advice: "You hold all four elemental tools. Concentrate your will upon a single objective.",
  },
  {
    name: "The Star",
    arcana: "Major Arcana XVII",
    symbol: "⭐",
    planetaryAssociation: "Shani (Saturn) & Uranus in Kumbha",
    meaning: "Hope, divine renewal, serene healing, and faith after passing through a storm.",
    advice: "Pour your heart out with generosity. The universe is recharging your spiritual battery.",
  },
  {
    name: "The Empress",
    arcana: "Major Arcana III",
    symbol: "🌸",
    planetaryAssociation: "Shukra (Venus) in Taurus",
    meaning: "Fertility, creative abundance, sensory delights, and nurturing growth.",
    advice: "Cultivate beauty around your home and workspace; allow ideas to ripen naturally.",
  },
  {
    name: "The Chariot",
    arcana: "Major Arcana VII",
    symbol: "🛡️",
    planetaryAssociation: "Mangal (Mars) & Chandra in Cancer",
    meaning: "Determination, conquest of conflicting impulses, momentum, and purposeful triumph.",
    advice: "Harness opposing forces with disciplined reins. Victory belongs to the focused mind.",
  },
  {
    name: "Strength",
    arcana: "Major Arcana VIII",
    symbol: "🦁",
    planetaryAssociation: "Surya (Sun) in Simha",
    meaning: "Compassionate fortitude, gentle patience overcoming raw instinct, moral resilience.",
    advice: "Win through gentleness and emotional mastery rather than aggression or confrontation.",
  },
];

export default function TarotReader() {
  const [spreadMode, setSpreadMode] = useState<"one" | "three">("one");
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);

  const drawCards = () => {
    setIsShuffling(true);
    setDrawnCards([]);

    setTimeout(() => {
      const shuffled = [...TAROT_DECK].sort(() => 0.5 - Math.random());
      const count = spreadMode === "one" ? 1 : 3;
      setDrawnCards(shuffled.slice(0, count));
      setIsShuffling(false);
    }, 700);
  };

  return (
    <div id="tarot-reader-view" className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="card-paper p-5 sm:p-6 text-center max-w-xl mx-auto">
        <span className="eyebrow text-[#c8531c]">Astro-Tarot Divination</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1b1612] mt-1">
          Draw Your Destiny Cards
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#786a55] leading-relaxed">
          Align your consciousness with celestial energies. Pick a spread to unveil cosmic guidance.
        </p>

        {/* Spread Selector */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSpreadMode("one");
              setDrawnCards([]);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              spreadMode === "one"
                ? "bg-[#fae6cf] border-[#c8531c] text-[#5e2308]"
                : "bg-[#f6efdc] border-[#e6d9b7] text-[#3d342a]"
            }`}
          >
            One-Card Insight (Daily Oracle)
          </button>

          <button
            type="button"
            onClick={() => {
              setSpreadMode("three");
              setDrawnCards([]);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              spreadMode === "three"
                ? "bg-[#fae6cf] border-[#c8531c] text-[#5e2308]"
                : "bg-[#f6efdc] border-[#e6d9b7] text-[#3d342a]"
            }`}
          >
            Three-Card Spread (Past • Present • Future)
          </button>
        </div>

        {/* Draw Button */}
        <div className="mt-6">
          <button
            id="btn-draw-tarot"
            type="button"
            onClick={drawCards}
            disabled={isShuffling}
            className="btn-saffron px-6 py-2.5 text-sm inline-flex items-center gap-2"
          >
            <Sparkles size={16} />
            {isShuffling ? "Shuffling Celestial Deck..." : drawnCards.length > 0 ? "Shuffle & Redraw" : "Draw Cards"}
          </button>
        </div>
      </div>

      {/* Drawn Cards Display */}
      {drawnCards.length > 0 && (
        <div
          className={`grid gap-4 sm:gap-6 ${
            spreadMode === "one" ? "max-w-md mx-auto grid-cols-1" : "grid-cols-1 md:grid-cols-3"
          }`}
        >
          {drawnCards.map((card, idx) => {
            const spreadLabels = ["Past Influences", "Present Circumstances", "Future Outcome"];
            return (
              <div
                key={idx}
                className="card-paper p-5 flex flex-col justify-between border-2 border-[#c9b884] shadow-md transition-all hover:scale-[1.01]"
              >
                <div>
                  {spreadMode === "three" && (
                    <span className="eyebrow text-[#c8531c] block mb-2 text-center">
                      {spreadLabels[idx]}
                    </span>
                  )}

                  <div className="w-full h-44 rounded-xl bg-gradient-to-b from-[#fbf6e8] to-[#ebe2c8] border border-[#d9cda7] flex flex-col items-center justify-center p-4 shadow-inner mb-4">
                    <span className="text-5xl mb-2">{card.symbol}</span>
                    <h3 className="font-display text-lg font-bold text-[#1b1612] text-center">
                      {card.name}
                    </h3>
                    <span className="text-[10px] text-[#786a55] font-mono mt-0.5">
                      {card.arcana}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="px-2.5 py-1 rounded-md bg-[#fae6cf]/50 border border-[#f3a76d]/50 text-[#7c2d12] font-semibold text-[11px]">
                      {card.planetaryAssociation}
                    </div>

                    <p className="text-[#3d342a] leading-relaxed pt-1">
                      <strong>Significance:</strong> {card.meaning}
                    </p>

                    <p className="text-[#786a55] italic leading-relaxed pt-1">
                      <strong>Sacred Counsel:</strong> {card.advice}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
