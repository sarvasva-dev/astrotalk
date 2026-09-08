import type {
  CalculatedChartV1,
  PlanetPosition,
  LagnaPosition,
  VimshottariDashaTree,
  ProvenanceRecord,
} from "./lib/vedicEngine/calculationEngine";

export type CategorySlug = "marriage" | "health" | "wealth" | "legal" | "finance" | "career";

export type FilterMode = "all" | "celebrity" | "new";

export type Counsellor = {
  slug: string;
  name: string;
  portrait: string;
  specialties: string[];
  languages: string[];
  experienceYears: number;
  rating: number;
  ordersCount: number;
  pricePerMin: number;
  originalPricePerMin: number;
  waitMinutes: number;
  isCelebrity: boolean;
  isNew: boolean;
  categories: CategorySlug[];
  tagline: string;
  bio: string;
  signature: string;
  hometown: string;
  region: "North India" | "South India" | "East India" | "West India" | "Central India" | "Diaspora";
  personaPrompt: string;
  gender?: "male" | "female";
};

export type UserProfile = {
  id?: string;
  displayName: string;
  gender: "male" | "female" | "other" | null;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  birthTimeUnknown: boolean;
  birthPlace: string;
};

export type KundliHouse = {
  house: number;
  sign: string;
  signLord: string;
  planets: string[];
  aspectedBy?: string[];
  significations?: string;
};

export type WhyThisConclusionData = {
  claim: string;
  category: "planet_rashi" | "nakshatra_pada" | "lagna" | "dasha" | "graha_drishti" | "manglik" | "remedy" | "ai_synthesis";
  astronomicalCalculation: {
    rawTropicalDeg?: string;
    ayanamsaName: string;
    ayanamsaValue: string;
    trueSiderealDeg: string;
    signRange?: string;
    nakshatraSpan?: string;
    padaSpan?: string;
    formula?: string;
    stepExplanation?: string;
  };
  provenance: {
    engine: string;
    engineVersion: string;
    julianDate: number;
    utcTimestamp: string;
    coordinates: string;
    auditStatus?: string;
  };
  classicalShastra: {
    sourceBook: string;
    chapter: string;
    verse: string;
    sanskritSloka: string;
    englishPurport: string;
    evidenceType: "CLASSICAL_RULE" | "MATHEMATICAL_AXIOM" | "SYNTHESIZED_PARASHARI";
  };
};

export type KundliData = {
  name: string;
  dob: string;
  tob: string;
  pob: string;
  lagna: string;
  lagnaLord: string;
  element: string;
  moonSign: string;
  nakshatra: string;
  nakshatraPada?: number;
  nakshatraLord?: string;
  isManglik: boolean;
  currentDasha: string;
  currentAntardasha?: string;
  currentPratyantardasha?: string;
  luckyGemstone: string;
  luckyNumber: number;
  luckyColor: string;
  houses: KundliHouse[];
  summary: string;
  chartV1?: CalculatedChartV1;
  planetsDetailed?: PlanetPosition[];
  lagnaDetailed?: LagnaPosition;
  dashaTree?: VimshottariDashaTree;
  provenance?: ProvenanceRecord;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  kind?: "text" | "voice";
  audioPlaying?: boolean;
  trace?: OrchestratorTrace;
};

export type ActiveCall = {
  counsellor: Counsellor;
  startTime: number;
  durationSeconds: number;
  isMuted: boolean;
  isSpeaker: boolean;
  status: "connecting" | "active" | "ended";
  audioWaveform: number[];
};

export type PanchangInfo = {
  date: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  rahuKaal: string;
  shubhMuhurat: string;
  amritKaal: string;
  moonSign: string;
  vikramSamvat: string;
};

export type AstrologyIntent =
  | "DETERMINISTIC_DIRECT"
  | "CAREER_10TH_HOUSE"
  | "MARRIAGE_7TH_HOUSE"
  | "WEALTH_2ND_11TH"
  | "HEALTH_6TH_8TH"
  | "DOSHA_REMEDY"
  | "GENERAL_SHASTRA_DEF"
  | "COMPLEX_SYNTHESIS";

