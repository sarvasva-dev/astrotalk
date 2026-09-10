import React from 'react';
import {
  Compass,
  Sparkles,
  HeartHandshake,
  Clock,
  Flame,
  Shield,
  MessageSquare,
  TrendingUp,
  User,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import type { PageRoute, UserProfile } from '../../types';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
  userProfile: UserProfile;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, userProfile }) => {
  const userName = userProfile.displayName ? userProfile.displayName.split(' ')[0] : 'Seeker';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 text-slate-100">
      {/* Welcome Banner */}
      <div className="card-cosmic p-6 sm:p-8 mb-8 relative overflow-hidden bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-950 border-cyan-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Today's Vimshottari Alignment</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
              Namaste, <span className="text-cyan-400">{userName}</span>
            </h1>
            <p className="text-sm text-slate-300">
              Jupiter transit is favoring your 10th house. Perfect day for career actions and morning Arghya.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate({ page: 'remedies' })}
              className="px-4 py-2.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-semibold flex items-center gap-2 hover:bg-orange-500/30 transition-all"
            >
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span>3-Day Remedy Streak</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Core Services */}
      <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-cyan-400" />
        <span>Your Vedic Toolkit</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        <button
          onClick={() => onNavigate({ page: 'kundli' })}
          className="card-cosmic p-4 text-center flex flex-col items-center justify-center hover:border-cyan-500/50 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
            <Compass className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-white mb-1">Janma Kundli</span>
          <span className="text-[10px] text-slate-400">D1 & D9 Charts</span>
        </button>

        <button
          onClick={() => onNavigate({ page: 'archetype' })}
          className="card-cosmic p-4 text-center flex flex-col items-center justify-center hover:border-purple-500/50 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
            <User className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-white mb-1">Astro Archetype</span>
          <span className="text-[10px] text-slate-400">Soul Blueprint</span>
        </button>

        <button
          onClick={() => onNavigate({ page: 'life-timeline' })}
          className="card-cosmic p-4 text-center flex flex-col items-center justify-center hover:border-emerald-500/50 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-white mb-1">Life Timeline</span>
          <span className="text-[10px] text-slate-400">Future Peaks</span>
        </button>

        <button
          onClick={() => onNavigate({ page: 'remedies' })}
          className="card-cosmic p-4 text-center flex flex-col items-center justify-center hover:border-orange-500/50 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-3 group-hover:scale-110 transition-transform">
            <Flame className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-white mb-1">Daily Remedies</span>
          <span className="text-[10px] text-slate-400">Mantras & Puja</span>
        </button>

        <button
          onClick={() => onNavigate({ page: 'kundli-matching' })}
          className="card-cosmic p-4 text-center flex flex-col items-center justify-center hover:border-pink-500/50 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-3 group-hover:scale-110 transition-transform">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-white mb-1">Match 36 Gunas</span>
          <span className="text-[10px] text-slate-400">Ashta Koota</span>
        </button>

        <button
          onClick={() => onNavigate({ page: 'tarot' })}
          className="card-cosmic p-4 text-center flex flex-col items-center justify-center hover:border-amber-500/50 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-white mb-1">Tarot Reading</span>
          <span className="text-[10px] text-slate-400">3-Card Draw</span>
        </button>
      </div>

      {/* Instant AI Consultation Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-2 card-cosmic p-6 border-cyan-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <span>Ask Acharya Agastyaa (AI)</span>
            </h3>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              ● ONLINE 24/7
            </span>
          </div>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Have a question about career change, marriage timing, or personal growth? Get instant answers grounded in classical Shastras.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate({ page: 'consult' })}
              className="btn-cosmic-primary text-xs px-5 py-2.5 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Start Free AI Chat</span>
            </button>
          </div>
        </div>

        {/* Today's Muhurat Widget */}
        <div className="card-cosmic p-6 border-amber-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Panchang Today
              </span>
              <span className="text-[10px] text-slate-400">Sunrise 06:12 AM</span>
            </div>
            <div className="text-base font-bold text-white mb-1">Shukla Paksha Dashami</div>
            <p className="text-xs text-slate-400 mb-4">Abhijit Muhurat: 11:48 AM – 12:36 PM</p>
          </div>

          <button
            onClick={() => onNavigate({ page: 'horoscope' })}
            className="w-full py-2 btn-cosmic-teal text-xs flex items-center justify-center gap-1.5"
          >
            <span>Full Panchang</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
