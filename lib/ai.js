// lib/ai.js — Universal AI Provider Integration Layer
const axios = require('axios');

// ── Provider type definitions ────────────────────────────────────────────────
const PROVIDER_TYPES = {
  openai: {
    label: 'OpenAI', icon: '⚡', baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o','gpt-4o-mini','gpt-4-turbo','gpt-4','gpt-3.5-turbo','o1-preview','o1-mini'],
    authType: 'bearer',
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  anthropic: {
    label: 'Anthropic', icon: '🔬', baseUrl: 'https://api.anthropic.com',
    models: ['claude-opus-4-5','claude-sonnet-4-5','claude-haiku-4-5-20251001','claude-3-5-sonnet-20241022','claude-3-opus-20240229'],
    authType: 'x-api-key',
    docsUrl: 'https://console.anthropic.com/settings/keys',
  },
  google: {
    label: 'Google Gemini', icon: '🌟', baseUrl: 'https://generativelanguage.googleapis.com',
    models: ['gemini-2.0-flash','gemini-1.5-pro','gemini-1.5-flash','gemini-1.0-pro'],
    authType: 'query',
    docsUrl: 'https://aistudio.google.com/app/apikey',
  },
  groq: {
    label: 'Groq', icon: '⚡', baseUrl: 'https://api.groq.com/openai/v1',
    models: ['llama-3.3-70b-versatile','llama-3.1-8b-instant','mixtral-8x7b-32768','gemma2-9b-it','llama3-70b-8192'],
    authType: 'bearer',
    docsUrl: 'https://console.groq.com/keys',
  },
  mistral: {
    label: 'Mistral AI', icon: '🌀', baseUrl: 'https://api.mistral.ai/v1',
    models: ['mistral-large-latest','mistral-medium-latest','mistral-small-latest','open-mistral-7b','open-mixtral-8x7b'],
    authType: 'bearer',
    docsUrl: 'https://console.mistral.ai/api-keys',
  },
  openrouter: {
    label: 'OpenRouter', icon: '🔀', baseUrl: 'https://openrouter.ai/api/v1',
    models: ['meta-llama/llama-3.1-70b-instruct','google/gemini-pro-1.5','anthropic/claude-3.5-sonnet','mistralai/mixtral-8x7b-instruct','cohere/command-r-plus'],
    authType: 'bearer',
    docsUrl: 'https://openrouter.ai/keys',
  },
  ollama: {
    label: 'Ollama (Local)', icon: '🦙', baseUrl: 'http://localhost:11434',
    models: ['llama3.2','llama3.1','mistral','gemma2','qwen2.5','phi3','codellama','deepseek-coder'],
    authType: 'none',
    docsUrl: 'https://ollama.com',
  },
  cohere: {
    label: 'Cohere', icon: '🎯', baseUrl: 'https://api.cohere.ai/v1',
    models: ['command-r-plus','command-r','command','command-light'],
    authType: 'bearer',
    docsUrl: 'https://dashboard.cohere.com/api-keys',
  },
  custom: {
    label: 'Custom (OpenAI-compatible)', icon: '🔧', baseUrl: '',
    models: [],
    authType: 'bearer',
    docsUrl: '',
  },
};

// ── Caller functions per provider ─────────────────────────────────────────────
async function callOpenAICompatible(provider, model, messages, systemPrompt, params = {}) {
  const msgs = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  const response = await axios.post(
    `${provider.baseUrl}/chat/completions`,
    {
      model,
      messages: msgs,
      max_tokens: params.maxTokens || 4096,
      temperature: params.temperature !== undefined ? params.temperature : 0.7,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
        ...(provider.type === 'openrouter' ? {
          'HTTP-Referer': 'https://github.com/engineeringmix/prompt-management-system',
          'X-Title': 'PMS — Prompt Management System',
        } : {}),
      },
      timeout: 60000,
    }
  );
  const choice = response.data.choices[0];
  return {
    text: choice.message.content,
    model,
    usage: response.data.usage || {},
    finishReason: choice.finish_reason,
  };
}

