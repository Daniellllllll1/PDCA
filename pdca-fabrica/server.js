const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '1mb' }));

const PASS = process.env.ACCESS_PASSWORD || '';
app.use('/api', (req, res, next) => {
  if (PASS && req.get('x-pin') !== PASS) return res.status(401).json({ error: 'senha' });
  next();
});

// Armazenamento: Postgres (DATABASE_URL) ou arquivo local (só para testes)
let store;
if (process.env.DATABASE_URL) {
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  store = {
    init: () => pool.query('create table if not exists pdca_ciclos (id text primary key, data jsonb not null)'),
    all: async () => (await pool.query('select data from pdca_ciclos')).rows.map(r => r.data),
    put: (id, d) => pool.query(
      'insert into pdca_ciclos (id, data) values ($1, $2) on conflict (id) do update set data = $2', [id, d]),
    del: id => pool.query('delete from pdca_ciclos where id = $1', [id]),
  };
} else {
  const F = process.env.DATA_FILE || path.join(__dirname, 'data.json');
  let m = {};
  try { m = JSON.parse(fs.readFileSync(F, 'utf8')); } catch (e) {}
  const w = () => fs.writeFileSync(F, JSON.stringify(m));
  store = {
    init: async () => {},
    all: async () => Object.values(m),
    put: async (id, d) => { m[id] = d; w(); },
    del: async id => { delete m[id]; w(); },
  };
}

const okId = id => /^[\w-]{1,40}$/.test(id);
const wrap = fn => (req, res) => fn(req, res).catch(e => { console.error(e); res.status(500).json({ error: 'erro' }); });

app.get('/api/ciclos', wrap(async (req, res) => res.json(await store.all())));
app.put('/api/ciclos/:id', wrap(async (req, res) => {
  const b = req.body;
  if (!okId(req.params.id) || !b || typeof b !== 'object' || b.id !== req.params.id) return res.status(400).json({ error: 'dados inválidos' });
  await store.put(req.params.id, b);
  res.json({ ok: true });
}));
app.delete('/api/ciclos/:id', wrap(async (req, res) => {
  if (!okId(req.params.id)) return res.status(400).json({ error: 'id inválido' });
  await store.del(req.params.id);
  res.json({ ok: true });
}));

app.use(express.static(path.join(__dirname, 'public')));

store.init().then(() => {
  app.listen(process.env.PORT || 3000, () => console.log('PDCA no ar'));
}).catch(e => { console.error('Falha ao iniciar o banco:', e); process.exit(1); });
