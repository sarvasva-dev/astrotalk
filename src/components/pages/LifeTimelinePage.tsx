import React from 'react';
import { TrendingUp, Calendar, Sparkles, Shield, ChevronRight } from 'lucide-react';
import type { PageRoute, UserProfile } from '../../types';

interface LifeTimelinePageProps {
  userProfile: UserProfile;
  onNavigate: (route: PageRoute) => void;
}

const TIMELINE_EVENTS = [
  {
    period: '2024 – 2026',
    dasha: 'Jupiter Mahadasha / Mercury Antardasha',
    title: 'Career Acceleration & Knowledge Acquisition',
    description: 'Golden phase for strategic expansion, digital projects, and financial consolidation.',
    status: 'ACTIVE',
    color: 'border-cyan-500/50 text-cyan-400',
  },
  {
    period: '2026 – 2028',
    dasha: 'Jupiter Mahadasha / Ketu Antardasha',
    title: 'Spiritual Awakening & Internal Refinement',
    description: 'Period of selective focus. Great for meditation, research, and eliminating distractions.',
    status: 'UPCOMING',
    color: 'border-purple-500/30 text-purple-400',
  },
  {
    period: '2028 – 2031',
    dasha: 'Jupiter Mahadasha / Venus Antardasha',
    title: 'Peak Prosperity & Domestic Harmony',
    description: 'Highly auspicious for marriage, property investments, and long-term partnerships.',
    status: 'UPCOMING',
    color: 'border-amber-500/30 text-amber-400',
  },
];

export const LifeTimelinePage: React.FC<LifeTimelinePageProps> = ({ userProfile, onNavigate }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 text-slate-100">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Vimshottari Dasha Tree</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
          Your Life Timeline
        </h1>
        <p className="text-sm text-slate-400">
          Key planetary cycles, major milestones, and peak growth opportunities.
        </p>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 md:before:left-1/2 before:w-0.5 before:bg-slate-800">
        {TIMELINE_EVENTS.map((evt, idx) => (
          <div key={idx} className="relative flex flex-col md:flex-row items-start gap-6 group">
            {/* Timeline Badge */}
            <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-bold text-xs shrink-0 z-10 shadow-lg shadow-cyan-500/20">
              {idx + 1}
            </div>

            {/* Event Card */}
            <div className="card-cosmic p-6 flex-1 border-slate-800 group-hover:border-cyan-500/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {evt.period}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${evt.color}`}>
                  {evt.status}
                </span>
              </div>
              <h3 className="font-bold text-lg text-white mb-1">{evt.title}</h3>
              <div className="text-xs text-purple-300 mb-3">{evt.dasha}</div>
              <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
