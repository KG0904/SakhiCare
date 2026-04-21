const http = require('http');

const BASE = 'http://localhost:5000';
let TOKEN = '';

function request(method, path, body, token) {
  return new Promise((resolve) => {
    const url = new URL(path, BASE);
    const opts = { hostname: url.hostname, port: url.port, path: url.pathname, method, headers: { 'Content-Type': 'application/json' }, timeout: 5000 };
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    const req = http.request(opts, (res) => {
      let d = '';
      res.on('data', (c) => d += c);
      res.on('end', () => { try { resolve({ s: res.statusCode, b: JSON.parse(d) }); } catch { resolve({ s: res.statusCode, b: d }); } });
    });
    req.on('error', (e) => resolve({ s: 0, b: null, e: e.message }));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('=== SakhiCare Quick Test (with bleedingDays) ===\n');

  // 1. Server
  let r = await request('GET', '/');
  console.log(r.s === 200 ? '✅ 1. Server running' : '❌ 1. Server not running');
  if (r.s !== 200) { console.log('Start server first!'); return; }

  // 2. Signup
  const email = 'test_' + Date.now() + '@test.com';
  r = await request('POST', '/auth/signup', { name: 'Test', email, password: 'test123456' });
  console.log(r.s === 201 ? '✅ 2. Signup works' : '❌ 2. Signup failed: ' + r.s);
  TOKEN = r.b?.data?.token;

  // 3. Login
  r = await request('POST', '/auth/login', { email, password: 'test123456' });
  console.log(r.s === 200 ? '✅ 3. Login works' : '❌ 3. Login failed');

  // 4. Add cycle WITH bleedingDays
  r = await request('POST', '/cycle/add', { lastPeriodDate: '2026-04-01', cycleLength: 28, bleedingDays: 6 }, TOKEN);
  console.log(r.s === 201 && r.b?.data?.bleedingDays === 6 ? '✅ 4. Add cycle with bleedingDays=6' : '❌ 4. Cycle add failed');

  // 5. Add cycle WITHOUT bleedingDays (should default to 5)
  r = await request('POST', '/cycle/add', { lastPeriodDate: '2026-03-01', cycleLength: 30 }, TOKEN);
  console.log(r.s === 201 && r.b?.data?.bleedingDays === 5 ? '✅ 5. Default bleedingDays=5' : '❌ 5. Default failed: ' + r.b?.data?.bleedingDays);

  // 6. Cycle history
  r = await request('GET', '/cycle/history', null, TOKEN);
  console.log(r.s === 200 && r.b?.data?.length >= 2 ? '✅ 6. History shows 2+ cycles' : '❌ 6. History failed');

  // 7. Next period prediction includes bleedingDays
  r = await request('GET', '/prediction/next-period', null, TOKEN);
  const pred = r.b?.data;
  console.log(pred?.nextPeriodStart ? '✅ 7. nextPeriodStart returned' : '❌ 7. No nextPeriodStart');
  console.log(pred?.nextPeriodEnd ? '✅ 8. nextPeriodEnd returned' : '❌ 8. No nextPeriodEnd');
  console.log(pred?.bleedingDays ? '✅ 9. bleedingDays in prediction: ' + pred.bleedingDays : '❌ 9. No bleedingDays');
  console.log(pred?.predictedNextPeriod ? '✅ 10. Backward-compat predictedNextPeriod' : '❌ 10. Missing backward-compat');

  // 8. Ovulation includes bleedingDays
  r = await request('GET', '/prediction/ovulation', null, TOKEN);
  const ov = r.b?.data;
  console.log(ov?.bleedingDays ? '✅ 11. bleedingDays in ovulation: ' + ov.bleedingDays : '❌ 11. No bleedingDays in ovulation');
  console.log(ov?.nextPeriodEnd ? '✅ 12. nextPeriodEnd in ovulation' : '❌ 12. No nextPeriodEnd in ovulation');

  // 9. Health
  r = await request('POST', '/health/update', { hasPCOS: true }, TOKEN);
  console.log(r.s === 200 ? '✅ 13. Health update works' : '❌ 13. Health failed');

  // 10. Chatbot
  r = await request('POST', '/chatbot', { message: 'cramps' }, TOKEN);
  console.log(r.s === 200 && r.b?.data?.botReply?.includes('Disclaimer') ? '✅ 14. Chatbot + disclaimer' : '❌ 14. Chatbot failed');

  // 11. Irregularities
  r = await request('GET', '/cycle/irregularities', null, TOKEN);
  console.log(r.s === 200 ? '✅ 15. Irregularity detection works' : '❌ 15. Irregularity failed');

  console.log('\n=== DONE ===');
}

run();
