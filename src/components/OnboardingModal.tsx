import { useState, type FormEvent } from "react";
import { X, Calendar, Clock, MapPin, User, Sparkles } from "lucide-react";
import type { UserProfile } from "../types";

interface OnboardingModalProps {
  initialProfile: UserProfile;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
}

const POPULAR_CITIES = [
  "New Delhi, India",
  "Varanasi, UP, India",
  "Mumbai, Maharashtra, India",
  "Bengaluru, Karnataka, India",
  "Jaipur, Rajasthan, India",
  "Kolkata, West Bengal, India",
  "Lucknow, UP, India",
];

export default function OnboardingModal({
  initialProfile,
  onClose,
  onSave,
}: OnboardingModalProps) {
  // Clean initial states — don't prefill dummy names like "Astro Seeker" or "Rahul Sharma"
  const cleanName =
    initialProfile.displayName &&
    initialProfile.displayName !== "Astro Seeker" &&
    initialProfile.displayName !== "Rahul Sharma"
      ? initialProfile.displayName
      : "";

  const cleanDate =
    initialProfile.birthDate &&
    initialProfile.birthDate !== "1998-05-15" &&
    initialProfile.birthDate !== "2000-01-01"
      ? initialProfile.birthDate
      : "";

  const cleanPlace =
    initialProfile.birthPlace &&
    initialProfile.birthPlace !== "New Delhi, India" &&
    initialProfile.birthPlace !== "India"
      ? initialProfile.birthPlace
      : "";

  const [displayName, setDisplayName] = useState(cleanName);
  const [gender, setGender] = useState<"male" | "female" | "other" | null>(initialProfile.gender || "male");
  const [birthDate, setBirthDate] = useState(cleanDate);
  const [birthTime, setBirthTime] = useState(initialProfile.birthTime || "12:00");
  const [birthTimeUnknown, setBirthTimeUnknown] = useState(initialProfile.birthTimeUnknown || false);
  const [birthPlace, setBirthPlace] = useState(cleanPlace);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      displayName: displayName.trim() || "Astro Seeker",
      gender: gender || "male",
      birthDate,
      birthTime: birthTimeUnknown ? "12:00" : birthTime,
      birthTimeUnknown,
      birthPlace: birthPlace.trim() || "New Delhi, India",
      isProfileComplete: true,
    });
    onClose();
  };

  return (
    <div
      id="profile-onboarding-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#0f172a] via-[#111c35] to-[#070d1a] border border-[#06b6d4]/30 shadow-2xl shadow-[#06b6d4]/10 p-6 sm:p-8 text-[#f8fafc] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#f97316]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#06b6d4]/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/10"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="px-2.5 py-1 rounded-full bg-[#f97316]/15 border border-[#f97316]/40 text-[#fb923c] text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles size={12} className="animate-pulse" />
            <span>Janma Patri Setup</span>
          </div>
          <span className="text-slate-400 text-xs">• Audit-Verified Engine</span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-200 via-orange-100 to-amber-400 bg-clip-text text-transparent">
          Enter Your Birth Details
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-6 leading-relaxed">
          Provide accurate birth coordinates for exact Vedic Lagna, Moon sign, and Vimshottari Dasha transits.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full rounded-xl bg-slate-900/80 border border-slate-700/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] focus:outline-none transition-all"
              />
              <User size={18} className="absolute right-3.5 top-3.5 text-slate-500" />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: "male", label: "Male ♂" },
                { id: "female", label: "Female ♀" },
                { id: "other", label: "Other ⚧" },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGender(g.id as any)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    gender === g.id
                      ? "bg-gradient-to-r from-[#f97316]/20 to-[#fb923c]/20 border-[#f97316] text-[#fb923c] shadow-xs shadow-[#f97316]/20"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-900/80 border border-slate-700/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] focus:outline-none transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Time of Birth */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Time of Birth
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={birthTimeUnknown}
                  onChange={(e) => setBirthTimeUnknown(e.target.checked)}
                  className="accent-[#f97316] rounded"
                />
                <span>Exact time unknown</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="time"
                value={birthTime}
                disabled={birthTimeUnknown}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full rounded-xl bg-slate-900/80 border border-slate-700/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] focus:outline-none disabled:opacity-40 transition-all [color-scheme:dark]"
              />
              <Clock size={18} className="absolute right-3.5 top-3.5 text-slate-500" />
            </div>
          </div>

          {/* Birth Place */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Birth Place (City, State)
            </label>
            <div className="relative mb-2">
              <input
                type="text"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                placeholder="e.g. Varanasi, UP, India"
                required
                className="w-full rounded-xl bg-slate-900/80 border border-slate-700/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] focus:outline-none transition-all"
              />
              <MapPin size={18} className="absolute right-3.5 top-3.5 text-slate-500" />
            </div>

            {/* Quick City Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 self-center mr-1">Popular:</span>
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setBirthPlace(city)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    birthPlace === city
                      ? "bg-[#06b6d4]/20 border-[#06b6d4] text-[#22d3ee]"
                      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  {city.split(",")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3">
            <button
              id="btn-save-profile"
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#d97706] hover:from-[#fb923c] hover:to-[#f97316] shadow-lg shadow-[#f97316]/25 hover:shadow-[#f97316]/40 transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#f97316]/30"
            >
              <Sparkles size={18} />
              Calculate My Janma Kundli
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
