import { LLMMessage, LLMRequestOptions, LLMResponse } from './types.js';

export async function callSarvam(
  messages: LLMMessage[],
  options: LLMRequestOptions = {}
): Promise<LLMResponse> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    throw new Error('SARVAM_API_KEY is not configured in environment');
  }

  const startTime = Date.now();
  // Valid Sarvam models: sarvam-105b, sarvam-105b-conversations
  const model = 'sarvam-105b';

  const formattedMessages = options.systemPrompt 
    ? [{ role: 'system', content: options.systemPrompt }, ...messages]
    : messages;

  const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-subscription-key': apiKey,
    },
    body: JSON.stringify({
      model,
      messages: formattedMessages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sarvam API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const latencyMs = Date.now() - startTime;

  return {
    content: data.choices?.[0]?.message?.content || '',
    provider: 'sarvam',
    model,
    latencyMs,
    tokensUsed: {
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    },
  };
}
