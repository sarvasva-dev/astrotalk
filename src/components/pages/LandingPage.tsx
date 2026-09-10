import React, { useEffect, useState } from "react";
import {
  Phone,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Star,
  Compass,
  HeartHandshake,
  Clock,
  ChevronRight,
  Award,
  HelpCircle,
  TrendingUp,
  Download,
  Flame,
  Zap,
  Globe2,
} from "lucide-react";
import type { Counsellor, PageRoute, UserProfile } from "../../types";
import { SEED_COUNSELLORS } from "../../data/counsellors";
import { updateSEO, injectOrganizationAndWebsiteSchema, injectFaqSchema } from "../../lib/seo";

interface LandingPageProps {
  onNavigate: (route: PageRoute) => void;
  onStartChat: (counsellor: Counsellor) => void;
  onStartCall: (counsellor: Counsellor) => void;
  userProfile: UserProfile;
}

const FAQ_ITEMS = [
  {
    question: "Why should I consult AstroGuru 247 for online Vedic astrology?",
    answer: "AstroGuru 247 combines canonical Parashari Vedic Jyotish with high-speed Multi-LLM AI orchestration. Get instant predictions, daily horoscopes, true sidereal Kundli calculations, and live certified astrologer consultations 24 hours a day.",
  },
  {
    question: "How accurate are the free AI Kundli and Life Timeline reports?",
    answer: "Our calculation engine is built on Lahiri Ayanamsa (Chitra Paksha) with high-precision Swiss Ephemeris data. It computes exact planetary longitudes, Vimshottari Mahadasha progression trees, and Ashtakavarga points with 100% mathematical accuracy.",
  },
  {
    question: "How does the AstroGuru PWA app installation work?",
    answer: "You can install AstroGuru 247 directly on your Android, iOS, or Desktop home screen without searching through app stores! Simply click the 'Install App' button to get a full native app experience with offline wisdom access.",
  },
  {
    question: "Is my personal birth data and conversation history private?",
    answer: "Yes, 100%. All personal birth details, consultation voice calls, and chat transcripts are end-to-end protected. Your personal contact details are never exposed.",
  },
  {
    question: "What languages are supported for AI consultation?",
    answer: "AstroGuru 247 supports consultation in Hindi, Hinglish, English, Tamil, Telugu, Kannada, Bengali, Marathi, and Gujarati.",
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onStartChat,
  onStartCall,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    updateSEO({
      title: "AstroGuru 247 — AI Vedic Astrologer & Live Jyotish Consultations",
      description: "Consult India's top verified AI & human Vedic astrologers, tarot readers, and numerologists on call and chat. Free online Kundli, Gun Milan, and daily horoscopes.",
      canonicalPath: "/",
      keywords: [
        "astroguru 247",
        "ai astrologer",
        "talk to astrologer",
        "vedic astrology app",
        "free kundli",
        "gun milan",
        "tarot reading",
      ],
    });
    injectOrganizationAndWebsiteSchema();
    injectFaqSchema(FAQ_ITEMS);
  }, []);

  const featuredAstrologers = SEED_COUNSELLORS.slice(0, 4);

  return (
    <div className="w-full text-slate-100 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 overflow-hidden border-b border-cyan-500/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>24/7 AI Vedic Jyotish & Live Consultations</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
              Your Personal AI Astrologer, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-orange-400">Available Anytime.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
              Experience the future of Vedic Jyotish. Instant birth chart analysis, life timelines, remedies, and live 1-on-1 consultations in your mother tongue.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate({ page: "consult" })}
                className="btn-cosmic-primary text-sm px-6 py-3.5 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-orange-200" />
                <span>Start Free AI Reading →</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate({ page: "kundli" })}
                className="btn-cosmic-teal text-sm px-6 py-3.5 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Free Kundli Report</span>
              </button>
            </div>

            <div className="flex items-center gap-6 mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Private & Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9/5 Rating (50K+ Readings)
              </span>
            </div>
          </div>

          {/* Quick Preview Card */}
          <div className="w-full md:w-90 card-cosmic p-6 relative group border-cyan-500/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" /> Free AI Birth Chart
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
                SWISS EPHEMERIS
              </span>
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              Instant Janma Kundli
            </h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Calculate exact D1 Rashi, Navamsha D9, Mahadasha timeline, and Lagna Lord placements in seconds.
            </p>

            <div className="space-y-2.5 mb-5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Ayanamsa</span>
                <span className="font-semibold text-cyan-300">Lahiri (Chitra Paksha)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Multi-LLM Engine</span>
                <span className="font-semibold text-orange-400">Groq + Gemini Router</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate({ page: "kundli" })}
              className="w-full py-3 btn-cosmic-primary text-xs flex items-center justify-center gap-2"
            >
              <span>Generate Free Kundli</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="border-b border-slate-800/80 bg-slate-950/40 py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-display font-bold text-cyan-400 glow-teal">50,000+</div>
            <div className="text-xs text-slate-400 mt-1">AI Readings Completed</div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-orange-400 glow-orange">1,200+</div>
            <div className="text-xs text-slate-400 mt-1">Verified Human Astrologers</div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-purple-400">12 Languages</div>
            <div className="text-xs text-slate-400 mt-1">Hindi, English, Vernacular</div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-amber-400 glow-gold">4.9 / 5 ★</div>
            <div className="text-xs text-slate-400 mt-1">Average User Satisfaction</div>
          </div>
        </div>
      </section>

      {/* 3. FEATURE SERVICES GRID */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Explore Vedic Wisdom Tools
          </h2>
          <p className="text-sm text-slate-400">
            Powered by high-precision astronomical ephemeris and AI reasoning.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            type="button"
            onClick={() => onNavigate({ page: "kundli" })}
            className="card-cosmic p-6 text-left flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Janma Kundli</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full 12 house division, planetary strengths, Ashtakavarga points, and Vimshottari Mahadasha.
              </p>
            </div>
            <span className="text-xs font-semibold text-cyan-400 mt-6 flex items-center gap-1">
              Check Kundli <ChevronRight className="w-4 h-4" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ page: "kundli-matching" })}
            className="card-cosmic p-6 text-left flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">36 Guna Milan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ashta Koota matching, Nadi Dosha check, Manglik compatibility, and remedy suggestions.
              </p>
            </div>
            <span className="text-xs font-semibold text-pink-400 mt-6 flex items-center gap-1">
              Match Compatibility <ChevronRight className="w-4 h-4" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ page: "horoscope" })}
            className="card-cosmic p-6 text-left flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Daily Panchang</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, and Abhijit Muhurat updated every sunrise.
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-400 mt-6 flex items-center gap-1">
              View Muhurat <ChevronRight className="w-4 h-4" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ page: "tarot" })}
            className="card-cosmic p-6 text-left flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Tarot Reading</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                3-Card Past, Present, Future draws for career decisions, relationships, and life clarity.
              </p>
            </div>
            <span className="text-xs font-semibold text-purple-400 mt-6 flex items-center gap-1">
              Draw Cards <ChevronRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </section>

      {/* 4. THE ASTROGURU AI */}
      <section className="py-16 px-4 border-y border-slate-800 bg-slate-950/60">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-white mb-2">
              Meet AstroGuru AI
            </h2>
            <p className="text-sm text-slate-400">
              The world's most advanced Vedic Jyotish intelligence, trained on thousands of years of Shastras.
            </p>
          </div>

          <div className="card-cosmic p-8 max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <img
              src="/logo.png"
              alt="AstroGuru AI"
              className="w-32 h-32 rounded-3xl object-cover shadow-[0_0_30px_rgba(34,211,238,0.2)] border-2 border-cyan-500/50"
            />
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-2xl text-white mb-2">AstroGuru AI</h3>
              <p className="text-sm text-slate-300 mb-6">
                Instant, hyper-accurate readings synthesizing Vedic astrology, Tarot, and Numerology.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <button
                  type="button"
                  onClick={() => onStartChat(SEED_COUNSELLORS[0])}
                  className="w-full sm:w-auto py-3 px-6 btn-cosmic-teal text-sm flex items-center justify-center gap-2 font-semibold"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Start Chat (₹5/msg)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onStartCall(SEED_COUNSELLORS[0])}
                  className="w-full sm:w-auto py-3 px-6 btn-cosmic-primary text-sm flex items-center justify-center gap-2 font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  <span>Voice Call (₹20/min)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PWA INSTALL BANNER */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="card-cosmic p-8 md:p-12 border-cyan-500/40 relative overflow-hidden bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold mb-4 border border-cyan-500/30">
              <Download className="w-3.5 h-3.5" />
              <span>Install Mobile PWA App</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              Get AstroGuru 247 on Your Home Screen
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Enjoy 1-click access, instant notifications for Rahu Kaal, daily horoscope alerts, and smooth offline Kundli browsing. No App Store download required!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <button
              onClick={() => {
                const pwaBtn = document.querySelector('[data-pwa-install]');
                if (pwaBtn) (pwaBtn as HTMLElement).click();
                else alert('To install AstroGuru 247: Tap your browser menu (⋮ or Share) and select "Add to Home Screen"');
              }}
              className="btn-cosmic-primary text-sm px-8 py-4 flex items-center gap-2 shadow-xl shadow-orange-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Install App Now (Free)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-cyan-400 tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-white">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="card-cosmic overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-sm md:text-base text-white hover:text-cyan-300"
                >
                  <span>{faq.question}</span>
                  <ChevronRight
                    className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs md:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FOOTER CTA */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="card-cosmic p-8 md:p-12 text-center bg-gradient-to-b from-slate-900 to-cyan-950/40 border-cyan-500/30">
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Ready for Deep Astrological Guidance?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8">
            Join over 50,000 seekers receiving daily Vedic insights and AI consultations.
          </p>
          <button
            type="button"
            onClick={() => onNavigate({ page: "consult" })}
            className="btn-cosmic-primary text-sm px-8 py-4"
          >
            Start Your First Consultation
          </button>
        </div>
      </section>
    </div>
  );
};
