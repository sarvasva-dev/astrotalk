import { LLMProviderId, LLMTaskType, ProviderQuotaState } from './types.js';

// Default limits based on provider free tiers
const INITIAL_LIMITS: Record<LLMProviderId, { daily: number; minute: number }> = {
  groq:       { daily: 14400, minute: 30 },
  gemini:     { daily: 1500,  minute: 15 },
  sambanova:  { daily: 100000, minute: 30 },
  cerebras:   { daily: 10000, minute: 30 },
  openrouter: { daily: 1000,  minute: 20 },
  cloudflare: { daily: 10000, minute: 60 },
  nvidia:     { daily: 1000,  minute: 10 },
  grok:       { daily: 500,   minute: 10 },
  mistral:    { daily: 500,   minute: 10 },
  sarvam:     { daily: 5000,  minute: 60 },
  offline:    { daily: 999999, minute: 9999 },
};

// Recommended ordering by Task Type
const TASK_PREFERENCES: Record<LLMTaskType, LLMProviderId[]> = {
  chat_reply:       ['groq', 'sambanova', 'cerebras', 'gemini', 'openrouter', 'cloudflare', 'grok', 'nvidia', 'sarvam', 'offline'],
  structured_json:  ['gemini', 'groq', 'sambanova', 'openrouter', 'nvidia', 'sarvam', 'offline'],
  deep_reasoning:   ['groq', 'sambanova', 'nvidia', 'gemini', 'openrouter', 'grok', 'offline'],
  'hindi_vernacular': ['groq', 'sambanova', 'grok', 'sarvam', 'gemini', 'openrouter', 'offline'],
  tarot_reading:    ['groq', 'sambanova', 'cerebras', 'gemini', 'openrouter', 'offline'],
  life_timeline:    ['groq', 'gemini', 'nvidia', 'sambanova', 'grok', 'offline'],
  archetype:        ['gemini', 'groq', 'sambanova', 'openrouter', 'offline'],
};

class QuotaManager {
  private states: Map<LLMProviderId, ProviderQuotaState> = new Map();
  private minuteWindows: Map<LLMProviderId, number[]> = new Map();
  private currentDay: string = new Date().toISOString().split('T')[0];

  constructor() {
    this.initStates();
  }

  private initStates() {
    (Object.keys(INITIAL_LIMITS) as LLMProviderId[]).forEach((provider) => {
      this.states.set(provider, {
        provider,
        isEnabled: true,
        requestsToday: 0,
        dailyLimit: INITIAL_LIMITS[provider].daily,
        minuteRequests: 0,
        minuteLimit: INITIAL_LIMITS[provider].minute,
        lastUsedTimestamp: 0,
        consecutiveErrors: 0,
      });
      this.minuteWindows.set(provider, []);
    });
  }

  private checkDayReset() {
    const today = new Date().toISOString().split('T')[0];
    if (today !== this.currentDay) {
      this.currentDay = today;
      this.states.forEach((state) => {
        state.requestsToday = 0;
        state.consecutiveErrors = 0;
      });
    }
  }

  private cleanMinuteWindow(provider: LLMProviderId): number {
    const now = Date.now();
    const window = this.minuteWindows.get(provider) || [];
    const valid = window.filter((ts) => now - ts < 60000);
    this.minuteWindows.set(provider, valid);
    return valid.length;
  }

  public canUse(provider: LLMProviderId): boolean {
    this.checkDayReset();
    const state = this.states.get(provider);
    if (!state || !state.isEnabled) return false;

    // Consecutive errors cooling off (wait 60 seconds if 3+ consecutive errors)
    if (state.consecutiveErrors >= 3) {
      if (Date.now() - state.lastUsedTimestamp < 60000) {
        return false;
      }
    }

    const minuteCount = this.cleanMinuteWindow(provider);
    if (minuteCount >= state.minuteLimit) return false;
    if (state.requestsToday >= state.dailyLimit) return false;

    return true;
  }

  public recordSuccess(provider: LLMProviderId) {
    const state = this.states.get(provider);
    if (state) {
      state.requestsToday += 1;
      state.lastUsedTimestamp = Date.now();
      state.consecutiveErrors = 0;

      const window = this.minuteWindows.get(provider) || [];
      window.push(Date.now());
      this.minuteWindows.set(provider, window);
    }
  }

  public recordError(provider: LLMProviderId, errorMsg: string) {
    const state = this.states.get(provider);
    if (state) {
      state.consecutiveErrors += 1;
      state.lastErrorMsg = errorMsg;
      state.lastUsedTimestamp = Date.now();
    }
  }

  public getCandidateProviders(taskType: LLMTaskType = 'chat_reply'): LLMProviderId[] {
    const preferences = TASK_PREFERENCES[taskType] || TASK_PREFERENCES.chat_reply;
    return preferences.filter((p) => this.canUse(p));
  }

  public getAllStates(): ProviderQuotaState[] {
    this.checkDayReset();
    return Array.from(this.states.values()).map((st) => ({
      ...st,
      minuteRequests: this.cleanMinuteWindow(st.provider),
    }));
  }

  public toggleProvider(provider: LLMProviderId, isEnabled: boolean) {
    const state = this.states.get(provider);
    if (state) {
      state.isEnabled = isEnabled;
    }
  }
}

export const quotaManager = new QuotaManager();
