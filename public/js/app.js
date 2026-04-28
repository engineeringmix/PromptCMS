// public/js/app.js — PMS v2.1  (bug-fixed + SVG icons + custom dropdown)
'use strict';

// ── API helpers ──────────────────────────────────────────────────────────────
const _api = async (method, url, body) => {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, data };
};
const get  = async (url)    => (await _api('GET',    url)).data;
const post = async (url, b) => (await _api('POST',   url, b)).data;
const put  = async (url, b) => (await _api('PUT',    url, b)).data;
const del  = async (url)    => (await _api('DELETE', url)).data;

// ── SVG Icon System ───────────────────────────────────────────────────────────
const IC = {
  book:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  star:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  starFill:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.75"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  pin:       `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>`,
  folder:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  search:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  plus:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  edit:      `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  play:      `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  copy:      `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  duplicate: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M3 16V5a2 2 0 0 1 2-2h11"/></svg>`,
  trash:     `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,
  close:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  chevDown:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  check:     `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  grid:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  list:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  chart:     `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
  settings:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  upload:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  download:  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  plug:      `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="m6 6 12 12"/><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 11V3"/></svg>`,
  tag:       `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  clock:     `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  zap:       `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  sort:      `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="9" y1="18" x2="15" y2="18"/></svg>`,
  save:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
  send:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  variable:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/></svg>`,
  code:      `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  refresh:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
};

// ── State ─────────────────────────────────────────────────────────────────────
const S = {
  view: 'all', layout: 'grid',
  categories: [], collections: [], providers: [], providerTypes: {},
  selectedIds: new Set(),
  editingId: null, detailData: null,
  catEditId: null, colEditId: null, addProvEditId: null,
  catColor: '#6366f1', colColor: '#6366f1',
  editorTags: [], filterTag: null,
  confirmCb: null, settingsTab: 'providers',
  provTypeSelected: null,
};

const PALETTE = [
  '#6366f1','#ec4899','#22c55e','#f59e0b','#06b6d4',
  '#a78bfa','#f97316','#ef4444','#14b8a6','#3b82f6',
];

// Registry of all PmsSelect instances
const SELECTS = {};

// ── DOM helpers ───────────────────────────────────────────────────────────────
const $    = id => document.getElementById(id);
const mk   = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; return e; };
const mki  = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
const esc  = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const deb  = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const fmtD = iso => {
  try {
    const d = new Date(iso), now = new Date(), diff = (now - d) / 1000;
    if (diff < 60)     return 'just now';
    if (diff < 3600)   return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400)  return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    return d.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'2-digit' });
  } catch { return '—'; }
};
const vars  = c => [...new Set((c.match(/\{\{([^}]+)\}\}/g)||[]).map(m => m.replace(/\{\{|\}\}/g,'').trim()))];
const tkns  = t => Math.round((t||'').length / 4);

// ── Notifications ─────────────────────────────────────────────────────────────
let _nt, _tt;
function toast(msg, type = 'info') {
  const e = $('toast'); e.textContent = msg; e.className = 'show ' + type;
  clearTimeout(_tt); _tt = setTimeout(() => e.className = '', 2500);
}
function notif(msg, type = 'info') {
  const e = $('notif'); e.textContent = msg; e.className = 'show';
  const colors = { error:'rgba(239,68,68,.4)', success:'rgba(34,197,94,.4)', info:'rgba(99,102,241,.4)' };
  const text   = { error:'var(--red)', success:'var(--green)', info:'var(--ind-lt)' };
  e.style.borderColor = colors[type] || colors.info;
  e.style.color = text[type] || text.info;
  clearTimeout(_nt); _nt = setTimeout(() => e.className = '', 3500);
}

// ════════════════════════════════════════════════════════════════════════════
//  CUSTOM SELECT COMPONENT  — replaces all <select> dropdowns
// ════════════════════════════════════════════════════════════════════════════
class PmsSelect {
  constructor({ id, options = [], value = '', placeholder = 'Select…', onChange = () => {}, width = '100%', searchable = false }) {
    this.id = id; this.options = options; this._v = value;
    this.placeholder = placeholder; this.onChange = onChange;
    this.width = width; this.searchable = searchable;
    this._open = false; this._q = ''; this._fi = -1;
    this._trig = null; this._drop = null; this._list = null;
  }

  get value() { return this._v; }
  set value(v) { this._v = v; this._trig && this._rt(); this._list && this._rl(); }
  setOptions(opts) { this.options = opts; this._list && this._rl(); }

  mount(container) {
    const wrap = mk('div','pms-sel-wrap'); wrap.style.width = this.width;

    const trig = mki('button','pms-sel-trig',''); trig.type = 'button';
    this._trig = trig; this._rt();
    trig.addEventListener('click', e => { e.stopPropagation(); this._tog(); });
    trig.addEventListener('keydown', e => this._kt(e));

    const drop = mk('div','pms-sel-drop'); drop.style.display = 'none';
    this._drop = drop;

    if (this.searchable) {
      const si = mki('div','pms-sel-sw', `<span class="pms-sel-si">${IC.search}</span>`);
      const inp = mk('input','pms-sel-search'); inp.placeholder = 'Search…'; inp.autocomplete = 'off';
      inp.addEventListener('input', ev => { this._q = ev.target.value.toLowerCase(); this._fi = -1; this._rl(); });
      inp.addEventListener('keydown', e => this._ks(e));
      si.appendChild(inp); drop.appendChild(si);
    }

    const list = mk('div','pms-sel-list'); drop.appendChild(list); this._list = list; this._rl();
    wrap.appendChild(trig); wrap.appendChild(drop); container.appendChild(wrap);

    document.addEventListener('click', e => { if (this._open && !wrap.contains(e.target)) this._cl(); });
    return wrap;
  }

  _rt() {
    const o = this.options.find(x => String(x.value) === String(this._v));
    const inner = o
      ? `<span class="pms-sel-lbl">${o.icon ? `<span>${o.icon}</span>` : ''}<span>${esc(o.label)}</span></span>`
      : `<span class="pms-sel-lbl" style="color:var(--t3)">${esc(this.placeholder)}</span>`;
    this._trig.innerHTML = inner + `<span class="pms-sel-arr">${IC.chevDown}</span>`;
  }

  _rl() {
    const filtered = this._q ? this.options.filter(o => o.label.toLowerCase().includes(this._q)) : this.options;
    this._list.innerHTML = '';
    if (!filtered.length) { this._list.innerHTML = '<div class="pms-sel-empty">No options</div>'; return; }
    filtered.forEach((o, i) => {
      const item = mk('div', 'pms-sel-item' + (String(o.value) === String(this._v) ? ' selected' : '') + (i === this._fi ? ' focused' : ''));
      item.dataset.v = o.value;
      if (o.icon) { const ic = mki('span','',o.icon); item.appendChild(ic); }
      item.appendChild(mk('span','',o.label));
      if (String(o.value) === String(this._v)) { const ch = mki('span','pms-sel-chk',IC.check); item.appendChild(ch); }
      item.addEventListener('mousedown', e => { e.preventDefault(); this._sel(o.value); });
      item.addEventListener('mouseenter', () => { this._fi = i; this._hf(); });
      this._list.appendChild(item);
    });
  }

  _hf() { [...this._list.children].forEach((el,i) => el.classList.toggle('focused', i === this._fi)); const f = this._list.children[this._fi]; if(f) f.scrollIntoView({ block:'nearest' }); }
  _tog() { this._open ? this._cl() : this._op(); }
  _op() {
    this._open = true; this._drop.style.display = 'block'; this._trig.classList.add('open');
    this._q = ''; this._fi = -1;
    if (this.searchable) { const si = this._drop.querySelector('.pms-sel-search'); if(si){ si.value=''; setTimeout(() => si.focus(), 30); } }
    this._rl();
    const rect = this._trig.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom;
    this._drop.style.top    = below < 220 ? 'auto' : (this._trig.offsetHeight + 2) + 'px';
    this._drop.style.bottom = below < 220 ? (this._trig.offsetHeight + 2) + 'px' : 'auto';
  }
  _cl() { this._open = false; this._drop.style.display = 'none'; this._trig.classList.remove('open'); }
  _sel(v) { this._v = v; this._rt(); this._rl(); this._cl(); this.onChange(v); }
  _kt(e) { if (['Enter',' ','ArrowDown'].includes(e.key)) { e.preventDefault(); this._open ? this._ks(e) : this._op(); } if (e.key==='Escape') this._cl(); }
  _ks(e) {
    const items = [...this._list.querySelectorAll('.pms-sel-item')];
    if (e.key==='ArrowDown') { e.preventDefault(); this._fi = Math.min(this._fi+1, items.length-1); this._hf(); }
    if (e.key==='ArrowUp')   { e.preventDefault(); this._fi = Math.max(this._fi-1, 0); this._hf(); }
    if (e.key==='Enter')     { e.preventDefault(); if(items[this._fi]) this._sel(items[this._fi].dataset.v); }
    if (e.key==='Escape')    this._cl();
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
async function init() {
  _buildSwatches();
  _mountSortSelect();
  await Promise.all([loadSidebar(), loadProviders(), loadProviderTypes()]);
  renderPromptsView();
  _bindEvents();
}

function _buildSwatches() {
  ['cat-swatches','col-swatches'].forEach(id => {
    const w = $(id); if (!w) return;
    PALETTE.forEach(c => {
      const s = mk('div','col-swatch'); s.style.background = c; s.dataset.color = c;
      s.addEventListener('click', () => {
        w.querySelectorAll('.col-swatch').forEach(x => x.classList.remove('active'));
        s.classList.add('active');
        if (id === 'cat-swatches') S.catColor = c; else S.colColor = c;
      });
      w.appendChild(s);
    });
    w.children[0]?.classList.add('active');
  });
}

function _mountSortSelect() {
  const w = $('sort-sel-wrap'); if (!w) return;
  const sel = new PmsSelect({
    id: 'sort', width: '140px',
    options: [
      { value:'newest', label:'Newest',    icon: IC.clock },
      { value:'oldest', label:'Oldest',    icon: IC.clock },
      { value:'alpha',  label:'A → Z',     icon: IC.sort  },
      { value:'used',   label:'Most Used', icon: IC.zap   },
    ],
    value: 'newest',
    onChange: () => renderPromptsView(),
  });
  sel.mount(w); SELECTS['sort'] = sel;
}

function _bindEvents() {
  $('global-search').addEventListener('input', deb(renderPromptsView, 280));
  document.addEventListener('keydown', e => {
    if ((e.metaKey||e.ctrlKey) && e.key === 'k') { e.preventDefault(); $('global-search').focus(); }
    if (e.key === 'Escape') closeAllModals();
  });
  document.querySelectorAll('.overlay').forEach(ov => {
    ov.addEventListener('click', e => { if (e.target === ov) ov.classList.remove('open'); });
  });
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
async function loadSidebar() {
  const [cats, cols, stats] = await Promise.all([
    get('/api/categories'), get('/api/collections'), get('/api/ai/stats'),
  ]);
  S.categories  = cats  || [];
  S.collections = cols  || [];

  setText('cnt-all',  stats.totalPrompts || 0);
  setText('cnt-fav',  stats.totalFavs    || 0);
  setText('cnt-col',  (cols||[]).length);
  setText('mini-prompts', stats.totalPrompts || 0);
  setText('mini-uses',    stats.totalUses    || 0);

  const pinned = await get('/api/prompts?pinned=1');
  setText('cnt-pin', (pinned||[]).length);

  // Category nav
  const catNav = $('cat-nav'); catNav.innerHTML = '';
  S.categories.forEach(c => {
    const item = mk('div', 'nav-item' + (S.view === 'cat_'+c.id ? ' active' : ''));
    item.dataset.view = 'cat_' + c.id;
    const dot = mk('span','cat-dot'); dot.style.background = c.color; item.appendChild(dot);
    const lb  = mk('span','',''); lb.textContent = (c.icon||'') + ' ' + c.name; item.appendChild(lb);
    const cnt = mk('span','nav-count',''); cnt.textContent = c.count||0; item.appendChild(cnt);
    item.addEventListener('click', () => showView('cat_'+c.id, (c.icon||'') + ' ' + c.name));
    item.addEventListener('dblclick', e => { e.stopPropagation(); openEditCat(c); });
    catNav.appendChild(item);
  });

  // Tag nav
  const tagData = await get('/api/settings/tags');
  const tagNav  = $('tag-nav'); tagNav.innerHTML = '';
  (tagData||[]).slice(0, 8).forEach(({ tag, count }) => {
    const item = mk('div', 'nav-item' + (S.filterTag === tag ? ' active' : ''));
    item.dataset.view = 'tag_' + tag;
    const ico = mki('span','nav-icon', IC.tag); item.appendChild(ico);
    const lb  = mk('span','',''); lb.textContent = tag; item.appendChild(lb);
    const cnt = mk('span','nav-count',''); cnt.textContent = count; item.appendChild(cnt);
    item.addEventListener('click', () => { S.filterTag = S.filterTag === tag ? null : tag; loadSidebar(); renderPromptsView(); });
    tagNav.appendChild(item);
  });

  _syncCatSelect();
}

function setText(id, val) { const e = $(id); if (e) e.textContent = val; }

function _syncCatSelect() {
  const opts = [
    { value:'', label:'— Uncategorized —' },
    ...S.categories.map(c => ({ value: String(c.id), label: (c.icon||'') + ' ' + c.name })),
  ];
  const sel = SELECTS['ef-category'];
  if (sel) sel.setOptions(opts);
}

// ── View router ───────────────────────────────────────────────────────────────
function showView(view, label) {
  S.view = view; clearSel();
  document.querySelectorAll('.nav-item[data-view]').forEach(n => n.classList.toggle('active', n.dataset.view === view));
  const area = $('content'); area.innerHTML = '';
  if (view === 'collections') { renderCollections(); setText('content-title','Collections'); return; }
  if (view === 'settings')    { renderSettings();    setText('content-title','Settings & AI Providers'); return; }
  if (view === 'stats')       { renderStats();       setText('content-title','Statistics'); return; }
  const titles = { all:'All Prompts', favorites:'Favorites', pinned:'Pinned' };
  setText('content-title', label || titles[view] || 'Prompts');
  renderPromptsView();
}

// ── Prompt list ───────────────────────────────────────────────────────────────
async function renderPromptsView() {
  // Snapshot view BEFORE await — prevents race condition where slow fetch renders into wrong view
  const snap = S.view;
  const params = new URLSearchParams();
  const q    = $('global-search').value.trim();
  const sort = SELECTS['sort']?.value || 'newest';
  if (q) params.set('q', q);
  params.set('sort', sort);
  if (S.filterTag) params.set('tag', S.filterTag);
  if (snap === 'favorites') params.set('favorite','1');
  if (snap === 'pinned')    params.set('pinned','1');
  if (snap.startsWith('cat_')) params.set('category', snap.replace('cat_',''));
  if (snap.startsWith('collection_')) {
    const cid = snap.replace('collection_','');
    const prompts = await get('/api/collections/' + cid + '/prompts');
    if (S.view === snap) _renderCards(prompts || []);
    return;
  }
  const prompts = await get('/api/prompts?' + params.toString());
  if (S.view === snap) _renderCards(prompts || []);
}

function _renderCards(prompts) {
  const area = $('content'); area.innerHTML = '';
  if (!prompts.length) {
    const e = mk('div','empty');
    const ei = mki('div','empty-icon', IC.book); e.appendChild(ei);
    const et = mk('div','empty-title','Nothing here yet'); e.appendChild(et);
    const es = mk('div','empty-sub','Create your first prompt or adjust the filter.'); e.appendChild(es);
    const eb = mk('button','btn btn-primary',''); eb.innerHTML = IC.plus + ' New Prompt'; eb.style.marginTop = '12px'; eb.onclick = openNewPrompt; e.appendChild(eb);
    area.appendChild(e); return;
  }
  const grid = mk('div', S.layout === 'grid' ? 'prompt-grid' : 'prompt-list');
  prompts.forEach((p, i) => { const c = _buildCard(p); c.style.animationDelay = Math.min(i * .025, .25) + 's'; grid.appendChild(c); });
  area.appendChild(grid);
}

// ── Build card — all DOM API, zero template literals with user data ─────────
function _buildCard(p) {
  const card = mk('div','pcard' + (p.is_pinned?' pinned':'') + (S.selectedIds.has(p.id)?' sel':''));
  card.dataset.id = p.id;
  const cc = p.category?.color || '#6366f1';
  const catName = p.category ? (p.category.icon||'') + ' ' + p.category.name : 'Uncategorized';

  // Accent
  const accent = mk('div','pcard-accent'); accent.style.background = cc; card.appendChild(accent);

  // Head
  const head = mk('div','pcard-head');
  const chk = mki('div','pcard-checkbox', IC.check);
  chk.addEventListener('click', e => { e.stopPropagation(); _toggleSel(e, p.id); });
  head.appendChild(chk);

  const cat = mk('span','pcard-cat'); cat.textContent = catName;
  cat.style.cssText = 'background:' + cc + '22;color:' + cc + ';border:1px solid ' + cc + '44';
  head.appendChild(cat);

  if (p.is_pinned) { const pin = mki('span','pcard-pin', IC.pin); head.appendChild(pin); }

  const fav = mki('span','pcard-fav' + (p.is_favorite ? ' on' : ''), p.is_favorite ? IC.starFill : IC.star);
  if (p.is_favorite) fav.style.color = 'var(--amber)';
  fav.addEventListener('click', e => { e.stopPropagation(); toggleFav(e, p.id, p.is_favorite); });
  head.appendChild(fav);
  card.appendChild(head);

  // Body
  const body = mk('div','pcard-body');
  const title = mk('div','pcard-title', p.title); body.appendChild(title);
  if (p.description) { const desc = mk('div','pcard-desc', p.description); body.appendChild(desc); }

  // Preview — textContent = inherently safe, no XSS
  const prev = mk('div','pcard-preview');
  prev.textContent = (p.content||'').substring(0, 120) + ((p.content||'').length > 120 ? '…' : '');
  body.appendChild(prev);

  // Var chips
  const pvars = p.variables || [];
  if (pvars.length) {
    const vc = mk('div','var-chips');
    pvars.slice(0, 4).forEach(v => { const ch = mk('span','var-chip'); ch.textContent = '{{' + v + '}}'; vc.appendChild(ch); });
    if (pvars.length > 4) { const more = mk('span','var-chip'); more.textContent = '+' + (pvars.length - 4); vc.appendChild(more); }
    body.appendChild(vc);
  }
  card.appendChild(body);

  // Footer
  const foot = mk('div','pcard-foot');
  const tagsW = mk('div','pcard-tags');
  (p.tags||[]).slice(0, 3).forEach(t => {
    const tc = mk('div','tag-chip'); const tIcon = mki('span','',IC.tag); tc.appendChild(tIcon); tc.appendChild(mk('span','',t)); tagsW.appendChild(tc);
  });
  foot.appendChild(tagsW);

  const statsW = mk('div','pcard-stats');
  [p.use_count||0, '~'+tkns(p.content||'')+'t'].forEach(v => { const s = mk('span','pcard-stat'); s.textContent = v; statsW.appendChild(s); });
  foot.appendChild(statsW);

  const acts = mk('div','pcard-actions');
  [
    { icon: IC.edit,      label:'Edit',      fn: e => { e.stopPropagation(); openEditPrompt(e, p.id); } },
    { icon: IC.play,      label:'Run',       fn: e => { e.stopPropagation(); openRunModal(e, p.id); } },
    { icon: IC.copy,      label:'Copy',      fn: e => { e.stopPropagation(); _copyDirect(e, p.id); } },
    { icon: IC.duplicate, label:'Duplicate', fn: e => { e.stopPropagation(); _duplicate(e, p.id); } },
  ].forEach(a => {
    const btn = mki('button','pcard-action', a.icon); btn.title = a.label;
    btn.addEventListener('click', a.fn); acts.appendChild(btn);
  });
  foot.appendChild(acts);
  card.appendChild(foot);

  card.addEventListener('click', e => {
    if (e.target.closest('.pcard-checkbox,.pcard-action,.pcard-fav')) return;
    if (S.selectedIds.size > 0) { _toggleSel(e, p.id); return; }
    openDetail(p.id);
  });
  return card;
}

// ── Selection ─────────────────────────────────────────────────────────────────
function _toggleSel(e, id) {
  e.stopPropagation();
  S.selectedIds.has(id) ? S.selectedIds.delete(id) : S.selectedIds.add(id);
  document.querySelector('.pcard[data-id="'+id+'"]')?.classList.toggle('sel', S.selectedIds.has(id));
  _updBulk();
}
function _updBulk() { const n = S.selectedIds.size; $('bulk-bar').classList.toggle('show', n > 0); setText('bulk-count', n + ' selected'); }
function clearSel()  { S.selectedIds.clear(); _updBulk(); document.querySelectorAll('.pcard.sel').forEach(c => c.classList.remove('sel')); }
async function bulkDelete() {
  confirmAction('Delete ' + S.selectedIds.size + ' Prompts', 'All selected prompts and their version history will be permanently deleted.', async () => {
    await post('/api/prompts/bulk-delete', { ids:[...S.selectedIds] });
    clearSel(); renderPromptsView(); loadSidebar(); notif('Deleted.','info');
  });
}

// ── Quick actions ─────────────────────────────────────────────────────────────
async function toggleFav(e, id, cur) { e.stopPropagation(); await put('/api/prompts/'+id, { is_favorite: cur?0:1 }); renderPromptsView(); loadSidebar(); }
async function _copyDirect(e, id)    { e.stopPropagation(); const p = await get('/api/prompts/'+id); await navigator.clipboard.writeText(p.content); await post('/api/prompts/'+id+'/use',{}); toast('Copied!','success'); renderPromptsView(); }
async function _duplicate(e, id)     { e.stopPropagation(); await post('/api/prompts/'+id+'/duplicate',{}); renderPromptsView(); loadSidebar(); notif('Duplicated!','success'); }

// ── Detail modal ──────────────────────────────────────────────────────────────
async function openDetail(id) {
  const p = await get('/api/prompts/'+id);
  S.detailData = p;
  const cc = p.category?.color || '#6366f1';

  $('detail-accent').style.background = cc;
  $('detail-title').textContent = p.title;
  $('detail-desc').textContent  = p.description || '';
  $('detail-fav').innerHTML  = p.is_favorite ? IC.starFill : IC.star;
  $('detail-fav').style.color = p.is_favorite ? 'var(--amber)' : '';
  $('detail-pin').innerHTML  = IC.pin;

  // Meta row
  const meta = $('detail-meta'); meta.innerHTML = '';
  if (p.category) {
    const b = mk('span','pcard-cat'); b.textContent = (p.category.icon||'') + ' ' + p.category.name;
    b.style.cssText = 'background:'+cc+'22;color:'+cc+';border:1px solid '+cc+'44';
    meta.appendChild(b);
  }
  [[IC.zap, p.model_hint||''], [IC.copy, p.use_count+' uses'], [IC.zap,'~'+p.token_estimate+' tokens'], [IC.clock, fmtD(p.updated_at)]].forEach(([icon,txt]) => {
    if (!txt || txt === 'undefined') return;
    const s = mki('span','detail-stat', icon + '<span>' + esc(String(txt)) + '</span>'); meta.appendChild(s);
  });
  (p.variables||[]).forEach(v => { const ch = mk('span','var-chip'); ch.textContent = '{{'+v+'}}'; meta.appendChild(ch); });

  // Content — highlight vars safely
  const box = $('detail-content'); box.innerHTML = '';
  (p.content||'').split(/(\{\{[^}]+\}\})/g).forEach(part => {
    if (/^\{\{[^}]+\}\}$/.test(part)) { const s = mk('span','ph'); s.textContent = part; box.appendChild(s); }
    else box.appendChild(document.createTextNode(part));
  });

  // Tags
  const tEl = $('detail-tags'); tEl.innerHTML = '';
  if ((p.tags||[]).length) {
    p.tags.forEach(t => { const tc = mk('div','tag-chip'); tc.appendChild(mki('span','',IC.tag)); tc.appendChild(mk('span','',t)); tEl.appendChild(tc); });
  } else { const n = mk('span'); n.style.cssText='color:var(--t3);font-size:11px'; n.textContent='No tags'; tEl.appendChild(n); }

  // System prompt
  const sp = $('detail-sysprompt');
  if (p.system_prompt) { sp.style.display='block'; $('detail-sysprompt-text').textContent=p.system_prompt; }
  else sp.style.display = 'none';

  // Run history
  const rl = $('detail-runs'); rl.innerHTML = '';
  if (!(p.runs||[]).length) {
    const n = mk('div'); n.style.cssText='color:var(--t3);font-size:12px;padding:16px 0;text-align:center'; n.textContent='No runs yet.'; rl.appendChild(n);
  } else {
    p.runs.slice(0,5).forEach(r => {
      const item = mk('div','run-item');
      const rm = mk('div','run-meta');
      rm.appendChild(mk('span','run-provider', r.provider_name));
      rm.appendChild(mk('span','run-model', r.model));
      const rd = mk('span','run-date', fmtD(r.created_at)); rm.appendChild(rd);
      item.appendChild(rm);
      const rr = mk('div','run-response'); rr.textContent = (r.response||'').substring(0,300); item.appendChild(rr);
      rl.appendChild(item);
    });
  }

  _switchTab('detail-modal','info');
  openOverlay('detail-modal');
}

function _switchTab(modalId, tab) {
  document.querySelectorAll('#'+modalId+' .mtab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('#'+modalId+' .mtab-panel').forEach(p => p.classList.toggle('active', p.dataset.tab === tab));
}
function switchDetailTab(tab) { _switchTab('detail-modal', tab); }
function switchEditorTab(tab) {
  _switchTab('editor-modal', tab);
  if (tab === 'playground') updatePlayground();
  if (tab === 'history' && S.editingId) _refreshHistory();
}

async function detailCopy()        { const p=S.detailData; if(!p) return; await navigator.clipboard.writeText(p.content); await post('/api/prompts/'+p.id+'/use',{}); toast('Copied!','success'); }
async function detailToggleFav()   { const p=S.detailData; if(!p) return; await put('/api/prompts/'+p.id,{is_favorite:p.is_favorite?0:1}); S.detailData.is_favorite=p.is_favorite?0:1; $('detail-fav').innerHTML=S.detailData.is_favorite?IC.starFill:IC.star; $('detail-fav').style.color=S.detailData.is_favorite?'var(--amber)':''; loadSidebar(); }
async function detailTogglePin()   { const p=S.detailData; if(!p) return; await put('/api/prompts/'+p.id,{is_pinned:p.is_pinned?0:1}); S.detailData.is_pinned=p.is_pinned?0:1; notif(S.detailData.is_pinned?'Pinned!':'Unpinned','info'); }
function detailEdit()              { const id=S.detailData?.id; closeAllModals(); openEditPrompt(null,id); }
function detailRun()               { const id=S.detailData?.id; closeAllModals(); openRunModal(null,id); }
async function detailDuplicate()   { const p=S.detailData; if(!p) return; await post('/api/prompts/'+p.id+'/duplicate',{}); closeAllModals(); renderPromptsView(); loadSidebar(); notif('Duplicated!','success'); }
function detailDelete()            { const id=S.detailData?.id; closeAllModals(); confirmAction('Delete Prompt','This prompt and all its history will be permanently deleted.',async()=>{ await del('/api/prompts/'+id); renderPromptsView(); loadSidebar(); notif('Deleted.','info'); }); }

// ── Editor modal ──────────────────────────────────────────────────────────────
function _resetEditor() {
  ['ef-title','ef-desc','ef-content','ef-model','ef-sysprompt','ef-versionote'].forEach(id => { const e=$(id); if(e) e.value=''; });
  $('ef-fav').checked = false; $('ef-pin').checked = false;
  S.editorTags = []; _renderTags(); onContentChange();
}

function openNewPrompt() {
  S.editingId = null; _resetEditor();
  setText('editor-title','New Prompt'); $('ed-del').style.display='none';
  if (SELECTS['ef-category']) SELECTS['ef-category'].value = '';
  _switchTab('editor-modal','edit');
  openOverlay('editor-modal');
  setTimeout(() => $('ef-title').focus(), 120);
}

async function openEditPrompt(e, id, tab='edit') {
  if (e) e.stopPropagation();
  const p = await get('/api/prompts/'+id);
  S.editingId = id; S.editorTags = [...(p.tags||[])];
  setText('editor-title','Edit Prompt'); $('ed-del').style.display='inline-flex';
  $('ef-title').value     = p.title;
  $('ef-desc').value      = p.description || '';
  $('ef-content').value   = p.content;
  $('ef-model').value     = p.model_hint || '';
  $('ef-sysprompt').value = p.system_prompt || '';
  $('ef-versionote').value = '';
  $('ef-fav').checked = !!p.is_favorite;
  $('ef-pin').checked = !!p.is_pinned;
  if (SELECTS['ef-category']) SELECTS['ef-category'].value = String(p.category_id||'');
  _renderTags(); onContentChange(); _renderVersionHistory(p.versions||[]);
  _switchTab('editor-modal', tab);
  openOverlay('editor-modal');
}

async function _refreshHistory() {
  const p = await get('/api/prompts/'+S.editingId);
  _renderVersionHistory(p.versions||[]);
}

function _renderVersionHistory(versions) {
  const wrap = $('ver-list'); wrap.innerHTML = '';
  if (!versions.length) { wrap.appendChild(mk('div','','No version history yet.')); return; }
  const list = mk('div','ver-list');
  versions.forEach((v, i) => {
    const item = mk('div','ver-item'+(i===0?' current':''));
    const badge = mk('div','ver-badge','v'+v.version_num); item.appendChild(badge);
    const info  = mk('div','ver-info');
    info.appendChild(mk('div','ver-note', v.note||'No note'));
    info.appendChild(mk('div','ver-date', fmtD(v.created_at)+' · '+v.content.length+' chars · ~'+tkns(v.content)+' tokens'));
    item.appendChild(info);
    if (i > 0) { const rb = mk('button','btn btn-ghost btn-sm','Restore'); rb.addEventListener('click', () => _restoreVersion(v.version_num)); item.appendChild(rb); }
    else { const cur = mk('span'); cur.style.cssText='font-family:var(--font-mono);font-size:10px;color:var(--ind-lt)'; cur.textContent='Current'; item.appendChild(cur); }
    list.appendChild(item);
  });
  wrap.appendChild(list);
}

async function _restoreVersion(vnum) {
  if (!S.editingId) return;
  confirmAction('Restore v'+vnum,'Current content will be saved as a new version before restoring.', async () => {
    const p = await post('/api/prompts/'+S.editingId+'/restore/'+vnum, {});
    $('ef-content').value = p.content; onContentChange(); _switchTab('editor-modal','edit'); notif('Restored to v'+vnum,'success');
  });
}

function onContentChange() {
  const content = $('ef-content').value || '';
  setText('ed-chars', content.length.toLocaleString()+' chars');
  setText('ed-tokens', tkns(content).toLocaleString()+' tokens');
  const v = vars(content);
  const vbar = $('vars-bar'); vbar.innerHTML = '';
  const lbl = mk('span','vars-bar-label','Vars:'); vbar.appendChild(lbl);
  if (!v.length) { const none = mk('span'); none.style.cssText='color:var(--t3);font-size:11px;font-family:var(--font-mono)'; none.textContent='none detected'; vbar.appendChild(none); }
  else v.forEach(vname => {
    const ch = mk('span','var-chip'); ch.textContent='{{'+vname+'}}'; ch.style.cursor='pointer';
    ch.addEventListener('click', () => { switchEditorTab('playground'); setTimeout(() => { const i=document.querySelector('.pg-var[data-var="'+vname+'"]'); if(i){i.focus();i.select();} },100); });
    vbar.appendChild(ch);
  });
  updatePlayground();
}

function insertVar() {
  const n = prompt('Variable name (letters/numbers/underscores):'); if (!n) return;
  const c = n.trim().replace(/[^a-zA-Z0-9_]/g,'_').toLowerCase();
  const el = $('ef-content'); const s=el.selectionStart,en=el.selectionEnd;
  el.value = el.value.substring(0,s)+'{{'+c+'}}'+el.value.substring(en);
  el.selectionStart = el.selectionEnd = s+c.length+4; el.focus(); onContentChange();
}
function wrapSel(b,a) {
  const el=$('ef-content'),s=el.selectionStart,en=el.selectionEnd;
  const sel=el.value.substring(s,en)||'text';
  el.value=el.value.substring(0,s)+b+sel+a+el.value.substring(en); el.focus();
}

function _renderTags() {
  const wrap=$('tags-wrap'), inp=$('tags-input');
  wrap.querySelectorAll('.tag-pill').forEach(p => p.remove());
  S.editorTags.forEach(t => {
    const pill=mk('div','tag-pill'); pill.appendChild(mk('span','',t));
    const del=mk('span','tag-del','×'); del.addEventListener('click', () => { S.editorTags=S.editorTags.filter(x=>x!==t); _renderTags(); }); pill.appendChild(del);
    wrap.insertBefore(pill, inp);
  });
}
function handleTagKey(e) {
  if (e.key==='Enter'||e.key===',') { e.preventDefault(); const v=e.target.value.trim().replace(/,$/,''); if(v&&!S.editorTags.includes(v)){S.editorTags.push(v);_renderTags();} e.target.value=''; }
  if (e.key==='Backspace'&&e.target.value===''&&S.editorTags.length) { S.editorTags.pop(); _renderTags(); }
}

async function savePrompt() {
  const title=($('ef-title').value||'').trim(), content=($('ef-content').value||'').trim();
  if (!title||!content) { notif('Title and content are required.','error'); return; }
  const body = {
    title, content,
    description:   $('ef-desc').value.trim(),
    category_id:   SELECTS['ef-category']?.value || null,
    model_hint:    $('ef-model').value.trim(),
    system_prompt: $('ef-sysprompt').value.trim(),
    tags:          S.editorTags,
    is_favorite:   $('ef-fav').checked ? 1 : 0,
    is_pinned:     $('ef-pin').checked ? 1 : 0,
    version_note:  $('ef-versionote').value.trim(),
  };
  if (S.editingId) { await put('/api/prompts/'+S.editingId, body); notif('Updated!','success'); }
  else             { await post('/api/prompts', body);              notif('Created!','success'); }
  closeAllModals(); renderPromptsView(); loadSidebar();
}

function editorDelete() {
  const id=S.editingId; closeAllModals();
  confirmAction('Delete Prompt','This prompt and all version history will be permanently deleted.', async () => {
    await del('/api/prompts/'+id); renderPromptsView(); loadSidebar(); notif('Deleted.','info');
  });
}

// ── Playground ────────────────────────────────────────────────────────────────
function updatePlayground() {
  const content = $('ef-content')?.value || '';
  const v = vars(content);
  const noV=$('pg-no-vars'), hasV=$('pg-has-vars');
  if (!noV||!hasV) return;
  if (!v.length) { noV.style.display='block'; hasV.style.display='none'; return; }
  noV.style.display='none'; hasV.style.display='grid';
  const existing={};
  document.querySelectorAll('.pg-var').forEach(e => { existing[e.dataset.var]=e.value; });
  const fields=$('pg-var-fields'); fields.innerHTML='';
  v.forEach(vname => {
    const wrap=mk('div');
    const lbl=mk('div','var-field-label'); lbl.textContent='{{'+vname+'}}'; wrap.appendChild(lbl);
    const ta=mk('textarea','var-field-input pg-var'); ta.dataset.var=vname; ta.rows=2; ta.value=existing[vname]||'';
    ta.placeholder='Value for {{'+vname+'}}…'; ta.addEventListener('input',_pgOut); wrap.appendChild(ta);
    fields.appendChild(wrap);
  });
  _pgOut();
}

function _pgOut() {
  const content=$('ef-content')?.value||'';
  const vals={}; document.querySelectorAll('.pg-var').forEach(e => { vals[e.dataset.var]=e.value; });
  const out=$('pg-output'); if(!out) return; out.innerHTML='';
  content.split(/(\{\{[^}]+\}\})/g).forEach(part => {
    if (/^\{\{[^}]+\}\}$/.test(part)) {
      const vname=part.slice(2,-2).trim();
      const s=mk('span', vals[vname]?'r-var':'r-empty'); s.textContent=vals[vname]?vals[vname]:part; out.appendChild(s);
    } else out.appendChild(document.createTextNode(part));
  });
}

function copyRendered() {
  let c=$('ef-content')?.value||'';
  document.querySelectorAll('.pg-var').forEach(e => { if(e.value) c=c.replaceAll('{{'+e.dataset.var+'}}',e.value); });
  navigator.clipboard.writeText(c); toast('Rendered prompt copied!','success');
}

// ── Run modal ─────────────────────────────────────────────────────────────────
let _runId = null;

async function openRunModal(e, id) {
  if (e) e.stopPropagation();
  const p = await get('/api/prompts/'+id);
  _runId = id;

  // Variable fields
  const varArea=$('run-var-area'); varArea.innerHTML='';
  const v=p.variables||[];
  if (v.length) {
    const fields=mk('div','var-fields');
    v.forEach(vname => {
      const wrap=mk('div');
      const lbl=mk('div','var-field-label'); lbl.textContent='{{'+vname+'}}'; wrap.appendChild(lbl);
      const ta=mk('textarea','var-field-input pg-var'); ta.dataset.var=vname; ta.rows=2; ta.placeholder='Value for {{'+vname+'}}…'; ta.addEventListener('input',_renderRunPreview); wrap.appendChild(ta);
      fields.appendChild(wrap);
    });
    varArea.appendChild(fields);
  } else { const n=mk('div'); n.style.cssText='color:var(--t3);font-size:12px;font-family:var(--font-mono)'; n.textContent='No variables — prompt runs as-is.'; varArea.appendChild(n); }

  $('run-sysprompt').value = p.system_prompt||'';

  const prev=$('run-preview'); prev.innerHTML=''; prev.dataset.raw=p.content;
  (p.content||'').split(/(\{\{[^}]+\}\})/g).forEach(part => {
    if (/^\{\{[^}]+\}\}$/.test(part)) { const s=mk('span','r-empty'); s.textContent=part; prev.appendChild(s); }
    else prev.appendChild(document.createTextNode(part));
  });

  await loadProviders();
  _mountRunSelects();

  const resp=$('run-response'); resp.innerHTML='';
  const pl=mk('span','response-placeholder'); pl.textContent='Response will appear here after running…'; resp.appendChild(pl);
  $('run-status').className='response-status';
  $('run-meta-info').textContent='';
  setText('run-modal-title','Run: '+p.title);
  openOverlay('run-modal');
}

function _mountRunSelects() {
  const provOpts=[
    {value:'',label:'— Select AI Provider —'},
    ...S.providers.filter(p=>p.hasKey).map(p=>({value:p.id,label:p.name+' ('+p.type+')'})),
  ];
  const pw=$('run-provider-wrap'); pw.innerHTML='';
  const pSel=new PmsSelect({id:'run-provider',width:'100%',options:provOpts,value:'',placeholder:'— Select Provider —',onChange:pid=>_updateRunModels(pid),searchable:S.providers.length>5});
  pSel.mount(pw); SELECTS['run-provider']=pSel;

  const mw=$('run-model-wrap'); mw.innerHTML='';
  const mSel=new PmsSelect({id:'run-model',width:'100%',options:[{value:'',label:'Select provider first…'}],value:'',onChange:()=>{}});
  mSel.mount(mw); SELECTS['run-model']=mSel;
}

function _updateRunModels(pid) {
  const prov=S.providers.find(p=>p.id===pid);
  const type=S.providerTypes[prov?.type];
  const models=(type?.models||[]).map(m=>({value:m,label:m}));
  const sel=SELECTS['run-model']; if(!sel) return;
  sel.setOptions(models.length?models:[{value:'',label:'Enter custom model below'}]);
  if (prov?.defaultModel) sel.value=prov.defaultModel;
}

function _renderRunPreview() {
  const prev=$('run-preview'); if(!prev||!prev.dataset.raw) return;
  const vals={}; document.querySelectorAll('#run-modal .pg-var').forEach(e=>{vals[e.dataset.var]=e.value;});
  prev.innerHTML='';
  prev.dataset.raw.split(/(\{\{[^}]+\}\})/g).forEach(part => {
    if (/^\{\{[^}]+\}\}$/.test(part)) { const vname=part.slice(2,-2).trim(); const s=mk('span',vals[vname]?'r-var':'r-empty'); s.textContent=vals[vname]?vals[vname]:part; prev.appendChild(s); }
    else prev.appendChild(document.createTextNode(part));
  });
}

async function executeRun() {
  const pid   = SELECTS['run-provider']?.value;
  const model = ($('run-custom-model')?.value||'').trim() || SELECTS['run-model']?.value;
  if (!pid)   { notif('Select a provider first.','error'); return; }
  if (!model) { notif('Select or enter a model name.','error'); return; }

  const raw=$('run-preview').dataset.raw||'';
  let rendered=raw;
  document.querySelectorAll('#run-modal .pg-var').forEach(e=>{rendered=rendered.replaceAll('{{'+e.dataset.var+'}}',e.value);});
  const sysPrompt=($('run-sysprompt').value||'').trim();
  const temp=parseFloat($('run-temp-val').textContent||'0.7');

  const btn=$('run-execute-btn'); btn.disabled=true;
  $('run-spin').style.display='block'; setText('run-spin-label','Running…');
  $('run-status').className='response-status running';
  const resp=$('run-response'); resp.innerHTML='';
  resp.appendChild(mk('span','response-placeholder','Waiting for response…'));
  $('run-meta-info').textContent='';

  try {
    const result=await post('/api/ai/run',{provider_id:pid,model,prompt:rendered,system_prompt:sysPrompt,prompt_id:_runId,params:{temperature:temp,maxTokens:4096}});
    if (result.error) throw new Error(result.error);
    resp.textContent=result.response;
    $('run-status').className='response-status done';
    $('run-meta-info').textContent=result.provider+' · '+model+' · '+result.duration_ms+'ms';
    renderPromptsView();
  } catch(err) {
    resp.textContent='Error: '+err.message;
    $('run-status').className='response-status error';
    notif('Run failed: '+err.message,'error');
  } finally {
    btn.disabled=false; $('run-spin').style.display='none'; setText('run-spin-label','Run Prompt');
  }
}

function copyRunResponse() { const t=$('run-response').textContent; if(!t||t.includes('Response will appear')) return; navigator.clipboard.writeText(t); toast('Copied!','success'); }
function updateTemp(val)   { setText('run-temp-val', parseFloat(val).toFixed(1)); }

// ── Categories ────────────────────────────────────────────────────────────────
function openNewCat()   { S.catEditId=null; S.catColor=PALETTE[0]; setText('cat-modal-title','New Category'); $('cat-name').value=''; $('cat-icon').value=''; $('cat-del').style.display='none'; $('cat-swatches').querySelectorAll('.col-swatch').forEach((s,i)=>s.classList.toggle('active',PALETTE[i]===S.catColor)); openOverlay('cat-modal'); }
function openEditCat(c) { S.catEditId=c.id; S.catColor=c.color; setText('cat-modal-title','Edit Category'); $('cat-name').value=c.name; $('cat-icon').value=c.icon||''; $('cat-del').style.display='inline-flex'; $('cat-swatches').querySelectorAll('.col-swatch').forEach(s=>s.classList.toggle('active',s.dataset.color===c.color)); openOverlay('cat-modal'); }
async function saveCat() { const name=($('cat-name').value||'').trim(),icon=($('cat-icon').value||'').trim()||'📁'; if(!name){notif('Name required','error');return;} if(S.catEditId)await put('/api/categories/'+S.catEditId,{name,icon,color:S.catColor}); else await post('/api/categories',{name,icon,color:S.catColor}); closeAllModals(); loadSidebar(); notif(S.catEditId?'Updated.':'Created.','success'); }
function delCat() { const id=S.catEditId; closeAllModals(); confirmAction('Delete Category','Prompts will become uncategorized.',async()=>{ await del('/api/categories/'+id); loadSidebar(); renderPromptsView(); notif('Deleted.','info'); }); }

// ── Collections ───────────────────────────────────────────────────────────────
async function renderCollections() {
  const cols=await get('/api/collections'); S.collections=cols||[];
  const area=$('content'); area.innerHTML='';
  const hdr=mk('div',''); hdr.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:16px';
  hdr.appendChild(mk('span','','YOUR COLLECTIONS')); // use CSS for styling
  hdr.firstChild.style.cssText='font-family:var(--font-mono);font-size:11px;color:var(--t3);letter-spacing:1px';
  const ab=mk('button','btn btn-primary btn-sm',''); ab.innerHTML=IC.plus+' New Collection'; ab.onclick=openNewCol; hdr.appendChild(ab);
  area.appendChild(hdr);
  if (!cols.length) { const e=mk('div','empty'); e.appendChild(mki('div','empty-icon',IC.folder)); e.appendChild(mk('div','empty-title','No Collections')); e.appendChild(mk('div','empty-sub','Group related prompts together.')); area.appendChild(e); return; }
  const grid=mk('div','col-grid');
  cols.forEach(c => {
    const card=mk('div','col-card'); card.style.setProperty('--ccolor',c.color);
    const ch=mk('div',''); ch.style.cssText='display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px';
    ch.appendChild(mk('div','col-name',c.name));
    const eb=mk('button','btn-icon','···'); eb.style.cssText='width:26px;height:26px;font-size:11px'; eb.addEventListener('click',e=>{e.stopPropagation();openEditCol(e,c.id);}); ch.appendChild(eb);
    card.appendChild(ch); card.appendChild(mk('div','col-desc',c.description||'No description'));
    const ct=mk('div','col-count'); ct.appendChild(mki('span','',IC.book)); ct.appendChild(mk('span','',' '+( c.count||0)+' prompts')); card.appendChild(ct);
    card.addEventListener('click',e=>{if(e.target.closest('.btn-icon'))return; openColView(c.id,c.name);});
    grid.appendChild(card);
  });
  area.appendChild(grid);
}

async function openColView(id,name) { S.view='collection_'+id; setText('content-title',name); document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active')); renderPromptsView(); }
function openNewCol()   { S.colEditId=null; S.colColor=PALETTE[0]; setText('col-modal-title','New Collection'); $('col-name').value=''; $('col-desc').value=''; $('col-del').style.display='none'; $('col-swatches').querySelectorAll('.col-swatch').forEach((s,i)=>s.classList.toggle('active',PALETTE[i]===S.colColor)); openOverlay('col-modal'); }
function openEditCol(e,id) { e.stopPropagation(); const c=S.collections.find(x=>x.id===id); if(!c)return; S.colEditId=id; S.colColor=c.color; setText('col-modal-title','Edit Collection'); $('col-name').value=c.name; $('col-desc').value=c.description||''; $('col-del').style.display='inline-flex'; $('col-swatches').querySelectorAll('.col-swatch').forEach(s=>s.classList.toggle('active',s.dataset.color===c.color)); openOverlay('col-modal'); }
async function saveCol() { const name=($('col-name').value||'').trim(),desc=($('col-desc').value||'').trim(); if(!name){notif('Name required','error');return;} if(S.colEditId)await put('/api/collections/'+S.colEditId,{name,description:desc,color:S.colColor}); else await post('/api/collections',{name,description:desc,color:S.colColor}); closeAllModals(); renderCollections(); loadSidebar(); notif(S.colEditId?'Updated.':'Created.','success'); }
function delCol() { const id=S.colEditId; closeAllModals(); confirmAction('Delete Collection','Prompt assignments removed.',async()=>{ await del('/api/collections/'+id); renderCollections(); loadSidebar(); notif('Deleted.','info'); }); }

// ── Stats ─────────────────────────────────────────────────────────────────────
async function renderStats() {
  const stats=await get('/api/ai/stats'); const area=$('content'); area.innerHTML='';
  const ov=mk('div','stats-overview');
  [{label:'Total Prompts',val:stats.totalPrompts,icon:IC.book},{label:'Total Uses',val:stats.totalUses,icon:IC.copy},{label:'Favorites',val:stats.totalFavs,icon:IC.star},{label:'Versions',val:stats.totalVersions,icon:IC.clock}].forEach(s=>{
    const c=mk('div','stat-card'); const n=mk('div','stat-num'); n.textContent=s.val; c.appendChild(n); const l=mki('div','stat-lbl',s.icon+'<span>'+esc(s.label)+'</span>'); c.appendChild(l); ov.appendChild(c);
  });
  area.appendChild(ov);
  const addH=(t)=>{ const h=mk('div'); h.style.cssText='font-family:var(--font-display);font-size:16px;font-weight:600;margin:20px 0 12px'; h.textContent=t; area.appendChild(h); };
  addH('Most Used Prompts');
  const tl=mk('div','run-list');
  (stats.topPrompts||[]).forEach((p,i)=>{ const item=mk('div','run-item'); item.style.cursor='pointer'; item.addEventListener('click',()=>openDetail(p.id)); const rm=mk('div','run-meta'); const rank=mk('span'); rank.style.cssText='font-family:var(--font-display);font-size:18px;font-weight:700;color:var(--t3);width:28px'; rank.textContent=i+1; rm.appendChild(rank); rm.appendChild(mk('span','',p.title)).style && (rm.lastChild.style.cssText='font-weight:500;flex:1'); rm.appendChild(mk('span','run-date',p.use_count+' uses')); item.appendChild(rm); tl.appendChild(item); });
  area.appendChild(tl);
  addH('Tag Cloud');
  const cloud=mk('div',''); cloud.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px';
  (stats.topTags||[]).forEach(({tag,count})=>{ const t=mk('div','tag-chip'); t.style.cssText='cursor:pointer;font-size:12px;padding:4px 10px'; t.appendChild(mki('span','',IC.tag)); t.appendChild(mk('span','',' #'+tag+' ('+count+')')); t.addEventListener('click',()=>{S.filterTag=tag;showView('all');}); cloud.appendChild(t); });
  area.appendChild(cloud);
  addH('By Category');
  const cg=mk('div','stats-overview'); cg.style.gridTemplateColumns='repeat(auto-fill,minmax(180px,1fr))';
  (stats.byCategory||[]).filter(c=>c.count>0).forEach(c=>{ const card=mk('div','stat-card'); const n=mk('div','stat-num'); n.style.fontSize='28px'; n.textContent=c.count; card.appendChild(n); card.appendChild(mk('div','stat-lbl',(c.icon||'')+' '+c.name)); cg.appendChild(card); });
  area.appendChild(cg);
}

// ── Settings ──────────────────────────────────────────────────────────────────
async function loadProviders()     { S.providers     = await get('/api/ai/providers') || []; }
async function loadProviderTypes() { S.providerTypes = await get('/api/ai/types')    || {}; }

async function renderSettings() {
  await loadProviders();
  const area=$('content'); area.innerHTML='';
  const layout=mk('div','settings-layout');
  const nav=mk('div','settings-nav');
  [{id:'providers',icon:IC.plug,label:'AI Providers'},{id:'ui',icon:IC.settings,label:'UI Settings'},{id:'data',icon:IC.download,label:'Import / Export'}].forEach(t=>{
    const item=mk('div','nav-item'+(S.settingsTab===t.id?' active':'')); item.dataset.view=t.id;
    item.appendChild(mki('span','nav-icon',t.icon)); item.appendChild(mk('span','',t.label));
    item.addEventListener('click',()=>{ S.settingsTab=t.id; renderSettings(); }); nav.appendChild(item);
  });
  layout.appendChild(nav);
  const panel=mk('div','settings-panel');

  if (S.settingsTab==='providers') {
    const hdr=mk('div',''); hdr.style.cssText='display:flex;align-items:center;justify-content:space-between;margin-bottom:16px';
    const hl=mk('div','');
    const t1=mk('div',''); t1.style.cssText='font-family:var(--font-display);font-size:17px;font-weight:600;margin-bottom:3px'; t1.textContent='AI Providers'; hl.appendChild(t1);
    const t2=mk('div',''); t2.style.cssText='font-size:12px;color:var(--t3)'; t2.textContent='Connect OpenAI, Anthropic, Gemini, Groq, Ollama, and more.'; hl.appendChild(t2);
    hdr.appendChild(hl);
    const ab=mk('button','btn btn-primary',''); ab.innerHTML=IC.plus+' Add Provider'; ab.onclick=()=>openAddProvider(); hdr.appendChild(ab);
    panel.appendChild(hdr);

    if (!S.providers.length) {
      const e=mk('div','empty'); e.style.padding='40px'; e.appendChild(mki('div','empty-icon',IC.plug)); e.appendChild(mk('div','empty-title','No Providers Yet')); e.appendChild(mk('div','empty-sub','Add your first AI provider to run prompts directly inside PMS.'));
      const ab2=mk('button','btn btn-primary',''); ab2.innerHTML=IC.plus+' Add Provider'; ab2.style.marginTop='12px'; ab2.onclick=()=>openAddProvider(); e.appendChild(ab2); panel.appendChild(e);
    } else {
      const grid=mk('div','provider-grid');
      S.providers.forEach(p => {
        const pt=S.providerTypes[p.type]||{}; const card=mk('div','provider-card'+(p.hasKey?' connected':''));
        const ph=mk('div','prov-head');
        const pi=mk('div','prov-icon'); pi.textContent=pt.icon||'🔌'; ph.appendChild(pi);
        const pd=mk('div',''); pd.appendChild(mk('div','prov-name',p.name)); pd.appendChild(mk('div','prov-type',pt.label||p.type)); ph.appendChild(pd);
        const ps=mk('div','prov-status'); const dot=mk('div','status-dot'+(p.hasKey?' on':' off')); ps.appendChild(dot); ph.appendChild(ps);
        card.appendChild(ph); card.appendChild(mk('div','prov-model','Model: '+(p.defaultModel||'—')));
        const pa=mk('div','prov-actions');
        const tb=mk('button','btn btn-secondary btn-sm','Test'); tb.addEventListener('click',()=>testProvider(p.id,tb)); pa.appendChild(tb);
        const eb=mk('button','btn btn-ghost btn-sm','Edit'); eb.addEventListener('click',()=>openAddProvider(p.id)); pa.appendChild(eb);
        const db=mk('button','btn btn-danger btn-sm','Remove'); db.addEventListener('click',()=>deleteProvider(p.id)); pa.appendChild(db);
        card.appendChild(pa); grid.appendChild(card);
      });
      panel.appendChild(grid);
    }

    const guide=mk('div','');
    const gh=mk('div',''); gh.style.cssText='font-family:var(--font-display);font-size:16px;font-weight:600;margin:24px 0 12px'; gh.textContent='Available Integrations'; guide.appendChild(gh);
    const pg=mk('div','ptype-grid');
    Object.entries(S.providerTypes).forEach(([key,pt])=>{
      const card=mk('div','ptype-card'); card.appendChild(mk('div','ptype-icon',pt.icon||'🔌'));
      const info=mk('div',''); info.appendChild(mk('div','ptype-label',pt.label)); info.appendChild(mk('div','ptype-url',pt.baseUrl||'Custom URL')); card.appendChild(info);
      card.addEventListener('click',()=>{ S.provTypeSelected=key; openAddProvider(); }); pg.appendChild(card);
    });
    guide.appendChild(pg); panel.appendChild(guide);

  } else if (S.settingsTab==='ui') {
    panel.appendChild(mk('div','','')) && (panel.lastChild.style.cssText='font-family:var(--font-display);font-size:17px;font-weight:600;margin-bottom:16px');
    panel.lastChild.textContent='UI Settings';
    const f=mk('div','field'); const lb=mk('label','field-label','Default Layout'); f.appendChild(lb);
    const lw=mk('div'); lw.style.marginTop='6px';
    const lSel=new PmsSelect({id:'ui-layout',width:'200px',value:'grid',options:[{value:'grid',label:'Grid View'},{value:'list',label:'List View'}],onChange:async v=>{await put('/api/settings',{defaultView:v}); notif('Saved.','success');}});
    lSel.mount(lw); f.appendChild(lw); panel.appendChild(f);
    const cfg=await get('/api/settings'); lSel.value=cfg.defaultView||'grid';
    const note=mk('div',''); note.style.cssText='color:var(--t3);font-size:13px;margin-top:16px'; note.textContent='More settings coming in future updates.'; panel.appendChild(note);

  } else if (S.settingsTab==='data') {
    const dh=mk('div',''); dh.style.cssText='font-family:var(--font-display);font-size:17px;font-weight:600;margin-bottom:16px'; dh.textContent='Import / Export'; panel.appendChild(dh);
    [{title:'Export All Data',icon:IC.upload,desc:'Download a full JSON backup of all prompts, categories, and collections.',btn:'Export JSON',fn:exportAll},
     {title:'Import Data',icon:IC.download,desc:'Import a previously exported PMS JSON file.',btn:'Choose File',fn:()=>$('imp-file').click()}].forEach(item=>{
      const card=mk('div','run-item'); card.style.marginBottom='12px';
      const h=mk('div',''); h.style.cssText='font-weight:600;margin-bottom:6px;display:flex;align-items:center;gap:6px'; h.appendChild(mki('span','',item.icon)); h.appendChild(mk('span','',item.title)); card.appendChild(h);
      card.appendChild(mk('div','',item.desc)).style && (card.lastChild.style.cssText='font-size:12px;color:var(--t3);margin-bottom:10px');
      const b=mk('button','btn btn-secondary',item.btn); b.addEventListener('click',item.fn); card.appendChild(b);
      panel.appendChild(card);
    });
    const imf=mk('input',''); imf.type='file'; imf.id='imp-file'; imf.accept='.json'; imf.style.display='none'; imf.addEventListener('change',handleImportFile); panel.appendChild(imf);
  }

  layout.appendChild(panel); area.appendChild(layout);
  _mountEditorCatSelect();
}

function _mountEditorCatSelect() {
  const w=$('ef-cat-wrap'); if(!w||w.querySelector('.pms-sel-wrap')) return;
  const sel=new PmsSelect({id:'ef-category',width:'100%',placeholder:'— Uncategorized —',value:'',options:[{value:'',label:'— Uncategorized —'},...S.categories.map(c=>({value:String(c.id),label:(c.icon||'')+' '+c.name}))],onChange:()=>{}});
  sel.mount(w); SELECTS['ef-category']=sel;
}

async function testProvider(id,btn) {
  const orig=btn.textContent; btn.textContent='Testing…'; btn.disabled=true;
  const r=await post('/api/ai/providers/'+id+'/test',{});
  btn.disabled=false;
  if(r.ok){ btn.textContent='Connected'; btn.style.color='var(--green)'; notif('Connection OK!','success'); }
  else    { btn.textContent='Failed';    btn.style.color='var(--red)';   notif('Failed: '+(r.error||'unknown'),'error'); }
  setTimeout(()=>{ btn.textContent=orig; btn.style.color=''; btn.className='btn btn-ghost btn-sm'; },3000);
}

async function deleteProvider(id) {
  confirmAction('Remove Provider','API key and config will be removed.',async()=>{ await del('/api/ai/providers/'+id); await loadProviders(); renderSettings(); notif('Removed.','info'); });
}

// ── Add Provider ──────────────────────────────────────────────────────────────
function openAddProvider(editId) {
  S.addProvEditId=editId||null;
  const step = editId ? 2 : (S.provTypeSelected ? 2 : 1);

  const tg=$('prov-type-grid'); tg.innerHTML='';
  Object.entries(S.providerTypes).forEach(([key,pt])=>{
    const card=mk('div','ptype-card'+(S.provTypeSelected===key?' selected':''));
    card.appendChild(mk('div','ptype-icon',pt.icon||'🔌'));
    const info=mk('div',''); info.appendChild(mk('div','ptype-label',pt.label)); info.appendChild(mk('div','ptype-url',pt.baseUrl||'Custom')); card.appendChild(info);
    card.addEventListener('click',()=>{ tg.querySelectorAll('.ptype-card').forEach(c=>c.classList.remove('selected')); card.classList.add('selected'); S.provTypeSelected=key; });
    tg.appendChild(card);
  });

  setText('add-prov-title', editId ? 'Edit Provider' : 'Add AI Provider');
  $('prov-step1').style.display=step===1?'block':'none';
  $('prov-step2').style.display=step===2?'block':'none';

  // Mount model select once
  const mw=$('prov-defmodel-wrap');
  if (!SELECTS['prov-defmodel-sel']) {
    const ms=new PmsSelect({id:'prov-defmodel-sel',width:'100%',options:[{value:'',label:'Select model…'}],onChange:v=>{if($('prov-defmodel'))$('prov-defmodel').value=v;}});
    ms.mount(mw); SELECTS['prov-defmodel-sel']=ms;
  }

  if (editId) {
    const p=S.providers.find(x=>x.id===editId);
    if (p) {
      S.provTypeSelected=p.type;
      $('prov-name').value=p.name; $('prov-apikey').value=''; $('prov-apikey').placeholder=p.hasKey?'••••'+p.apiKey?.slice(-4):'sk-…';
      // ── FIX: always resolve baseUrl from type default if saved empty ──
      $('prov-baseurl').value=p.baseUrl||(S.providerTypes[p.type]?.baseUrl||'');
      $('prov-defmodel').value=p.defaultModel||''; $('prov-enabled').checked=p.enabled!==false;
      _populateProvModels(p.type, p.defaultModel);
    }
  } else {
    $('prov-name').value=''; $('prov-apikey').value=''; $('prov-apikey').placeholder='sk-…';
    // ── FIX: pre-fill baseUrl from selected type immediately ──
    $('prov-baseurl').value=S.provTypeSelected?(S.providerTypes[S.provTypeSelected]?.baseUrl||''):'';
    $('prov-defmodel').value=''; $('prov-enabled').checked=true;
    if (S.provTypeSelected) _populateProvModels(S.provTypeSelected);
  }
  openOverlay('add-prov-modal');
}

function provTypeNext() {
  if (!S.provTypeSelected) { notif('Select a provider type.','error'); return; }
  const pt=S.providerTypes[S.provTypeSelected];
  if (!$('prov-name').value) $('prov-name').value=pt.label;
  // ── FIX: guarantee baseUrl is set from type default ──
  $('prov-baseurl').value=pt.baseUrl||'';
  _populateProvModels(S.provTypeSelected);
  $('prov-step1').style.display='none';
  $('prov-step2').style.display='block';
}

function _populateProvModels(type, current='') {
  const models=(S.providerTypes[type]?.models||[]).map(m=>({value:m,label:m}));
  const sel=SELECTS['prov-defmodel-sel'];
  if (sel) { sel.setOptions(models.length?models:[{value:'',label:'Enter model manually'}]); if(current)sel.value=current; }
}

async function saveProvider() {
  const name=($('prov-name').value||'').trim();
  const apiKey=($('prov-apikey').value||'').trim();
  // ── FIX: resolve baseUrl with fallback to type default ──
  const savedUrl=($('prov-baseurl').value||'').trim();
  const baseUrl=savedUrl||(S.providerTypes[S.provTypeSelected]?.baseUrl||'');
  const defModel=($('prov-defmodel').value||'').trim()||SELECTS['prov-defmodel-sel']?.value||'';
  const enabled=$('prov-enabled').checked;
  if (!name) { notif('Name required','error'); return; }
  if (!S.provTypeSelected) { notif('Select a provider type','error'); return; }
  const body={name,type:S.provTypeSelected,apiKey,baseUrl,defaultModel:defModel,enabled};
  if (S.addProvEditId) await put('/api/ai/providers/'+S.addProvEditId,body);
  else                 await post('/api/ai/providers',body);
  S.provTypeSelected=null;
  closeAllModals(); await loadProviders(); renderSettings(); notif(S.addProvEditId?'Updated!':'Provider added!','success');
}

// ── Export / Import ───────────────────────────────────────────────────────────
function exportAll() { window.location.href='/api/settings/export'; }
function handleImportFile() {
  const file=$('imp-file')?.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=async e=>{
    try {
      const data=JSON.parse(e.target.result);
      const r=await post('/api/settings/import',{data,mode:'merge'});
      if (r.error) throw new Error(r.error);
      notif('Imported: '+r.added.prompts+' prompts.','success');
      loadSidebar(); renderPromptsView();
    } catch(err) { notif('Import failed: '+err.message,'error'); }
  };
  reader.readAsText(file);
}

// ── Modal system ──────────────────────────────────────────────────────────────
function openOverlay(id)  { $(id).classList.add('open'); if(id==='editor-modal') _mountEditorCatSelect(); }
function closeOverlay(id) { $(id).classList.remove('open'); }
function closeAllModals() { document.querySelectorAll('.overlay').forEach(o=>o.classList.remove('open')); S.provTypeSelected=null; }
function confirmAction(title,msg,cb) { S.confirmCb=cb; setText('confirm-title',title); setText('confirm-msg',msg); $('confirm-ok').onclick=async()=>{ closeOverlay('confirm-modal'); await cb(); }; openOverlay('confirm-modal'); }
function setLayout(l) { S.layout=l; $('vbtn-grid').classList.toggle('active',l==='grid'); $('vbtn-list').classList.toggle('active',l==='list'); renderPromptsView(); }

// ── Boot ──────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', init);
