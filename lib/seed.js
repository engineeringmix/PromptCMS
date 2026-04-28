// lib/seed.js — Default sample data
const { load, save, nextId } = require('./db');

const now = () => new Date().toISOString();

const CATEGORIES = [
  { name:'Content Writing',   color:'#f59e0b', icon:'✍️' },
  { name:'Code Generation',   color:'#22c55e', icon:'💻' },
  { name:'Data & Analysis',   color:'#06b6d4', icon:'📊' },
  { name:'SEO & Marketing',   color:'#f97316', icon:'📈' },
  { name:'Research',          color:'#a78bfa', icon:'🔬' },
  { name:'Image Generation',  color:'#ec4899', icon:'🎨' },
  { name:'System Prompts',    color:'#6366f1', icon:'⚙️' },
  { name:'Roleplay & Story',  color:'#14b8a6', icon:'🎭' },
];

const SAMPLE_PROMPTS = [
  {
    title: 'Blog Post Writer',
    description: 'SEO-optimized long-form blog post generator with structured sections.',
    content: `Write a comprehensive, SEO-optimized blog post about **{{topic}}** targeting **{{target_audience}}**.

**Requirements:**
- Length: {{word_count}} words
- Tone: {{tone}} (e.g., professional, casual, technical)
- Primary keyword: {{primary_keyword}}
- Include: compelling H1, 4-6 H2 sections, FAQ block, conclusion with CTA

**Structure:**
1. Hook introduction (problem + promise)
2. Main sections with subheadings
3. Data points and examples
4. FAQ (5 questions)
5. Conclusion + call to action
6. Meta description (150-160 chars)

Start writing the full post directly. No preamble.`,
    category: 'Content Writing', tags: ['blog','seo','long-form','writing'],
    model_hint: 'claude-opus-4-5, gpt-4o', is_favorite: 1, is_pinned: 1, use_count: 67,
    system_prompt: 'You are an expert content writer with 10+ years of experience in SEO and digital marketing. Write authoritative, engaging content that ranks well and converts readers.',
  },
  {
    title: 'Code Reviewer',
    description: 'Deep code review: security, performance, best practices, and refactoring.',
    content: `Review the following **{{language}}** code thoroughly.

\`\`\`{{language}}
{{code}}
\`\`\`

Provide a structured review covering:

**1. Security Audit** — Vulnerabilities with severity (Critical/High/Medium/Low)
**2. Performance** — Bottlenecks, complexity issues, optimization suggestions
**3. Code Quality** — Naming, structure, readability, DRY violations
**4. Best Practices** — Language-specific idioms and patterns
**5. Refactored Version** — Improved code with inline comments explaining changes

Be specific. Reference line numbers. Explain the *why* behind each suggestion.`,
    category: 'Code Generation', tags: ['code','review','security','quality','refactor'],
    model_hint: 'claude-opus-4-5, gpt-4o', is_favorite: 1, is_pinned: 0, use_count: 134,
    system_prompt: 'You are a senior software engineer with expertise in security, performance optimization, and clean code principles. Be thorough, specific, and constructive.',
  },
  {
    title: 'Research Synthesizer',
    description: '5-phase deep research synthesis on any topic for any expertise level.',
    content: `Conduct a comprehensive research synthesis on: **{{topic}}**

**Phase 1 — Overview** (for {{expertise_level}})
Explain the core concept in 3 clear paragraphs. Define key terms.

**Phase 2 — Deep Dive**
- Origin and history
- How it works (mechanisms)
- Key components and variations
- Current state of the art
- Open research problems

**Phase 3 — Contrarian View**
What do experts disagree on? Strongest criticisms? Alternative schools of thought?

**Phase 4 — Practical Application**
How does this apply to {{use_case}}? Give 3 concrete, actionable examples.

**Phase 5 — Further Learning**
List 5 authoritative sources (books, papers, or websites) with one-line descriptions of what each covers.`,
    category: 'Research', tags: ['research','deep-dive','synthesis','learning'],
    model_hint: 'claude-opus-4-5, gpt-4o', is_favorite: 1, is_pinned: 0, use_count: 43,
    system_prompt: 'You are a research assistant with broad expertise across science, technology, and humanities. Synthesize information accurately, cite perspectives fairly, and distinguish established facts from emerging theories.',
  },
  {
    title: 'SEO Meta Generator',
    description: 'Complete SEO metadata package: title, description, OG, schema, slug.',
    content: `Generate complete SEO metadata for this page:

**Page Topic:** {{topic}}
**Primary Keyword:** {{primary_keyword}}
**Secondary Keywords:** {{secondary_keywords}}
**Target Location:** {{location}} (or global)
**Page Type:** {{page_type}} (blog post / product / landing page / etc.)

Deliver as structured JSON:
\`\`\`json
{
  "title_tag": "(50-60 chars, keyword near start)",
  "meta_description": "(150-160 chars, includes CTA)",
  "og_title": "(different angle from title tag)",
  "og_description": "(engaging, shareable)",
  "slug": "clean-url-slug",
  "lsi_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "schema_type": "recommended Schema.org type",
  "focus_keyword_density": "recommended %"
}
\`\`\``,
    category: 'SEO & Marketing', tags: ['seo','meta','json','on-page','schema'],
    model_hint: 'claude-sonnet-4-5, gpt-4o-mini', is_favorite: 0, is_pinned: 0, use_count: 29,
    system_prompt: 'You are an SEO specialist with deep knowledge of Google\'s ranking factors, search intent, and metadata optimization. Always output valid JSON.',
  },
  {
    title: 'Image Prompt Builder',
    description: 'Generate optimized prompts for Midjourney, DALL-E, and Stable Diffusion.',
    content: `Create production-ready image generation prompts for:

**Subject:** {{subject}}
**Art Style:** {{art_style}}
**Mood:** {{mood}}
**Lighting:** {{lighting}}
**Color Palette:** {{colors}}
**Aspect Ratio:** {{aspect_ratio}}

Generate three optimized versions:

**1. Midjourney:**
(Comma-separated descriptors, end with --ar {{aspect_ratio}} --v 6 --quality 2)

**2. DALL-E 3:**
(Natural language, very detailed, one flowing paragraph)

**3. Stable Diffusion:**
Positive: (descriptors, quality tags)
Negative: (what to exclude)

Include recommended CFG scale and steps for SD.`,
    category: 'Image Generation', tags: ['image','midjourney','dalle','stable-diffusion','art'],
    model_hint: 'claude-sonnet-4-5', is_favorite: 1, is_pinned: 0, use_count: 88,
    system_prompt: 'You are an expert at prompt engineering for image generation models. You understand the syntax and weighting systems of Midjourney, DALL-E, and Stable Diffusion deeply.',
  },
  {
    title: 'Data Analysis Report',
    description: 'Transform raw data into a structured executive report with insights.',
    content: `Analyse the following dataset and produce a professional report:

\`\`\`
{{data}}
\`\`\`

**Report for:** {{audience}}
**Output format:** {{output_format}}

Structure your report:
1. **Executive Summary** (3 sentences: what, why it matters, top recommendation)
2. **Key Findings** — Top 5 insights with supporting numbers
3. **Trends & Patterns** — What is changing? What correlates?
4. **Anomalies & Outliers** — Flag unexpected data points
5. **Recommendations** — 3 specific, actionable next steps with expected impact
6. **Data Quality Notes** — Gaps, limitations, confidence level`,
    category: 'Data & Analysis', tags: ['data','analysis','report','insights','bi'],
    model_hint: 'claude-opus-4-5, gpt-4o', is_favorite: 0, is_pinned: 0, use_count: 21,
    system_prompt: 'You are a senior data analyst. Be precise with numbers, objective in interpretation, and clear in recommendations. Always qualify uncertainty.',
  },
  {
    title: 'System Prompt Architect',
    description: 'Design a complete system prompt for any AI assistant or chatbot.',
    content: `Design a production-ready system prompt for an AI assistant with this purpose:

**Role:** {{role}}
**Use Case:** {{use_case}}
**Target Users:** {{target_users}}
**Tone:** {{tone}}
**Key Capabilities:** {{capabilities}}
**Hard Restrictions:** {{restrictions}}

Create a system prompt that includes:
1. Role definition and persona
2. Core capabilities and knowledge scope
3. Response format guidelines
4. Tone and communication style
5. Hard limits and refusal conditions
6. Example interaction patterns (3 examples)

The system prompt should be ready to paste directly into any AI platform.`,
    category: 'System Prompts', tags: ['system-prompt','assistant','chatbot','engineering'],
    model_hint: 'claude-opus-4-5, gpt-4o', is_favorite: 1, is_pinned: 1, use_count: 55,
    system_prompt: 'You are an expert prompt engineer specializing in system prompt design. Create clear, effective, and safe system prompts that produce consistent AI behavior.',
  },
  {
    title: 'Code Generator',
    description: 'Generate complete, production-ready code for any feature or component.',
    content: `Generate complete, production-ready {{language}} code for the following:

**Feature:** {{feature_description}}
**Framework/Library:** {{framework}} (or vanilla if none)
**Requirements:**
{{requirements}}

**Constraints:**
- {{constraints}}

Deliver:
1. **Complete implementation** (no placeholders, no "TODO")
2. **Inline comments** explaining non-obvious logic
3. **Usage example** showing how to call/use it
4. **Edge cases handled** — list what you accounted for
5. **Dependencies** — list any packages needed

Write clean, idiomatic {{language}} code following current best practices.`,
    category: 'Code Generation', tags: ['code','generator','implementation','feature'],
    model_hint: 'claude-sonnet-4-5, gpt-4o', is_favorite: 0, is_pinned: 0, use_count: 76,
    system_prompt: 'You are a senior developer. Write complete, working code only. Never use placeholder comments like "// add logic here". Every function must have a real implementation.',
  },
];

