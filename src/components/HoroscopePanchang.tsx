import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Clock,
  Compass,
  Sparkles,
  Heart,
  Briefcase,
  Activity,
  Coins,
  Calendar,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import type { PanchangInfo } from "../types";

const ZODIAC_SIGNS = [
  { name: "Aries", hindi: "Mesh", dates: "Mar 21 - Apr 19", element: "Fire", symbol: "♈" },
  { name: "Taurus", hindi: "Vrishabh", dates: "Apr 20 - May 20", element: "Earth", symbol: "♉" },
  { name: "Gemini", hindi: "Mithun", dates: "May 21 - Jun 20", element: "Air", symbol: "♊" },
  { name: "Cancer", hindi: "Kark", dates: "Jun 21 - Jul 22", element: "Water", symbol: "♋" },
  { name: "Leo", hindi: "Singh", dates: "Jul 23 - Aug 22", element: "Fire", symbol: "♌" },
  { name: "Virgo", hindi: "Kanya", dates: "Aug 23 - Sep 22", element: "Earth", symbol: "♍" },
  { name: "Libra", hindi: "Tula", dates: "Sep 23 - Oct 22", element: "Air", symbol: "♎" },
  { name: "Scorpio", hindi: "Vrischika", dates: "Oct 23 - Nov 21", element: "Water", symbol: "♏" },
  { name: "Sagittarius", hindi: "Dhanu", dates: "Nov 22 - Dec 21", element: "Fire", symbol: "♐" },
  { name: "Capricorn", hindi: "Makar", dates: "Dec 22 - Jan 19", element: "Earth", symbol: "♑" },
  { name: "Aquarius", hindi: "Kumbh", dates: "Jan 20 - Feb 18", element: "Air", symbol: "♒" },
  { name: "Pisces", hindi: "Meen", dates: "Feb 19 - Mar 20", element: "Water", symbol: "♓" },
];

