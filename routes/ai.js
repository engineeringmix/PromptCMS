// routes/ai.js — AI execution proxy
const express = require('express');
const { load, save, nextId, loadSettings } = require('../lib/db');
const { runPrompt, testConnection, PROVIDER_TYPES } = require('../lib/ai');
const r = express.Router();
const now = () => new Date().toISOString();

// GET /api/ai/providers — list configured providers
r.get('/providers', (req, res) => {
  const cfg = loadSettings();
  // Don't send API keys to frontend — mask them
  const safe = (cfg.providers || []).map(p => ({
    ...p,
    apiKey: p.apiKey ? '••••••••' + p.apiKey.slice(-4) : '',
    hasKey: !!p.apiKey,
  }));
  res.json(safe);
});

// GET /api/ai/types — available provider types (for setup UI)
r.get('/types', (req, res) => {
  res.json(PROVIDER_TYPES);
});

// POST /api/ai/providers — add a provider
r.post('/providers', (req, res) => {
  const { name, type, apiKey, baseUrl, defaultModel, enabled } = req.body;
  if (!name || !type) return res.status(400).json({ error: 'name and type required' });
  const cfg = loadSettings();
  const { loadSettings: ls, saveSettings } = require('../lib/db');
  const { saveSettings: ss } = require('../lib/db');
  const provider = {
    id: 'p_' + Date.now(),
    name: name.trim(), type,
    apiKey: apiKey || '',
    baseUrl: baseUrl || PROVIDER_TYPES[type]?.baseUrl || '',
    defaultModel: defaultModel || PROVIDER_TYPES[type]?.models?.[0] || '',
    enabled: enabled !== false,
    created_at: now(),
  };
  cfg.providers = cfg.providers || [];
  cfg.providers.push(provider);
  const { saveSettings: saveSet } = require('../lib/db');
  saveSet(cfg);
  res.json({ ...provider, apiKey: provider.apiKey ? '••••' + provider.apiKey.slice(-4) : '', hasKey: !!provider.apiKey });
});

// PUT /api/ai/providers/:id — update a provider
r.put('/providers/:id', (req, res) => {
  const { saveSettings } = require('../lib/db');
  const cfg = loadSettings();
  const idx = cfg.providers.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const existing = cfg.providers[idx];
  const { apiKey, ...rest } = req.body;
  cfg.providers[idx] = {
    ...existing,
    ...rest,
    // Only update API key if a real value is provided (not the masked placeholder)
    apiKey: apiKey && !apiKey.startsWith('••••') ? apiKey : existing.apiKey,
  };
  saveSettings(cfg);
  const p = cfg.providers[idx];
  res.json({ ...p, apiKey: p.apiKey ? '••••' + p.apiKey.slice(-4) : '', hasKey: !!p.apiKey });
});

// DELETE /api/ai/providers/:id
r.delete('/providers/:id', (req, res) => {
  const { saveSettings } = require('../lib/db');
  const cfg = loadSettings();
  cfg.providers = cfg.providers.filter(p => p.id !== req.params.id);
  saveSettings(cfg);
  res.json({ ok: true });
});

// POST /api/ai/providers/:id/test
r.post('/providers/:id/test', async (req, res) => {
  const cfg = loadSettings();
  const raw = cfg.providers.find(p => p.id === req.params.id);
  if (!raw) return res.status(404).json({ error: 'Provider not found' });
  const provider = {
    ...raw,
    baseUrl: (raw.baseUrl && raw.baseUrl.trim())
      ? raw.baseUrl.trim().replace(/\/$/, '')
      : (PROVIDER_TYPES[raw.type]?.baseUrl || ''),
  };
  const result = await testConnection(provider);
  res.json(result);
});

// POST /api/ai/run — execute a prompt against a provider
r.post('/run', async (req, res) => {
  const { provider_id, model, prompt, system_prompt, prompt_id, params } = req.body;
  if (!provider_id || !model || !prompt) return res.status(400).json({ error: 'provider_id, model, and prompt required' });

  const cfg = loadSettings();
  const providerRaw = cfg.providers.find(p => p.id === provider_id);
  if (!providerRaw) return res.status(404).json({ error: 'Provider not configured' });
  if (!providerRaw.enabled) return res.status(400).json({ error: 'Provider is disabled' });

  // ── KEY FIX: always resolve baseUrl from type default if saved value is empty ──
  const provider = {
    ...providerRaw,
    baseUrl: (providerRaw.baseUrl && providerRaw.baseUrl.trim())
      ? providerRaw.baseUrl.trim().replace(/\/$/, '')   // strip trailing slash
      : (PROVIDER_TYPES[providerRaw.type]?.baseUrl || ''),
  };

  try {
    const result = await runPrompt({ provider, model, prompt, systemPrompt: system_prompt || '', params: params || {} });

    // Log the run to DB if prompt_id given
    if (prompt_id) {
      const db = load();
      const pidx = db.prompts.findIndex(p => p.id == prompt_id);
      if (pidx !== -1) {
        db.prompts[pidx].use_count = (db.prompts[pidx].use_count || 0) + 1;
        db.runs.push({
          id: nextId(db), prompt_id: parseInt(prompt_id),
          provider_id, provider_name: provider.name,
          model, rendered_prompt: prompt,
          response: result.text,
          duration_ms: result.duration_ms,
          usage: result.usage || {},
          created_at: now(),
        });
        // Keep last 50 runs per prompt
        const promptRuns = db.runs.filter(r => r.prompt_id == prompt_id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        if (promptRuns.length > 50) {
          const toRemove = promptRuns.slice(50).map(r => r.id);
          db.runs = db.runs.filter(r => !toRemove.includes(r.id));
        }
        save(db);
      }
    }

    res.json({ ok: true, response: result.text, model, provider: provider.name, duration_ms: result.duration_ms, usage: result.usage });
  } catch (e) {
    const msg = e.response?.data?.error?.message || e.response?.data?.message || e.message;
    res.status(500).json({ error: msg || 'AI call failed' });
  }
});

// GET /api/ai/stats — aggregated usage stats
r.get('/stats', (req, res) => {
  const db = load();
  const totalRuns = db.runs.length;
  const byProvider = {};
  const byModel = {};
  db.runs.forEach(r => {
    byProvider[r.provider_name] = (byProvider[r.provider_name] || 0) + 1;
    byModel[r.model] = (byModel[r.model] || 0) + 1;
  });
  const totalPrompts = db.prompts.length;
  const totalUses    = db.prompts.reduce((s, p) => s + (p.use_count || 0), 0);
  const totalFavs    = db.prompts.filter(p => p.is_favorite).length;
  const totalVersions= db.versions.length;
  const topPrompts   = [...db.prompts].sort((a, b) => b.use_count - a.use_count).slice(0, 5);
  const byCategory   = {};
  const catMap = {};
  db.categories.forEach(c => { catMap[c.id] = c; byCategory[c.id] = { ...c, count: 0 }; });
  db.prompts.forEach(p => { if (p.category_id && byCategory[p.category_id]) byCategory[p.category_id].count++; });
  const allTags = {};
  db.prompts.forEach(p => (p.tags || []).forEach(t => { allTags[t] = (allTags[t] || 0) + 1; }));
  const topTags = Object.entries(allTags).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([tag, count]) => ({ tag, count }));

  res.json({ totalPrompts, totalUses, totalFavs, totalVersions, totalRuns, byProvider, byModel, topPrompts, byCategory: Object.values(byCategory), topTags });
});

module.exports = r;
