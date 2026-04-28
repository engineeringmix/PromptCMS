// routes/settings.js
const express = require('express');
const { load, save, loadSettings, saveSettings } = require('../lib/db');
const r = express.Router();
const now = () => new Date().toISOString();

// UI Settings
r.get('/', (req, res) => { res.json(loadSettings().ui || {}); });
r.put('/', (req, res) => {
  const cfg = loadSettings(); cfg.ui = { ...(cfg.ui || {}), ...req.body };
  saveSettings(cfg); res.json(cfg.ui);
});

// Tags list
r.get('/tags', (req, res) => {
  const db = load(); const tags = {};
  db.prompts.forEach(p => (p.tags || []).forEach(t => { tags[t] = (tags[t] || 0) + 1; }));
  res.json(Object.entries(tags).sort((a, b) => b[1] - a[1]).map(([tag, count]) => ({ tag, count })));
});

// Export
r.get('/export', (req, res) => {
  const db = load();
  const data = {
    version: '2.0.0', exported_at: now(),
    categories: db.categories, prompts: db.prompts,
    collections: db.collections, collection_prompts: db.collection_prompts,
  };
  res.setHeader('Content-Disposition', `attachment; filename="pms-export-${now().slice(0,10)}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(data, null, 2));
});

// Import
r.post('/import', (req, res) => {
  const { data, mode } = req.body;
  if (!data) return res.status(400).json({ error: 'No data provided' });
  try {
    const imported = typeof data === 'string' ? JSON.parse(data) : data;
    const db = load();
    let added = { prompts: 0, categories: 0 };
    if (mode === 'replace') {
      db.prompts = []; db.categories = []; db.collections = []; db.collection_prompts = []; db.versions = []; db.runs = [];
    }
    (imported.categories || []).forEach(c => {
      if (!db.categories.find(x => x.name === c.name)) {
        const { load: _l, save: _s, nextId: ni } = require('../lib/db');
        db.categories.push({ ...c, id: db.meta.nextId++ }); added.categories++;
      }
    });
    (imported.prompts || []).forEach(p => {
      if (!db.prompts.find(x => x.title === p.title)) {
        p.id = db.meta.nextId++;
        db.prompts.push(p);
        db.versions.push({ id: db.meta.nextId++, prompt_id: p.id, version_num: 1, content: p.content, note: 'Imported', created_at: now() });
        added.prompts++;
      }
    });
    save(db);
    res.json({ ok: true, added });
  } catch (e) {
    res.status(400).json({ error: 'Invalid data: ' + e.message });
  }
});

module.exports = r;