const SIGN_PREDICTIONS: Record<string, {
  overview: string;
  career: string;
  love: string;
  health: string;
  finance: string;
  luckyNumber: number;
  luckyColor: string;
  luckyHours: string;
  scores: { career: number; love: number; finance: number; health: number };
}> = {
  Aries: {
    overview: "Mars energizes your 1st house today, bringing bold decision-making power and renewed vitality. Trust your instincts on pending work.",
    career: "Favorable time for pitching proposals and taking initiative. Senior colleagues notice your dedicated pace.",
    love: "Honest communication resolves past misunderstandings. A peaceful evening with your partner is foreseen.",
    health: "High energy, but avoid over-exertion during physical workouts. Drink plenty of fresh water.",
    finance: "Modest unexpected gains from an earlier investment. Good day to balance your monthly ledger.",
    luckyNumber: 9,
    luckyColor: "Saffron Red",
    luckyHours: "10:30 AM - 12:15 PM",
    scores: { career: 4.5, love: 4.0, finance: 4.2, health: 4.8 },
  },
  Taurus: {
    overview: "Venus casts a gentle aspect on your social sphere. Artistic pursuits and domestic comforts bring peace of mind.",
    career: "Steady progress on long-term initiatives. Avoid rushing negotiations; patience is your greatest virtue.",
    love: "Deep emotional bonding. Single Taureans may encounter someone intriguing through mutual friends.",
    health: "Pay attention to your neck and throat area. Warm herbal tea or honey brings soothing comfort.",
    finance: "Stability reigns. A great day to review savings schemes or property paperwork.",
    luckyNumber: 6,
    luckyColor: "Emerald Green",
    luckyHours: "02:00 PM - 03:45 PM",
    scores: { career: 4.0, love: 4.8, finance: 4.5, health: 4.1 },
  },
  Gemini: {
    overview: "Mercury stimulates your intellect and speech. Networking, writing, and client meetings yield fruitful outcomes.",
    career: "A new collaborative avenue opens. Your quick adaptability proves decisive in problem solving.",
    love: "Playful banter keeps spirits high. Express what is on your heart without holding back.",
    health: "Mental restlessness might cause brief fatigue. Take short 5-minute screen breaks.",
    finance: "Be cautious of impulsive online purchases. Prioritize needs over momentary desires.",
    luckyNumber: 5,
    luckyColor: "Canary Yellow",
    luckyHours: "09:00 AM - 10:45 AM",
    scores: { career: 4.7, love: 4.1, finance: 3.8, health: 4.0 },
  },
  Cancer: {
    overview: "The Moon accentuates your intuitive wisdom today. Trust your gut feelings regarding personal matters.",
    career: "Support from maternal figures or mentors helps navigate workplace complexities.",
    love: "Cherish domestic warmth. Cook a special meal or spend quiet time with loved ones.",
    health: "Eat light and freshly cooked meals. Digestive sensitivity responds well to curd or cumin water.",
    finance: "Stable financial outlook. Safe investments yield consistent returns.",
    luckyNumber: 2,
    luckyColor: "Pearl White & Silver",
    luckyHours: "06:15 PM - 08:00 PM",
    scores: { career: 3.9, love: 4.9, finance: 4.0, health: 4.3 },
  },
  Leo: {
    overview: "The Sun bestows regal charisma and leadership confidence. You naturally command respect in group discussions.",
    career: "Your vision inspires team members. A pending recognition or appreciation comes through.",
    love: "Generosity and warmth strengthen romantic ties. Express your appreciation openly.",
    health: "Cardiovascular vitality is robust. Enjoy morning sunlight and light cardio.",
    finance: "Good day for lucrative business consultations and exploring royalty or dividend avenues.",
    luckyNumber: 1,
    luckyColor: "Golden Marigold",
    luckyHours: "11:15 AM - 01:00 PM",
    scores: { career: 4.9, love: 4.3, finance: 4.6, health: 4.7 },
  },
  Virgo: {
    overview: "Analytical acumen and precision are at their peak. Ideal day for clearing backlogs and structuring workflows.",
    career: "Attention to detail prevents a potential oversight. Colleagues seek your guidance.",
    love: "Practical gestures of care speak louder than grand words. Offer a helping hand to your partner.",
    health: "Digestive health requires mindful nutrition. Avoid heavy fried food at night.",
    finance: "Prudent budgeting bears fruit. A surplus allows for a long-planned family purchase.",
    luckyNumber: 7,
    luckyColor: "Olive & Forest Green",
    luckyHours: "08:30 AM - 10:00 AM",
    scores: { career: 4.8, love: 3.9, finance: 4.7, health: 4.2 },
  },
  Libra: {
    overview: "Harmony, balance, and aesthetic pleasures define your day. Artistic decisions and diplomatic talks succeed.",
    career: "Partnership agreements move forward smoothly. Great day for legal and contract reviews.",
    love: "Romance is in the air. A lovely conversation brings mutual reassurance.",
    health: "Hydrate well to support kidney and skin vitality. Enjoy soothing instrumental music.",
    finance: "Joint financial endeavors look auspicious. Keep accounts transparent.",
    luckyNumber: 6,
    luckyColor: "Rose Pink & Sky Blue",
    luckyHours: "04:00 PM - 05:30 PM",
    scores: { career: 4.2, love: 4.9, finance: 4.3, health: 4.4 },
  },
  Scorpio: {
    overview: "Profound focus and transformative insights arise. You uncover hidden solutions to long-standing dilemmas.",
    career: "Confidential projects progress with stealthy efficiency. Keep your cards close to your chest.",
    love: "Intense passion and loyal commitment. Guard against unnecessary suspicion.",
    health: "Detoxification and good sleep restore stamina. Meditation calms intense thoughts.",
    finance: "Secret gains or recovery of an old lent sum is indicated. Stay fiscally discreet.",
    luckyNumber: 8,
    luckyColor: "Crimson & Deep Maroon",
    luckyHours: "07:00 PM - 08:45 PM",
    scores: { career: 4.6, love: 4.4, finance: 4.5, health: 4.1 },
  },
  Sagittarius: {
    overview: "Jupiter brings optimism, philosophical joy, and broad horizons. Learning and mentor interactions are blessed.",
    career: "International or cross-city communications open up exciting future prospects.",
    love: "Spontaneous adventures and laughter lighten the mood. Share your dreams openly.",
    health: "Thigh and hip flexibility benefits from stretching and brisk outdoor walks.",
    finance: "Expenditure on travel, higher education, or spiritual books proves worthwhile.",
    luckyNumber: 3,
    luckyColor: "Royal Saffron",
    luckyHours: "01:15 PM - 03:00 PM",
    scores: { career: 4.7, love: 4.5, finance: 4.1, health: 4.6 },
  },
  Capricorn: {
    overview: "Saturn rewards discipline, diligence, and structured execution. Solid groundwork laid today will endure for years.",
    career: "Authority figures acknowledge your steady reliability. Administrative tasks finish ahead of time.",
    love: "Loyalty and steady presence matter most. Reassure your loved ones with tangible support.",
    health: "Knee joints and bones require nourishment. Include calcium and vitamin D in your diet.",
    finance: "Long-term investment plans and fixed deposits yield reliable returns.",
    luckyNumber: 8,
    luckyColor: "Charcoal & Steel Blue",
    luckyHours: "10:00 AM - 11:30 AM",
    scores: { career: 4.9, love: 3.8, finance: 4.8, health: 4.0 },
  },
  Aquarius: {
    overview: "Innovative ideas and humanitarian thoughts stimulate your vision. Collaboration with like-minded peers brings joy.",
    career: "Technological solutions and creative brainstorming sessions yield unexpected breakthroughs.",
    love: "Intellectual connection precedes romance. Engage in meaningful discussions about future ideals.",
    health: "Ankles and circulatory flow benefit from gentle foot massage or elevating legs after work.",
    finance: "Gains through group activities or community projects. Avoid speculative risks.",
    luckyNumber: 4,
    luckyColor: "Electric Blue & Turquoise",
    luckyHours: "03:30 PM - 05:00 PM",
    scores: { career: 4.4, love: 4.2, finance: 4.3, health: 4.5 },
  },
  Pisces: {
    overview: "Intuition, empathy, and spiritual blessings shower your chart. Artistic creation and prayers bring peace.",
    career: "Creative professions (writing, counselling, art) experience a surge of divine inspiration.",
    love: "Unconditional empathy heals past grievances. Soulful conversations draw you closer.",
    health: "Restful sleep and soothing baths rejuvenate your immune system. Trust your dreams.",
    finance: "Charitable acts attract unexpected abundance. Donating small food items is auspicious.",
    luckyNumber: 3,
    luckyColor: "Sea Green & Gold",
    luckyHours: "05:00 PM - 06:45 PM",
    scores: { career: 4.3, love: 4.8, finance: 4.2, health: 4.6 },
  },
};

