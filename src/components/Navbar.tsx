import { Sparkles, Wallet, User, Search, Compass, Moon, Sun, ScrollText, Phone, Cpu } from "lucide-react";
import type { UserProfile } from "../types";

interface NavbarProps {
  activeTab: "consult" | "kundli" | "horoscope" | "tarot";
  setActiveTab: (tab: "consult" | "kundli" | "horoscope" | "tarot") => void;
  walletBalance: number;
  userProfile: UserProfile;
  onOpenWallet: () => void;
  onOpenProfile: () => void;
  onOpenOrchestrator?: () => void;
  aiCredits?: number;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  walletBalance,
  userProfile,
  onOpenWallet,
  onOpenProfile,
  onOpenOrchestrator,
  aiCredits = 86,
}: NavbarProps) {
  const navItems = [
    { id: "consult", label: "Consult Astrologers", icon: Phone },
    { id: "kundli", label: "Janam Kundli", icon: ScrollText },
    { id: "horoscope", label: "Horoscope & Panchang", icon: Sun },
    { id: "tarot", label: "Astro-Tarot", icon: Compass },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-[#fbf6e8]/95 backdrop-blur-md border-b border-[#c9b884] shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div
          onClick={() => setActiveTab("consult")}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#c8531c] to-[#e07a3e] p-0.5 shadow-sm">
            <div className="w-full h-full rounded-full bg-[#fbf6e8] flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Astrotalk"
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <Sparkles size={20} className="text-[#c8531c] hidden group-has-[:not(img)]:block" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sacred text-lg font-bold tracking-wider text-[#1b1612]">
                ASTROTALK
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#c8531c]" />
            </div>
            <span className="text-[10px] text-[#786a55] tracking-wide block -mt-1 font-display">
              Vedic Guidance & Living Counsel
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#f6efdc] p-1 rounded-full border border-[#e6d9b7]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#c8531c] text-white shadow-xs"
                    : "text-[#3d342a] hover:text-[#1b1612] hover:bg-[#ebe2c8]"
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Kundli Profile, AI Orchestrator & Wallet Action */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* AI Orchestrator Trigger Button */}
          {onOpenOrchestrator && (
            <button
              id="nav-orchestrator-btn"
              type="button"
              onClick={onOpenOrchestrator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1410] border border-[#d97706]/50 hover:border-[#d97706] text-xs font-bold text-[#fbbf24] shadow-xs transition-all cursor-pointer"
              title="Inspect AI Orchestrator, Quota Pools & Evidence Pipeline"
            >
              <Cpu size={14} className="text-[#fbbf24] animate-pulse" />
              <span className="hidden sm:inline">AI Router</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#d97706]/30 font-mono text-[10px] text-[#fdf8ed]">
                {aiCredits} cr
              </span>
            </button>
          )}

          {/* Profile Shortcut */}
          <button
            id="nav-profile-btn"
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f6efdc] border border-[#e6d9b7] hover:border-[#c9b884] text-xs font-semibold text-[#1b1612] transition-colors cursor-pointer"
            title="Edit Kundli Details"
          >
            <User size={14} className="text-[#c8531c]" />
            <span className="hidden sm:inline truncate max-w-[80px]">
              {userProfile.displayName ? userProfile.displayName.split(" ")[0] : "Kundli"}
            </span>
          </button>

          {/* Wallet Balance & Recharge */}
          <button
            id="nav-wallet-btn"
            type="button"
            onClick={onOpenWallet}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fae6cf] border border-[#f3a76d] hover:bg-[#fae6cf]/80 text-[#5e2308] text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Astrotalk Wallet"
          >
            <Wallet size={14} className="text-[#c8531c]" />
            <span>₹{walletBalance}</span>
            <span className="bg-[#c8531c] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ml-0.5">
              +
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

