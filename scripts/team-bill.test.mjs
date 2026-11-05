import assert from 'node:assert/strict';
import { test } from 'node:test';

// Expected yearly totals are worked out by hand from Freshdesk's annual list prices read on 14 October
// 2026 (Growth $19, Pro $55, Freddy AI Copilot $29 per agent per month) and the Colliedesk plans in
// src/lib/site.ts (Founding 4 x $99, Team $690, Team 25 $1,490, Business $4,990 a year).
const { BILL_SIZES, DEFAULT_BILL_SIZE, billAt, barWidth } = await import('../src/lib/team-bill.ts');

const totals = (agents, open) => billAt(agents, open).map((b) => `${b.name} ${b.usd}`);

test('the picker offers 5, 10, 25 and 50 agents and opens on 10', () => {
  assert.deepEqual([...BILL_SIZES], [5, 10, 25, 50]);
  assert.equal(DEFAULT_BILL_SIZE, 10);
});

test('5 agents: $5,040 and $1,140 a year on Freshdesk against Founding at $396', () => {
  assert.deepEqual(totals(5, true), ['Freshdesk Pro + Freddy AI Copilot 5040', 'Freshdesk Growth, no AI 1140', 'Colliedesk Founding 396']);
});

test('10 agents: $10,080 and $2,280 against Founding at $396, with the math shown', () => {
  const [pro, growth, ours] = billAt(10, true);
  assert.equal(pro.usd, 10080);
  assert.equal(pro.math, '10 × ($55 + $29) × 12');
  assert.equal(growth.usd, 2280);
  assert.equal(growth.math, '10 × $19 × 12');
  assert.equal(ours.usd, 396);
  assert.equal(ours.math, '4 × $99, flat for 3 to 10 agents · locked for life · AI drafts and triage included, within a monthly allowance');
  assert.equal(ours.ours, true);
  assert.equal(ours.call, undefined);
});

test('once Founding closes, 10 agents compare against Cloud Team at $690 a year', () => {
  assert.deepEqual(totals(10, false), ['Freshdesk Pro + Freddy AI Copilot 10080', 'Freshdesk Growth, no AI 2280', 'Colliedesk Cloud Team 690']);
});

test('25 agents: Team 25 at $1,490 a year, whether Founding is open or not', () => {
  for (const open of [true, false]) {
    assert.deepEqual(totals(25, open), ['Freshdesk Pro + Freddy AI Copilot 25200', 'Freshdesk Growth, no AI 5700', 'Colliedesk Team 25 1490']);
  }
  assert.equal(billAt(25, true)[2].math, 'flat for 11 to 25 agents, a year costs ten months');
});

test('50 agents: Business at $4,990 a year, sold through a call', () => {
  const bars = billAt(50, true);
  assert.deepEqual(bars.map((b) => `${b.name} ${b.usd}`), ['Freshdesk Pro + Freddy AI Copilot 50400', 'Freshdesk Growth, no AI 11400', 'Colliedesk Business 4990']);
  assert.equal(bars[2].math, 'flat for 26 to 100 agents, a year costs ten months');
  assert.equal(bars[2].call, true);
});

test('a team with no flat plan is refused rather than priced', () => {
  assert.throws(() => billAt(101, true), /101 agents/);
  assert.throws(() => billAt(0, true), /0 agents/);
});

// The dearest bar takes 86% of the track so its label fits beside it; the canvas draws 10 agents as
// 86%, 19.5% and 3.4%: 2,280 / 10,080 x 86 = 19.45, 396 / 10,080 x 86 = 3.38.
test('bar widths scale to the dearest bar at 86% of the track', () => {
  assert.equal(barWidth(10080, 10080), '86%');
  assert.equal(barWidth(2280, 10080), '19.5%');
  assert.equal(barWidth(396, 10080), '3.4%');
  assert.equal(barWidth(396, 50400), '1%');
});
