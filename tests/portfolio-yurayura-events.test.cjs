const test = require('node:test');
const assert = require('node:assert/strict');
const api = require('../js/portfolio-yurayura-events.js');

const makeEvent = (overrides = {}) => ({
  id: 'yurayura-02', edition: 2, published: true, city: '横浜', venue: '確認済み会場',
  startsAt: '2030-10-06T13:00:00+09:00', endsAt: '2030-10-12T13:00:00+09:00',
  officialUrl: 'https://mizukioyama.github.io/yurayura/information.html#past-exhibitions',
  portfolioDetailUrl: 'https://mizukioyama.github.io/website/exhibitions/yurayura/',
  artists: ['Mizuki', 'かおる'], artworkCount: 18,
  copy: {
    yurayura: { ja: '作品と空間のあいだに余白をひらきます。', en: 'The exhibition opens a space between artworks and their surroundings.' },
    portfolio: { ja: '小山瑞樹が企画・主催する第2回の展示です。', en: 'Mizuki Oyama is organizing the second exhibition.' }
  },
  ...overrides
});

function offsetFromNow(offsetMs) {
  return new Date(Date.now() + offsetMs).toISOString().replace(/\.\d{3}Z$/, "Z");
}

test('only published, valid records survive normalization and unknown fields fail closed', () => {
  const rows = api.normalizeEvents([
    makeEvent(),
    { ...makeEvent({ id: 'hidden', edition: 3, published: false, privateNotes: 'PRIVATE' }) }
  ]);
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0].copy.portfolio, makeEvent().copy.portfolio);
  assert(!JSON.stringify(rows).includes('PRIVATE'));
  assert.throws(() => api.normalizeEvents([{ ...makeEvent(), privateNotes: 'PRIVATE' }]));
  assert.throws(() => api.normalizeEvents([{ ...makeEvent(), copy: { ...makeEvent().copy, portfolio: { ...makeEvent().copy.portfolio, privateNotes: 'PRIVATE' } } }]));
  assert.throws(() => api.normalizeEvents({}));
});

test('Japanese and English copy are required independently for both sites', () => {
  const event = makeEvent({ copy: { ...makeEvent().copy, portfolio: { ja: '日本語だけ' } } });
  assert.throws(() => api.normalizeEvents([event]));
});

test('unsafe detail links, invalid dates and incomplete locations are rejected', () => {
  assert.throws(() => api.normalizeEvents([makeEvent({ officialUrl: 'javascript:alert(1)' })]));
  assert.throws(() => api.normalizeEvents([makeEvent({ portfolioDetailUrl: 'https://evil.example/website/exhibitions/yurayura/' })]));
  assert.throws(() => api.normalizeEvents([makeEvent({ startsAt: '2030-02-30T00:00:00Z' })]));
  assert.throws(() => api.normalizeEvents([makeEvent({ city: undefined })]));
});

test('JST boundaries and undated records follow the official event-state convention', () => {
  const event = makeEvent({ startsAt: '2030-10-06T13:00:00+09:00', endsAt: '2030-10-12T13:00:00+09:00' });
  const start = Date.parse('2030-10-06T04:00:00Z'), end = Date.parse('2030-10-12T04:00:00Z');
  assert.equal(api.eventState(event, start - 1), 'upcoming');
  assert.equal(api.eventState(event, start), 'current');
  assert.equal(api.eventState(event, end - 1), 'current');
  assert.equal(api.eventState(event, end), 'past');
  assert.equal(api.eventState(makeEvent({ startsAt: null, endsAt: null }), Date.now()), 'undated');
});

test('current, upcoming, past and undated rows sort deterministically', () => {
  const now = Date.now();
  const current = makeEvent({ id: 'current', edition: 2, startsAt: offsetFromNow(-3600000), endsAt: offsetFromNow(3600000) });
  const early = makeEvent({ id: 'early', edition: 3, startsAt: offsetFromNow(86400000), endsAt: offsetFromNow(172800000) });
  const late = makeEvent({ id: 'late', edition: 4, startsAt: offsetFromNow(259200000), endsAt: offsetFromNow(345600000) });
  const undated = makeEvent({ id: 'undated', edition: 5, startsAt: null, endsAt: null, city: null, venue: null, portfolioDetailUrl: undefined });
  const past = makeEvent({ id: 'past', edition: 1, startsAt: offsetFromNow(-345600000), endsAt: offsetFromNow(-259200000) });
  const groups = api.groupEvents([undated, late, past, early, current], now);
  assert.deepEqual(groups.current.map(row => row.id), ['current']);
  assert.deepEqual(groups.upcoming.map(row => row.id), ['early', 'late', 'undated']);
  assert.deepEqual(groups.past.map(row => row.id), ['past']);
});

test('feed URLs use the local JSON source in preview and a cache-busting public URL in production', () => {
  const local = api.buildFeedUrl({ hostname: '127.0.0.1', origin: 'http://127.0.0.1:4173' }, 60000);
  assert.equal(local, 'http://127.0.0.1:4173/website/__preview/yurayura-events.json');
  const remote = new URL(api.buildFeedUrl({ hostname: 'mizukioyama.github.io', origin: 'https://mizukioyama.github.io' }, 120000));
  assert.equal(remote.origin, 'https://mizukioyama.github.io');
  assert.equal(remote.pathname, '/yurayura/assets/data/exhibitions.json');
  assert.equal(remote.searchParams.get('v'), '2');
});

test('fetch bypasses the browser cache and omits cross-site credentials', async () => {
  let observed;
  const rows = await api.loadEvents(async (url, options) => {
    observed = { url, options };
    return { ok: true, json: async () => [makeEvent()] };
  }, { hostname: 'mizukioyama.github.io', origin: 'https://mizukioyama.github.io' }, Date.now());
  assert.equal(rows.length, 1);
  assert.equal(observed.options.cache, 'no-store');
  assert.equal(observed.options.credentials, 'omit');
  assert.equal(observed.options.mode, 'cors');
});

test('fetch and JSON errors reject instead of reporting an empty schedule', async () => {
  await assert.rejects(api.loadEvents(async () => ({ ok: false }), { hostname: 'localhost', origin: 'http://localhost:4173' }, Date.now()));
  await assert.rejects(api.loadEvents(async () => ({ ok: true, json: async () => ({ invalid: true }) }), { hostname: 'localhost', origin: 'http://localhost:4173' }, Date.now()));
  await assert.rejects(api.loadEvents(async () => ({ ok: true, json: async () => { throw new SyntaxError('invalid JSON'); } }), { hostname: 'localhost', origin: 'http://localhost:4173' }, Date.now()));
});
