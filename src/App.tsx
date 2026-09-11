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
  Cpu,
} from "lucide-react";
import type {
  Counsellor,
  UserProfile,
  CategorySlug,
  FilterMode,
  KundliData,
  OrchestratorTrace,
  PageRoute,
} from "./types";
import { SEED_COUNSELLORS, CATEGORIES, FILTER_MODES } from "./data/counsellors";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import { Footer } from "./components/Footer";
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
import { getCurrentRoute, navigateTo, triggerAuthSignIn } from "./lib/router";
import { useUserSession } from "./hooks/useUserSession";

// Pages & Components
import { StarCanvas } from "./components/StarCanvas";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { LandingPage } from "./components/pages/LandingPage";
import { HomePage } from "./components/pages/HomePage";
import { ArchetypePage } from "./components/pages/ArchetypePage";
import { LifeTimelinePage } from "./components/pages/LifeTimelinePage";
import { RemediesPage } from "./components/pages/RemediesPage";
import { AstrologerProfilePage } from "./components/pages/AstrologerProfilePage";
import { KundliMatchingPage } from "./components/pages/KundliMatchingPage";
import { UserProfilePage } from "./components/pages/UserProfilePage";
import { SEOArticleHubPage } from "./components/pages/SEOArticleHubPage";

import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

const STORAGE_PROFILE_KEY = "astroguru_user_profile";

const DEFAULT_PROFILE: UserProfile = {
  displayName: "",
  gender: "male",
  birthDate: "",
  birthTime: "12:00",
  birthTimeUnknown: false,
  birthPlace: "",
  isProfileComplete: false,
};

interface AppProps {
  isClerkConfigured?: boolean;
}

function ClerkDataSyncer({ onUserLoaded }: { onUserLoaded: (userId: string, fullName: string) => void }) {
  const { isLoaded, isSignedIn, user } = useUser();
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      onUserLoaded(user.id, user.fullName || "");
    }
  }, [isLoaded, isSignedIn, user, onUserLoaded]);
  return null;
}

