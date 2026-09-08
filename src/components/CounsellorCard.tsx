import { Phone, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import type { Counsellor } from "../types";
import RatingStars from "./RatingStars";

function formatOrders(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
  return `${n}`;
}

interface CounsellorCardProps {
  c: Counsellor;
  index: number;
  onSelect: (c: Counsellor) => void;
  onStartChat: (c: Counsellor) => void;
  onStartCall: (c: Counsellor) => void;
}

export default function CounsellorCard({
  c,
  index,
  onSelect,
  onStartChat,
  onStartCall,
}: CounsellorCardProps) {
  const available = c.waitMinutes === 0;
  const num = String(index + 1).padStart(2, "0");

  return (
    <article
      id={`counsellor-card-${c.slug}`}
      className="card-paper relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-[#c9b884] flex flex-col justify-between"
    >
      {/* Top Banner Tag if Celebrity or New */}
      {c.isCelebrity && (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fae6cf] border border-[#f3a76d] text-[#7c2d12] text-[10px] font-semibold tracking-wider uppercase">
          <Sparkles size={10} className="text-[#c8531c]" />
          Celebrity
        </div>
      )}
      {c.isNew && !c.isCelebrity && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#d9ece8] border border-[#3f8a82] text-[#1f5f5b] text-[10px] font-bold tracking-wider uppercase">
          NEW
        </div>
      )}

      {/* Main card info area - click to view details */}
      <div
        onClick={() => onSelect(c)}
        className="p-4 cursor-pointer group"
      >
        <div className="flex items-start gap-3.5">
          {/* Portrait with halo and status ring */}
          <div className="relative shrink-0">
            <div className="w-[78px] h-[78px] rounded-full overflow-hidden border-2 border-[#d9cda7] shadow-inner bg-[#ece4cb]">
              <img
                src={c.portrait}
                alt={c.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback if image fails
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            {/* Online Status Dot */}
            <span
              className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#fbf6e8] ${
                available ? "bg-[#1f5f5b] pulse-ring" : "bg-[#d35a4f]"
              }`}
              title={available ? "Available Now" : `Busy (~${c.waitMinutes}m wait)`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-[10px] text-[#a89a7d] tracking-widest">
                № {num}
              </span>
              <span className="h-px flex-1 bg-[#e6d9b7]" />
            </div>

            <div className="flex items-center gap-1.5 mt-1">
              <h3 className="font-display text-lg font-bold text-[#1b1612] group-hover:text-[#c8531c] transition-colors truncate">
                {c.name}
              </h3>
              <span title="Verified Astrologer" className="inline-flex">
                <ShieldCheck size={16} className="text-[#1f5f5b] shrink-0" />
              </span>
            </div>

            <p className="text-xs text-[#786a55] line-clamp-2 mt-0.5 italic leading-relaxed">
              {c.tagline || c.specialties.slice(0, 3).join(" • ")}
            </p>

            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#3d342a] flex-wrap">
              <span className="font-semibold">{c.experienceYears}y exp</span>
              <span className="text-[#c9b884]">•</span>
              <span className="truncate max-w-[120px] text-[#786a55]">{c.hometown}</span>
              <span className="text-[#c9b884]">•</span>
              <div className="inline-flex items-center gap-1">
                <RatingStars rating={c.rating} size={11} />
                <span className="font-bold text-[#1b1612]">{c.rating.toFixed(1)}</span>
                <span className="text-[#a89a7d]">({formatOrders(c.ordersCount)})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hairline divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#e6d9b7] to-transparent mx-4" />

      {/* Card Action footer */}
      <div className="p-3 px-4 flex items-center justify-between gap-2 bg-[#f8f2e2]/60">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#a89a7d]">Rate</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-[#a89a7d] line-through">₹{c.originalPricePerMin}</span>
            <span className="font-display text-base font-bold text-[#1b1612]">
              ₹{c.pricePerMin}
            </span>
            <span className="text-[11px] text-[#786a55]">/min</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id={`btn-chat-${c.slug}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStartChat(c);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#c9b884] bg-[#fbf6e8] px-3.5 py-1.5 text-xs font-semibold text-[#1b1612] hover:border-[#c8531c] hover:bg-[#fae6cf] transition-all cursor-pointer shadow-xs"
          >
            <MessageCircle size={13} className="text-[#c8531c]" />
            Chat
          </button>

          <button
            id={`btn-call-${c.slug}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStartCall(c);
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold shadow-xs transition-all cursor-pointer ${
              available
                ? "bg-[#1f5f5b] text-white hover:bg-[#184d4a] hover:shadow-sm"
                : "bg-[#f4d6cf] text-[#a8231a] border border-[#d35a4f]"
            }`}
          >
            <Phone size={13} className={available ? "text-white" : "text-[#a8231a]"} />
            {available ? "Call" : `${c.waitMinutes}m wait`}
          </button>
        </div>
      </div>
    </article>
  );
}
