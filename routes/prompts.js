// routes/prompts.js
const express = require('express');
const { load, save, nextId } = require('../lib/db');
const router = express.Router();

const now = () => new Date().toISOString();
const detectVars = (c) => [...new Set((c.match(/\{\{([^}]+)\}\}/g)||[]).map(m=>m.replace(/\{\{|\}\}/g,'').trim()))];
const tokenEst   = (t) => Math.round(t.length / 4);

// GET /api/prompts
router.get('/', (req, res) => {
  const db = load();
  let list = [...db.prompts];
  const { q, category, tag, favorite, pinned, sort } = req.query;

  if (q) { const lq=q.toLowerCase(); list=list.filter(p=>p.title.toLowerCase().includes(lq)||p.content.toLowerCase().includes(lq)||(p.description||'').toLowerCase().includes(lq)||(p.tags||[]).some(t=>t.toLowerCase().includes(lq))); }
  if (category && category!=='all') list=list.filter(p=>p.category_id==category);
  if (tag)      list=list.filter(p=>(p.tags||[]).includes(tag));
  if (favorite==='1') list=list.filter(p=>p.is_favorite);
  if (pinned==='1')   list=list.filter(p=>p.is_pinned);

  const sorts = { newest:(a,b)=>new Date(b.updated_at)-new Date(a.updated_at), oldest:(a,b)=>new Date(a.created_at)-new Date(b.created_at), alpha:(a,b)=>a.title.localeCompare(b.title), used:(a,b)=>b.use_count-a.use_count };
  list.sort(sorts[sort]||sorts.newest);

  const catMap={};db.categories.forEach(c=>{catMap[c.id]=c;});
  res.json(list.map(p=>({...p,category:catMap[p.category_id]||null})));
});

// GET /api/prompts/:id
router.get('/:id', (req, res) => {
  const db = load();
  const p  = db.prompts.find(p=>p.id==req.params.id);
  if (!p) return res.status(404).json({error:'Not found'});
  const cat=db.categories.find(c=>c.id===p.category_id)||null;
  const versions=db.versions.filter(v=>v.prompt_id==p.id).sort((a,b)=>b.version_num-a.version_num);
  const collections=db.collection_prompts.filter(cp=>cp.prompt_id==p.id).map(cp=>db.collections.find(c=>c.id===cp.collection_id)).filter(Boolean);
  const runs=db.runs.filter(r=>r.prompt_id==p.id).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,20);
  res.json({...p,category:cat,versions,collections,runs});
});

// POST /api/prompts
router.post('/', (req, res) => {
  const {title,content,description,category_id,tags,model_hint,system_prompt,is_favorite,is_pinned} = req.body;
  if (!title||!content) return res.status(400).json({error:'Title and content required'});
  const db=load();
  const vars=detectVars(content);
  const p={id:nextId(db),title:title.trim(),content,description:description||'',system_prompt:system_prompt||'',category_id:category_id||null,tags:tags||[],variables:vars,model_hint:model_hint||'',is_favorite:is_favorite||0,is_pinned:is_pinned||0,use_count:0,char_count:content.length,token_estimate:tokenEst(content),created_at:now(),updated_at:now()};
  db.prompts.push(p);
  db.versions.push({id:nextId(db),prompt_id:p.id,version_num:1,content,note:'Created',created_at:now()});
  save(db); res.json(p);
});

