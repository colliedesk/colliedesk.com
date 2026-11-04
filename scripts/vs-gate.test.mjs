import assert from 'node:assert/strict';
import { test } from 'node:test';
import { compareFindings, sourceFileOf } from './vs-gate.mjs';

// Dates are worked by hand from the calendar: 16 October 2026 to 4 November 2026 is 19 days;
// 1 August 2026 to 4 November 2026 is 95 days, over the 90-day limit.
const NOW = Date.parse('2026-11-04T03:00:00Z');
const EDIT = 'https://github.com/colliedesk/colliedesk.com/edit/main/src/data/pages/vs-zendesk.ts';
const fresh = `Read on 16 October 2026. Prices change. Spot a mistake? <a href="${EDIT}">Open a pull request</a>.`;
const findings = (text, path = '/vs/zendesk') => compareFindings({ path, text, now: NOW });

test('a comparison read 19 days ago with a correction link passes', () => {
  assert.deepEqual(findings(fresh), []);
});

test('the Markdown twin passes with the same date and a Markdown link', () => {
  assert.deepEqual(findings(`Read on 16 October 2026.\n[Open a pull request](${EDIT})`, '/vs/zendesk.md'), []);
});

test('competitor facts read 95 days ago fail', () => {
  const out = findings(fresh.replace('16 October 2026', '1 August 2026'));
  assert.equal(out.length, 1);
  assert.match(out[0], /\/vs\/zendesk: competitor facts read 1 August 2026, 95 days ago/);
});

test('the ISO read date on the price chart counts as the read date', () => {
  assert.deepEqual(findings(`<figure data-read-on="2026-10-17"></figure> <a href="${EDIT}">x</a>`), []);
});

test('a comparison with no read date fails', () => {
  const out = findings(`<a href="${EDIT}">Open a pull request</a>`);
  assert.equal(out.length, 1);
  assert.match(out[0], /no "Read on" date/);
});

test('a comparison without a link to edit its own source file fails', () => {
  const other = fresh.replace('vs-zendesk.ts', 'vs-freshdesk.ts');
  const out = findings(other);
  assert.equal(out.length, 1);
  assert.match(out[0], /does not invite corrections .*vs-zendesk\.ts/);
});

test('source files follow the page path', () => {
  assert.equal(sourceFileOf('/vs/hubspot-service-hub'), 'src/data/pages/vs-hubspot-service-hub.ts');
  assert.equal(sourceFileOf('/freshdesk-alternative.md'), 'src/data/pages/freshdesk-alternative.ts');
  assert.equal(sourceFileOf('/compare'), 'src/data/pages/compare.ts');
});
