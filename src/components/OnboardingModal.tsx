import { useState, type FormEvent } from "react";
import { X, Calendar, Clock, MapPin, User, Sparkles } from "lucide-react";
import type { UserProfile } from "../types";

interface OnboardingModalProps {
  initialProfile: UserProfile;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
}

export default function OnboardingModal({
  initialProfile,
  onClose,
  onSave,
}: OnboardingModalProps) {
  const [displayName, setDisplayName] = useState(initialProfile.displayName || "");
  const [gender, setGender] = useState<"male" | "female" | "other" | null>(initialProfile.gender || "male");
  const [birthDate, setBirthDate] = useState(initialProfile.birthDate || "1998-05-15");
  const [birthTime, setBirthTime] = useState(initialProfile.birthTime || "12:00");
  const [birthTimeUnknown, setBirthTimeUnknown] = useState(initialProfile.birthTimeUnknown || false);
  const [birthPlace, setBirthPlace] = useState(initialProfile.birthPlace || "New Delhi, India");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      displayName: displayName.trim() || "Devotee",
      gender,
      birthDate,
      birthTime,
      birthTimeUnknown,
      birthPlace: birthPlace.trim() || "New Delhi, India",
    });
    onClose();
  };

  return (
    <div
      id="profile-onboarding-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#fbf6e8] border border-[#c9b884] shadow-2xl p-6 text-[#1b1612]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#ebe2c8] text-[#786a55] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="eyebrow text-[#c8531c]">Janam Patri Setup</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-[#1b1612]">
          Birth Chart (Kundli) Details
        </h2>
        <p className="text-xs text-[#786a55] mt-1 mb-5">
          Your accurate birth coordinates enable our astrologers and algorithms to calculate exact Lagna, Moon sign, and planetary transits.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-[#3d342a] uppercase tracking-wider block mb-1">
              Your Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
                className="w-full rounded-xl bg-[#f6efdc] border border-[#c9b884] px-4 py-2.5 text-sm text-[#1b1612] focus:border-[#c8531c] focus:outline-none"
              />
              <User size={16} className="absolute right-3.5 top-3 text-[#a89a7d]" />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="text-xs font-bold text-[#3d342a] uppercase tracking-wider block mb-1">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["male", "female", "other"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2 rounded-xl text-xs font-semibold border capitalize transition-all cursor-pointer ${
                    gender === g
                      ? "bg-[#fae6cf] border-[#c8531c] text-[#5e2308]"
                      : "bg-[#f6efdc] border-[#e6d9b7] text-[#3d342a]"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-xs font-bold text-[#3d342a] uppercase tracking-wider block mb-1">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full rounded-xl bg-[#f6efdc] border border-[#c9b884] px-4 py-2.5 text-sm text-[#1b1612] focus:border-[#c8531c] focus:outline-none"
              />
            </div>
          </div>

          {/* Time of Birth */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#3d342a] uppercase tracking-wider">
                Time of Birth
              </label>
              <label className="flex items-center gap-1.5 text-xs text-[#786a55] cursor-pointer">
                <input
                  type="checkbox"
                  checked={birthTimeUnknown}
                  onChange={(e) => setBirthTimeUnknown(e.target.checked)}
                  className="accent-[#c8531c]"
                />
                <span>I don&rsquo;t know exact time</span>
              </label>
            </div>
            <input
              type="time"
              value={birthTime}
              disabled={birthTimeUnknown}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full rounded-xl bg-[#f6efdc] border border-[#c9b884] px-4 py-2.5 text-sm text-[#1b1612] focus:border-[#c8531c] focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Birth Place */}
          <div>
            <label className="text-xs font-bold text-[#3d342a] uppercase tracking-wider block mb-1">
              Birth Place (City, State)
            </label>
            <div className="relative">
              <input
                type="text"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                placeholder="e.g. Varanasi, UP, India"
                required
                className="w-full rounded-xl bg-[#f6efdc] border border-[#c9b884] px-4 py-2.5 text-sm text-[#1b1612] focus:border-[#c8531c] focus:outline-none"
              />
              <MapPin size={16} className="absolute right-3.5 top-3 text-[#a89a7d]" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2">
            <button
              id="btn-save-profile"
              type="submit"
              className="btn-saffron w-full py-3 text-sm flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              Save & Recalculate Chart
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
