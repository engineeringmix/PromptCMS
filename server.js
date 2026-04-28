// server.js — PMS v2.0 Entry Point
// ─────────────────────────────────────────────────────────────────────────────
//  Prompt Management System — Free & Local-First
//  GitHub: https://github.com/your-username/prompt-management-system
// ─────────────────────────────────────────────────────────────────────────────
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const { seed } = require('./lib/seed');

const app  = express();
const PORT = process.env.PORT || 5500;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/prompts',     require('./routes/prompts'));
app.use('/api/categories',  require('./routes/categories'));
app.use('/api/collections', require('./routes/collections'));
app.use('/api/ai',          require('./routes/ai'));
app.use('/api/settings',    require('./routes/settings'));
app.use('/api/tags',        require('./routes/settings')); // tags endpoint lives in settings

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Boot ──────────────────────────────────────────────────────────────────────
seed(); // only runs if DB is empty

app.listen(PORT, () => {
  console.log('\n┌─────────────────────────────────────────────────┐');
  console.log('│  📚  PMS — Prompt Management System  v2.0       │');
  console.log('│                                                   │');
  console.log(`│  🚀  Running → http://localhost:${PORT}            │`);
  console.log('│  💾  Data    → ./data/pms.json                   │');
  console.log('│  🔧  Config  → ./data/settings.json              │');
  console.log('└─────────────────────────────────────────────────┘\n');
});