export default function HoroscopePanchang() {
  const [selectedSign, setSelectedSign] = useState(ZODIAC_SIGNS[0]);
  const [panchang, setPanchang] = useState<PanchangInfo | null>(null);

  useEffect(() => {
    fetch("/api/panchang")
      .then((res) => res.json())
      .then((data) => setPanchang(data))
      .catch((err) => console.error(err));
  }, []);

  const currentPred = SIGN_PREDICTIONS[selectedSign.name] || SIGN_PREDICTIONS.Aries;

  return (
    <div id="horoscope-panchang-view" className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Daily Panchang Card */}
      <section className="card-paper p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="eyebrow text-[#c8531c]">Aaj Ka Panchang</span>
              <span className="h-1 w-1 rounded-full bg-[#c9b884]" />
              <span className="text-xs text-[#786a55]">Vedic Daily Calendar</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1b1612] mt-0.5">
              {panchang?.date || "Today's Sacred Ephemeris"}
            </h2>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-[#ebe2c8] border border-[#d9cda7] text-[#3d342a] font-mono">
            {panchang?.vikramSamvat || "Vikram Samvat 2082"}
          </span>
        </div>

        {/* Panchang Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#f6efdc] border border-[#e6d9b7]">
            <span className="text-[#a89a7d] block font-semibold">Tithi</span>
            <span className="font-bold text-[#1b1612] text-sm mt-0.5 block">
              {panchang?.tithi || "Shukla Trayodashi"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#f6efdc] border border-[#e6d9b7]">
            <span className="text-[#a89a7d] block font-semibold">Nakshatra</span>
            <span className="font-bold text-[#1b1612] text-sm mt-0.5 block">
              {panchang?.nakshatra || "Rohini"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#f6efdc] border border-[#e6d9b7]">
            <span className="text-[#a89a7d] block font-semibold">Sun Timing</span>
            <span className="font-bold text-[#1b1612] text-sm mt-0.5 block">
              🌅 {panchang?.sunrise || "06:18 AM"} - 🌇 {panchang?.sunset || "06:42 PM"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#f6efdc] border border-[#e6d9b7]">
            <span className="text-[#a89a7d] block font-semibold">Chandra Rashi</span>
            <span className="font-bold text-[#1b1612] text-sm mt-0.5 block">
              🌙 {panchang?.moonSign || "Vrishabha (Taurus)"}
            </span>
          </div>
        </div>

        {/* Auspicious & Inauspicious Muhurats */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[#d9ece8]/60 border border-[#3f8a82]/40 flex items-start gap-3">
            <CheckCircle2 size={18} className="text-[#1f5f5b] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-[#1f5f5b] uppercase tracking-wider block">
                Shubh Abhijit Muhurat
              </span>
              <span className="text-sm font-bold text-[#1b1612] block">
                {panchang?.shubhMuhurat || "11:48 AM - 12:36 PM"}
              </span>
              <span className="text-[11px] text-[#3d342a]">
                Most auspicious window for new beginnings, agreements, and travels.
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f4d6cf]/60 border border-[#d35a4f]/40 flex items-start gap-3">
            <AlertTriangle size={18} className="text-[#a8231a] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-[#a8231a] uppercase tracking-wider block">
                Rahu Kaal (Avoid auspicious work)
              </span>
              <span className="text-sm font-bold text-[#1b1612] block">
                {panchang?.rahuKaal || "01:30 PM - 03:00 PM"}
              </span>
              <span className="text-[11px] text-[#3d342a]">
                Inauspicious window; avoid signing deeds or major financial transactions.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Horoscope (Rashifal) */}
      <section className="card-paper p-5 sm:p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="eyebrow text-[#c8531c]">Dainik Rashifal</span>
            <span className="h-1 w-1 rounded-full bg-[#c9b884]" />
            <span className="text-xs text-[#786a55]">Daily Horoscope for 12 Signs</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1b1612] mt-0.5">
            Select Your Zodiac Rashi
          </h2>
        </div>

        {/* 12 Signs Horizontal Scroll / Selector */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {ZODIAC_SIGNS.map((sign) => {
            const isSelected = selectedSign.name === sign.name;
            return (
              <button
                key={sign.name}
                type="button"
                onClick={() => setSelectedSign(sign)}
                className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#fae6cf] border-[#c8531c] shadow-xs text-[#5e2308]"
                    : "bg-[#f6efdc] border-[#e6d9b7] hover:border-[#c9b884] text-[#3d342a]"
                }`}
              >
                <span className="text-lg">{sign.symbol}</span>
                <div>
                  <span className="text-xs font-bold block leading-tight">{sign.name}</span>
                  <span className="text-[10px] text-[#786a55] block">{sign.hindi}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Sign Detailed Forecast */}
        <div className="mt-5 p-5 rounded-2xl bg-[#f6efdc] border border-[#e6d9b7] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e6d9b7]">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl p-2 rounded-xl bg-[#fbf6e8] border border-[#d9cda7]">
                {selectedSign.symbol}
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-[#1b1612]">
                  {selectedSign.name} ({selectedSign.hindi})
                </h3>
                <p className="text-xs text-[#786a55]">
                  {selectedSign.dates} • Element: {selectedSign.element}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-full bg-[#fae6cf] text-[#5e2308] border border-[#f3a76d]">
                Lucky No: {currentPred.luckyNumber}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#fbf6e8] text-[#1b1612] border border-[#d9cda7]">
                Color: {currentPred.luckyColor}
              </span>
            </div>
          </div>

          {/* Overview text */}
          <p className="text-sm text-[#3d342a] leading-relaxed italic font-display">
            &ldquo;{currentPred.overview}&rdquo;
          </p>

          {/* Area breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#fbf6e8] border border-[#e6d9b7]">
              <div className="flex items-center gap-1.5 font-bold text-[#1b1612] mb-1">
                <Briefcase size={14} className="text-[#c8531c]" />
                <span>Career & Business ({currentPred.scores.career} / 5)</span>
              </div>
              <p className="text-[#786a55] leading-relaxed">{currentPred.career}</p>
            </div>

            <div className="p-3 rounded-xl bg-[#fbf6e8] border border-[#e6d9b7]">
              <div className="flex items-center gap-1.5 font-bold text-[#1b1612] mb-1">
                <Heart size={14} className="text-[#a8231a]" />
                <span>Love & Relationship ({currentPred.scores.love} / 5)</span>
              </div>
              <p className="text-[#786a55] leading-relaxed">{currentPred.love}</p>
            </div>

            <div className="p-3 rounded-xl bg-[#fbf6e8] border border-[#e6d9b7]">
              <div className="flex items-center gap-1.5 font-bold text-[#1b1612] mb-1">
                <Coins size={14} className="text-[#b8860b]" />
                <span>Finance & Wealth ({currentPred.scores.finance} / 5)</span>
              </div>
              <p className="text-[#786a55] leading-relaxed">{currentPred.finance}</p>
            </div>

            <div className="p-3 rounded-xl bg-[#fbf6e8] border border-[#e6d9b7]">
              <div className="flex items-center gap-1.5 font-bold text-[#1b1612] mb-1">
                <Activity size={14} className="text-[#1f5f5b]" />
                <span>Health & Vitality ({currentPred.scores.health} / 5)</span>
              </div>
              <p className="text-[#786a55] leading-relaxed">{currentPred.health}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
