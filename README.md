# 📚 PMS — Prompt Management System

> **Free, local-first Prompt Management System with full AI provider integration.**  
> Store, organize, version, and execute prompts — entirely on your own machine.

![Version](https://img.shields.io/badge/version-2.0.0-6366f1?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)
![Node](https://img.shields.io/badge/node-%3E%3D16-38bdf8?style=flat-square)
![Local First](https://img.shields.io/badge/data-local%20only-f59e0b?style=flat-square)

---

## ✨ Features

| Feature | Details |
|---|---|
| **Prompt Library** | Create, edit, duplicate, pin, and favorite prompts |
| **`{{Variables}}`** | Dynamic placeholders auto-detected and fillable in Playground |
| **Version History** | Every save creates a new version — restore any past version |
| **Live Playground** | Fill variables and preview rendered prompt in real time |
| **AI Runner** | Execute prompts against any configured AI provider directly |
| **Collections** | Group related prompts into named, color-coded collections |
| **Categories & Tags** | Organize with custom categories (icon + color) and tags |
| **Bulk Operations** | Select multiple prompts and delete in one click |
| **Statistics** | Usage counts, top prompts, tag cloud, per-category breakdown |
| **Import / Export** | Full JSON backup and restore with merge or replace mode |
| **Local Storage** | All data in `data/pms.json` — no cloud, no accounts |

---

## 🔌 Supported AI Providers

| Provider | Type | Notes |
|---|---|---|
| **OpenAI** | Cloud | GPT-5.5, GPT-5.5 Pro, GPT-5.4, o3 series, GPT Realtime 1.5 |
| **Anthropic** | Cloud | Claude Opus 4.7, Sonnet 4.6, Haiku 4.5 |
| **Google Gemini** | Cloud | Gemini 3.1 Pro, Gemini 3.1 Flash |
| **Groq** | Cloud | Llama 4, Mixtral — ultra-fast inference |
| **Mistral AI** | Cloud | Mistral Large 3, Mistral Small 4, Devstral 2 |
| **OpenRouter** | Aggregator | Access 200+ models via one API |
| **Ollama** | **Local** | Run Llama 4, Mistral, Gemma locally — free forever |
| **Cohere** | Cloud | Command A series (Reasoning, Vision), Rerank 4 |
| **Custom** | Any | Any OpenAI-compatible endpoint |

---

## 🚀 Quick Start

### Requirements
- Node.js **v16 or higher**
- npm (included with Node.js)

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/your-username/prompt-management-system.git
cd prompt-management-system

# 2. Install dependencies
npm install

# 3. Start the server
npm start

# 4. Open in browser
open http://localhost:5500
```

The app will automatically seed 8 sample prompts on first run.

### Custom Port

```bash
PORT=3000 npm start
```

---

## 📁 Project Structure

```
prompt-management-system/
├── server.js              # Express entry point
├── package.json
│
├── lib/
│   ├── db.js              # Local JSON database layer
│   ├── seed.js            # First-run sample data
│   └── ai.js              # AI provider integration (all providers)
│
├── routes/
│   ├── prompts.js         # Prompt CRUD + versioning + bulk
│   ├── categories.js      # Category CRUD
│   ├── collections.js     # Collection CRUD + prompt assignment
│   ├── ai.js              # Provider management + AI execution proxy
│   └── settings.js        # UI settings + import/export + tags
│
├── public/
│   ├── index.html         # Single-page application
│   ├── css/
│   │   └── app.css        # Full design system
│   └── js/
│       └── app.js         # Complete frontend logic
│
└── data/                  # Auto-created on first run
    ├── pms.json           # All prompts, categories, collections
    └── settings.json      # UI settings + AI provider configs (with API keys)
```

---

## 🔒 Privacy & Security

- **All data is stored locally** in `./data/` — nothing leaves your machine
- **API keys** are stored in `data/settings.json` (local file only)
- Add `data/` to `.gitignore` before pushing to any repository (included by default)
- For team use, deploy on a private server and use environment-based secrets

---

## 🎯 The `{{Variable}}` System

Variables are automatically detected from `{{variable_name}}` syntax:

```
Write a {{word_count}}-word blog post about {{topic}} for {{audience}}.
Tone: {{tone}}
Primary keyword: {{primary_keyword}}
```

- Detected variables appear as chips on each prompt card
- The **Playground tab** lets you fill values and preview the rendered output
- The **Run tab** renders variables before sending to the AI provider
- Use `_` for spaces: `{{target_audience}}`, not `{{target audience}}`

---

## 📡 API Reference

### Prompts
| Method | Endpoint | Description |
|---|---|---|
| GET    | `/api/prompts`           | List all prompts (query: q, category, tag, favorite, pinned, sort) |
| GET    | `/api/prompts/:id`       | Get single prompt with versions, collections, runs |
| POST   | `/api/prompts`           | Create prompt |
| PUT    | `/api/prompts/:id`       | Update prompt (auto-versions on content change) |
| DELETE | `/api/prompts/:id`       | Delete prompt |
| POST   | `/api/prompts/bulk-delete` | Delete multiple prompts |
| POST   | `/api/prompts/:id/duplicate` | Duplicate prompt |
| POST   | `/api/prompts/:id/use`   | Increment use counter |
| POST   | `/api/prompts/:id/restore/:vnum` | Restore a version |

### AI Providers
| Method | Endpoint | Description |
|---|---|---|
| GET    | `/api/ai/providers`      | List configured providers (keys masked) |
| GET    | `/api/ai/types`          | Available provider types |
| POST   | `/api/ai/providers`      | Add provider |
| PUT    | `/api/ai/providers/:id`  | Update provider |
| DELETE | `/api/ai/providers/:id`  | Remove provider |
| POST   | `/api/ai/providers/:id/test` | Test connection |
| POST   | `/api/ai/run`            | Execute prompt against a provider |
| GET    | `/api/ai/stats`          | Usage statistics |

### Import / Export
| Method | Endpoint | Description |
|---|---|---|
| GET    | `/api/settings/export`   | Download full JSON backup |
| POST   | `/api/settings/import`   | Import JSON (merge or replace) |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT © [EngineeringMix](https://engineeringmix.com)

Free to use, modify, and distribute. See [LICENSE](LICENSE) for details.

---

## 🌟 Star History

If PMS helps your workflow, please give it a ⭐ on GitHub — it helps others discover it!
