/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Sparkles,
  ShieldCheck,
  Phone,
  MessageCircle,
  Clock,
  Filter,
  Flame,
  Award,
  ChevronRight,
  HeartHandshake,
  HeartPulse,
  Wallet,
  Scale,
  Landmark,
  Briefcase,
  Cpu
} from "lucide-react";
import type { Counsellor, UserProfile, CategorySlug, FilterMode, KundliData, OrchestratorTrace } from "./types";
import { SEED_COUNSELLORS, CATEGORIES, FILTER_MODES } from "./data/counsellors";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import CounsellorCard from "./components/CounsellorCard";
import CounsellorModal from "./components/CounsellorModal";
import AiChatClient from "./components/AiChatClient";
import VoiceCallClient from "./components/VoiceCallClient";
import KundliViewer from "./components/KundliViewer";
import HoroscopePanchang from "./components/HoroscopePanchang";
import TarotReader from "./components/TarotReader";
import WalletModal from "./components/WalletModal";
import OnboardingModal from "./components/OnboardingModal";
import OrchestratorHUD from "./components/OrchestratorHUD";
import { AICreditManager } from "./lib/orchestrator/creditManager";

const STORAGE_PROFILE_KEY = "astrotalk_user_profile";
const STORAGE_WALLET_KEY = "astrotalk_wallet_balance";

const DEFAULT_PROFILE: UserProfile = {
  displayName: "Rahul Sharma",
  gender: "male",
  birthDate: "1998-05-15",
  birthTime: "10:30",
  birthTimeUnknown: false,
  birthPlace: "New Delhi, India",
};

