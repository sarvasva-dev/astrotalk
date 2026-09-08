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
  Eye
} from "lucide-react";
import type { UserProfile, KundliData } from "../types";

interface KundliViewerProps {
  userProfile: UserProfile;
  onEditProfile: () => void;
  onConsultChart: () => void;
}

export default function KundliViewer({
  userProfile,
  onEditProfile,
  onConsultChart,
}: KundliViewerProps) {
  const [kundli, setKundli] = useState<KundliData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHouse, setSelectedHouse] = useState<number>(1);

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

  return (
    <div id="kundli-viewer-page" className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner with Profile summary & Edit button */}
      <div className="card-paper p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow text-[#c8531c]">Vedic Janam Kundli</span>
            <span className="h-1 w-1 rounded-full bg-[#c9b884]" />
            <span className="text-xs text-[#786a55]">Parashari Jyotish</span>
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

        <div className="flex items-center gap-2">
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
            Graha sthiti aur Nakshatra chakra ganana ho rahi hai...
          </p>
        </div>
      ) : kundli ? (
        <>
          {/* Primary Planetary Signs Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="card-paper p-4 text-center">
              <span className="eyebrow text-[#786a55]">Lagna (Ascendant)</span>
              <p className="font-display text-lg font-bold text-[#1b1612] mt-1">
                {kundli.lagna}
              </p>
              <span className="text-xs text-[#c8531c] font-medium">Lord: {kundli.lagnaLord}</span>
            </div>

            <div className="card-paper p-4 text-center">
              <span className="eyebrow text-[#786a55]">Moon Sign (Rashi)</span>
              <p className="font-display text-lg font-bold text-[#1b1612] mt-1">
                {kundli.moonSign}
              </p>
              <span className="text-xs text-[#1f5f5b] font-medium">Mind & Emotion</span>
            </div>

            <div className="card-paper p-4 text-center">
              <span className="eyebrow text-[#786a55]">Janma Nakshatra</span>
              <p className="font-display text-lg font-bold text-[#1b1612] mt-1">
                {kundli.nakshatra}
              </p>
              <span className="text-xs text-[#786a55] font-medium">Constellation</span>
            </div>

            <div className="card-paper p-4 text-center">
              <span className="eyebrow text-[#786a55]">Current Mahadasha</span>
              <p className="font-display text-lg font-bold text-[#1b1612] mt-1">
                {kundli.currentDasha}
              </p>
              <span className="text-xs text-[#b8860b] font-medium">Active Planetary Period</span>
            </div>
          </div>

          {/* North Indian Kundli Chart Visualizer */}
          <div className="card-paper p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-[#1b1612]">
                  Lagna Chart (D1 Chakram)
                </h3>
                <p className="text-xs text-[#786a55]">
                  Click on any house to examine Bhavas, ruling Grahas, and significations.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#fae6cf] text-[#5e2308] font-semibold">
                Element: {kundli.element}
              </span>
            </div>

            {/* 12 House Grid / Diamond Presentation */}
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
                        <span className="text-[10px] text-[#a89a7d] italic">Clear</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected House Deep-Dive Banner */}
            <div className="mt-4 p-3.5 rounded-xl bg-[#ebe2c8]/70 border border-[#d9cda7] text-xs">
              <span className="font-bold text-[#1b1612]">
                {houseNames[selectedHouse - 1]}
              </span>
              <p className="mt-1 text-[#3d342a] leading-relaxed">
                Sign: <strong>{kundli.houses[selectedHouse - 1]?.sign}</strong> governed by <strong>{kundli.houses[selectedHouse - 1]?.signLord}</strong>.
                {kundli.houses[selectedHouse - 1]?.planets.length > 0
                  ? ` Planets positioned here: ${kundli.houses[selectedHouse - 1].planets.join(", ")}.`
                  : " Currently aspected by planetary transits."}
              </p>
            </div>
          </div>

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
    </div>
  );
}
