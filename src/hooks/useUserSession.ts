/**
 * useUserSession - Manages user session state with proper caching
 *
 * Priority order:
 * 1. Clerk auth → POST /api/user/sync (creates user if new, fetches if existing)
 * 2. localStorage cache (survives page refresh without extra API calls)
 * 3. DB fallback defaults
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { UserProfile } from "../types";

// ─── localStorage keys ────────────────────────────────────────────────────────
const LS_SESSION_KEY = "ag_session_v2";      // { userId, freeCredits, paidCredits, claimStreak, activeTrial, profile }
const LS_PROFILE_KEY = "astroguru_user_profile";  // legacy key (still used by profile editor)

// ─── Types ────────────────────────────────────────────────────────────────────
interface SessionData {
  userId: string | null;
  displayName: string;
  freeCredits: number;
  paidCredits: number;
  claimStreak: number;
  activeTrial: { isActive: boolean; expiresAt: string | null };
  profile: Partial<UserProfile>;
  lastSynced: number; // epoch ms
}

const DEFAULT_SESSION: SessionData = {
  userId: null,
  displayName: "Astro Seeker",
  freeCredits: 150,
  paidCredits: 0,
  claimStreak: 0,
  activeTrial: { isActive: false, expiresAt: null },
  profile: {},
  lastSynced: 0,
};

const SESSION_STALE_MS = 5 * 60 * 1000; // re-sync after 5 minutes

// ─── Helpers ─────────────────────────────────────────────────────────────────
function loadSession(): SessionData {
  try {
    const raw = localStorage.getItem(LS_SESSION_KEY);
    if (raw) return { ...DEFAULT_SESSION, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_SESSION };
}

function saveSession(s: SessionData) {
  try {
    localStorage.setItem(LS_SESSION_KEY, JSON.stringify(s));
  } catch {}
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useUserSession() {
  const [session, setSessionState] = useState<SessionData>(loadSession);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncingRef = useRef(false); // prevent duplicate concurrent syncs

  // Persist to localStorage on every change
  useEffect(() => {
    saveSession(session);
  }, [session]);

  /**
   * Called by ClerkDataSyncer on every Clerk user load.
   * Syncs with backend, caches result in localStorage.
   */
  const syncWithClerk = useCallback(async (userId: string, fullName: string) => {
    // Skip if same user & data is still fresh
    if (
      session.userId === userId &&
      Date.now() - session.lastSynced < SESSION_STALE_MS &&
      session.freeCredits !== undefined
    ) {
      return;
    }

    // Prevent duplicate concurrent syncs
    if (syncingRef.current) return;
    syncingRef.current = true;
    setIsSyncing(true);

    try {
      const res = await fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // send/receive session cookie
        body: JSON.stringify({ userId, displayName: fullName }),
      });

      if (!res.ok) throw new Error(`Sync failed: ${res.status}`);
      const data = await res.json();
      const user = data.user;

      if (user) {
        const updatedSession: SessionData = {
          userId,
          displayName: user.displayName || fullName,
          freeCredits: user.freeCredits ?? 150,
          paidCredits: user.paidCredits ?? 0,
          claimStreak: user.claimStreak ?? 0,
          activeTrial: user.activeTrial ?? { isActive: false, expiresAt: null },
          profile: {
            id: userId,
            displayName: user.displayName || fullName,
            birthDate: user.birthDate || "2000-01-01",
            birthTime: user.birthTime || "12:00",
            birthTimeUnknown: user.birthTimeUnknown ?? true,
            birthPlace: user.birthPlace || "India",
            gender: user.gender || "other",
          },
          lastSynced: Date.now(),
        };
        setSessionState(updatedSession);

        // Also update legacy profile key so profile editor still works
        try {
          localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(updatedSession.profile));
        } catch {}
      }
    } catch (err) {
      console.error("[useUserSession] Sync error:", err);
      // Don't wipe existing session on error — use cached data
    } finally {
      syncingRef.current = false;
      setIsSyncing(false);
    }
  }, [session.userId, session.lastSynced, session.freeCredits]);

  // ─── Credit mutators (optimistic updates → persist) ──────────────────────
  const setFreeCredits = useCallback((val: number | ((prev: number) => number)) => {
    setSessionState(prev => {
      const next = typeof val === "function" ? val(prev.freeCredits) : val;
      return { ...prev, freeCredits: Math.max(0, next) };
    });
  }, []);

  const setPaidCredits = useCallback((val: number | ((prev: number) => number)) => {
    setSessionState(prev => {
      const next = typeof val === "function" ? val(prev.paidCredits) : val;
      return { ...prev, paidCredits: Math.max(0, next) };
    });
  }, []);

  const setClaimStreak = useCallback((val: number) => {
    setSessionState(prev => ({ ...prev, claimStreak: val }));
  }, []);

  const setActiveTrial = useCallback((trial: { isActive: boolean; expiresAt: string | null }) => {
    setSessionState(prev => ({ ...prev, activeTrial: trial }));
  }, []);

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    setSessionState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profile },
      displayName: profile.displayName || prev.displayName,
    }));
    // Also update legacy key
    try {
      const existing = JSON.parse(localStorage.getItem(LS_PROFILE_KEY) || "{}");
      localStorage.setItem(LS_PROFILE_KEY, JSON.stringify({ ...existing, ...profile }));
    } catch {}
  }, []);

  /**
   * Force re-sync from DB (e.g. after recharge/wallet claim)
   */
  const forceSync = useCallback(async () => {
    if (!session.userId) return;
    setSessionState(prev => ({ ...prev, lastSynced: 0 })); // mark stale
    await syncWithClerk(session.userId, session.displayName);
  }, [session.userId, session.displayName, syncWithClerk]);

  return {
    // State
    userId: session.userId,
    freeCredits: session.freeCredits,
    paidCredits: session.paidCredits,
    claimStreak: session.claimStreak,
    activeTrial: session.activeTrial,
    profile: session.profile as UserProfile,
    isSyncing,

    // Mutators
    setFreeCredits,
    setPaidCredits,
    setClaimStreak,
    setActiveTrial,
    updateProfile,

    // Actions
    syncWithClerk,
    forceSync,
  };
}
