import { X, Phone, MessageCircle, ShieldCheck, MapPin, Globe, Sparkles, Award } from "lucide-react";
import type { Counsellor } from "../types";
import RatingStars from "./RatingStars";

interface CounsellorModalProps {
  counsellor: Counsellor | null;
  onClose: () => void;
  onStartChat: (c: Counsellor) => void;
  onStartCall: (c: Counsellor) => void;
}

export default function CounsellorModal({
  counsellor,
  onClose,
  onStartChat,
  onStartCall,
}: CounsellorModalProps) {
  if (!counsellor) return null;

  const available = counsellor.waitMinutes === 0;

  return (
    <div
      id="counsellor-details-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#fbf6e8] border border-[#c9b884] shadow-2xl p-6 text-[#1b1612]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="btn-close-counsellor-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#ebe2c8] text-[#786a55] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Header with portrait and main stats */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#d9cda7] shadow-md bg-[#ebe2c8]">
              <img
                src={counsellor.portrait}
                alt={counsellor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-[#fbf6e8] ${
                available ? "bg-[#1f5f5b]" : "bg-[#d35a4f]"
              }`}
            />
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <h2 className="font-display text-2xl font-bold text-[#1b1612]">
                {counsellor.name}
              </h2>
              <ShieldCheck size={20} className="text-[#1f5f5b] shrink-0" />
            </div>

            <p className="text-sm italic text-[#c8531c] font-medium mt-0.5">
              {counsellor.tagline}
            </p>

            <div className="mt-2 flex items-center justify-center sm:justify-start gap-3 text-xs text-[#786a55] flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-[#1b1612]">
                <Award size={14} className="text-[#c8531c]" />
                {counsellor.experienceYears} Years Experience
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={13} />
                {counsellor.hometown}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
              <RatingStars rating={counsellor.rating} size={14} />
              <span className="text-sm font-bold text-[#1b1612]">{counsellor.rating.toFixed(1)}</span>
              <span className="text-xs text-[#a89a7d]">({counsellor.ordersCount.toLocaleString()} Consultations)</span>
            </div>
          </div>
        </div>

        {/* Signature Line */}
        {counsellor.signature && (
          <div className="mt-5 p-3.5 rounded-xl bg-[#fae6cf]/70 border border-[#f3a76d]/50 text-sm text-[#5e2308] italic text-center font-display">
            &ldquo;{counsellor.signature}&rdquo;
          </div>
        )}

        {/* Bio */}
        <div className="mt-5">
          <h3 className="font-display text-sm uppercase tracking-wider font-bold text-[#786a55]">
            About Astrologer
          </h3>
          <p className="mt-2 text-sm text-[#3d342a] leading-relaxed">
            {counsellor.bio}
          </p>
        </div>

        {/* Specialties and Languages */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-[#f6efdc] border border-[#e6d9b7]">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#786a55] flex items-center gap-1">
              <Sparkles size={12} className="text-[#c8531c]" />
              Specialties
            </span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {counsellor.specialties.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-[#fbf6e8] border border-[#d9cda7] text-xs font-medium text-[#1b1612]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#f6efdc] border border-[#e6d9b7]">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#786a55] flex items-center gap-1">
              <Globe size={12} className="text-[#1f5f5b]" />
              Languages Spoken
            </span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {counsellor.languages.map((l, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-[#fbf6e8] border border-[#d9cda7] text-xs font-medium text-[#1b1612]"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Rate & Consultation CTAs */}
        <div className="mt-6 pt-4 border-t border-[#e6d9b7] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase text-[#a89a7d] font-semibold">Consultation Rate</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm line-through text-[#a89a7d]">₹{counsellor.originalPricePerMin}</span>
              <span className="font-display text-2xl font-bold text-[#1b1612]">
                ₹{counsellor.pricePerMin}
              </span>
              <span className="text-xs text-[#786a55]">/ min</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="modal-btn-chat"
              type="button"
              onClick={() => {
                onClose();
                onStartChat(counsellor);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full border border-[#c9b884] bg-[#fbf6e8] px-5 py-2.5 text-sm font-semibold text-[#1b1612] hover:bg-[#fae6cf] hover:border-[#c8531c] transition-colors cursor-pointer shadow-xs"
            >
              <MessageCircle size={16} className="text-[#c8531c]" />
              Start Chat
            </button>

            <button
              id="modal-btn-call"
              type="button"
              onClick={() => {
                onClose();
                onStartCall(counsellor);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-[#1f5f5b] hover:bg-[#184d4a] px-6 py-2.5 text-sm font-semibold text-white transition-all cursor-pointer shadow-md"
            >
              <Phone size={16} />
              {available ? "Call Now" : `Waitlist (~${counsellor.waitMinutes}m)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
