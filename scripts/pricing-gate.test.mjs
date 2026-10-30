import assert from 'node:assert/strict';
import { test } from 'node:test';
import { homeFindings, onePlanFindings, pricingFindings } from './pricing-gate.mjs';

// Fixtures are written by hand from the owner's rule: while Founding is open, /pricing and the home
// page sell Founding ($99 every 3 months) and Team 25 ($149 a month); Solo, Small, Team and
// Unlimited stay hidden until Founding closes.
const FOUNDING = 'Founding is $99 every 3 months per workspace for up to 10 agents.';
const TEAM_25_CARD = '<article class="plan"><h2 class="plan-name">Team 25</h2><p class="plan-price"><strong>$149</strong> <span>a month</span></p></article>';
const TEAM_25_ROW = '| Team 25 | $149 a month, or $1,490 a year per workspace | Up to 25 agents. |';
const TEAM_25_HOME = 'Teams of 11 to 25 agents can buy [Team 25 for $149 a month](/pricing).';
const LADDER = 'Solo $19 a month, Small $39, Team $69, Team 25 $149.';

const pricing = (text, open = true, path = '/pricing') => pricingFindings({ path, text, open });
const home = (text, open = true) => homeFindings({ path: '/index.html', text, open });

test('pricing, founding open: Founding and Team 25 together pass, in HTML and in Markdown', () => {
  assert.deepEqual(pricing(`${FOUNDING} ${TEAM_25_CARD}`), []);
  assert.deepEqual(pricing(`${FOUNDING}\n${TEAM_25_ROW}`, true, '/pricing.md'), []);
});

test('pricing, founding open: Founding without Team 25 fails', () => {
  const findings = pricing(FOUNDING);
  assert.equal(findings.length, 1);
  assert.match(findings[0], /does not show Team 25 at \$149/);
});

test('pricing, founding open: Team 25 without its $149 price fails', () => {
  const findings = pricing(`${FOUNDING} <h2 class="plan-name">Team 25</h2> Coming soon`);
  assert.equal(findings.length, 1);
  assert.match(findings[0], /does not show Team 25 at \$149/);
});

test('pricing, founding open: Team 25 without the Founding price fails', () => {
  const findings = pricing(TEAM_25_CARD);
  assert.equal(findings.length, 1);
  assert.match(findings[0], /does not show the \$99 every 3 months price/);
});

test('pricing, founding open: each hidden plan fails when listed as a card, a table row or a JSON-LD offer', () => {
  const base = `${FOUNDING} ${TEAM_25_CARD}`;
  const listings = {
    'Solo word': 'Solo is $19 a month.',
    'Small card': '<h2 class="plan-name">Small</h2>',
    'Team card': '<article class="plan"><h2 class="plan-name">Team</h2>',
    'Unlimited card': '<h2 class="plan-name">Unlimited</h2>',
    'Small row': '| Small | $39 per workspace per month | Up to 3 agents. |',
    'Team row': '| Team | $69 per workspace per month | Up to 10 agents. |',
    'Unlimited row': '| Unlimited | $349 per workspace per month, billed annually | Coming soon. |',
    'Team offer': '{"@type":"Offer","name":"Colliedesk Cloud Team","price":"69"}',
    'Unlimited offer': '{"@type":"Offer","name":"Colliedesk Cloud Unlimited","price":"349"}',
  };
  for (const [label, listing] of Object.entries(listings)) {
    const findings = pricing(`${base}\n${listing}`);
    assert.equal(findings.length, 1, `${label}: expected one finding, got ${JSON.stringify(findings)}`);
    assert.match(findings[0], /lists the Cloud ladder/, label);
  }
});

test('pricing, founding open: Team 25 as card, row and JSON-LD offer is not a hidden plan', () => {
  const offer = '{"@type":"Offer","name":"Colliedesk Cloud Team 25","price":"149"}';
  assert.deepEqual(pricing(`${FOUNDING} ${TEAM_25_CARD} ${offer}`), []);
});

