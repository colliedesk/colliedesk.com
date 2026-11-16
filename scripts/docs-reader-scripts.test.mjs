// The small scripts of docs pages, run against stub pages: the feedback question reports to PostHog
// through the page's analytics setup (and keeps working where PostHog does not run), Cmd/Ctrl+K opens
// search, and "Copy MCP URL" puts the server URL on the clipboard.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

// Objects made inside the script's context have that context's prototypes; compare their data.
const plain = (v) => JSON.parse(JSON.stringify(v));
const source = (name) => readFileSync(new URL(`../public/${name}`, import.meta.url), 'utf8');

function element(attrs = {}) {
  const listeners = {};
  return {
    attrs, listeners, hidden: false, disabled: false, textContent: '', dataset: {},
    getAttribute: (k) => (k in attrs ? attrs[k] : null),
    setAttribute: (k, v) => { attrs[k] = String(v); },
    addEventListener: (type, fn) => { (listeners[type] ??= []).push(fn); },
    focus: () => {}, select: () => {},
  };
}

function page(name, { elements, globals = {} }) {
  const ready = [];
  const docListeners = {};
  const document = {
    addEventListener: (type, fn) => { if (type === 'DOMContentLoaded') ready.push(fn); else (docListeners[type] ??= []).push(fn); },
    querySelector: (s) => elements[s] ?? null,
    querySelectorAll: (s) => elements[s] ?? [],
  };
  runInNewContext(source(name), { document, window: globals, navigator: globals.navigator ?? {}, ...globals });
  for (const f of ready) f();
  return { docListeners };
}

function feedbackPage(posthog) {
  const yes = element({ 'data-helpful': 'yes' });
  const no = element({ 'data-helpful': 'no' });
  const status = element();
  const box = element({ 'data-path': '/docs/connect-codex' });
  box.querySelectorAll = () => [yes, no];
  box.querySelector = () => status;
  page('docs-feedback.js', { elements: { '[data-docs-feedback]': box }, globals: posthog ? { posthog } : {} });
  return { yes, no, status };
}

test('"Yes" sends docs_feedback with the page path and helpful: true, then thanks the reader', () => {
  const calls = [];
  const { yes, no, status } = feedbackPage({ capture: (...args) => calls.push(args) });
  yes.listeners.click[0]();
  assert.deepEqual(plain(calls), [['docs_feedback', { path: '/docs/connect-codex', helpful: true }]]);
  assert.equal(status.textContent, 'Thanks for telling us.');
  assert.ok(yes.disabled && no.disabled, 'one answer per page view');
});

test('"No" sends helpful: false', () => {
  const calls = [];
  const { no } = feedbackPage({ capture: (...args) => calls.push(args) });
  no.listeners.click[0]();
  assert.deepEqual(plain(calls), [['docs_feedback', { path: '/docs/connect-codex', helpful: false }]]);
});

test('without PostHog (a preview, an automated browser) the answer still gets its thanks', () => {
  const { yes, status } = feedbackPage(null);
  assert.doesNotThrow(() => yes.listeners.click[0]());
  assert.equal(status.textContent, 'Thanks for telling us.');
});

function searchPage() {
  let opened = 0;
  const dialog = element();
  dialog.showModal = () => { opened++; dialog.open = true; };
  dialog.close = () => { dialog.open = false; };
  dialog.querySelector = () => element();
  const { docListeners } = page('docs-search.js', {
    elements: { '[data-docs-search]': dialog, '[data-docs-search-open]': [], '[data-docs-search-key]': [] },
    globals: { navigator: { platform: 'MacIntel' } },
  });
  const press = (e) => { let prevented = false; for (const f of docListeners.keydown ?? []) f({ ...e, preventDefault: () => { prevented = true; } }); return prevented; };
  return { press, opened: () => opened, close: () => dialog.close() };
}

test('Cmd+K or Ctrl+K opens docs search; a plain K does not', () => {
  const s = searchPage();
  assert.equal(s.press({ key: 'k', metaKey: true }), true);
  assert.equal(s.opened(), 1);
  s.close();
  s.press({ key: 'K', ctrlKey: true });
  assert.equal(s.opened(), 2);
  s.press({ key: 'k' });
  assert.equal(s.opened(), 2);
});

test('"Copy MCP URL" copies https://app.colliedesk.com/mcp', async () => {
  const written = [];
  const button = element({ 'data-url': 'https://app.colliedesk.com/mcp' });
  page('docs-copy.js', {
    elements: { '[data-docs-copy-mcp]': button },
    globals: { navigator: { clipboard: { writeText: (t) => { written.push(t); return Promise.resolve(); } } }, setTimeout: () => 0, clearTimeout: () => {} },
  });
  button.textContent = 'Copy MCP URL';
  await button.listeners.click[0]();
  assert.deepEqual(written, ['https://app.colliedesk.com/mcp']);
  assert.equal(button.textContent, 'Copied');
});