export default function App() {
  // Persistence state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [walletBalance, setWalletBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WALLET_KEY);
      return saved ? Number(saved) : 150; // Starting with ₹150 welcome bonus
    } catch {
      return 150;
    }
  });

  // Navigation & filtering state
  const [activeTab, setActiveTab] = useState<"consult" | "kundli" | "horoscope" | "tarot">("consult");
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | "all">("all");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Active Session state
  const [inspectedCounsellor, setInspectedCounsellor] = useState<Counsellor | null>(null);
  const [activeChatCounsellor, setActiveChatCounsellor] = useState<Counsellor | null>(null);
  const [activeCallCounsellor, setActiveCallCounsellor] = useState<Counsellor | null>(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isOrchestratorOpen, setIsOrchestratorOpen] = useState(false);
  const [activeTrace, setActiveTrace] = useState<OrchestratorTrace | null>(null);
  const [kundli, setKundli] = useState<KundliData | null>(null);
  const [creditProfile, setCreditProfile] = useState(AICreditManager.getProfile);

  // Sync Kundli data with birth chart profile
  useEffect(() => {
    async function loadKundli() {
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
        console.error("Kundli fetch error:", err);
      }
    }
    loadKundli();
  }, [userProfile]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(userProfile));
    } catch (e) {
      console.error(e);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WALLET_KEY, String(walletBalance));
    } catch (e) {
      console.error(e);
    }
  }, [walletBalance]);

  // Wallet operations
  const handleRecharge = (amount: number, bonus: number) => {
    setWalletBalance((prev) => prev + amount + bonus);
  };

  const handleDeductBalance = (amount: number): boolean => {
    if (walletBalance >= amount) {
      setWalletBalance((prev) => Math.max(0, prev - amount));
      return true;
    }
    return false;
  };

  // Filter counsellors
  const filteredCounsellors = useMemo(() => {
    return SEED_COUNSELLORS.filter((c) => {
      // Category filter
      if (selectedCategory !== "all" && !c.categories.includes(selectedCategory)) {
        return false;
      }
      // Mode filter
      if (filterMode === "celebrity" && !c.isCelebrity) {
        return false;
      }
      if (filterMode === "new" && !c.isNew) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesSpecialty = c.specialties.some((s) => s.toLowerCase().includes(q));
        const matchesLang = c.languages.some((l) => l.toLowerCase().includes(q));
        const matchesHometown = c.hometown.toLowerCase().includes(q);
        if (!matchesName && !matchesSpecialty && !matchesLang && !matchesHometown) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, filterMode, searchQuery]);

  const handleLoadGoldenFixture = () => {
    const goldenProfile: UserProfile = {
      displayName: "Golden Fixture Native",
      gender: "male",
      birthDate: "2005-12-21",
      birthTime: "23:55",
      birthTimeUnknown: false,
      birthPlace: "Delhi, India",
    };
    setUserProfile(goldenProfile);
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(goldenProfile));
    } catch (e) {
      console.error(e);
    }
  };

  // Active Live Voice Call View
  if (activeCallCounsellor) {
    return (
      <VoiceCallClient
        counsellor={activeCallCounsellor}
        userProfile={userProfile}
        walletBalance={walletBalance}
        onEndCall={() => setActiveCallCounsellor(null)}
        onDeductBalance={handleDeductBalance}
        onOpenWallet={() => setIsWalletOpen(true)}
        onSwitchToChat={() => {
          const c = activeCallCounsellor;
          setActiveCallCounsellor(null);
          setActiveChatCounsellor(c);
        }}
      />
    );
  }

  // Active Live Astrologer Chat View
  if (activeChatCounsellor) {
    return (
      <div className="h-screen flex flex-col bg-[#f6efdc]">
        <AiChatClient
          counsellor={activeChatCounsellor}
          userProfile={userProfile}
          kundli={kundli}
          walletBalance={walletBalance}
          onBack={() => setActiveChatCounsellor(null)}
          onStartCall={(c) => {
            setActiveChatCounsellor(null);
            setActiveCallCounsellor(c);
          }}
          onDeductBalance={handleDeductBalance}
          onOpenWallet={() => setIsWalletOpen(true)}
          onOpenOrchestrator={(trace) => {
            if (trace) setActiveTrace(trace);
            setIsOrchestratorOpen(true);
          }}
        />
        {isWalletOpen && (
          <WalletModal
            balance={walletBalance}
            onClose={() => setIsWalletOpen(false)}
            onRecharge={handleRecharge}
          />
        )}
        <OrchestratorHUD
          isOpen={isOrchestratorOpen}
          onClose={() => setIsOrchestratorOpen(false)}
          activeTrace={activeTrace}
          userProfile={userProfile}
          kundli={kundli}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f6efdc] text-[#1b1612]">
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        walletBalance={walletBalance}
        userProfile={userProfile}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenProfile={() => setIsOnboardingOpen(true)}
        onOpenOrchestrator={() => setIsOrchestratorOpen(true)}
        aiCredits={creditProfile.creditsRemaining}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-12">
        {activeTab === "consult" && (
          <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Welcome Banner with Free Consultation Credit notification */}
            <div className="card-paper p-5 bg-gradient-to-r from-[#fbf6e8] via-[#f8f0d8] to-[#f4e6cf] border-[#c9b884] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#fae6cf] border border-[#f3a76d] flex items-center justify-center text-[#c8531c] shrink-0">
                  <Sparkles size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#c8531c] uppercase tracking-wider">
                      Welcome Bonus Active
                    </span>
                    <span className="h-1 w-1 rounded-full bg-[#c9b884]" />
                    <span className="text-xs text-[#786a55]">₹150 Free Cash in Wallet</span>
                  </div>
                  <h1 className="font-display text-xl sm:text-2xl font-bold text-[#1b1612] mt-0.5">
                    Consult India&rsquo;s Best Astrologers in Real-Time
                  </h1>
                  <p className="text-xs sm:text-sm text-[#786a55] mt-1">
                    Vedic Jyotish, Prashna Kundli, Tarot & Vastu guidance with live voice calls & chat.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  id="banner-btn-orchestrator"
                  type="button"
                  onClick={() => setIsOrchestratorOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1a1410] hover:bg-[#261d16] text-[#fbbf24] border border-[#d97706]/60 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  title="Inspect Multi-Provider Router, Shastra Evidence & Quotas"
                >
                  <Cpu size={13} className="text-[#fbbf24] animate-pulse" />
                  <span>AI Router & Pipeline ({creditProfile.creditsRemaining} cr)</span>
                </button>
                <button
                  id="banner-btn-kundli"
                  type="button"
                  onClick={() => setActiveTab("kundli")}
                  className="btn-outline text-xs px-3.5 py-1.5"
                >
                  View My Kundli
                </button>
                <button
                  id="banner-btn-recharge"
                  type="button"
                  onClick={() => setIsWalletOpen(true)}
                  className="btn-saffron text-xs px-4 py-1.5"
                >
                  Add Money
                </button>
              </div>
            </div>

            {/* Category Filter Chips Bar */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-[#c8531c] text-white border-[#5e2308] shadow-xs"
                    : "bg-[#fbf6e8] text-[#3d342a] border-[#e6d9b7] hover:border-[#c9b884]"
                }`}
              >
                All Topics
              </button>

              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#c8531c] text-white border-[#5e2308] shadow-xs"
                        : "bg-[#fbf6e8] text-[#3d342a] border-[#e6d9b7] hover:border-[#c9b884]"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Filter Modes (All / Celebrity / New) & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 bg-[#ebe2c8] p-1 rounded-full border border-[#d9cda7] w-fit">
                {FILTER_MODES.map((mode) => {
                  const isSelected = filterMode === mode.slug;
                  return (
                    <button
                      key={mode.slug}
                      type="button"
                      onClick={() => setFilterMode(mode.slug)}
                      className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#fbf6e8] text-[#1b1612] shadow-2xs font-bold"
                          : "text-[#786a55] hover:text-[#1b1612]"
                      }`}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 sm:max-w-xs">
                <input
                  id="search-astrologers-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search astrologer, tarot, language..."
                  className="w-full rounded-full bg-[#fbf6e8] border border-[#c9b884] pl-9 pr-4 py-1.5 text-xs text-[#1b1612] placeholder-[#a89a7d] focus:outline-none focus:border-[#c8531c]"
                />
                <Search size={14} className="absolute left-3.5 top-2.5 text-[#a89a7d]" />
              </div>
            </div>

            {/* Astrologers Directory Count */}
            <div className="flex items-center justify-between text-xs text-[#786a55] px-1">
              <span>
                Showing <strong>{filteredCounsellors.length}</strong> verified counsellors online
              </span>
              <span className="hidden sm:inline">
                Average wait time: &lt; 2 minutes
              </span>
            </div>

            {/* Astrologers Grid */}
            {filteredCounsellors.length === 0 ? (
              <div className="card-paper p-12 text-center">
                <p className="font-display text-base text-[#786a55]">
                  No counsellors found matching your search.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setFilterMode("all");
                    setSearchQuery("");
                  }}
                  className="mt-3 btn-outline text-xs"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCounsellors.map((counsellor, idx) => (
                  <CounsellorCard
                    key={counsellor.slug}
                    c={counsellor}
                    index={idx}
                    onSelect={(c) => setInspectedCounsellor(c)}
                    onStartChat={(c) => setActiveChatCounsellor(c)}
                    onStartCall={(c) => setActiveCallCounsellor(c)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "kundli" && (
          <KundliViewer
            userProfile={userProfile}
            onEditProfile={() => setIsOnboardingOpen(true)}
            onConsultChart={() => {
              setActiveTab("consult");
            }}
            onLoadGoldenFixture={handleLoadGoldenFixture}
          />
        )}

        {activeTab === "horoscope" && <HoroscopePanchang />}

        {activeTab === "tarot" && <TarotReader />}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Astrologer Profile Modal */}
      {inspectedCounsellor && (
        <CounsellorModal
          counsellor={inspectedCounsellor}
          onClose={() => setInspectedCounsellor(null)}
          onStartChat={(c) => {
            setInspectedCounsellor(null);
            setActiveChatCounsellor(c);
          }}
          onStartCall={(c) => {
            setInspectedCounsellor(null);
            setActiveCallCounsellor(c);
          }}
        />
      )}

      {/* Wallet Modal */}
      {isWalletOpen && (
        <WalletModal
          balance={walletBalance}
          onClose={() => setIsWalletOpen(false)}
          onRecharge={handleRecharge}
        />
      )}

      {/* Onboarding / Edit Birth Chart Modal */}
      {isOnboardingOpen && (
        <OnboardingModal
          initialProfile={userProfile}
          onClose={() => setIsOnboardingOpen(false)}
          onSave={(updated) => setUserProfile(updated)}
        />
      )}

      {/* AI Orchestrator & Evidence Architecture HUD */}
      <OrchestratorHUD
        isOpen={isOrchestratorOpen}
        onClose={() => setIsOrchestratorOpen(false)}
        activeTrace={activeTrace}
        userProfile={userProfile}
        kundli={kundli}
      />
    </div>
  );
}
