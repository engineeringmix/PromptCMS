// routes/collections.js
const express = require('express');
const { load, save, nextId } = require('../lib/db');
const r = express.Router();
const now = () => new Date().toISOString();

r.get('/', (req, res) => {
  const db=load(); const counts={};
  db.collection_prompts.forEach(cp=>{counts[cp.collection_id]=(counts[cp.collection_id]||0)+1;});
  res.json(db.collections.map(c=>({...c,count:counts[c.id]||0})));
});
r.post('/', (req, res) => {
  const {name,description,color}=req.body; if (!name) return res.status(400).json({error:'Name required'});
  const db=load(); const col={id:nextId(db),name:name.trim(),description:description||'',color:color||'#6366f1',created_at:now()};
  db.collections.push(col); save(db); res.json(col);
});
r.put('/:id', (req, res) => {
  const db=load(); const idx=db.collections.findIndex(c=>c.id==req.params.id);
  if (idx===-1) return res.status(404).json({error:'Not found'});
  db.collections[idx]={...db.collections[idx],...req.body,id:db.collections[idx].id};
  save(db); res.json(db.collections[idx]);
});
r.delete('/:id', (req, res) => {
  const db=load(); const id=parseInt(req.params.id);
  db.collections=db.collections.filter(c=>c.id!==id);
  db.collection_prompts=db.collection_prompts.filter(cp=>cp.collection_id!==id);
  save(db); res.json({ok:true});
});
r.get('/:id/prompts', (req, res) => {
  const db=load();
  const entries=db.collection_prompts.filter(cp=>cp.collection_id==req.params.id).sort((a,b)=>a.sort_order-b.sort_order);
  const catMap={};db.categories.forEach(c=>{catMap[c.id]=c;});
  const prompts=entries.map(e=>{const p=db.prompts.find(p=>p.id===e.prompt_id);return p?{...p,category:catMap[p.category_id]||null}:null;}).filter(Boolean);
  res.json(prompts);
});
r.post('/:id/prompts', (req, res) => {
  const {prompt_id}=req.body; if (!prompt_id) return res.status(400).json({error:'prompt_id required'});
  const db=load();
  if (db.collection_prompts.some(cp=>cp.collection_id==req.params.id&&cp.prompt_id==prompt_id)) return res.status(409).json({error:'Already in collection'});
  const maxOrder=db.collection_prompts.filter(cp=>cp.collection_id==req.params.id).reduce((m,cp)=>Math.max(m,cp.sort_order),-1);
  db.collection_prompts.push({collection_id:parseInt(req.params.id),prompt_id:parseInt(prompt_id),sort_order:maxOrder+1});
  save(db); res.json({ok:true});
});
r.delete('/:id/prompts/:pid', (req, res) => {
  const db=load();
  db.collection_prompts=db.collection_prompts.filter(cp=>!(cp.collection_id==req.params.id&&cp.prompt_id==req.params.pid));
  save(db); res.json({ok:true});
});

module.exports = r;