test('pricing, founding open: prose that names the Team plan after Founding is not a listing', () => {
  const prose = 'Your own uploads wait until you upgrade to Cloud Team, which includes 100 GiB. 10 Founding places, then Cloud Team at $690 a year.';
  assert.deepEqual(pricing(`${FOUNDING} ${TEAM_25_CARD} ${prose}`), []);
});

test('pricing, founding closed: the ladder is required and a Founding-only page fails', () => {
  assert.deepEqual(pricing(LADDER, false), []);
  const findings = pricing(FOUNDING, false);
  assert.equal(findings.length, 1);
  assert.match(findings[0], /does not list the Cloud ladder/);
});

test('pricing, founding closed: Team 25 and the hidden plans are all allowed', () => {
  assert.deepEqual(pricing(`${LADDER}\n| Small | $39 |\n<h2 class="plan-name">Unlimited</h2>`, false), []);
});

test('home, founding open: Founding with the Team 25 line passes', () => {
  assert.deepEqual(home(`${FOUNDING} ${TEAM_25_HOME}`), []);
  assert.deepEqual(home(`${FOUNDING} Teams of 11 to 25 agents can buy <a href="/pricing">Team 25 for $149 a month</a>.`), []);
});

test('home, founding open: no Team 25 line fails', () => {
  const findings = home(FOUNDING);
  assert.equal(findings.length, 1);
  assert.match(findings[0], /does not show Team 25 at \$149/);
});

test('home, founding open: the rest of the ladder fails', () => {
  const base = `${FOUNDING} ${TEAM_25_HOME}`;
  for (const extra of ['Plans from $19 a month', 'Solo is $19', '{"name":"Colliedesk Cloud Team","price":"69"}', '| Small | $39 |']) {
    const findings = home(`${base}\n${extra}`);
    assert.equal(findings.length, 1, extra);
    assert.match(findings[0], /quotes the Cloud ladder/, extra);
  }
});

test('home, founding closed: nothing to enforce', () => {
  assert.deepEqual(home(LADDER, false), []);
  assert.deepEqual(home(FOUNDING, false), []);
});

// Team 25 is on sale exactly while Founding is open, so no page may say Cloud sells one plan then.
const onePlan = (text, open = true) => onePlanFindings({ path: '/vs/zendesk.md', text, open });

test('one plan, founding open: every wording of "Cloud sells one plan" fails', () => {
  const stale = [
    'Today Colliedesk Cloud sells one plan, Founding: $99 every 3 months ($396 a year) per workspace.',
    'Today it sells one plan, Founding: $99 every 3 months per workspace.',
    'Colliedesk Cloud is sold as one plan while it is young: Founding.',
    '### Why is there only one plan?',
    '# One plan. $99 every 3 months, locked for life.',
    '## One plan while we are young',
    'One plan while we are young: Founding, $99 every 3 months per workspace.',
    'We sell one thing right now: **Founding**, for 10 support teams.',
    'One plan, one price: $99 every 3 months per workspace.',
  ];
  for (const text of stale) {
    const findings = onePlan(text);
    assert.equal(findings.length, 1, text);
    assert.match(findings[0], /says Cloud sells one plan/, text);
  }
});

test('one plan, founding open: the two-plan wording passes', () => {
  const lead = 'Today Colliedesk Cloud sells Founding for teams of 3 to 10 agents: $99 every 3 months per workspace, locked for life. Teams of 11 to 25 agents can buy Team 25 at $149 a month.';
  assert.deepEqual(onePlan(lead), []);
});

test('one plan, founding open: "move up one plan" in ladder copy is not a sales claim', () => {
  assert.deepEqual(onePlan("Adding an agent does not change the price; you move up one plan only when you pass your plan's agent limit."), []);
  assert.deepEqual(onePlan('Pass it and you move up one plan; at 11 agents that is Team 25.'), []);
});

test('one plan, founding closed: nothing to enforce', () => {
  assert.deepEqual(onePlan('Today Colliedesk Cloud sells one plan, Founding.', false), []);
});
