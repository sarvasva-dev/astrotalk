import { LLMMessage, LLMRequestOptions, LLMResponse } from './types.js';

export async function callGemini(
  messages: LLMMessage[],
  options: LLMRequestOptions = {}
): Promise<LLMResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment');
  }

  const startTime = Date.now();
  // Use a valid current Gemini model
  const model = 'gemini-1.5-flash';

  // Format system prompt and contents for Gemini REST API
  const contents = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const systemInstruction = options.systemPrompt
    ? { parts: [{ text: options.systemPrompt }] }
    : undefined;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents,
      systemInstruction,
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxTokens ?? 1024,
        responseMimeType: options.responseFormat === 'json' ? 'application/json' : 'text/plain',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const latencyMs = Date.now() - startTime;
  const candidate = data.candidates?.[0];
  const textOutput = candidate?.content?.parts?.[0]?.text || '';

  return {
    content: textOutput,
    provider: 'gemini',
    model,
    latencyMs,
    tokensUsed: {
      promptTokens: data.usageMetadata?.promptTokenCount,
      completionTokens: data.usageMetadata?.candidatesTokenCount,
      totalTokens: data.usageMetadata?.totalTokenCount,
    },
  };
}