function seed() {
  const db = load();
  if (db.categories.length > 0) return; // already seeded

  // Insert categories
  const catMap = {};
  CATEGORIES.forEach(c => {
    const cat = { id: nextId(db), ...c, created_at: now() };
    db.categories.push(cat);
    catMap[c.name] = cat.id;
  });

  // Insert prompts
  SAMPLE_PROMPTS.forEach(p => {
    const catId = catMap[p.category] || null;
    const vars  = (p.content.match(/\{\{([^}]+)\}\}/g) || [])
      .map(m => m.replace(/\{\{|\}\}/g, '').trim());
    const uniq  = [...new Set(vars)];
    const prompt = {
      id: nextId(db), title: p.title, description: p.description,
      content: p.content, system_prompt: p.system_prompt || '',
      category_id: catId, tags: p.tags, variables: uniq,
      model_hint: p.model_hint || '', is_favorite: p.is_favorite || 0,
      is_pinned: p.is_pinned || 0, use_count: p.use_count || 0,
      char_count: p.content.length, token_estimate: Math.round(p.content.length / 4),
      created_at: now(), updated_at: now(),
    };
    db.prompts.push(prompt);
    db.versions.push({
      id: nextId(db), prompt_id: prompt.id, version_num: 1,
      content: p.content, note: 'Initial version', created_at: now(),
    });
  });

  // Default collection
  const col = { id: nextId(db), name: '⭐ Starter Pack', description: 'Essential prompts to get started quickly', color: '#6366f1', created_at: now() };
  db.collections.push(col);
  db.prompts.slice(0, 4).forEach((p, i) => {
    db.collection_prompts.push({ collection_id: col.id, prompt_id: p.id, sort_order: i });
  });

  save(db);
  console.log(`  ✓ Seeded ${db.categories.length} categories, ${db.prompts.length} prompts`);
}

module.exports = { seed };
