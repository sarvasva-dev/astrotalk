import { LLMMessage, LLMRequestOptions, LLMResponse } from './types.js';

export async function callOpenRouter(
  messages: LLMMessage[],
  options: LLMRequestOptions = {}
): Promise<LLMResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured in environment');
  }

  const startTime = Date.now();
  // Updated to currently available OpenRouter free models (Sep 2026)
  const model = options.taskType === 'structured_json'
    ? 'meta-llama/llama-3.3-70b-instruct:free'
    : 'meta-llama/llama-3.3-70b-instruct:free';

  const formattedMessages = options.systemPrompt 
    ? [{ role: 'system', content: options.systemPrompt }, ...messages]
    : messages;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://astroguru247.com',
      'X-Title': 'AstroGuru 247',
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
    throw new Error(`OpenRouter API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const latencyMs = Date.now() - startTime;

  return {
    content: data.choices?.[0]?.message?.content || '',
    provider: 'openrouter',
    model,
    latencyMs,
    tokensUsed: {
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    },
  };
}
