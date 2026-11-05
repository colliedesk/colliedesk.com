// public/consent.js reports the switch funnel to the Meta pixel, so ads can be judged and optimized on
// steps that happen far more often than a trial: the switch page seen (ViewContent), read to 75%
// (SwitchScroll75), the trial link clicked (InitiateCheckout) and the switch call link clicked (Contact).
// The events go only where the pixel itself may run (scripts/consent.test.mjs decides that).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/consent.js', import.meta.url), 'utf8');

function visit({ zone = 'America/New_York', choice = null, path = '/migrate/freshdesk/switch', clicks = [], scrollTo = 0 }) {
  const domReady = [];
  const docClicks = [];
  const scrolls = [];
  const window = {
    addEventListener: (type, fn) => { if (type === 'scroll') scrolls.push(fn); },
    setTimeout: (fn) => fn(),
    scrollY: 0,
    innerHeight: 1000,
  };
  const document = {
    cookie: '',
    readyState: 'complete',
    body: { appendChild: () => {} },
    documentElement: { scrollHeight: 4000 },
    head: { appendChild: () => {} },
    createElement: () => ({ setAttribute: () => {}, addEventListener: () => {} }),
    addEventListener: (type, fn) => {
      if (type === 'DOMContentLoaded') domReady.push(fn);
      if (type === 'click') docClicks.push(fn);
    },
  };
  const localStorage = { getItem: (key) => (key === 'colliedesk-consent' ? choice : null), setItem: () => {}, removeItem: () => {} };
  const Intl = { DateTimeFormat: () => ({ resolvedOptions: () => ({ timeZone: zone }) }) };
  runInNewContext(source, {
    window, document, localStorage, Intl, Object, URL,
    location: { hostname: 'colliedesk.com', pathname: path, reload: () => {} },
    navigator: {},
  });
  domReady.forEach((fn) => fn());
  for (const href of clicks) {
    const link = { href };
    docClicks.forEach((fn) => fn({ target: { closest: (sel) => (sel === 'a[href]' ? link : null) } }));
  }
  if (scrollTo) {
    window.scrollY = scrollTo;
    scrolls.forEach((fn) => fn());
    scrolls.forEach((fn) => fn());
  }
  const queue = (window.fbq?.queue ?? []).map((args) => Array.from(args));
  const tracked = (name) => queue.filter((c) => (c[0] === 'track' || c[0] === 'trackCustom') && c[1] === name).length;
  return { pixel: Boolean(window.fbq), tracked };
}

const TRIAL = 'https://app.colliedesk.com/sign-in?intent=trial&utm_source=meta&utm_content=invoice';
const CALL = 'https://cal.com/chinh/colliedesk-switch';

test('the switch page counts as ViewContent, once', () => {
  assert.equal(visit({}).tracked('ViewContent'), 1);
  assert.equal(visit({ path: '/pricing' }).tracked('ViewContent'), 0);
});

test('a trial link click is InitiateCheckout, a switch call click is Contact', () => {
  const v = visit({ clicks: [TRIAL, CALL, 'https://colliedesk.com/pricing'] });
  assert.equal(v.tracked('InitiateCheckout'), 1);
  assert.equal(v.tracked('Contact'), 1);
});

test('plain sign-in (not a trial) is not InitiateCheckout', () => {
  assert.equal(visit({ clicks: ['https://app.colliedesk.com/sign-in?utm_source=meta'] }).tracked('InitiateCheckout'), 0);
});

test('reading the switch page to 75% is reported once', () => {
  assert.equal(visit({ scrollTo: 1900 }).tracked('SwitchScroll75'), 0, '(1900+1000)/4000 is 72.5%');
  assert.equal(visit({ scrollTo: 2100 }).tracked('SwitchScroll75'), 1, '(2100+1000)/4000 is 77.5%, sent once for two scroll events');
  assert.equal(visit({ path: '/pricing', scrollTo: 3000 }).tracked('SwitchScroll75'), 0);
});

test('no pixel means no funnel events: opt-in place without Accept', () => {
  const v = visit({ zone: 'Europe/Berlin', clicks: [TRIAL, CALL], scrollTo: 3000 });
  assert.equal(v.pixel, false);
});

test('an opt-in place after Accept gets the funnel events too', () => {
  const v = visit({ zone: 'Europe/Berlin', choice: 'granted', clicks: [TRIAL] });
  assert.equal(v.tracked('ViewContent'), 1);
  assert.equal(v.tracked('InitiateCheckout'), 1);
});
