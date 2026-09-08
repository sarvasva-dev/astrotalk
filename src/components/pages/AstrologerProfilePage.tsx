import React, { useEffect } from "react";
import {
  Phone,
  MessageSquare,
  Star,
  CheckCircle2,
  Clock,
  Globe2,
  MapPin,
  ShieldCheck,
  Award,
  ChevronLeft,
  Share2,
} from "lucide-react";
import type { Counsellor, PageRoute, UserProfile } from "../../types";
import { SEED_COUNSELLORS } from "../../data/counsellors";
import { updateSEO, injectAstrologerProfileSchema } from "../../lib/seo";

interface AstrologerProfilePageProps {
  slug: string;
  onNavigate: (route: PageRoute) => void;
  onStartChat: (counsellor: Counsellor) => void;
  onStartCall: (counsellor: Counsellor) => void;
  userProfile: UserProfile;
}

export const AstrologerProfilePage: React.FC<AstrologerProfilePageProps> = ({
  slug,
  onNavigate,
  onStartChat,
  onStartCall,
}) => {
  const counsellor = SEED_COUNSELLORS.find((c) => c.slug === slug) || SEED_COUNSELLORS[0];

  useEffect(() => {
    updateSEO({
      title: `${counsellor.name} — Consult Live on Call & Chat | Astroguru`,
      description: `Consult ${counsellor.name} on Astroguru. ${counsellor.experienceYears}+ years experience in ${counsellor.specialties.join(", ")}. Rated ${counsellor.rating}★ with ${counsellor.ordersCount.toLocaleString()}+ consultations.`,
      canonicalPath: `/astrologer/${counsellor.slug}`,
      type: "profile",
      keywords: [
        counsellor.name,
        "astrology consultation",
        ...counsellor.specialties,
        "vedic astrologer",
        "astroguru",
      ],
    });

    injectAstrologerProfileSchema(counsellor);
  }, [counsellor]);

  const reviews = [
    {
      name: "Rohit Malhotra",
      date: "Yesterday",
      rating: 5,
      comment:
        "Pandit ji's reading was spot on about my job transit date in April! His explanation about my 10th house Mahadasha gave me immense mental peace.",
    },
    {
      name: "Ananya Deshmukh",
      date: "3 days ago",
      rating: 5,
      comment:
        "Extremely patient, calm, and grounded. Did not push any expensive gemstone remedies, just simple daily mantras that helped immediately.",
    },
    {
      name: "Vikram Sengupta",
      date: "Last week",
      rating: 4.8,
      comment:
        "Remarkable accuracy regarding family property matters. Highly recommended for complex chart consultations!",
    },
  ];

  return (
    <div className="w-full bg-[#fcfaf7] text-[#2c2416] pb-16">
      {/* Top Breadcrumb Header */}
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-[#826a48] border-b border-[#ebd7be]">
        <button
          type="button"
          onClick={() => onNavigate({ page: "consult" })}
          className="flex items-center gap-1 hover:text-[#c8531c] font-medium transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Back to All Astrologers</span>
        </button>
        <div className="flex items-center gap-2">
          <span>Profile</span>
          <span>/</span>
          <span className="font-semibold text-[#2c2416]">{counsellor.name}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Portrait Card & CTA Buttons */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-[#ebd7be] p-5 shadow-sm sticky top-20">
              <div className="relative mb-4">
                <img
                  src={counsellor.portrait}
                  alt={counsellor.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-64 object-cover rounded-xl border border-[#ebd7be]"
                />
                <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Available Now
                </span>
              </div>

              <h1 className="font-serif font-bold text-xl text-[#1a140d] mb-1 flex items-center gap-1.5">
                <span>{counsellor.name}</span>
                <CheckCircle2 size={18} className="text-[#c8531c] fill-[#fae6cf]" />
              </h1>

              <p className="text-xs text-[#826a48] mb-3">
                {counsellor.specialties.join(" • ")}
              </p>

              <div className="flex items-center justify-between py-2 border-y border-[#ebd7be] text-xs mb-4">
                <div className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star size={14} className="fill-amber-500 text-amber-500" />
                  <span>{counsellor.rating.toFixed(1)}</span>
                </div>
                <div className="text-[#826a48]">
                  <span className="font-semibold text-[#2c2416]">{counsellor.ordersCount.toLocaleString()}</span> consultations
                </div>
              </div>

              {/* Pricing Box */}
              <div className="bg-[#fcfaf7] p-3 rounded-xl border border-[#ebd7be] mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#826a48]">Consultation Rate:</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#c8531c]">₹{counsellor.pricePerMin}</span>
                    <span className="text-[11px] text-[#826a48]"> / min</span>
                    {counsellor.originalPricePerMin && (
                      <span className="text-[10px] text-[#a48e71] line-through ml-1">
                        ₹{counsellor.originalPricePerMin}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-[10px] text-emerald-700 font-medium">
                  ✓ Pay-per-minute via secure wallet balance
                </div>
              </div>

              {/* Instant Launch Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => onStartChat(counsellor)}
                  className="w-full py-3 bg-white hover:bg-[#fae6cf] text-[#85350f] border border-[#f3a76d] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <MessageSquare size={16} />
                  <span>Start Chat Session (₹{counsellor.pricePerMin}/min)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onStartCall(counsellor)}
                  className="w-full py-3 bg-[#c8531c] hover:bg-[#a64013] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <Phone size={16} />
                  <span>Start Live Call (₹{counsellor.pricePerMin}/min)</span>
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-[#ebd7be] flex items-center justify-center gap-2 text-[11px] text-[#826a48]">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>100% Private & Verified Scholar</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Detailed Bio, Lineage, and Reviews */}
          <div className="md:col-span-2 space-y-6">
            {/* Tagline & Overview Card */}
            <div className="bg-white rounded-2xl border border-[#ebd7be] p-6 shadow-sm">
              <h2 className="font-serif text-lg font-bold text-[#1a140d] mb-2">
                About {counsellor.name}
              </h2>
              <blockquote className="border-l-3 border-[#c8531c] pl-3 italic text-xs sm:text-sm text-[#85350f] bg-[#fff8ef] p-2.5 rounded-r-lg mb-4">
                "{counsellor.signature}"
              </blockquote>
              <p className="text-xs sm:text-sm text-[#614d33] leading-relaxed mb-4">
                {counsellor.bio}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-[#ebd7be] text-xs">
                <div className="flex items-center gap-2 text-[#826a48]">
                  <Award size={16} className="text-[#c8531c]" />
                  <span><strong>{counsellor.experienceYears} Years</strong> Experience</span>
                </div>
                <div className="flex items-center gap-2 text-[#826a48]">
                  <Globe2 size={16} className="text-[#c8531c]" />
                  <span><strong>{counsellor.languages.join(", ")}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-[#826a48]">
                  <MapPin size={16} className="text-[#c8531c]" />
                  <span>{counsellor.hometown}</span>
                </div>
              </div>
            </div>

            {/* Specialties & Classical Approach */}
            <div className="bg-white rounded-2xl border border-[#ebd7be] p-6 shadow-sm">
              <h3 className="font-serif text-base font-bold text-[#1a140d] mb-3">
                Areas of Expertise & Shastric Systems
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {counsellor.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#fae6cf] text-[#85350f] text-xs font-semibold rounded-lg border border-[#f3a76d]"
                  >
                    {spec}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#826a48] leading-relaxed">
                Consultations are conducted following classical Brihat Parashara Hora Shastra, Nadi palm leaves, and Jaimini Sutras. Exact birth chart rectification is performed for clients with uncertain birth timings.
              </p>
            </div>

            {/* Verified User Reviews */}
            <div className="bg-white rounded-2xl border border-[#ebd7be] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-base font-bold text-[#1a140d]">
                  User Ratings & Reviews ({counsellor.ordersCount.toLocaleString()})
                </h3>
                <div className="flex items-center gap-1 text-sm font-bold text-amber-600">
                  <Star size={16} className="fill-amber-500 text-amber-500" />
                  <span>{counsellor.rating.toFixed(1)} / 5.0</span>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#fcfaf7] border border-[#ebd7be]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[#2c2416]">{rev.name}</span>
                      <span className="text-[#a48e71]">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className="fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-[#614d33] leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
