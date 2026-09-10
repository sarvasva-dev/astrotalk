import React, { useState } from 'react';
import { Flame, CheckCircle, Sparkles, ShieldCheck, Sun } from 'lucide-react';
import type { PageRoute, UserProfile } from '../../types';

interface RemediesPageProps {
  userProfile: UserProfile;
  onNavigate: (route: PageRoute) => void;
}

const REMEDIES_LIST = [
  {
    id: 'surya-arghya',
    planet: 'Surya (Sun)',
    title: 'Morning Surya Arghya',
    description: 'Offer clean water in a copper vessel to the rising Sun while chanting "Om Suryaya Namah" 11 times.',
    benefit: 'Boosts leadership, physical energy, and professional recognition.',
    time: 'At Sunrise (06:15 AM)',
    completed: true,
  },
  {
    id: 'gayatri-japa',
    planet: 'Guru (Jupiter)',
    title: 'Gayatri Mantra Japa (108x)',
    description: 'Chant the Gayatri Mantra with concentration facing East during Brahma Muhurat.',
    benefit: 'Enhances clarity of thought, wisdom, and academic/career focus.',
    time: 'Morning or Evening',
    completed: true,
  },
  {
    id: 'hanuman-chalisa',
    planet: 'Mangal (Mars)',
    title: 'Hanuman Chalisa Recitation',
    description: 'Recite 1 round of Hanuman Chalisa to balance aggressive Mars energies.',
    benefit: 'Wards off anxiety, strengthens courage, and resolves relationship friction.',
    time: 'Sunset / Night',
    completed: false,
  },
];

export const RemediesPage: React.FC<RemediesPageProps> = ({ userProfile, onNavigate }) => {
  const [remedies, setRemedies] = useState(REMEDIES_LIST);
  const [streakCount, setStreakCount] = useState(3);

  const toggleRemedy = (id: string) => {
    setRemedies((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextState = !r.completed;
          if (nextState) setStreakCount((c) => c + 1);
          return { ...r, completed: nextState };
        }
        return r;
      })
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 text-slate-100">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Flame className="w-3.5 h-3.5 fill-orange-400" />
          <span>Shastra Remedies & Mantras</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
          Daily Upaya & Streak Tracker
        </h1>
        <p className="text-sm text-slate-400">
          Simple, effective daily Vedic remedies to neutralize difficult transits and amplify positive graha energy.
        </p>
      </div>

      {/* Streak Header Card */}
      <div className="card-cosmic p-6 border-orange-500/30 bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-950 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <Flame className="w-8 h-8 fill-orange-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">{streakCount} Day Active Streak!</h3>
            <p className="text-xs text-slate-400">Consistent remedies build lasting karmic protection.</p>
          </div>
        </div>
      </div>

      {/* Remedy List */}
      <div className="space-y-4">
        {remedies.map((rem) => (
          <div
            key={rem.id}
            onClick={() => toggleRemedy(rem.id)}
            className={`card-cosmic p-6 border-slate-800 cursor-pointer transition-all flex items-start gap-4 ${
              rem.completed ? 'bg-slate-900/40 border-emerald-500/40' : 'hover:border-orange-500/30'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-colors ${
                rem.completed
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                  : 'border-slate-600'
              }`}
            >
              {rem.completed && <CheckCircle className="w-4 h-4" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  {rem.planet}
                </span>
                <span className="text-[10px] text-slate-400">{rem.time}</span>
              </div>
              <h4 className="font-bold text-base text-white mb-1">{rem.title}</h4>
              <p className="text-xs text-slate-300 mb-2 leading-relaxed">{rem.description}</p>
              <div className="text-[11px] text-cyan-300 font-medium">{rem.benefit}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