async function callAnthropic(provider, model, messages, systemPrompt, params = {}) {
  const response = await axios.post(
    `${provider.baseUrl}/v1/messages`,
    {
      model,
      max_tokens: params.maxTokens || 4096,
      ...(systemPrompt ? { system: systemPrompt } : {}),
      messages,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': provider.apiKey,
        'anthropic-version': '2023-06-01',
      },
      timeout: 60000,
    }
  );
  return {
    text: response.data.content[0].text,
    model,
    usage: response.data.usage || {},
    finishReason: response.data.stop_reason,
  };
}

async function callGoogle(provider, model, messages, systemPrompt, params = {}) {
  const lastMsg = messages[messages.length - 1];
  const parts = [{ text: systemPrompt ? `${systemPrompt}\n\n${lastMsg.content}` : lastMsg.content }];

  const response = await axios.post(
    `${provider.baseUrl}/v1beta/models/${model}:generateContent?key=${provider.apiKey}`,
    {
      contents: [{ parts }],
      generationConfig: {
        maxOutputTokens: params.maxTokens || 4096,
        temperature: params.temperature !== undefined ? params.temperature : 0.7,
      },
    },
    { headers: { 'Content-Type': 'application/json' }, timeout: 60000 }
  );
  const candidate = response.data.candidates[0];
  return {
    text: candidate.content.parts[0].text,
    model,
    usage: response.data.usageMetadata || {},
    finishReason: candidate.finishReason,
  };
}

async function callOllama(provider, model, messages, systemPrompt, params = {}) {
  const msgs = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  const response = await axios.post(
    `${provider.baseUrl}/api/chat`,
    { model, messages: msgs, stream: false,
      options: { temperature: params.temperature !== undefined ? params.temperature : 0.7 } },
    { headers: { 'Content-Type': 'application/json' }, timeout: 120000 }
  );
  return {
    text: response.data.message.content,
    model,
    usage: { total_tokens: response.data.eval_count || 0 },
    finishReason: 'stop',
  };
}

async function callCohere(provider, model, messages, systemPrompt, params = {}) {
  const lastMsg = messages[messages.length - 1];
  const response = await axios.post(
    `${provider.baseUrl}/chat`,
    {
      model,
      message: lastMsg.content,
      ...(systemPrompt ? { preamble: systemPrompt } : {}),
      max_tokens: params.maxTokens || 4096,
      temperature: params.temperature !== undefined ? params.temperature : 0.7,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
      },
      timeout: 60000,
    }
  );
  return {
    text: response.data.text,
    model,
    usage: response.data.meta?.billed_units || {},
    finishReason: response.data.finish_reason,
  };
}

// ── Main dispatch ──────────────────────────────────────────────────────────────
async function runPrompt({ provider, model, prompt, systemPrompt, params = {} }) {
  const messages = [{ role: 'user', content: prompt }];
  const t0 = Date.now();

  let result;
  switch (provider.type) {
    case 'anthropic':
      result = await callAnthropic(provider, model, messages, systemPrompt, params);
      break;
    case 'google':
      result = await callGoogle(provider, model, messages, systemPrompt, params);
      break;
    case 'ollama':
      result = await callOllama(provider, model, messages, systemPrompt, params);
      break;
    case 'cohere':
      result = await callCohere(provider, model, messages, systemPrompt, params);
      break;
    // openai, groq, mistral, openrouter, custom all use OpenAI-compatible format
    default:
      result = await callOpenAICompatible(provider, model, messages, systemPrompt, params);
  }

  return { ...result, duration_ms: Date.now() - t0 };
}

// ── Test connection ────────────────────────────────────────────────────────────
async function testConnection(provider) {
  try {
    await runPrompt({
      provider, model: provider.defaultModel,
      prompt: 'Reply with exactly: "PMS connection OK"',
      systemPrompt: '', params: { maxTokens: 20, temperature: 0 }
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.response?.data?.error?.message || e.message };
  }
}

module.exports = { PROVIDER_TYPES, runPrompt, testConnection };
