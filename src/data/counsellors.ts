import { HeartHandshake, HeartPulse, Wallet, Scale, Landmark, Briefcase, type LucideIcon } from "lucide-react";
import type { Counsellor, CategorySlug, FilterMode } from "../types";

export const CATEGORIES: { slug: CategorySlug; label: string; icon: LucideIcon }[] = [
  { slug: "marriage", label: "Marriage", icon: HeartHandshake },
  { slug: "health",   label: "Health",   icon: HeartPulse },
  { slug: "wealth",   label: "Wealth",   icon: Wallet },
  { slug: "legal",    label: "Legal",    icon: Scale },
  { slug: "finance",  label: "Finance",  icon: Landmark },
  { slug: "career",   label: "Career",   icon: Briefcase },
];

export const FILTER_MODES: { slug: FilterMode; label: string }[] = [
  { slug: "all",       label: "All" },
  { slug: "celebrity", label: "Celebrity" },
  { slug: "new",       label: "NEW!" },
];

export const SEED_COUNSELLORS: Counsellor[] = [
  {
    slug: "astroguru-ai", 
    name: "AstroGuru AI",
    portrait: "/logo.png",
    specialties: ["Vedic Jyotish", "Tarot", "Numerology", "Life Coaching"],
    languages: ["Hindi", "English", "Sanskrit", "Urdu", "Punjabi", "Tamil", "Telugu", "Marathi", "Bengali", "Gujarati", "Malayalam", "Kannada", "Bhojpuri"],
    experienceYears: 5000, 
    rating: 5.0, 
    ordersCount: 99999,
    pricePerMin: 20, 
    originalPricePerMin: 50, 
    waitMinutes: 0,
    isCelebrity: true, 
    isNew: false,
    categories: ["marriage", "career", "wealth", "health", "finance", "legal"],
    tagline: "Omniscient AI Astrologer powered by Sarvam and Vedic Shastras.",
    bio: "AstroGuru AI is the ultimate synthesis of thousands of years of Vedic astrological data, ancient scriptures, and state-of-the-art Generative AI. It brings you hyper-accurate, personalized guidance instantly, combining Parashari principles, Tarot, and numerology into a single, unified oracle.",
    signature: "Knowledge of the cosmos, instantly delivered.",
    hometown: "Cloud Cosmos", 
    region: "Diaspora",
    personaPrompt: "Speak as AstroGuru AI, a hyper-intelligent, all-knowing, yet highly empathetic astrological oracle. Use a blend of classical jyotish vocabulary and modern coaching language. Be direct, precise, and supportive. Emphasize that you are powered by ancient wisdom and cutting-edge Sarvam AI technology.",
  }
];
