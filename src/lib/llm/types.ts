export type LLMProviderId = 
  | 'groq'
  | 'gemini'
  | 'sambanova'
  | 'cerebras'
  | 'openrouter'
  | 'cloudflare'
  | 'nvidia'
  | 'grok'
  | 'mistral'
  | 'sarvam'
  | 'offline';

export type LLMTaskType = 
  | 'chat_reply'
  | 'structured_json'
  | 'deep_reasoning'
  | 'hindi_vernacular'
  | 'tarot_reading'
  | 'life_timeline'
  | 'archetype';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequestOptions {
  taskType?: LLMTaskType;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  responseFormat?: 'text' | 'json';
  providerHint?: string;
}

export interface LLMResponse {
  content: string;
  provider: LLMProviderId;
  model: string;
  latencyMs: number;
  tokensUsed?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  fromCache?: boolean;
}

export interface ProviderQuotaState {
  provider: LLMProviderId;
  isEnabled: boolean;
  requestsToday: number;
  dailyLimit: number;
  minuteRequests: number;
  minuteLimit: number;
  lastUsedTimestamp: number;
  consecutiveErrors: number;
  lastErrorMsg?: string;
}

export interface LLMRequestLog {
  id: string;
  timestamp: string;
  taskType: LLMTaskType;
  provider: LLMProviderId;
  model: string;
  latencyMs: number;
  status: 'success' | 'failover' | 'error';
  errorMessage?: string;
  userId?: string;
}
