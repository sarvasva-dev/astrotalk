import { LLMMessage, LLMRequestOptions, LLMResponse } from './types';

export async function callSambaNova(
  messages: LLMMessage[],
  options: LLMRequestOptions = {}
): Promise<LLMResponse> {
  const apiKey = process.env.SAMBANOVA_API_KEY;
  if (!apiKey) {
    throw new Error('SAMBANOVA_API_KEY is not configured in environment');
  }

  const startTime = Date.now();
  const model = options.taskType === 'deep_reasoning' 
    ? 'DeepSeek-R1' 
    : 'Meta-Llama-3.3-70B-Instruct';

  const formattedMessages = options.systemPrompt 
    ? [{ role: 'system', content: options.systemPrompt }, ...messages]
    : messages;

  const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
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
    throw new Error(`SambaNova API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const latencyMs = Date.now() - startTime;

  return {
    content: data.choices?.[0]?.message?.content || '',
    provider: 'sambanova',
    model,
    latencyMs,
    tokensUsed: {
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    },
  };
}