// PUT /api/prompts/:id
router.put('/:id', (req, res) => {
  const db=load();
  const idx=db.prompts.findIndex(p=>p.id==req.params.id);
  if (idx===-1) return res.status(404).json({error:'Not found'});
  const old=db.prompts[idx];
  const {title,content,description,category_id,tags,model_hint,system_prompt,is_favorite,is_pinned,version_note}=req.body;
  if (content && content!==old.content){
    const lastVer=db.versions.filter(v=>v.prompt_id==old.id).sort((a,b)=>b.version_num-a.version_num)[0];
    const vn=(lastVer?.version_num||0)+1;
    db.versions.push({id:nextId(db),prompt_id:old.id,version_num:vn,content,note:version_note||`Version ${vn}`,created_at:now()});
    // Keep max 25 versions
    const vers=db.versions.filter(v=>v.prompt_id==old.id).sort((a,b)=>a.version_num-b.version_num);
    if (vers.length>25) db.versions=db.versions.filter(v=>!(v.prompt_id==old.id&&v.version_num===vers[0].version_num));
  }
  const upd={...old,
    title:title!==undefined?title.trim():old.title,
    content:content!==undefined?content:old.content,
    description:description!==undefined?description:old.description,
    system_prompt:system_prompt!==undefined?system_prompt:old.system_prompt,
    category_id:category_id!==undefined?category_id:old.category_id,
    tags:tags!==undefined?tags:old.tags,
    model_hint:model_hint!==undefined?model_hint:old.model_hint,
    is_favorite:is_favorite!==undefined?is_favorite:old.is_favorite,
    is_pinned:is_pinned!==undefined?is_pinned:old.is_pinned,
    variables:content!==undefined?detectVars(content):old.variables,
    char_count:content!==undefined?content.length:old.char_count,
    token_estimate:content!==undefined?tokenEst(content):old.token_estimate,
    updated_at:now()};
  db.prompts[idx]=upd; save(db); res.json(upd);
});

// DELETE /api/prompts/:id
router.delete('/:id', (req, res) => {
  const db=load(); const id=parseInt(req.params.id);
  db.prompts=db.prompts.filter(p=>p.id!==id);
  db.versions=db.versions.filter(v=>v.prompt_id!==id);
  db.collection_prompts=db.collection_prompts.filter(cp=>cp.prompt_id!==id);
  db.runs=db.runs.filter(r=>r.prompt_id!==id);
  save(db); res.json({ok:true});
});

// POST /api/prompts/bulk-delete
router.post('/bulk-delete', (req, res) => {
  const {ids}=req.body;
  if (!Array.isArray(ids)) return res.status(400).json({error:'ids array required'});
  const db=load();
  ids.forEach(id=>{
    db.prompts=db.prompts.filter(p=>p.id!=id);
    db.versions=db.versions.filter(v=>v.prompt_id!=id);
    db.collection_prompts=db.collection_prompts.filter(cp=>cp.prompt_id!=id);
    db.runs=db.runs.filter(r=>r.prompt_id!=id);
  });
  save(db); res.json({ok:true,deleted:ids.length});
});

// POST /api/prompts/:id/duplicate
router.post('/:id/duplicate', (req, res) => {
  const db=load(); const orig=db.prompts.find(p=>p.id==req.params.id);
  if (!orig) return res.status(404).json({error:'Not found'});
  const copy={...orig,id:nextId(db),title:orig.title+' (Copy)',is_pinned:0,use_count:0,created_at:now(),updated_at:now()};
  db.prompts.push(copy);
  db.versions.push({id:nextId(db),prompt_id:copy.id,version_num:1,content:copy.content,note:`Duplicated from #${orig.id}`,created_at:now()});
  save(db); res.json(copy);
});

// POST /api/prompts/:id/use
router.post('/:id/use', (req, res) => {
  const db=load(); const idx=db.prompts.findIndex(p=>p.id==req.params.id);
  if (idx===-1) return res.status(404).json({error:'Not found'});
  db.prompts[idx].use_count=(db.prompts[idx].use_count||0)+1; save(db);
  res.json({use_count:db.prompts[idx].use_count});
});

// POST /api/prompts/:id/restore/:vnum
router.post('/:id/restore/:vnum', (req, res) => {
  const db=load(); const idx=db.prompts.findIndex(p=>p.id==req.params.id);
  if (idx===-1) return res.status(404).json({error:'Not found'});
  const ver=db.versions.find(v=>v.prompt_id==req.params.id&&v.version_num==req.params.vnum);
  if (!ver) return res.status(404).json({error:'Version not found'});
  const lastVer=db.versions.filter(v=>v.prompt_id==req.params.id).sort((a,b)=>b.version_num-a.version_num)[0];
  const vn=(lastVer?.version_num||0)+1;
  db.versions.push({id:nextId(db),prompt_id:db.prompts[idx].id,version_num:vn,content:ver.content,note:`Restored from v${ver.version_num}`,created_at:now()});
  db.prompts[idx]={...db.prompts[idx],content:ver.content,variables:detectVars(ver.content),char_count:ver.content.length,token_estimate:tokenEst(ver.content),updated_at:now()};
  save(db); res.json(db.prompts[idx]);
});

module.exports = router;
