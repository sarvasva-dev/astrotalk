import React from "react";
import { Sparkles, ShieldCheck, HeartHandshake, Phone, MessageSquare, BookOpen, Compass, Lock } from "lucide-react";
import type { PageRoute } from "../types";

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#1b140e] text-[#cfc1af] border-t border-[#3b2d1f] pt-12 pb-16 md:pb-12 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#3b2d1f]">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div
              onClick={() => onNavigate({ page: "landing" })}
              className="flex items-center gap-2 cursor-pointer mb-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#c8531c] flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <span className="font-serif text-lg font-bold text-white tracking-wider">
                ASTROGURU
              </span>
            </div>
            <p className="text-xs text-[#9d8d7a] leading-relaxed max-w-sm mb-4">
              India's premier Vedic astrology consultation network. Connecting millions with certified Vedic scholars, Prashna Jyotish masters, and tarot readers with 100% confidential privacy.
            </p>
            <div className="flex items-center gap-4 text-[#cfc1af]">
              <span className="flex items-center gap-1">
                <Lock size={13} className="text-emerald-400" /> 256-bit Encrypted
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-amber-400" /> Verified Scholars
              </span>
            </div>
          </div>

          {/* Quick Astrology Tools */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">
              Astrology Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: "kundli" })}
                  className="hover:text-[#f3a76d] transition-colors"
                >
                  Free Janma Kundli
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: "kundli-matching" })}
                  className="hover:text-[#f3a76d] transition-colors"
                >
                  Kundli Matching (36 Gunas)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: "horoscope" })}
                  className="hover:text-[#f3a76d] transition-colors"
                >
                  Daily Horoscope & Panchang
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: "tarot" })}
                  className="hover:text-[#f3a76d] transition-colors"
                >
                  3-Card Tarot Reading
                </button>
              </li>
            </ul>
          </div>

          {/* Consultation Services */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">
              Live Consultations
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: "consult" })}
                  className="hover:text-[#f3a76d] transition-colors"
                >
                  Talk to Astrologer (Call)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: "consult" })}
                  className="hover:text-[#f3a76d] transition-colors"
                >
                  Chat with Astrologer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: "consult", category: "love" })}
                  className="hover:text-[#f3a76d] transition-colors"
                >
                  Love & Relationship Guidance
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: "consult", category: "career" })}
                  className="hover:text-[#f3a76d] transition-colors"
                >
                  Career & Wealth Timing
                </button>
              </li>
            </ul>
          </div>

          {/* Knowledge Hub / SEO Guides */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">
              Vedic Knowledge Hub
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: "blogs" })}
                  className="hover:text-[#f3a76d] transition-colors"
                >
                  All Astrology Articles
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: "blogs", slug: "purva-phalguni-nakshatra-guide" })}
                  className="hover:text-[#f3a76d] transition-colors"
                >
                  Purva Phalguni Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: "blogs", slug: "shani-sade-sati-phases-remedies" })}
                  className="hover:text-[#f3a76d] transition-colors"
                >
                  Shani Sade Sati 2026
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: "blogs", slug: "gemstone-astrology-guide-rules" })}
                  className="hover:text-[#f3a76d] transition-colors"
                >
                  Ratna Shastra Gemstone Rules
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7d6f5e]">
          <div>
            © 2026 Astroguru Services Private Limited. All rights reserved. Calculations verified via Lahiri Ephemeris.
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate({ page: "profile" })}
              className="hover:text-white transition-colors"
            >
              My Account
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: "landing" })}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: "landing" })}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
