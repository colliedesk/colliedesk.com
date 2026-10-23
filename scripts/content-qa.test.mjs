import assert from 'node:assert/strict';
import { test } from 'node:test';
import { betaFindings, checkPage, oldAiPriceFindings, readingGrade } from './content-qa.mjs';

// Plain sentences a 7th grader reads easily; links to pricing (CTA) and to a source.
const CLEAN = `# Move off Freshdesk before your renewal

Your team pays for every agent on Freshdesk. The bill grows when you hire. We think that is the wrong way to price a helpdesk.

Colliedesk costs the same for one agent or ten. You pay for the workspace. Read the [Freshdesk pricing history](https://colliedesk.com/freshdesk-pricing-history) to see what changed and when.

Start with a free trial and bring your tickets with you. See [pricing](https://colliedesk.com/pricing) for the plans.

Small team? Read [the helpdesk guide for small teams](/helpdesk-for-small-teams).
`;

const page = (md, path = '/blog/move-off-freshdesk', head = {}) => checkPage({ path, md, ...head });

test('clean article passes every rule', () => {
  assert.deepEqual(page(CLEAN), []);
});

test('reading grade: short plain sentences score low, dense jargon scores high', () => {
  const plain = 'The cat sat on the mat. The dog ran to the door. We like to read short words. '.repeat(5);
  const dense = 'Organizational interoperability necessitates comprehensive infrastructural standardization methodologies, facilitating multidimensional operational optimization considerations. '.repeat(5);
  assert.ok(readingGrade(plain) < 4, `plain grade ${readingGrade(plain)}`);
  assert.ok(readingGrade(dense) > 15, `dense grade ${readingGrade(dense)}`);
});

test('fails prose above the reading grade limit', () => {
  const dense = 'Organizational interoperability necessitates comprehensive infrastructural standardization methodologies, facilitating multidimensional operational optimization considerations. '.repeat(5);
  const findings = page(`${CLEAN}\n${dense}\n`);
  assert.equal(findings.length, 1);
  assert.match(findings[0], /reading grade/);
});

test('fails an em dash in prose but allows one as an empty table cell', () => {
  assert.deepEqual(page(`${CLEAN}\n| Plan | AI |\n|---|---|\n| Free | — |\n`), []);
  const findings = page(CLEAN.replace('We think that is', 'We think — honestly — that is'));
  assert.equal(findings.length, 1);
  assert.match(findings[0], /em dash/);
});

test('fails AI-slop phrases, case-insensitive, naming each one', () => {
  const findings = page(CLEAN.replace('Your team pays', 'Let us delve into how your team pays. Seamless migration is a game-changer. Your team pays'));
  assert.equal(findings.length, 1);
  assert.match(findings[0], /delve/);
  assert.match(findings[0], /Seamless/);
  assert.match(findings[0], /game-changer/);
});

test('fails a body with no link to pricing, migration, founding or the app', () => {
  const findings = page(CLEAN.replace('See [pricing](https://colliedesk.com/pricing) for the plans.', ''));
  assert.equal(findings.length, 1);
  assert.match(findings[0], /no call to action/);
});

test('accepts each conversion target as a call to action', () => {
  const noCta = CLEAN.replace('See [pricing](https://colliedesk.com/pricing) for the plans.', '');
  for (const href of ['/pricing', 'https://colliedesk.com/migrate/freshdesk', 'https://colliedesk.com/#founding', 'https://app.colliedesk.com/sign-in']) {
    assert.deepEqual(page(`${noCta}\n[Go](${href})\n`), [], href);
  }
});

test('fails a competitor price with no source link on the page', () => {
  const unsourced = CLEAN.replace('Read the [Freshdesk pricing history](https://colliedesk.com/freshdesk-pricing-history) to see what changed and when.', 'Zendesk now charges $55 per agent.');
  const findings = page(unsourced);
  assert.equal(findings.length, 1);
  assert.match(findings[0], /competitor price/);
});

test('accepts an external link or a /vs page as the source of a competitor price', () => {
  const base = CLEAN.replace('Read the [Freshdesk pricing history](https://colliedesk.com/freshdesk-pricing-history) to see what changed and when.', 'Zendesk now charges $55 per agent.');
  assert.deepEqual(page(`${base}\nSource: [zendesk.com/pricing](https://www.zendesk.com/pricing/).\n`), []);
  assert.deepEqual(page(`${base}\nSee [Colliedesk vs Zendesk](https://colliedesk.com/vs/zendesk).\n`), []);
});

test("Colliedesk's own prices need no outside source", () => {
  const own = CLEAN.replace('Read the [Freshdesk pricing history](https://colliedesk.com/freshdesk-pricing-history) to see what changed and when.', 'Colliedesk Cloud Team is $69 a month.');
  assert.deepEqual(page(own), []);
});

