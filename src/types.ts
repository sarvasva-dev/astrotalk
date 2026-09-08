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
};

export type UserProfile = {
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
  isManglik: boolean;
  currentDasha: string;
  luckyGemstone: string;
  luckyNumber: number;
  luckyColor: string;
  houses: KundliHouse[];
  summary: string;
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