export type ClassicalRuleCitation = {
  id: string;
  sourceText: "Brihat Parashara Hora Shastra" | "Phaladeepika" | "Saravali" | "Jataka Parijata" | "Lal Kitab";
  chapter: string;
  verse: string;
  sanskritSloka?: string;
  purport: string;
  tags: string[];
};

export type OrchestratorTrace = {
  traceId: string;
  userQuestion: string;
  intent: AstrologyIntent;
  isDeterministic: boolean;
  rawTokensEstimate: number;
  prunedTokensSent: number;
  tokensSavedPercentage: number;
  matchedRules: ClassicalRuleCitation[];
  prunedFactsSummary: string[];
  routeDecision: {
    providerName: "Deterministic Engine" | "Sarvam Synthesizer" | "Gemini Deep Reasoning" | "Cache Layer";
    pool: "Deterministic" | "Primary Pool (Sarvam)" | "Fallback Pool (Gemini)" | "Semantic Cache";
    accountSlot: string;
    latencyMs: number;
    creditsCharged: number;
    costReason: string;
  };
  factCheck: {
    verified: boolean;
    chartTruthConfirmed: boolean;
    verifiedClaims: string[];
    correctedDiscrepancies: string[];
  };
  cached: boolean;
};

export type AICreditProfile = {
  planName: "₹10 / 24-Hour Pass" | "Explorer Free" | "Shastra Scholar";
  dailyCreditsLimit: number;
  creditsRemaining: number;
  creditsUsedToday: number;
  totalTokensSaved: number;
  deterministicQueriesCount: number;
  llmQueriesCount: number;
  expiresAt: string;
};

// Enterprise Multi-Page Navigation Route Definition
export type PageRoute =
  | { page: "landing" }
  | { page: "consult"; category?: string }
  | { page: "astrologer-detail"; slug: string }
  | { page: "kundli" }
  | { page: "kundli-matching" }
  | { page: "horoscope"; sign?: string }
  | { page: "tarot" }
  | { page: "wallet" }
  | { page: "profile"; tab?: "details" | "charts" | "history" | "ledger" }
  | { page: "blogs"; slug?: string }
  | { page: "support" };

// Gun Milan (36 Gunas Ashta Koota) Types
export type GunaKoota = {
  name: "Varna" | "Vashya" | "Tara" | "Yoni" | "Graha Maitri" | "Gana" | "Bhakoot" | "Nadi";
  maxPoints: number;
  obtainedPoints: number;
  description: string;
  meaning: string;
  isFavorable: boolean;
};

export type GunMilanResult = {
  boyDetails: { name: string; moonSign: string; nakshatra: string; pada: number };
  girlDetails: { name: string; moonSign: string; nakshatra: string; pada: number };
  totalScore: number;
  maxScore: 36;
  recommendation: "Excellent Match" | "Good Match" | "Average Match" | "Challenging Match";
  summary: string;
  kootas: GunaKoota[];
  manglikAnalysis: {
    boyManglik: boolean;
    girlManglik: boolean;
    isCompatible: boolean;
    remedies: string[];
    explanation: string;
  };
  classicalVerse: {
    text: string;
    source: string;
  };
};

// SEO Knowledge Hub Articles
export type ArticleCategory = "nakshatras" | "grahas" | "yogas" | "sade-sati" | "gemstones" | "transits";

export type AstrologyArticle = {
  slug: string;
  title: string;
  category: ArticleCategory;
  categoryLabel: string;
  readTime: string;
  publishedDate: string;
  author: string;
  authorRole: string;
  excerpt: string;
  headings: string[];
  content: string[];
  faqs: { question: string; answer: string }[];
  tags: string[];
};

// Saved Kundlis for Profile Management
export type SavedKundli = {
  id: string;
  relation: "Self" | "Spouse" | "Child" | "Parent" | "Friend" | "Business";
  name: string;
  gender: "male" | "female" | "other";
  dob: string;
  tob: string;
  pob: string;
  moonSign?: string;
  lagna?: string;
  savedAt: string;
};

export type PastSessionLog = {
  id: string;
  type: "call" | "chat";
  counsellorName: string;
  counsellorSlug: string;
  counsellorPortrait: string;
  date: string;
  durationMinutes: number;
  amountCharged: number;
  status: "completed" | "interrupted";
};

