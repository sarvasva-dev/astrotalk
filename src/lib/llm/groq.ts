import { LLMMessage, LLMRequestOptions, LLMResponse } from './types';

export async function callGroq(
  messages: LLMMessage[],
  options: LLMRequestOptions = {}
): Promise<LLMResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in environment');
  }

  const startTime = Date.now();
  // Updated to currently available Groq models
  const model = options.taskType === 'deep_reasoning' 
    ? 'llama-3.3-70b-versatile'
    : 'llama-3.3-70b-versatile';

  const formattedMessages = options.systemPrompt 
    ? [{ role: 'system', content: options.systemPrompt }, ...messages]
    : messages;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
      response_format: options.responseFormat === 'json' ? { type: 'json_object' } : undefined,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const latencyMs = Date.now() - startTime;
  let rawContent: string = data.choices?.[0]?.message?.content || '';

  // Strip <think>...</think> reasoning blocks from Qwen3 / compound models
  rawContent = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  return {
    content: rawContent,
    provider: 'groq',
    model,
    latencyMs,
    tokensUsed: {
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    },
  };
}
