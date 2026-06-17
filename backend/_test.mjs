import { MongoMemoryServer } from 'mongodb-memory-server';
import { execSync, spawn } from 'child_process';

const mongod = await MongoMemoryServer.create({ binary: { version: '7.0.14' } });
const uri = mongod.getUri('nestaro');
const env = { ...process.env, MONGO_URI: uri, JWT_SECRET: 'testsecret', PORT: '5099' };

// 1. Seed
console.log('== SEEDING ==');
execSync('node seed/seed.js', { stdio: 'inherit', env });

// 2. Start server
console.log('\n== STARTING SERVER ==');
const srv = spawn('node', ['server.js'], { env });
srv.stdout.on('data', (d) => process.stdout.write('[srv] ' + d));
srv.stderr.on('data', (d) => process.stderr.write('[srv-err] ' + d));
await new Promise((r) => setTimeout(r, 2500));

const base = 'http://localhost:5099/api';
const j = async (r) => ({ status: r.status, body: await r.json() });
let pass = 0, fail = 0;
const check = (name, cond) => { if (cond) { console.log('  ✅', name); pass++; } else { console.log('  ❌', name); fail++; } };

try {
  console.log('\n== API TESTS ==');
  let r = await j(await fetch(`${base}/properties`));
  check('GET /properties returns items', r.body.items?.length > 0);
  check('total is 20', r.body.total === 20);

  r = await j(await fetch(`${base}/properties?city=Lahore&purpose=sale`));
  check('city+purpose filter works', r.body.items.every((p) => p.city === 'Lahore' && p.purpose === 'sale'));

  r = await j(await fetch(`${base}/properties?sort=priceAsc&limit=50`));
  const prices = r.body.items.map((p) => p.price);
  check('priceAsc sorted', prices.every((v, i) => i === 0 || prices[i - 1] <= v));

  r = await j(await fetch(`${base}/properties?featured=true`));
  check('featured filter returns only featured', r.body.items.every((p) => p.featured));

  const oneId = r.body.items[0]._id;
  r = await j(await fetch(`${base}/properties/${oneId}`));
  check('GET /properties/:id populates agent', !!r.body.agent?.name);

  // Login as agent
  r = await j(await fetch(`${base}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'imran@nestaro.pk', password: 'password123' }) }));
  check('agent login returns token', !!r.body.token);
  const token = r.body.token;
  const auth = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  // Create listing
  r = await j(await fetch(`${base}/properties`, { method: 'POST', headers: auth, body: JSON.stringify({ title: 'Test Plot', price: 5000000, city: 'Lahore', location: 'Test', area: 5, areaUnit: 'Marla', type: 'Plot', images: ['x'] }) }));
  check('agent can create listing', r.status === 201 && r.body._id);
  const newId = r.body._id;

  // Update
  r = await j(await fetch(`${base}/properties/${newId}`, { method: 'PUT', headers: auth, body: JSON.stringify({ price: 6000000 }) }));
  check('agent can update own listing', r.body.price === 6000000);

  // Register a user + favorite
  r = await j(await fetch(`${base}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Tester', email: 't@t.com', password: 'password123' }) }));
  check('user registration works', !!r.body.token);
  const utoken = r.body.token;
  const uauth = { 'Content-Type': 'application/json', Authorization: `Bearer ${utoken}` };

  r = await j(await fetch(`${base}/users/me/favorites/${newId}`, { method: 'POST', headers: uauth }));
  check('toggle favorite on', r.body.favorited === true);
  r = await j(await fetch(`${base}/users/me/favorites`, { headers: uauth }));
  check('favorites list has 1', r.body.length === 1);

  // User cannot create listing (role guard)
  r = await j(await fetch(`${base}/properties`, { method: 'POST', headers: uauth, body: JSON.stringify({ title: 'x', price: 1, city: 'Lahore', location: 'x', area: 1 }) }));
  check('non-agent blocked from posting (403)', r.status === 403);

  // Delete
  r = await j(await fetch(`${base}/properties/${newId}`, { method: 'DELETE', headers: auth }));
  check('agent can delete own listing', r.status === 200);

  console.log(`\n== RESULT: ${pass} passed, ${fail} failed ==`);
} catch (e) {
  console.error('TEST ERROR', e);
  fail++;
} finally {
  srv.kill();
  await mongod.stop();
  process.exit(fail ? 1 : 0);
}