export default function App({ isClerkConfigured = false }: AppProps) {
  // Routing State
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() => getCurrentRoute());

  // Listen to popstate and custom app:routechange events
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getCurrentRoute());
    };
    const handleCustomRoute = (e: Event) => {
      const customEvent = e as CustomEvent<PageRoute>;
      if (customEvent.detail) {
        setCurrentRoute(customEvent.detail);
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("app:routechange", handleCustomRoute);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("app:routechange", handleCustomRoute);
    };
  }, []);

  const handleNavigate = (route: PageRoute) => {
    setCurrentRoute(route);
    navigateTo(route);
  };

  // ─── Session (localStorage-backed, Clerk-synced) ────────────────────────────
  const {
    userId: clerkUserId,
    freeCredits,
    paidCredits,
    claimStreak,
    activeTrial,
    profile: sessionProfile,
    setFreeCredits,
    setPaidCredits,
    setClaimStreak,
    setActiveTrial,
    updateProfile,
    syncWithClerk,
    forceSync,
  } = useUserSession();

  // Build UserProfile from session (merge with localStorage legacy profile)
  const [localProfile, setLocalProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Merge: sessionProfile (from DB sync) takes priority over localProfile
  const userProfile: UserProfile = {
    ...localProfile,
    ...(sessionProfile && sessionProfile.birthDate ? sessionProfile : {}),
  };

  const requireAuth = (callback: () => void) => {
    if (isClerkConfigured && !clerkUserId) {
      const btn = document.getElementById("hidden-sign-in-btn");
      if (btn) btn.click();
      return;
    }
    callback();
  };

  // Clerk syncer callback — uses the hook to sync
  const handleClerkUserLoaded = (userId: string, fullName: string) => {
    syncWithClerk(userId, fullName);
  };

  // Consult filtering state
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | "all">(() => {
    if (currentRoute.page === "consult" && currentRoute.category) {
      return currentRoute.category as CategorySlug;
    }
    return "all";
  });
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

  // Auto-prompt onboarding modal if birth details are missing
  useEffect(() => {
    if (!userProfile.birthDate || !userProfile.isProfileComplete) {
      const timer = setTimeout(() => {
        setIsOnboardingOpen(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [userProfile.birthDate, userProfile.isProfileComplete]);

  // Sync Kundli data with birth chart profile
  useEffect(() => {
    async function loadKundli() {
      if (!userProfile.birthDate) return;
      try {
        const res = await fetch("/api/kundli", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userProfile.displayName || "Seeker",
            dob: userProfile.birthDate,
            tob: userProfile.birthTime || "12:00 PM",
            pob: userProfile.birthPlace || "India",
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

  // Profile persistence — handled by useUserSession hook, but we still sync localProfile
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(localProfile));
    } catch (e) {
      console.error(e);
    }
  }, [localProfile]);

  // Wallet operations
  const handleRecharge = (amount: number, bonus: number, isTrial: boolean = false) => {
    if (isTrial) {
      setActiveTrial({ isActive: true, expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString() });
    } else {
      setPaidCredits((prev) => prev + amount + bonus);
    }
    // Force a fresh sync from DB after recharge so balance is confirmed
    setTimeout(() => forceSync(), 1500);
  };

  const handleDeductChat = (): boolean => {
    if (activeTrial.isActive && activeTrial.expiresAt) {
      if (new Date() < new Date(activeTrial.expiresAt)) {
        return true; // Use trial, don't deduct credits
      } else {
        setActiveTrial({ isActive: false, expiresAt: null }); // Expired
      }
    }
    
    if (paidCredits >= 25) {
      setPaidCredits((prev) => Math.max(0, prev - 25));
      return true;
    }
    if (freeCredits >= 25) {
      setFreeCredits((prev) => Math.max(0, prev - 25));
      return true;
    }
    return false;
  };

  const handleDeductCall = (costPerMin: number): boolean => {
    if (paidCredits >= costPerMin) {
      setPaidCredits((prev) => Math.max(0, prev - costPerMin));
      return true;
    }
    return false;
  };

  // Filter counsellors for Consult catalog
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
    setLocalProfile(goldenProfile);
    updateProfile(goldenProfile);
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
        paidCredits={paidCredits}
        onEndCall={() => setActiveCallCounsellor(null)}
        onDeductBalance={handleDeductCall}
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
      <div className="h-[100dvh] flex flex-col bg-[#f6efdc]">
        <AiChatClient
          counsellor={activeChatCounsellor}
          userProfile={userProfile}
          kundli={kundli}
          freeCredits={freeCredits}
          paidCredits={paidCredits}
          onBack={() => setActiveChatCounsellor(null)}
          onStartCall={(c) => {
            setActiveChatCounsellor(null);
            setActiveCallCounsellor(c);
          }}
          onDeductChat={handleDeductChat}
          onOpenWallet={() => setIsWalletOpen(true)}
          onOpenOrchestrator={(trace) => {
            if (trace) setActiveTrace(trace);
            setIsOrchestratorOpen(true);
          }}
        />
        {isWalletOpen && (
          <WalletModal
            userId={clerkUserId || "default"}
            freeCredits={freeCredits}
            paidCredits={paidCredits}
            claimStreak={claimStreak}
            onClose={() => setIsWalletOpen(false)}
            onRecharge={(amount, bonus, isTrial) => handleRecharge(amount, bonus, isTrial)}
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
    <div className="min-h-[100dvh] flex flex-col bg-[#070d1a] text-slate-100 relative">
      {isClerkConfigured && <ClerkDataSyncer onUserLoaded={handleClerkUserLoaded} />}
      <StarCanvas />
      <PWAInstallPrompt />

      {/* Hidden Sign-in button for imperative auth triggers */}
      {isClerkConfigured && (
        <div className="hidden">
          <SignedOut>
            <SignInButton mode="modal">
              <button id="hidden-sign-in-btn">Sign In</button>
            </SignInButton>
          </SignedOut>
        </div>
      )}

      {/* Top Header Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={(route) => {
          if (route.page === "profile") {
            requireAuth(() => handleNavigate(route));
          } else {
            handleNavigate(route);
          }
        }}
        freeCredits={freeCredits}
        paidCredits={paidCredits}
        userProfile={userProfile}
        onOpenWallet={() => requireAuth(() => setIsWalletOpen(true))}
        onOpenProfile={() => requireAuth(() => handleNavigate({ page: "profile" }))}
        onOpenOrchestrator={() => setIsOrchestratorOpen(true)}
        aiCredits={creditProfile.creditsRemaining}
        isClerkConfigured={isClerkConfigured}
      />
      <BottomNav
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        isClerkConfigured={isClerkConfigured}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-0 relative z-10">
        {/* 1. LANDING PAGE */}
        {currentRoute.page === "landing" && (
          <LandingPage
            onNavigate={handleNavigate}
            onStartChat={(c) => requireAuth(() => setActiveChatCounsellor(c))}
            onStartCall={(c) => requireAuth(() => setActiveCallCounsellor(c))}
            userProfile={userProfile}
          />
        )}

        {/* 2. HOME DASHBOARD PAGE (/home) */}
        {currentRoute.page === "home" && (
          <HomePage onNavigate={handleNavigate} userProfile={userProfile} />
        )}

        {/* 3. ASTRO ARCHETYPE PAGE (/archetype) */}
        {currentRoute.page === "archetype" && (
          <ArchetypePage userProfile={userProfile} onNavigate={handleNavigate} />
        )}

        {/* 4. LIFE TIMELINE PAGE (/life-timeline) */}
        {currentRoute.page === "life-timeline" && (
          <LifeTimelinePage userProfile={userProfile} onNavigate={handleNavigate} />
        )}

        {/* 5. REMEDIES PAGE (/remedies) */}
        {currentRoute.page === "remedies" && (
          <RemediesPage userProfile={userProfile} onNavigate={handleNavigate} />
        )}

        {/* 2. DEDICATED ASTROLOGER PROFILE PAGE (/astrologer/:slug) */}
        {currentRoute.page === "astrologer-detail" && (
          <AstrologerProfilePage
            slug={currentRoute.slug}
            onNavigate={handleNavigate}
            onStartChat={(c) => requireAuth(() => setActiveChatCounsellor(c))}
            onStartCall={(c) => requireAuth(() => setActiveCallCounsellor(c))}
            userProfile={userProfile}
          />
        )}

        {/* 3. KUNDLI MATCHING (GUN MILAN 36 GUNAS) */}
        {currentRoute.page === "kundli-matching" && (
          <KundliMatchingPage onNavigate={handleNavigate} />
        )}

        {/* 4. USER PROFILE & SAVED KUNDLIS */}
        {currentRoute.page === "profile" && (
          isClerkConfigured ? (
            <>
              <SignedIn>
                <UserProfilePage
                  initialTab={currentRoute.tab}
                  userProfile={userProfile}
                  freeCredits={freeCredits}
                  paidCredits={paidCredits}
                  onUpdateProfile={(up) => { setLocalProfile(up); updateProfile(up); }}
                  onOpenWallet={() => requireAuth(() => setIsWalletOpen(true))}
                  onNavigate={handleNavigate}
                />
              </SignedIn>
              <SignedOut>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                  <div className="w-16 h-16 bg-[#fae6cf] rounded-full flex items-center justify-center mb-4 border border-[#f3a76d]">
                    <ShieldCheck size={32} className="text-[#c8531c]" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-[#1b1612] mb-2">Secure Access</h2>
                  <p className="text-[#786a55] mb-6 max-w-md">Please sign in to view your profile, saved Kundlis, and manage your wallet.</p>
                  <button onClick={() => triggerAuthSignIn()} className="btn-saffron px-8 py-2.5 shadow-md">
                    Sign In
                  </button>
                </div>
              </SignedOut>
            </>
          ) : (
            <UserProfilePage
              initialTab={currentRoute.tab}
              userProfile={userProfile}
              freeCredits={freeCredits}
              paidCredits={paidCredits}
              onUpdateProfile={(up) => { setLocalProfile(up); updateProfile(up); }}
              onOpenWallet={() => requireAuth(() => setIsWalletOpen(true))}
              onNavigate={handleNavigate}
            />
          )
        )}

        {/* 5. SEO ARTICLE KNOWLEDGE HUB (/blogs or /blog/:slug) */}
        {currentRoute.page === "blogs" && (
          <SEOArticleHubPage slug={currentRoute.slug} onNavigate={handleNavigate} />
        )}

        {/* 6. CONSULT DIRECTORY CATALOG (/consult) */}
        {currentRoute.page === "consult" && (
          <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Welcome Banner */}
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
                    <span className="text-xs text-[#786a55]">₹10 Free Bonus in Wallet</span>
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
                  onClick={() => handleNavigate({ page: "kundli" })}
                  className="btn-outline text-xs px-3.5 py-1.5"
                >
                  View My Kundli
                </button>
                <button
                  id="banner-btn-recharge"
                  type="button"
                  onClick={() => requireAuth(() => setIsWalletOpen(true))}
                  className="btn-saffron text-xs px-4 py-1.5"
                >
                  Add Money
                </button>
              </div>
            </div>

            {/* AstroGuru AI Unified Interface */}
            <div className="card-paper p-8 text-center mt-6">
              <img src="/logo.png" alt="AstroGuru AI" className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-[#c8531c]" />
              <h2 className="font-display text-2xl font-bold text-[#1b1612] mb-2">AstroGuru AI</h2>
              <p className="text-sm text-[#786a55] max-w-lg mx-auto mb-8">
                Your personal, omniscient Vedic astrologer. Get instant answers to your life's deepest questions through chat or voice call.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => requireAuth(() => setActiveChatCounsellor(SEED_COUNSELLORS[0]))}
                  className="btn-cosmic-teal text-sm px-8 py-3 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  Start Chat (₹5/msg)
                </button>
                <button
                  type="button"
                  onClick={() => requireAuth(() => setActiveCallCounsellor(SEED_COUNSELLORS[0]))}
                  className="btn-cosmic-primary text-sm px-8 py-3 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <Phone size={18} />
                  Start Voice Call (₹20/min)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 7. JANAM KUNDLI VIEWER (/kundli) */}
        {currentRoute.page === "kundli" && (
          <KundliViewer
            userProfile={userProfile}
            onEditProfile={() => setIsOnboardingOpen(true)}
            onConsultChart={() => handleNavigate({ page: "consult" })}
            onLoadGoldenFixture={handleLoadGoldenFixture}
          />
        )}

        {/* 8. HOROSCOPE & PANCHANG (/horoscope) */}
        {currentRoute.page === "horoscope" && <HoroscopePanchang />}

        {/* 9. TAROT CARD READING (/tarot) */}
        {currentRoute.page === "tarot" && <TarotReader />}
      </main>

      {/* Global Enterprise Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Navigation */}
      <BottomNav 
        currentRoute={currentRoute} 
        onNavigate={(route) => {
          if (route.page === "profile") {
            requireAuth(() => handleNavigate(route));
          } else {
            handleNavigate(route);
          }
        }} 
        isClerkConfigured={isClerkConfigured} 
      />

      {/* Astrologer Profile Modal */}
      {inspectedCounsellor && (
        <CounsellorModal
          counsellor={inspectedCounsellor}
          onClose={() => setInspectedCounsellor(null)}
          onStartChat={(c) => {
            requireAuth(() => {
              setInspectedCounsellor(null);
              setActiveChatCounsellor(c);
            });
          }}
          onStartCall={(c) => {
            requireAuth(() => {
              setInspectedCounsellor(null);
              setActiveCallCounsellor(c);
            });
          }}
        />
      )}

      {/* Wallet Modal */}
      {isWalletOpen && (
        <WalletModal
          userId={clerkUserId || "default_user"}
          freeCredits={freeCredits}
          paidCredits={paidCredits}
          claimStreak={claimStreak}
          onClose={() => setIsWalletOpen(false)}
          onRecharge={(amount, bonus, isTrial) => handleRecharge(amount, bonus, isTrial)}
        />
      )}

      {/* Onboarding / Edit Birth Chart Modal */}
      {isOnboardingOpen && (
        <OnboardingModal
          initialProfile={userProfile}
          onClose={() => setIsOnboardingOpen(false)}
          onSave={(updated) => { setLocalProfile(updated); updateProfile(updated); }}
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
