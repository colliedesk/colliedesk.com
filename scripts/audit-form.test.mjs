// public/audit.js sends the /audit form to the Colliedesk web form channel and, only after the
// endpoint accepts it (202), reports a Lead to the Meta pixel and an event to PostHog. The pixel and
// PostHog are loaded by public/consent.js alone; audit.js only calls them when they exist, and never
// passes the email or the help center address to either.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/audit.js', import.meta.url), 'utf8');
const ENDPOINT = 'https://app.colliedesk.com/api/v1/public/forms/hclabs';

/** Loads audit.js against a stub page, fills the form, submits it and waits for the result. */
async function submit({ url = 'https://help.example.com', email = 'ana@example.com', band = '11-25', trap = '', respond = { status: 202 }, search = '', pixel = true, posthog = true } = {}) {
  const calls = { fetch: [], fbq: [], posthog: [] };
  let onSubmit;
  const status = { textContent: '', dataset: {} };
  const button = { disabled: false };
  const form = {
    action: ENDPOINT,
    helpcenter: { value: url }, email: { value: email }, team: { value: band }, website: { value: trap },
    querySelector: (sel) => (sel === '.audit-status' ? status : sel === 'button' ? button : null),
    addEventListener: (type, fn) => { if (type === 'submit') onSubmit = fn; },
    reset: () => {},
  };
  const domReady = [];
  const window = {};
  if (pixel) window.fbq = (...args) => calls.fbq.push(args);
  if (posthog) window.posthog = { capture: (...args) => calls.posthog.push(args) };
  const fetch = (target, init) => {
    calls.fetch.push({ target, init });
    return respond === 'network' ? Promise.reject(new Error('offline')) : Promise.resolve(respond);
  };
  runInNewContext(source, {
    window, fetch, JSON, URL, URLSearchParams,
    document: {
      querySelector: (sel) => (sel === '[data-audit-form]' ? form : null),
      addEventListener: (type, fn) => { if (type === 'DOMContentLoaded') domReady.push(fn); },
    },
    location: { origin: 'https://colliedesk.com', pathname: '/audit', search, href: `https://colliedesk.com/audit${search}#top` },
  });
  domReady.forEach((fn) => fn());
  onSubmit({ preventDefault: () => {} });
  await new Promise((resolve) => setImmediate(resolve));
  return { calls, status, button };
}

// Objects made inside the vm have another prototype; compare them as JSON.
const plain = (value) => JSON.parse(JSON.stringify(value));
const leads = (calls) => calls.fbq.filter((c) => c[0] === 'track' && c[1] === 'Lead');

test('a 202 reports one Lead to Meta and audit_requested to PostHog, with the team size only', async () => {
  const { calls, status } = await submit({});
  assert.deepEqual(plain(leads(calls)), [['track', 'Lead', { content_name: 'audit' }]]);
  assert.deepEqual(plain(calls.posthog), [['audit_requested', { team_size: '11-25' }]]);
  assert.equal(status.dataset.state, 'ok');
  assert.equal(status.textContent, 'Got it. You will get the list by email within 24 hours.');
  const sent = JSON.stringify([calls.fbq, calls.posthog]);
  assert.ok(!sent.includes('ana@example.com') && !sent.includes('help.example.com'), 'no email or URL goes to a tracker');
});

for (const [name, respond, state] of [['422', { status: 422 }, 'error'], ['500', { status: 500 }, 'error'], ['429', { status: 429 }, 'error'], ['a network error', 'network', 'error']]) {
  test(`${name} does not report a Lead or a PostHog event`, async () => {
    const { calls, status, button } = await submit({ respond });
    assert.equal(leads(calls).length, 0);
    assert.equal(calls.fbq.length, 0);
    assert.equal(calls.posthog.length, 0);
    assert.equal(status.dataset.state, state);
    assert.equal(button.disabled, false, 'the button works again');
  });
}

test('a 202 without the pixel or PostHog still succeeds', async () => {
  const { status } = await submit({ pixel: false, posthog: false });
  assert.equal(status.dataset.state, 'ok');
});

test('the JSON body has exactly email, message, source and website', async () => {
  const { calls } = await submit({ search: '?utm_source=meta&utm_campaign=audit-nov&utm_content=v1&fbclid=abc&email=x' });
  assert.equal(calls.fetch.length, 1);
  assert.equal(calls.fetch[0].target, ENDPOINT);
  assert.equal(calls.fetch[0].init.method, 'POST');
  assert.equal(calls.fetch[0].init.headers['Content-Type'], 'application/json');
  const body = JSON.parse(calls.fetch[0].init.body);
  assert.deepEqual(Object.keys(body).sort(), ['email', 'message', 'source', 'website']);
  assert.equal(body.source, 'site:audit');
  assert.equal(body.email, 'ana@example.com');
  assert.equal(body.website, '');
  assert.equal(
    body.message,
    'Help center audit request\nHelp center: https://help.example.com\nAgents: 11-25\nPage: https://colliedesk.com/audit\nUTM: utm_source=meta utm_campaign=audit-nov utm_content=v1',
  );
});

test('the UTM line is left out when the visit has no UTM', async () => {
  const { calls } = await submit({ search: '?fbclid=abc' });
  assert.equal(
    JSON.parse(calls.fetch[0].init.body).message,
    'Help center audit request\nHelp center: https://help.example.com\nAgents: 11-25\nPage: https://colliedesk.com/audit',
  );
});

test('a help center address that is not http(s) is rejected before anything is sent', async () => {
  for (const url of ['ftp://help.example.com', 'javascript:alert(1)', 'help.example.com', 'mailto:a@b.co']) {
    const { calls, status } = await submit({ url });
    assert.equal(calls.fetch.length, 0, url);
    assert.equal(calls.fbq.length, 0, url);
    assert.equal(status.dataset.state, 'error', url);
  }
});

test('the honeypot value is sent as website', async () => {
  const { calls } = await submit({ trap: 'spam.example' });
  assert.equal(JSON.parse(calls.fetch[0].init.body).website, 'spam.example');
});
