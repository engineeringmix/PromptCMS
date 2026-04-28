// routes/categories.js
const express = require('express');
const { load, save, nextId } = require('../lib/db');
const r = express.Router();
const now = () => new Date().toISOString();

r.get('/', (req, res) => {
  const db=load(); const counts={};
  db.prompts.forEach(p=>{counts[p.category_id]=(counts[p.category_id]||0)+1;});
  res.json(db.categories.map(c=>({...c,count:counts[c.id]||0})));
});
r.post('/', (req, res) => {
  const {name,color,icon}=req.body; if (!name) return res.status(400).json({error:'Name required'});
  const db=load(); const cat={id:nextId(db),name:name.trim(),color:color||'#6366f1',icon:icon||'📁',created_at:now()};
  db.categories.push(cat); save(db); res.json(cat);
});
r.put('/:id', (req, res) => {
  const db=load(); const idx=db.categories.findIndex(c=>c.id==req.params.id);
  if (idx===-1) return res.status(404).json({error:'Not found'});
  db.categories[idx]={...db.categories[idx],...req.body,id:db.categories[idx].id};
  save(db); res.json(db.categories[idx]);
});
r.delete('/:id', (req, res) => {
  const db=load(); const id=parseInt(req.params.id);
  db.categories=db.categories.filter(c=>c.id!==id);
  db.prompts.forEach(p=>{if(p.category_id===id)p.category_id=null;});
  save(db); res.json({ok:true});
});

module.exports = r;
