import React from 'react';
import { User, Sparkles, Shield, Compass, ChevronRight, Award } from 'lucide-react';
import type { PageRoute, UserProfile } from '../../types';

interface ArchetypePageProps {
  userProfile: UserProfile;
  onNavigate: (route: PageRoute) => void;
}

export const ArchetypePage: React.FC<ArchetypePageProps> = ({ userProfile, onNavigate }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 text-slate-100">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <User className="w-3.5 h-3.5" />
          <span>Vedic Personality Blueprint</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
          Your Astro Archetype
        </h1>
        <p className="text-sm text-slate-400">
          Synthesized from your Lagna (Ascendant), Moon Rashi, and Atmakaraka planet.
        </p>
      </div>

      {/* Archetype Profile Card */}
      <div className="card-cosmic p-8 border-purple-500/40 relative overflow-hidden mb-8 bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-950">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-purple-500 to-cyan-500 p-1 flex-shrink-0 shadow-xl shadow-purple-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-purple-400" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              PRIMARY ARCHETYPE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
              The Visionary Sovereign
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              With Leo Ascendant (Simha Lagna) and Jupiter aspecting your 10th house, you possess natural command, strategic foresight, and an innate drive to build enduring institutions.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
              <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-purple-300">
                Key Trait: Leadership & Integrity
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300">
                Element: Agni (Fire)
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-300">
                Guiding Deity: Surya Dev
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillars Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-cosmic p-6 border-cyan-500/30">
          <h3 className="font-bold text-base text-white mb-2 flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Lagna (Ascendant)</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Simha (Leo) — Outer persona, physical vitality, and natural authority in group settings.
          </p>
        </div>

        <div className="card-cosmic p-6 border-purple-500/30">
          <h3 className="font-bold text-base text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Moon Nakshatra</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Magha Nakshatra — Ancestral dignity, respect for tradition, and deeply honorable instincts.
          </p>
        </div>

        <div className="card-cosmic p-6 border-orange-500/30">
          <h3 className="font-bold text-base text-white mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-orange-400" />
            <span>Atmakaraka Planet</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Jupiter (Guru) — Soul destination lies in teaching, mentoring, and protecting moral order.
          </p>
        </div>
      </div>
    </div>
  );
};
