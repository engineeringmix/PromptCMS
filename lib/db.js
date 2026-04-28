// lib/db.js — Local JSON database for PMS
const fs   = require('fs');
const path = require('path');

const DATA_DIR    = path.join(__dirname, '..', 'data');
const DB_FILE     = path.join(DATA_DIR, 'pms.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ── Generic read/write ──────────────────────────────────────────────────────
function readFile(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch { return fallback; }
}

function writeFile(filePath, data) {
  ensureDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// ── DB ─────────────────────────────────────────────────────────────────────
const EMPTY_DB = () => ({
  categories: [], prompts: [], versions: [],
  collections: [], collection_prompts: [], runs: [],
  meta: { version: '2.0.0', created: new Date().toISOString(), nextId: 1 }
});

function load()    { return readFile(DB_FILE, EMPTY_DB()); }
function save(db)  { writeFile(DB_FILE, db); }
function nextId(db){ const id = db.meta.nextId; db.meta.nextId++; return id; }

// ── Settings ───────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = () => ({
  providers: [],
  ui: { theme: 'dark', defaultView: 'grid', defaultProvider: null },
  meta: { version: '2.0.0' }
});

function loadSettings()    { return readFile(SETTINGS_FILE, DEFAULT_SETTINGS()); }
function saveSettings(cfg) { writeFile(SETTINGS_FILE, cfg); }

module.exports = { load, save, nextId, loadSettings, saveSettings, EMPTY_DB };
