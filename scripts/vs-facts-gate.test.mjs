import assert from 'node:assert/strict';
import { test } from 'node:test';
import { competitorFindings, pageTextFindings, unsourcedDebtFindings } from './vs-facts-gate.mjs';

// Fixtures are written by hand from the rule in issue #136: every competitor fact has a source the
// file lists, every feature key has a value, and no source was read more than 90 days ago.
const KEYS = ['email_channel', 'live_chat'];
const TODAY = new Date('2026-11-15T00:00:00Z');

const competitor = (patch = {}) => ({
  slug: 'acme',
  name: 'Acme',
  currency: 'USD',
  readOn: '2026-10-16',
  sources: { pricing: { label: 'Acme pricing', link: 'acme.com/pricing', url: 'https://acme.com/pricing' } },
  facts: {
    plans: { text: 'Basic $10 per agent per month', source: 'pricing' },
    ai: { text: 'No AI', source: 'pricing' },
    free: { text: '14-day trial', source: 'pricing' },
    license: { text: 'Proprietary', source: 'pricing' },
  },
  export: [],
  features: {
    email_channel: { has: 'yes', text: 'yes', source: 'pricing' },
    live_chat: 'unread',
  },
  ...patch,
});

const check = (c) => competitorFindings(c, { today: TODAY, featureKeys: KEYS });

test('a complete competitor file passes', () => {
  assert.deepEqual(check(competitor()), []);
});

test('fails a feature key with no value', () => {
  const findings = check(competitor({ features: { email_channel: { has: 'yes', text: 'yes', source: 'pricing' } } }));
  assert.deepEqual(findings, ['acme: feature live_chat has no value; give it one or mark it \'unread\'']);
});

test('fails a feature that is not in the dictionary', () => {
  const c = competitor();
  const findings = check({ ...c, features: { ...c.features, phone: { has: 'no', text: 'no', source: 'pricing' } } });
  assert.deepEqual(findings, ['acme: feature phone is not in src/data/competitors/features.ts']);
});

test('fails a fact, an export limit or a feature without a source the file lists', () => {
  const c = competitor();
  const findings = check({
    ...c,
    facts: { ...c.facts, ai: { text: 'No AI' } },
    export: [{ text: 'CSV only', source: 'help' }],
    features: { ...c.features, email_channel: { has: 'yes', text: 'yes', source: '' } },
  });
  assert.deepEqual(findings, [
    'acme: fact ai has no source',
    'acme: export limit 1 cites source "help", which is not in sources',
    'acme: feature email_channel has no source',
  ]);
});

test('a fact on the known-unsourced list may lack a source, and only that one', () => {
  const c = competitor();
  const bare = { ...c, facts: { ...c.facts, usPrices: { text: 'Third-party sites list $19', source: '' }, ai: { text: 'No AI', source: '' } } };
  assert.deepEqual(competitorFindings(bare, { today: TODAY, featureKeys: KEYS, unsourced: ['acme.facts.usPrices'] }), ['acme: fact ai has no source']);
});

test('fails a known-unsourced entry that has a source now or no longer exists', () => {
  const c = competitor();
  assert.deepEqual(unsourcedDebtFindings([c], ['acme.facts.plans', 'acme.facts.gone', 'other.facts.x']), [
    'KNOWN_UNSOURCED: acme.facts.plans has a source now; delete the entry',
    'KNOWN_UNSOURCED: acme.facts.gone does not exist; delete the entry',
    'KNOWN_UNSOURCED: other.facts.x does not exist; delete the entry',
  ]);
});

test('fails a missing required fact', () => {
  const c = competitor();
  const { license, ...facts } = c.facts;
  assert.deepEqual(check({ ...c, facts }), ['acme: fact license is missing']);
});

test('fails a source with no https URL', () => {
  const findings = check(competitor({ sources: { pricing: { label: 'Acme pricing', link: 'acme.com', url: 'acme.com/pricing' } } }));
  assert.deepEqual(findings, ['acme: source pricing has no https URL']);
});

test('fails a read date older than 90 days, for the file and for a source read on its own day', () => {
  // 2026-08-16 is 91 days before 15 November 2026; 2026-08-17 is exactly 90 and still passes.
  assert.deepEqual(check(competitor({ readOn: '2026-08-17' })), []);
  assert.deepEqual(check(competitor({ readOn: '2026-08-16' })), ['acme: read on 2026-08-16, 91 days ago; read the sources again (limit 90 days)']);
  const c = competitor();
  const findings = check({ ...c, sources: { pricing: { ...c.sources.pricing, readOn: '2026-07-01' } } });
  assert.deepEqual(findings, ['acme: source pricing read on 2026-07-01, 137 days ago; read it again (limit 90 days)']);
});

test('fails a file with no read date', () => {
  assert.deepEqual(check(competitor({ readOn: undefined })), ['acme: no read date (readOn, YYYY-MM-DD)']);
});

test('our own file is checked for feature keys and sources, not for a read date or competitor facts', () => {
  const ours = { slug: 'colliedesk', sources: { roadmap: { label: 'Roadmap', link: 'ROADMAP.md', url: 'https://github.com/colliedesk/colliedesk/blob/main/ROADMAP.md' } },
    features: { email_channel: { has: 'yes', text: 'yes', source: 'roadmap' } } };
  assert.deepEqual(competitorFindings(ours, { today: TODAY, featureKeys: KEYS, own: true }), [
    'colliedesk: feature live_chat has no value; give it one or mark it \'unread\'',
  ]);
});

const PAGE = `import { acme as a } from '../competitors/acme';
const faq = [{ q: 'How much is Acme?', a: \`On \${a.readOnLabel}: \${a.facts.plans.text}.\` }];
const page = { path: '/vs/acme', updated: '2026-10-16', title: 'Colliedesk vs Acme', body: \`Five agents pay \${usd(a.price.basic * 5)}.\` };
`;

test('a page whose figures all come from data passes', () => {
  assert.deepEqual(pageTextFindings('src/data/pages/vs-acme.ts', PAGE), []);
});

test('fails a figure written into page text, in a string or a template', () => {
  const page = PAGE.replace('How much is Acme?', 'Is Acme $10 per agent?').replace('Five agents pay', 'Five agents pay 5 × $10 =');
  assert.deepEqual(pageTextFindings('src/data/pages/vs-acme.ts', page), [
    'src/data/pages/vs-acme.ts:2: figure "Is Acme $10 per agent?" in page text; state it in the competitor data file',
    'src/data/pages/vs-acme.ts:3: figure "Five agents pay 5 × $10 =" in page text; state it in the competitor data file',
  ]);
});

test('fails a price passed to a money formatter as a number in the page', () => {
  // A team size times a price from data is page arithmetic; a price made of numbers only is not.
  const page = PAGE.replace('usd(a.price.basic * 5)', 'usd(10 * 5)');
  assert.deepEqual(pageTextFindings('src/data/pages/vs-acme.ts', page), [
    'src/data/pages/vs-acme.ts:3: price "10 * 5" passed to usd() in page code; take it from the competitor data file',
  ]);
});

test('ignores comments, import paths, the page path and the updated date', () => {
  const page = `// Read on 16 October 2026.\n${PAGE}`;
  assert.deepEqual(pageTextFindings('src/data/pages/vs-acme.ts', page), []);
});
