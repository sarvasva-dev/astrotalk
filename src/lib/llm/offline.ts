import { LLMMessage, LLMRequestOptions, LLMResponse } from './types.js';

const OFFLINE_RESPONSES = [
  "Om Namah Shivaya. Based on your birth chart alignments, Jupiter (Guru) is presently placing strong focus on your 10th house of career and karma. Stay patient and maintain steady action.",
  "Your current Mahadasha alignment indicates a period of introspection and internal growth. Focus on daily meditation, offering water to Surya Dev in the morning, and staying true to your core purpose.",
  "Astrological charts show favorable planetary transits coming in the next 14 days. Avoid making impulsive financial commitments right now; instead, focus on strengthening your relationships.",
  "Namaste. According to Vedic Jyotish, maintaining focus on righteous action (Dharma) during Rahu sub-periods yields immense spiritual and material resilience. Keep your morning routines sacred.",
];

export async function callOffline(
  messages: LLMMessage[],
  options: LLMRequestOptions = {}
): Promise<LLMResponse> {
  const startTime = Date.now();
  const userMsg = messages[messages.length - 1]?.content || '';
  
  // Pick deterministic response based on hash of input message
  let hash = 0;
  for (let i = 0; i < userMsg.length; i++) {
    hash = (hash << 5) - hash + userMsg.charCodeAt(i);
    hash |= 0;
  }
  
  const index = Math.abs(hash) % OFFLINE_RESPONSES.length;
  const content = OFFLINE_RESPONSES[index];

  return {
    content,
    provider: 'offline',
    model: 'vedic-offline-engine-v1',
    latencyMs: Date.now() - startTime,
    tokensUsed: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    fromCache: true,
  };
}
