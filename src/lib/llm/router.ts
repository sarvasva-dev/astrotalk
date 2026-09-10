import { LLMMessage, LLMRequestOptions, LLMResponse, LLMProviderId } from './types.js';
import { quotaManager } from './quotaManager.js';
import { callGroq } from './groq.js';
import { callGemini } from './gemini.js';
import { callSambaNova } from './sambanova.js';
import { callOpenRouter } from './openrouter.js';
import { callSarvam } from './sarvam.js';
import { callOffline } from './offline.js';

// Stub for providers that don't have active API keys yet
async function notConfigured(provider: string): Promise<LLMResponse> {
  throw new Error(`Provider '${provider}' has no active API key configured. Skipping.`);
}

const PROVIDER_HANDLERS: Record<LLMProviderId, (messages: LLMMessage[], opts?: LLMRequestOptions) => Promise<LLMResponse>> = {
  groq:       callGroq,
  gemini:     callGemini,
  sambanova:  callSambaNova,
  openrouter: callOpenRouter,
  sarvam:     callSarvam,
  offline:    callOffline,
  // Providers with no active keys — skip immediately and move to next
  cerebras:   () => notConfigured('cerebras'),
  cloudflare: () => notConfigured('cloudflare'),
  nvidia:     () => notConfigured('nvidia'),
  grok:       () => notConfigured('grok'),
  mistral:    () => notConfigured('mistral'),
};

export async function routeLLMRequest(
  messages: LLMMessage[],
  options: LLMRequestOptions = {}
): Promise<LLMResponse> {
  const taskType = options.taskType || 'chat_reply';
  
  if (options.providerHint && PROVIDER_HANDLERS[options.providerHint as LLMProviderId]) {
    const providerId = options.providerHint as LLMProviderId;
    const handler = PROVIDER_HANDLERS[providerId];
    try {
      console.log(`[LLMRouter] Attempting forced provider: ${providerId}`);
      const response = await handler(messages, options);
      quotaManager.recordSuccess(providerId);
      return response;
    } catch (err: any) {
      console.warn(`[LLMRouter] Forced provider ${providerId} failed: ${err?.message || err}`);
      quotaManager.recordError(providerId, err?.message || String(err));
    }
  }

  const candidates = quotaManager.getCandidateProviders(taskType);

  if (candidates.length === 0) {
    // If no candidate available, forced offline fallback
    return callOffline(messages, options);
  }

  const errors: Array<{ provider: LLMProviderId; error: string }> = [];

  for (const providerId of candidates) {
    const handler = PROVIDER_HANDLERS[providerId];
    if (!handler) continue;

    try {
      console.log(`[LLMRouter] Attempting provider: ${providerId} for task: ${taskType}`);
      const response = await handler(messages, options);
      quotaManager.recordSuccess(providerId);
      console.log(`[LLMRouter] Success via ${providerId} (${response.latencyMs}ms)`);
      return response;
    } catch (err: any) {
      const errorMsg = err?.message || String(err);
      console.warn(`[LLMRouter] Provider ${providerId} failed: ${errorMsg}`);
      quotaManager.recordError(providerId, errorMsg);
      errors.push({ provider: providerId, error: errorMsg });
    }
  }

  // If all candidate external providers failed, fallback to offline
  console.warn('[LLMRouter] All LLM providers failed. Executing offline fallback.');
  return callOffline(messages, options);
}
