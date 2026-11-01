// public/attribution.js carries the ad keys of the landing link (utm_*, ttclid, fbclid) to the
// app's sign-up links, so the app can tell which post or ad brought a trial.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// public/attribution.js is a browser script; run it in a sandbox that offers module.exports.
const sandbox = { module: { exports: {} }, URL, URLSearchParams };
vm.runInNewContext(readFileSync(new URL('../public/attribution.js', import.meta.url), 'utf8'), sandbox);
const { decorate } = sandbox.module.exports;
// Objects from the sandbox have its prototypes; the tests compare their plain copies.
const plain = (value) => JSON.parse(JSON.stringify(value));
const fromSearch = (search) => plain(sandbox.module.exports.fromSearch(search));
const remember = (search, storage, now) => plain(sandbox.module.exports.remember(search, storage, now));

function memoryStorage() {
  const data = new Map();
  return { getItem: (k) => (data.has(k) ? data.get(k) : null), setItem: (k, v) => data.set(k, String(v)) };
}

test('fromSearch keeps the ad keys of a landing link and drops everything else', () => {
  assert.deepEqual(fromSearch('?utm_source=meta&utm_campaign=seat-tax&fbclid=IwAR_x-1&ttclid=E_C_P_9&email=a@b.c&token=abc'),
    { utm_source: 'meta', utm_campaign: 'seat-tax', fbclid: 'IwAR_x-1', ttclid: 'E_C_P_9' },
  );
});

test('fromSearch refuses values outside [A-Za-z0-9._-] or longer than 300 characters', () => {
  assert.deepEqual(fromSearch('?utm_source=<script>&fbclid=' + 'x'.repeat(301)), {});
});

test('decorate adds the keys to the trial, sign-in and Founding links of the app', () => {
  const keys = { utm_source: 'meta', fbclid: 'IwAR_x' };
  assert.equal(decorate('https://app.colliedesk.com/sign-in?intent=trial', keys), 'https://app.colliedesk.com/sign-in?intent=trial&utm_source=meta&fbclid=IwAR_x');
  assert.equal(decorate('https://app.colliedesk.com/sign-in', keys), 'https://app.colliedesk.com/sign-in?utm_source=meta&fbclid=IwAR_x');
  assert.equal(
    decorate('https://app.colliedesk.com/settings/billing?buy=founding', keys),
    'https://app.colliedesk.com/settings/billing?buy=founding&utm_source=meta&fbclid=IwAR_x',
  );
});

test('decorate leaves other links, and keys a link already has, as they are', () => {
  const keys = { utm_source: 'meta', fbclid: 'IwAR_x' };
  assert.equal(decorate('https://colliedesk.com/pricing', keys), 'https://colliedesk.com/pricing');
  assert.equal(decorate('https://app.colliedesk.com/api/v1/public/forms/hclabs', keys), 'https://app.colliedesk.com/api/v1/public/forms/hclabs');
  assert.equal(decorate('https://github.com/colliedesk/colliedesk', keys), 'https://github.com/colliedesk/colliedesk');
  assert.equal(
    decorate('https://app.colliedesk.com/sign-in?utm_source=tiktok', keys),
    'https://app.colliedesk.com/sign-in?utm_source=tiktok&fbclid=IwAR_x',
  );
  assert.equal(decorate('https://app.colliedesk.com/sign-in?intent=trial', {}), 'https://app.colliedesk.com/sign-in?intent=trial');
});

test('remember keeps the keys of the landing page for the next pages of the visit', () => {
  const storage = memoryStorage();
  const t0 = Date.UTC(2026, 10, 1, 9, 0);
  assert.deepEqual(remember('?fbclid=IwAR_x&utm_source=meta', storage, t0), { fbclid: 'IwAR_x', utm_source: 'meta' });
  assert.deepEqual(remember('', storage, t0 + 60_000), { fbclid: 'IwAR_x', utm_source: 'meta' });
  // A new ad link replaces the old keys.
  assert.deepEqual(remember('?utm_source=tiktok', storage, t0 + 120_000), { utm_source: 'tiktok' });
});

test('remember forgets the keys after a day', () => {
  const storage = memoryStorage();
  const t0 = Date.UTC(2026, 10, 1, 9, 0);
  remember('?fbclid=IwAR_x', storage, t0);
  assert.deepEqual(remember('', storage, t0 + 24 * 60 * 60_000 + 1), {});
});

test('remember works without storage (blocked or private mode)', () => {
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.deepEqual(remember('?fbclid=IwAR_x', blocked, 0), { fbclid: 'IwAR_x' });
  assert.deepEqual(remember('', blocked, 0), {});
});
