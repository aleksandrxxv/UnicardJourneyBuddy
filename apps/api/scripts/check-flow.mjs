// End-to-end check of accounts, pairing and access rules against the Firebase emulators.
// Needs `npm run emulators` and `npm run api` running. Run with: npm run check:flow
// Creates throwaway test accounts in the emulator only — never real accounts or data.
const AUTH = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake';
const API = process.env.API_URL ?? 'http://127.0.0.1:4000';
const signUp = async (body) => (await (await fetch(AUTH, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...body, returnSecureToken: true }) })).json()).idToken;
const call = async (token, method, path, body) => {
  const r = await fetch(API + path, { method, headers: { 'content-type': 'application/json', ...(token && { authorization: 'Bearer ' + token }) }, body: body && JSON.stringify(body) });
  const text = await r.text();
  return [r.status, text ? JSON.parse(text) : null];
};
let passed = 0;
let failed = 0;
const check = (label, cond) => {
  cond ? passed++ : failed++;
  console.log((cond ? 'PASS ' : 'FAIL ') + label);
};

const parent = await signUp({ email: `parent${Date.now()}@example.test`, password: 'test-pass-123' });
const other = await signUp({ email: `other${Date.now()}@example.test`, password: 'test-pass-123' });
const phone = await signUp({});
const stranger = await signUp({});

check('no token → 401', (await call(null, 'GET', '/me'))[0] === 401);
check('parent /me', (await call(parent, 'GET', '/me'))[1].role === 'parent');
check('phone unpaired', (await call(phone, 'GET', '/me'))[1].role === 'unpaired');
const [cs, child] = await call(parent, 'POST', '/children', { name: 'Sam' });
check('create child', cs === 201);
check('phone cannot create child', (await call(phone, 'POST', '/children', { name: 'X' }))[0] === 403);
check('other parent cannot see child', (await call(other, 'GET', `/children/${child.id}/destinations`))[0] === 404);
check('unpaired phone cannot see child', (await call(phone, 'GET', `/children/${child.id}/destinations`))[0] === 404);
const [ps, pc] = await call(parent, 'POST', `/children/${child.id}/pairing-code`);
check('pairing code', ps === 201 && /^\d{6}$/.test(pc.code));
check('wrong code', (await call(phone, 'POST', '/pairing/claim', { code: '000000' === pc.code ? '111111' : '000000' }))[0] === 400);
const [cls, me] = await call(phone, 'POST', '/pairing/claim', { code: pc.code });
check('claim', cls === 200 && me.role === 'child' && me.child.name === 'Sam');
check('code is single use', (await call(stranger, 'POST', '/pairing/claim', { code: pc.code }))[0] === 400);
const [ds, dests] = await call(phone, 'GET', `/children/${child.id}/destinations`);
check('paired phone sees destinations', ds === 200 && dests.length === 4);
check('paired phone plans trip', (await call(phone, 'POST', '/journeys/plan', { childId: child.id, destinationId: 'school', from: { lat: 51.53, lng: -0.12 } }))[0] === 200);
check('unapproved destination → 403', (await call(phone, 'POST', '/journeys/plan', { childId: child.id, destinationId: 'casino', from: { lat: 51.53, lng: -0.12 } }))[0] === 403);
check('parent list shows 1 device', (await call(parent, 'GET', '/children'))[1][0].pairedDevices === 1);
check('unpair', (await call(parent, 'DELETE', `/children/${child.id}/devices`))[0] === 204);
check('phone unpaired again', (await call(phone, 'GET', '/me'))[1].role === 'unpaired');
console.log(`\n${passed} of ${passed + failed} checks passed`);
process.exitCode = failed ? 1 : 0;