// Titles and descriptions of the pages ranking top 3 for our keywords, measured 20 October 2026
// (docs/seo/serp-patterns.md): titles 47 to 60 characters, descriptions 132 to 156.
const TITLE_OK = 'Help Scout vs Freshdesk: An Honest 2026 Breakdown';
const DESC_OK = 'Freshdesk ticketing runs from $19 per agent per month to $89 on annual billing. Here is what a 10-agent team pays, with every add-on counted.';

test('accepts a title of 60 characters or fewer and a description of 120 to 160', () => {
  assert.deepEqual(page(CLEAN, undefined, { title: TITLE_OK, description: DESC_OK }), []);
});

test('fails a title over 60 characters, which Google cuts off', () => {
  const title = 'Colliedesk vs Freshdesk: $49 or $99 a month for the whole team, not $19–107 per agent';
  const findings = page(CLEAN, undefined, { title, description: DESC_OK });
  assert.equal(findings.length, 1);
  assert.match(findings[0], /title is 85 characters/);
});

test('fails a description shorter than 120 or longer than 160 characters', () => {
  for (const description of ['Freshdesk pricing, explained.', `${DESC_OK} ${DESC_OK}`]) {
    const findings = page(CLEAN, undefined, { title: TITLE_OK, description });
    assert.equal(findings.length, 1, description);
    assert.match(findings[0], /meta description is \d+ characters/);
  }
});

test('fails a body that links fewer than 2 other pages on this site', () => {
  const findings = page(CLEAN.replace('Small team? Read [the helpdesk guide for small teams](/helpdesk-for-small-teams).', '')
    .replace('Read the [Freshdesk pricing history](https://colliedesk.com/freshdesk-pricing-history) to see what changed and when.', ''));
  assert.equal(findings.length, 1);
  assert.match(findings[0], /links 1 other page/);
});

test('a link to the page itself or to the app is not an internal link', () => {
  const md = CLEAN.replace('/helpdesk-for-small-teams', '/blog/move-off-freshdesk')
    .replace('https://colliedesk.com/freshdesk-pricing-history', 'https://app.colliedesk.com/sign-in');
  const findings = page(md);
  assert.equal(findings.length, 1);
  assert.match(findings[0], /links 1 other page/);
});

// Colliedesk as a whole is alpha; nothing on the site may be called beta until HC Labs announces it.
test('fails the word beta in any case, quoting where it appears', () => {
  for (const text of ['AI is coming after beta.', '| Gmail mailboxes | **Beta** |', 'Our BETA programme', 'Not there yet (beta).']) {
    const findings = betaFindings('/pricing', text);
    assert.equal(findings.length, 1, text);
    assert.match(findings[0], /^\/pricing: says "beta"/i);
  }
});

test('reports every line that says beta, not only the first', () => {
  assert.equal(betaFindings('/', 'Beta next.\nAlpha now.\nAI after beta.').length, 2);
});

test('allows alpha copy and words that only contain the letters beta', () => {
  assert.deepEqual(betaFindings('/', 'Colliedesk is alpha. Sorted alphabetically. A Betamax tape. The alphabet.'), []);
});

test('allows beta inside a URL or a Markdown link target', () => {
  assert.deepEqual(betaFindings('/vs/x', 'Source: [their pricing](https://example.com/beta/pricing) and https://beta.example.com/plans'), []);
});

// AI is priced per resolution and by allowance now; the old "model cost plus 30%" price must not come back.
test('fails the retired AI price in any of its wordings, quoting where it appears', () => {
  for (const text of [
    'AI at LLM cost +30% or your own key.',
    '| AI | Model cost +30% on our key |',
    'Use ours at cost plus 30%.',
    'AI usage at cost + 30 %',
    'A flat price with AI at model cost.',
    'One flat price with AI included at cost.',
    '## AI in every plan, at model cost',
  ]) {
    const findings = oldAiPriceFindings('/pricing', text);
    assert.equal(findings.length, 1, text);
    assert.match(findings[0], /^\/pricing: states the retired AI price/);
  }
});

test('allows the current AI price and unrelated percentages', () => {
  const ok = [
    'Auto-answer costs $0.50 per resolution while Colliedesk is alpha.',
    'Reply drafts and triage are included in every plan, with a monthly allowance.',
    'Bring your own key: Colliedesk adds no fee.',
    'We warn you at 80%. Freshdesk raised prices by 30% in 2024.',
  ].join('\n');
  assert.deepEqual(oldAiPriceFindings('/pricing', ok), []);
});
