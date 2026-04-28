# Changelog

All notable changes to PMS are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.0.0] — 2025

### Added
- Full AI provider integration: OpenAI, Anthropic, Gemini, Groq, Mistral, OpenRouter, Ollama, Cohere, Custom
- Live AI Runner modal — execute any prompt against any configured provider
- System prompt field per prompt (model role/persona)
- Run history stored per prompt (last 50 runs)
- Temperature slider in Run modal
- Custom model name override in Run modal
- Provider test connection button
- Two-step provider setup UI (type picker → config form)
- Settings panel with Providers / UI / Import-Export tabs
- `{{variable}}` auto-detection with clickable chips
- Playground tab: fill variables, live rendered preview, copy rendered output
- Version history: unlimited saves, one-click restore
- Collections: group prompts, color-coded, assignable
- Bulk selection and bulk delete
- Statistics view: top prompts, tag cloud, by-category, AI provider usage
- Import/Export: full JSON, merge or replace mode
- `data/settings.json` for provider configs (separate from prompt data)
- Proper Express route separation (`routes/` directory)
- Professional README, LICENSE, CONTRIBUTING, CHANGELOG
- `.gitignore` protecting API keys from accidental commits

### Changed
- Complete UI redesign: Outfit + Manrope + JetBrains Mono fonts
- Deep navy-slate color system with indigo accent
- Modular file structure: `lib/`, `routes/`, `public/css/`, `public/js/`
- All API keys stored in `data/settings.json`, masked in API responses

### Fixed
- Variable detection now handles edge cases in content
- Version history capped at 25 per prompt to prevent DB bloat

---

## [1.0.0] — 2025 (Initial Release)

### Added
- Basic prompt CRUD
- Category system
- Tag system
- Version history
- Collections
- JSON export/import
- sql.js database (later replaced with plain JSON for portability)
