// public/analytics.js reports JavaScript errors to PostHog, but only errors a change to this site could
// fix. Two kinds are dropped before they are sent:
//   - errors thrown by code a browser or an extension injected into the page, whose every stack frame
//     has a non-web address (the Facebook in-app browser on Android throws "Error invoking postMessage:
//     Java object is gone" from iabjs://navigation_performance_logger_android while the page unloads);
//   - the browser's opaque "Script error." with no stack: a script from another origin failed and the
//     browser hides what and where. The site's own scripts are same-origin and PostHog's is loaded with
//     crossorigin, so their errors always arrive with a message and a stack.
// Fixtures are the raw frames PostHog recorded on /migrate/freshdesk/switch and /audit (6 and 12/11/2026).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/analytics.js', import.meta.url), 'utf8');

function beforeSend() {
  const configs = [];
  const posthog = { __SV: 1, init: (key, config) => configs.push(config), opt_in_capturing: () => {} };
  runInNewContext(source, {
    posthog, window: { posthog }, document: {}, localStorage: { getItem: () => null },
    location: { hostname: 'colliedesk.com' }, navigator: { webdriver: false },
  });
  assert.equal(configs.length, 1, 'PostHog starts once');
  const hook = configs[0].before_send;
  assert.equal(typeof hook, 'function', 'analytics.js sets before_send');
  return hook;
}

const frame = (filename, fn, lineno = 1, colno = 1) => ({ filename, function: fn, lineno, colno, in_app: false, platform: 'web:javascript' });
const exception = (list) => ({ event: '$exception', properties: { $exception_list: list, $current_url: 'https://colliedesk.com/migrate/freshdesk/switch' } });
const error = (value, frames) => ({ type: 'Error', value, mechanism: { handled: false, synthetic: !frames }, ...(frames ? { stacktrace: { type: 'raw', frames } } : {}) });

const IAB_ANDROID = error('Error invoking postMessage: Java object is gone', [
  frame('iabjs://navigation_performance_logger_android', '?', 1, 20806),
  frame('iabjs://navigation_performance_logger_android', 'sendBeforeUnloadMessage', 1, 15376),
  frame('iabjs://navigation_performance_logger_android', 'sendDataToNative', 1, 11722),
]);
const SCRIPT_ERROR = error('Script error.');
const OUR_ERROR = error("Cannot read properties of null (reading 'value')", [
  frame('https://colliedesk.com/audit.js', 'submit', 41, 12),
]);

test('an error thrown only by in-app-browser code (iabjs://) is not sent', () => {
  assert.equal(beforeSend()(exception([IAB_ANDROID])), null);
});

test('an extension-only stack is not sent either', () => {
  assert.equal(beforeSend()(exception([error('x is undefined', [frame('chrome-extension://abc/content.js', 'run')])])), null);
});

test('the opaque cross-origin "Script error." with no stack is not sent', () => {
  assert.equal(beforeSend()(exception([SCRIPT_ERROR])), null);
});

test('an error with a frame in the site\'s own script is sent unchanged', () => {
  const event = exception([OUR_ERROR]);
  assert.equal(beforeSend()(event), event);
});

test('a chain that mixes injected and site frames is sent', () => {
  const mixed = error('boom', [frame('iabjs://navigation_performance_logger_android', '?'), frame('https://colliedesk.com/consent.js', 'store')]);
  const event = exception([mixed]);
  assert.equal(beforeSend()(event), event);
});

test('an error with a message but no stack is sent (nothing says it is not ours)', () => {
  const event = exception([error("Can't find variable: CONFIG")]);
  assert.equal(beforeSend()(event), event);
});

test('an exception without a readable list is sent, and nothing throws', () => {
  const hook = beforeSend();
  for (const properties of [{}, { $exception_list: null }, { $exception_list: 'x' }, { $exception_list: [null] }, { $exception_list: [] }]) {
    const event = { event: '$exception', properties };
    assert.equal(hook(event), event, JSON.stringify(properties));
  }
});

test('every other event passes through unchanged, null included', () => {
  const hook = beforeSend();
  for (const event of [
    { event: '$pageview', properties: { $current_url: 'https://colliedesk.com/audit' } },
    { event: 'audit_requested', properties: {} },
    { event: '$autocapture' },
  ]) assert.equal(hook(event), event, event.event);
  assert.equal(hook(null), null);
});
