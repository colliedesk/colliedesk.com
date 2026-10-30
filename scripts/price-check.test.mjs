// The price check maths in public/price-check.js, checked against hand-worked numbers.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

// public/price-check.js is a browser script; run it in a sandbox that offers module.exports.
const sandbox = { module: { exports: {} } };
vm.runInNewContext(readFileSync(new URL('../public/price-check.js', import.meta.url), 'utf8'), sandbox);
const { compute } = sandbox.module.exports;

// Facts as the page passes them in: Founding $99 a quarter for up to 10 agents, Team 25 $1,490 a
// year for up to 25, and a popular per-seat plan with its AI add-on at $66 + $35 = $101 per agent
// per month (billed monthly, read 22 October 2026) for people who do not know their price.
const FACTS = { foundingName: 'Founding', foundingYear: 396, foundingAgents: 10, team25Year: 1490, team25Agents: 25, typicalPerSeat: 101 };

test('5 agents at $101 a seat: $6,060 today, $396 on Founding, $5,664 kept, a hire adds $1,212', () => {
  const r = compute({ agents: 5, perSeat: 101, needs: [] }, FACTS);
  assert.equal(r.todayYear, 6060);
  assert.equal(r.oursYear, 396);
  assert.equal(r.plan, 'Founding');
  assert.equal(r.keepYear, 5664);
  assert.equal(r.nextHireYear, 1212);
  assert.equal(r.estimated, false);
  assert.equal(r.verdict, 'save');
});

test('an unknown price uses the popular per-seat plan and says it is an estimate', () => {
  const r = compute({ agents: 4, perSeat: null, needs: [] }, FACTS);
  assert.equal(r.todayYear, 4848);
  assert.equal(r.estimated, true);
});

test('2 agents at $23 a seat save little, and the result says so', () => {
  const r = compute({ agents: 2, perSeat: 23, needs: [] }, FACTS);
  assert.equal(r.todayYear, 552);
  assert.equal(r.keepYear, 156);
  assert.equal(r.verdict, 'small');
});

test('12 agents move to Team 25: $9,504 today at $66, $1,490 a year, $8,014 kept', () => {
  const r = compute({ agents: 12, perSeat: 66, needs: [] }, FACTS);
  assert.equal(r.plan, 'Team 25');
  assert.equal(r.oursYear, 1490);
  assert.equal(r.keepYear, 8014);
});

test('a team that needs SSO, phone or client billing is told what is missing', () => {
  const r = compute({ agents: 5, perSeat: 66, needs: ['sso', 'phone'] }, FACTS);
  assert.deepEqual(r.missing, ['sso', 'phone']);
  assert.equal(r.verdict, 'not-yet');
});

const { withAttribution } = sandbox.module.exports;
// The sandbox has its own Object prototype; copy results into this realm before deepEqual.
const attribution = (search) => ({ ...sandbox.module.exports.attribution(search) });

test('attribution keeps utm_* and ttclid from the landing URL and drops everything else', () => {
  assert.deepEqual(
    attribution('?utm_source=tiktok&utm_medium=comment&utm_campaign=seat-tax&utm_content=post-07&ttclid=E_C_P_abc123&email=a@b.c'),
    { utm_source: 'tiktok', utm_medium: 'comment', utm_campaign: 'seat-tax', utm_content: 'post-07', ttclid: 'E_C_P_abc123' },
  );
});

test('attribution refuses values with characters outside [A-Za-z0-9._-] or longer than 300', () => {
  assert.deepEqual(attribution('?utm_source=<script>&utm_content=' + 'x'.repeat(301)), {});
});

test('withAttribution appends the kept values to a sign-up link', () => {
  assert.equal(
    withAttribution('https://app.colliedesk.com/sign-in', { utm_source: 'tiktok', utm_content: 'post-07' }),
    'https://app.colliedesk.com/sign-in?utm_source=tiktok&utm_content=post-07',
  );
  assert.equal(
    withAttribution('https://app.colliedesk.com/settings/billing?buy=founding', { utm_source: 'tiktok' }),
    'https://app.colliedesk.com/settings/billing?buy=founding&utm_source=tiktok',
  );
});
