import React, { useEffect, useState } from "react";
import {
  Phone,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Star,
  Users,
  Compass,
  HeartHandshake,
  Clock,
  ChevronRight,
  BookOpen,
  Award,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  Lock,
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
    question: "Why should I consult an online astrologer on Astroguru?",
    answer: "Astroguru connects you directly with 1,200+ rigorously vetted and certified Vedic astrologers, numerologists, tarot readers, and Prashna experts. You receive genuine Shastric insights with 100% confidential privacy, live voice calls, and real-time interactive chats.",
  },
  {
    question: "How accurate is the Astroguru online Kundli generation?",
    answer: "Our Kundli calculation engine uses the canonical Lahiri Ayanamsa (Chitra Paksha) with high-precision true sidereal planet algorithms. It calculates exact planetary longitudes, Bhavas, Nakshatra Padas, and Vimshottari Dasha trees verified against standard ephemeris benchmarks.",
  },
  {
    question: "What is Kundli Matching (Gun Milan) and how does it work?",
    answer: "Gun Milan is the classical Ashta Koota method evaluating 36 total Gunas between the bride and groom: Varna (1), Vashya (2), Tara (3), Yoni (4), Graha Maitri (5), Gana (6), Bhakoot (7), and Nadi (8). A score of 18 or above indicates positive marital compatibility.",
  },
  {
    question: "Is my personal data and consultation history private?",
    answer: "Yes, 100%. All personal birth details, consultation audio calls, and chat transcripts are strictly encrypted. Your phone number is never shared with astrologers.",
  },
  {
    question: "How does wallet recharge and billing work?",
    answer: "You can recharge your wallet securely with Razorpay, UPI, debit/credit cards, and net banking. Billing is strictly pay-per-minute with real-time balance tracking and no hidden charges.",
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
      title: "Astroguru: Talk to Best Astrologers Live | Kundli, Horoscope & Gun Milan",
      description: "Consult India's best verified Vedic astrologers, tarot readers, and numerologists on call and chat. Get free online Kundli, 36 Guna Milan matching, and daily horoscopes on Astroguru.",
      canonicalPath: "/",
      keywords: [
        "astroguru",
        "talk to astrologer",
        "online astrology consultation",
        "free kundli",
        "kundli matching",
        "gun milan",
        "vedic astrology",
        "daily horoscope",
        "tarot reading",
      ],
    });
    injectOrganizationAndWebsiteSchema();
    injectFaqSchema(FAQ_ITEMS);
  }, []);

  const featuredAstrologers = SEED_COUNSELLORS.slice(0, 4);

  return (
    <div className="w-full bg-[#fcfaf7] text-[#2c2416] pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fae6cf] via-[#fff8ef] to-[#fcfaf7] border-b border-[#ebd7be] py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fae6cf] border border-[#f3a76d] text-[#c8531c] text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              1,240+ Astrologers Online Now
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1a140d] leading-tight mb-4">
              Clear Answers to Life's Deepest Questions.
            </h1>

            <p className="text-base sm:text-lg text-[#614d33] mb-6 leading-relaxed">
              Connect with India's most respected Vedic astrologers, tarot readers, and numerologists in seconds. 100% private, verified, and grounded in classical Shastra.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate({ page: "consult" })}
                className="px-6 py-3 bg-[#c8531c] hover:bg-[#a64013] text-white font-medium rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-98"
              >
                <Phone size={18} />
                <span>Talk to Astrologer</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate({ page: "kundli" })}
                className="px-6 py-3 bg-white hover:bg-[#fae6cf]/50 text-[#85350f] border border-[#f3a76d] font-medium rounded-xl shadow-xs transition-all flex items-center gap-2"
              >
                <Sparkles size={18} />
                <span>Free Kundli Report</span>
              </button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-[#f3a76d]/40 text-xs text-[#826a48]">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-600" /> 100% Private & Confidential
              </span>
              <span className="flex items-center gap-1">
                <Star size={14} className="text-amber-500 fill-amber-500" /> 4.9/5 Rating (5M+ Reviews)
              </span>
            </div>
          </div>

          {/* Quick Kundli Preview Card */}
          <div className="w-full md:w-80 bg-white rounded-2xl p-5 border border-[#ebd7be] shadow-lg relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#c8531c]">
                Quick Kundli Check
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                100% FREE
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg text-[#2c2416] mb-1">
              Know Your Janma Kundli
            </h3>
            <p className="text-xs text-[#826a48] mb-4">
              Instant D1 chart, Lagna lord, Janma Nakshatra, and current Vimshottari Mahadasha.
            </p>
            <div className="space-y-2 mb-4 text-xs">
              <div className="p-2.5 rounded-lg bg-[#fcfaf7] border border-[#ebd7be] flex items-center justify-between">
                <span className="text-[#826a48]">Ayanamsa System</span>
                <span className="font-semibold text-[#2c2416]">Lahiri (Chitra Paksha)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#fcfaf7] border border-[#ebd7be] flex items-center justify-between">
                <span className="text-[#826a48]">Divisional Charts</span>
                <span className="font-semibold text-[#2c2416]">D1 (Rashi) & D9 (Navamsha)</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ page: "kundli" })}
              className="w-full py-2.5 bg-[#fae6cf] hover:bg-[#f3a76d] text-[#85350f] font-semibold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>Generate Free Kundli</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. LIVE STATS STRIP */}
      <section className="bg-white border-b border-[#ebd7be] py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-[#c8531c]">1,200+</div>
            <div className="text-xs sm:text-sm text-[#826a48] font-medium mt-1">Verified Astrologers</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-[#c8531c]">5 Million+</div>
            <div className="text-xs sm:text-sm text-[#826a48] font-medium mt-1">Happy Seekers</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-[#c8531c]">12 Million+</div>
            <div className="text-xs sm:text-sm text-[#826a48] font-medium mt-1">Consultation Minutes</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-[#c8531c]">4.9 / 5 ★</div>
            <div className="text-xs sm:text-sm text-[#826a48] font-medium mt-1">Average Review Rating</div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR ASTROLOGY TOOLS GRID */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a140d]">
            Free Astrological Services & Tools
          </h2>
          <p className="text-sm text-[#826a48] mt-1">
            Trusted by millions for marriage matching, career planning, and daily auspicious timings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => onNavigate({ page: "kundli" })}
            className="p-5 rounded-2xl bg-white border border-[#ebd7be] hover:border-[#c8531c] hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#fae6cf] flex items-center justify-center text-[#c8531c] mb-3 group-hover:scale-105 transition-transform">
                <Compass size={20} />
              </div>
              <h3 className="font-bold text-base text-[#2c2416] mb-1">Janma Kundli</h3>
              <p className="text-xs text-[#826a48] leading-relaxed">
                Accurate birth chart analysis, planetary longitudes, houses, and Parashari aspects.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#c8531c] mt-4 flex items-center gap-1">
              View Kundli <ChevronRight size={14} />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ page: "kundli-matching" })}
            className="p-5 rounded-2xl bg-white border border-[#ebd7be] hover:border-[#c8531c] hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 mb-3 group-hover:scale-105 transition-transform">
                <HeartHandshake size={20} />
              </div>
              <h3 className="font-bold text-base text-[#2c2416] mb-1">Kundli Matching</h3>
              <p className="text-xs text-[#826a48] leading-relaxed">
                Ashta Koota 36 Guna Milan, Manglik Dosha compatibility, and marriage remedies.
              </p>
            </div>
            <span className="text-xs font-semibold text-pink-600 mt-4 flex items-center gap-1">
              Match 36 Gunas <ChevronRight size={14} />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ page: "horoscope" })}
            className="p-5 rounded-2xl bg-white border border-[#ebd7be] hover:border-[#c8531c] hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-3 group-hover:scale-105 transition-transform">
                <Clock size={20} />
              </div>
              <h3 className="font-bold text-base text-[#2c2416] mb-1">Horoscope & Panchang</h3>
              <p className="text-xs text-[#826a48] leading-relaxed">
                Daily, weekly, and monthly predictions, Rahu Kaal, Abhijit Muhurat, and Tithis.
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-600 mt-4 flex items-center gap-1">
              Check Today's Tithi <ChevronRight size={14} />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ page: "tarot" })}
            className="p-5 rounded-2xl bg-white border border-[#ebd7be] hover:border-[#c8531c] hover:shadow-md transition-all text-left flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-3 group-hover:scale-105 transition-transform">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-base text-[#2c2416] mb-1">3-Card Tarot Reading</h3>
              <p className="text-xs text-[#826a48] leading-relaxed">
                Past, Present, and Future guidance for love, careers, and critical life decisions.
              </p>
            </div>
            <span className="text-xs font-semibold text-purple-600 mt-4 flex items-center gap-1">
              Draw 3 Cards <ChevronRight size={14} />
            </span>
          </button>
        </div>
      </section>

      {/* 4. FEATURED TOP ASTROLOGERS */}
      <section className="bg-white border-y border-[#ebd7be] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a140d]">
                Top Verified Astrologers
              </h2>
              <p className="text-sm text-[#826a48]">
                Certified scholars with 15+ years of Vedic, Nadi, and KP astrology experience.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate({ page: "consult" })}
              className="px-4 py-2 text-xs font-bold text-[#c8531c] bg-[#fae6cf] hover:bg-[#f3a76d]/40 rounded-xl transition-all flex items-center gap-1"
            >
              <span>View All 1,200+ Astrologers</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredAstrologers.map((c) => (
              <div
                key={c.slug}
                className="bg-[#fcfaf7] rounded-2xl border border-[#ebd7be] p-4 flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={c.portrait}
                      alt={c.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-[#ebd7be]"
                    />
                    <div>
                      <h3
                        onClick={() => onNavigate({ page: "astrologer-detail", slug: c.slug })}
                        className="font-bold text-sm text-[#2c2416] hover:text-[#c8531c] cursor-pointer transition-colors"
                      >
                        {c.name}
                      </h3>
                      <div className="text-xs text-[#826a48]">{c.specialties.slice(0, 2).join(", ")}</div>
                      <div className="flex items-center gap-1 text-xs text-amber-600 mt-1 font-semibold">
                        <Star size={12} className="fill-amber-500" />
                        <span>{c.rating.toFixed(1)}</span>
                        <span className="text-[#a48e71] font-normal">({c.ordersCount.toLocaleString()} orders)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#614d33] line-clamp-2 mb-3">
                    {c.tagline}
                  </p>

                  <div className="flex items-center justify-between text-xs py-2 border-t border-[#ebd7be] mb-3">
                    <span className="text-[#826a48]">Fee:</span>
                    <span className="font-bold text-[#2c2416]">₹{c.pricePerMin}/min</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onStartChat(c)}
                    className="py-2 bg-white hover:bg-[#fae6cf] text-[#85350f] border border-[#f3a76d] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <MessageSquare size={13} />
                    <span>Chat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onStartCall(c)}
                    className="py-2 bg-[#c8531c] hover:bg-[#a64013] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <Phone size={13} />
                    <span>Call</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY ASTROGURU */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a140d]">
            Why 5 Million+ Trust Astroguru
          </h2>
          <p className="text-sm text-[#826a48] mt-1">
            Built on pure Vedic astronomy, customer privacy, and verified astrologers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#ebd7be] text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} />
            </div>
            <h3 className="font-bold text-base text-[#2c2416] mb-2">100% Privacy Guaranteed</h3>
            <p className="text-xs text-[#826a48] leading-relaxed">
              Your chats, voice calls, and Kundli records are strictly confidential. Astrologers never see your phone number or banking information.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#ebd7be] text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Award size={24} />
            </div>
            <h3 className="font-bold text-base text-[#2c2416] mb-2">Rigorously Tested Astrologers</h3>
            <p className="text-xs text-[#826a48] leading-relaxed">
              Only 1 in 20 astrologers clears our 4-stage verification exam conducted by senior Kashi and Banaras Sanskrit scholars.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#ebd7be] text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={24} />
            </div>
            <h3 className="font-bold text-base text-[#2c2416] mb-2">Canonical Vedic Ephemeris</h3>
            <p className="text-xs text-[#826a48] leading-relaxed">
              Calculations powered by Lahiri Ayanamsa, Swiss Ephemeris precision, and 120-year Vimshottari progression trees.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION (SEO RICH) */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase text-[#c8531c] tracking-wider mb-2">
            <HelpCircle size={14} />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a140d]">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#ebd7be] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#2c2416] hover:bg-[#fcfaf7]"
                >
                  <span>{faq.question}</span>
                  <ChevronRight
                    size={18}
                    className={`text-[#c8531c] shrink-0 transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-[#614d33] leading-relaxed border-t border-[#fcfaf7]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. BOTTOM CTA BANNER */}
      <section className="max-w-6xl mx-auto px-4 mt-6">
        <div className="bg-gradient-to-r from-[#fae6cf] to-[#ebd7be] rounded-3xl p-8 sm:p-12 border border-[#f3a76d] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center sm:text-left">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a140d] mb-2">
              Ready to find clarity about your future?
            </h2>
            <p className="text-xs sm:text-sm text-[#614d33]">
              Join over 5 million seekers today. Instant voice calls and live chats starting at just ₹20/minute.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate({ page: "consult" })}
            className="px-8 py-3.5 bg-[#c8531c] hover:bg-[#a64013] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-98 shrink-0"
          >
            Start Your First Consultation
          </button>
        </div>
      </section>
    </div>
  );
};
