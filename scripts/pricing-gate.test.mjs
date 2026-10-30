import assert from 'node:assert/strict';
import { test } from 'node:test';
import { homeFindings, pricingFindings } from './pricing-gate.mjs';

const FOUNDING = 'Founding is $99 every 3 months per workspace for up to 10 agents.';
const LADDER = 'Solo $19 a month, Small $39, Team $69, Team 25 $149.';

test('founding open: a page that sells Founding only passes', () => {
  assert.deepEqual(pricingFindings({ path: '/pricing', text: FOUNDING, open: true }), []);
});

test('founding open: a page without the Founding price fails', () => {
  const findings = pricingFindings({ path: '/pricing', text: 'Pick a plan.', open: true });
  assert.equal(findings.length, 1);
  assert.match(findings[0], /\$99 every 3 months/);
});

test('founding open: the Cloud ladder on /pricing fails', () => {
  const findings = pricingFindings({ path: '/pricing.md', text: `${FOUNDING} ${LADDER}`, open: true });
  assert.equal(findings.length, 1);
  assert.match(findings[0], /lists the Cloud ladder/);
});

test('founding closed: /pricing must list the ladder', () => {
  assert.deepEqual(pricingFindings({ path: '/pricing', text: LADDER, open: false }), []);
  assert.match(pricingFindings({ path: '/pricing', text: FOUNDING, open: false })[0], /does not list the Cloud ladder/);
});

test('home, founding open: the ladder fails, Founding passes', () => {
  assert.deepEqual(homeFindings({ path: '/index.html', text: FOUNDING, open: true }), []);
  assert.match(homeFindings({ path: '/index.html', text: 'Plans from $19 a month', open: true })[0], /quotes the Cloud ladder/);
});

test('home, founding closed: nothing to enforce', () => {
  assert.deepEqual(homeFindings({ path: '/index.html', text: LADDER, open: false }), []);
});
