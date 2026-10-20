import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkPage, readingGrade } from './content-qa.mjs';

// Plain sentences a 7th grader reads easily; links to pricing (CTA) and to a source.
const CLEAN = `# Move off Freshdesk before your renewal

Your team pays for every agent on Freshdesk. The bill grows when you hire. We think that is the wrong way to price a helpdesk.

Colliedesk costs the same for one agent or ten. You pay for the workspace. Read the [Freshdesk pricing history](https://colliedesk.com/freshdesk-pricing-history) to see what changed and when.

Start with a free trial and bring your tickets with you. See [pricing](https://colliedesk.com/pricing) for the plans.
`;

const page = (md, path = '/blog/move-off-freshdesk') => checkPage({ path, md });

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
