// public/consent.js decides, per visitor, whether analytics and ad cookies may load before a choice.
// Opt-in places (EU, EEA, UK, Switzerland, Quebec, or a time zone we cannot place) see the banner and
// nothing loads until Accept. Opt-out places we advertise in (US, Canada outside Quebec's time zones,
// Australia) load them at once unless the browser sends Global Privacy Control or the visitor declined.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/consent.js', import.meta.url), 'utf8');

function visit({ zone, choice = null, gpc = false, openFromFooter = false, clickDecline = false }) {
  const loaded = [];
  const stored = {};
  const domReady = [];
  const clicks = [];
  const docClicks = [];
  let banner = null;
  let reloaded = false;
  const window = {
    addEventListener: () => {},
    setTimeout: (fn) => fn(),
  };
  const body = { appendChild: (el) => { banner = el; } };
  const document = {
    cookie: '_fbp=fb.1.1; _ga=GA1.1',
    readyState: 'complete',
    body,
    head: { appendChild: (el) => { if (el.src) loaded.push(el.src); } },
    createElement: () => ({ setAttribute: () => {}, addEventListener: (type, fn) => clicks.push(fn) }),
    addEventListener: (type, fn) => { if (type === 'DOMContentLoaded') domReady.push(fn); if (type === 'click') docClicks.push(fn); },
  };
  const localStorage = {
    getItem: (key) => (key === 'colliedesk-consent' ? choice : null),
    setItem: (key, value) => { stored[key] = value; },
    removeItem: () => {},
  };
  const Intl = { DateTimeFormat: () => ({ resolvedOptions: () => ({ timeZone: zone }) }) };
  runInNewContext(source, {
    window, document, localStorage, Intl, Object,
    location: { hostname: 'colliedesk.com', reload: () => { reloaded = true; } },
    navigator: { globalPrivacyControl: gpc },
  });
  domReady.forEach((fn) => fn());
  if (openFromFooter) docClicks.forEach((fn) => fn({ target: { closest: (sel) => (sel === '[data-consent-open]' ? {} : null) } }));
  if (clickDecline) {
    if (!banner) throw new Error('no banner to decline in');
    const button = { getAttribute: () => 'denied' };
    clicks.forEach((fn) => fn({ target: { closest: () => button } }));
  }
  const pixel = loaded.some((src) => src.endsWith('/fbevents.js'));
  const ga = loaded.some((src) => src.includes('googletagmanager.com/gtag/js'));
  return { pixel, ga, banner: Boolean(banner && !banner.hidden), stored, reloaded, cookie: document.cookie };
}

test('a US visitor with no choice gets the cookies at once and no banner', () => {
  for (const zone of ['America/New_York', 'America/Los_Angeles', 'America/Indiana/Indianapolis', 'Pacific/Honolulu']) {
    const v = visit({ zone });
    assert.equal(v.pixel, true, `${zone}: Meta pixel`);
    assert.equal(v.ga, true, `${zone}: Google Analytics`);
    assert.equal(v.banner, false, `${zone}: banner`);
  }
});

test('Australia and Canada outside the Quebec time zones are opt-out too', () => {
  for (const zone of ['Australia/Sydney', 'America/Vancouver', 'America/Edmonton', 'America/Halifax']) {
    assert.equal(visit({ zone }).pixel, true, zone);
  }
});

test('opt-in places keep the banner and load nothing before Accept', () => {
  for (const zone of ['Europe/Berlin', 'Europe/London', 'Europe/Dublin', 'Europe/Zurich', 'Atlantic/Canary', 'Asia/Nicosia', 'America/Toronto', 'America/Montreal']) {
    const v = visit({ zone });
    assert.equal(v.pixel, false, `${zone}: Meta pixel`);
    assert.equal(v.ga, false, `${zone}: Google Analytics`);
    assert.equal(v.banner, true, `${zone}: banner`);
  }
});

test('a time zone we cannot place counts as opt-in', () => {
  for (const zone of ['', 'UTC', 'Etc/UTC', 'Asia/Ho_Chi_Minh', 'America/Sao_Paulo']) {
    const v = visit({ zone });
    assert.equal(v.pixel, false, `"${zone}": Meta pixel`);
    assert.equal(v.banner, true, `"${zone}": banner`);
  }
});

test('Global Privacy Control in an opt-out place means no cookies and no banner', () => {
  const v = visit({ zone: 'America/Chicago', gpc: true });
  assert.equal(v.pixel, false);
  assert.equal(v.ga, false);
  assert.equal(v.banner, false);
});

test('a stored Decline wins everywhere, a stored Accept loads everywhere', () => {
  assert.equal(visit({ zone: 'America/New_York', choice: 'denied' }).pixel, false);
  assert.equal(visit({ zone: 'Europe/Berlin', choice: 'granted' }).pixel, true);
  assert.equal(visit({ zone: 'America/New_York', choice: 'granted', gpc: true }).pixel, true);
});

test('declining after cookies loaded by default deletes them and reloads', () => {
  // A US visitor who never chose opens "Your privacy choices" in the footer and declines.
  const v = visit({ zone: 'America/New_York', openFromFooter: true, clickDecline: true });
  assert.equal(v.stored['colliedesk-consent'], 'denied');
  assert.equal(v.reloaded, true, 'the page reloads so nothing keeps running');
  assert.match(v.cookie, /Max-Age=0/, 'the cookies are deleted');
});
