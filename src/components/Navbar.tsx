import React from "react";
import {
  Sparkles,
  Wallet,
  User,
  Phone,
  ScrollText,
  Sun,
  Compass,
  HeartHandshake,
  BookOpen,
  Cpu,
  LogIn,
  Key,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import type { UserProfile, PageRoute } from "../types";

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  freeCredits: number;
  paidCredits: number;
  userProfile: UserProfile;
  onOpenWallet: () => void;
  onOpenProfile: () => void;
  onOpenOrchestrator?: () => void;
  aiCredits?: number;
  isClerkConfigured?: boolean;
}

function ClerkAuthSection({ isClerkConfigured }: { isClerkConfigured?: boolean }) {
  const [showSetupNotice, setShowSetupNotice] = React.useState(false);

  if (!isClerkConfigured) {
    return (
      <div className="relative">
        <button
          id="clerk-setup-hint-btn"
          type="button"
          onClick={() => setShowSetupNotice(!showSetupNotice)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fae6cf] hover:bg-[#ebd7be] text-[#c8531c] border border-[#f3a76d] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          title="Clerk Auth: Ready for VITE_CLERK_PUBLISHABLE_KEY"
        >
          <Key size={13} className="text-[#c8531c]" />
          <span>Sign In</span>
        </button>

        {showSetupNotice && (
          <div className="absolute right-0 mt-2 w-72 p-4 bg-[#fffdfa] border border-[#d9cda7] rounded-2xl shadow-xl z-50 text-left">
            <div className="flex items-center gap-2 mb-2 text-[#c8531c] font-bold text-xs">
              <Key size={14} />
              <span>Clerk Auth Ready</span>
            </div>
            <p className="text-xs text-[#614d33] leading-relaxed mb-3">
              Clerk is fully wired into Astroguru. To activate live authentication, add your <strong>VITE_CLERK_PUBLISHABLE_KEY</strong> and <strong>CLERK_SECRET_KEY</strong> in the environment settings.
            </p>
            <button
              type="button"
              onClick={() => setShowSetupNotice(false)}
              className="w-full py-1.5 bg-[#c8531c] hover:bg-[#a64213] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <SignedIn>
        <div className="flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded-full bg-[#f6efdc] border border-[#e6d9b7]">
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex items-center gap-1.5">
          <SignInButton mode="modal">
            <button
              id="clerk-hidden-signin"
              className="hidden"
              type="button"
            >
              Hidden Sign In
            </button>
          </SignInButton>
          <SignInButton mode="modal">
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#f6efdc] hover:bg-[#ebd7be] text-[#3d342a] border border-[#e6d9b7] text-xs font-semibold transition-all cursor-pointer"
            >
              <LogIn size={13} />
              <span>Log In</span>
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#c8531c] hover:bg-[#a64213] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <span>Sign Up</span>
            </button>
          </SignUpButton>
        </div>
      </SignedOut>
    </div>
  );
}

export default function Navbar({
  currentRoute,
  onNavigate,
  freeCredits,
  paidCredits,
  userProfile,
  onOpenWallet,
  onOpenProfile,
  onOpenOrchestrator,
  aiCredits = 86,
  isClerkConfigured = false,
}: NavbarProps) {
  const navItems: {
    id: string;
    label: string;
    route: PageRoute;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }[] = [
    { id: "home", label: "Home", route: { page: "landing" }, icon: Sparkles },
    { id: "consult", label: "Consult", route: { page: "consult" }, icon: Phone },
    { id: "kundli", label: "Kundli", route: { page: "kundli" }, icon: ScrollText },
    { id: "matching", label: "Matching (36 Gunas)", route: { page: "kundli-matching" }, icon: HeartHandshake },
    { id: "horoscope", label: "Horoscope", route: { page: "horoscope" }, icon: Sun },
    { id: "tarot", label: "Tarot", route: { page: "tarot" }, icon: Compass },
    { id: "blogs", label: "Articles", route: { page: "blogs" }, icon: BookOpen },
  ];

  const isRouteActive = (route: PageRoute) => {
    return currentRoute.page === route.page;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fbf6e8]/95 backdrop-blur-md border-b border-[#c9b884] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name: ASTROGURU */}
        <div
          onClick={() => onNavigate({ page: "landing" })}
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <div className="w-10 h-10 rounded-full shadow-sm overflow-hidden flex-shrink-0 border-2 border-[#10243e] hover:border-[#06b6d4] transition-colors">
            <img src="/logo.png" alt="AstroGuru Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sacred text-base sm:text-lg font-bold tracking-wider text-[#1b1612]">
                ASTROGURU
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#c8531c]" />
            </div>
            <span className="text-[10px] text-[#786a55] tracking-wide block -mt-1 font-display">
              Vedic Guidance & Living Counsel
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#f6efdc] p-1 rounded-full border border-[#e6d9b7]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isRouteActive(item.route);
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                type="button"
                onClick={() => onNavigate(item.route)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-[#c8531c] text-white shadow-xs"
                    : "text-[#3d342a] hover:text-[#1b1612] hover:bg-[#ebe2c8]"
                }`}
              >
                <Icon size={13} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Kundli Profile, AI Orchestrator, Clerk Auth & Wallet Action */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Clerk Auth Section */}
          <div className="hidden lg:block">
            <ClerkAuthSection isClerkConfigured={isClerkConfigured} />
          </div>

          {/* AI Orchestrator Trigger Button */}
          {onOpenOrchestrator && (
            <button
              id="nav-orchestrator-btn"
              type="button"
              onClick={onOpenOrchestrator}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1410] border border-[#d97706]/50 hover:border-[#d97706] text-xs font-bold text-[#fbbf24] shadow-xs transition-all cursor-pointer"
              title="Inspect AI Orchestrator, Quota Pools & Evidence Pipeline"
            >
              <Cpu size={14} className="text-[#fbbf24] animate-pulse" />
              <span className="hidden md:inline">AI Router</span>
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
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors cursor-pointer ${
              currentRoute.page === "profile"
                ? "bg-[#c8531c] text-white border-[#5e2308]"
                : "bg-[#f6efdc] border-[#e6d9b7] hover:border-[#c9b884] text-[#1b1612]"
            }`}
            title="My Account & Saved Charts"
          >
            <User size={14} className={currentRoute.page === "profile" ? "text-white" : "text-[#c8531c]"} />
            <span className="hidden sm:inline truncate max-w-[80px]">
              {userProfile.displayName ? userProfile.displayName.split(" ")[0] : "Profile"}
            </span>
          </button>

          {/* Wallet Recharge / Balance Button */}
          <button
            id="nav-wallet-btn"
            type="button"
            onClick={onOpenWallet}
            className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-gradient-to-r from-[#fae6cf] to-[#ebd7be] border border-[#f3a76d] hover:border-[#c8531c] shadow-xs transition-all cursor-pointer group"
          >
            <Wallet size={14} className="text-[#c8531c] group-hover:scale-110 transition-transform" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] font-bold text-[#c8531c]">F: {freeCredits.toFixed(0)}</span>
              <span className="text-[10px] font-bold text-[#1b1612]">P: {paidCredits.toFixed(0)}</span>
            </div>
            <span className="w-5 h-5 rounded-full bg-[#c8531c] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
              +
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
