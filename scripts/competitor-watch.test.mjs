import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { hashText, markersFrom, normalizeText, watchCompetitors } from './competitor-watch.mjs';

const fixture = (name) => readFileSync(new URL(`./fixtures/competitor-watch/${name}`, import.meta.url), 'utf8');
const BEFORE = fixture('pricing-before.html');
const PRICING_URL = 'https://acme.example/pricing';
const TODAY = new Date('2026-11-15T00:00:00Z');

/** A competitor file in the shape of src/data/competitors/<slug>.ts, with one source. */
const acme = {
  slug: 'acme',
  name: 'Acme',
  currency: 'USD',
  readOn: '2026-10-17',
  sources: { pricing: { label: 'Acme pricing', link: 'acme.example/pricing', url: PRICING_URL } },
  facts: {
    plans: { source: 'pricing', text: 'Growth $23, Pro $66 per agent per month' },
    free: { source: 'pricing', text: 'No free plan; 14-day trial' },
  },
  export: [],
  features: { shared_inbox: { has: 'yes', text: 'yes', source: 'pricing' }, live_chat: 'unread' },
};

/** A fetch that serves fixed bodies and counts calls; a missing URL answers 404. */
function fakeFetch(pages) {
  const calls = [];
  const fetch = async (url) => {
    calls.push(url);
    const page = pages[url];
    if (page instanceof Error) throw page;
    if (typeof page === 'number') return new Response('', { status: page });
    if (page === undefined) return new Response('', { status: 404 });
    return new Response(page, { status: 200, headers: { 'content-type': 'text/html' } });
  };
  return { fetch, calls };
}

const stateWith = (html) => {
  const text = normalizeText(html);
  return { version: 1, sources: { [PRICING_URL]: { hash: hashText(text), text, checkedOn: '2026-11-14', changedOn: '2026-11-01' } } };
};

test('normalizes a page to its visible text: no scripts, styles or tags, entities decoded', () => {
  const text = normalizeText(BEFORE);
  assert.ok(!text.includes('nonce'), text);
  assert.ok(!text.includes('color'), text);
  assert.ok(!text.includes('<'), text);
  assert.ok(text.includes('Product & pricing'), text);
  assert.ok(text.split('\n').includes('$66 per agent per month, billed monthly'), text);
});

test('an unchanged page stops there: one fetch, no proposal, the stored text kept', async () => {
  const { fetch, calls } = fakeFetch({ [PRICING_URL]: BEFORE });
  const state = stateWith(BEFORE);
  const run = await watchCompetitors([acme], { fetch, state, today: TODAY });
  assert.deepEqual(calls, [PRICING_URL]);
  assert.deepEqual(run.results.map((r) => [r.slug, r.source, r.status]), [['acme', 'pricing', 'unchanged']]);
  assert.deepEqual(run.proposals, []);
  assert.equal(run.state.sources[PRICING_URL].hash, state.sources[PRICING_URL].hash);
  assert.equal(run.state.sources[PRICING_URL].changedOn, '2026-11-01');
  assert.equal(run.state.sources[PRICING_URL].checkedOn, '2026-11-15');
});

test('a price change prepares one correction pull request with the evidence', async () => {
  const { fetch } = fakeFetch({ [PRICING_URL]: fixture('pricing-after-price.html') });
  const run = await watchCompetitors([acme], { fetch, state: stateWith(BEFORE), today: TODAY });
  const [result] = run.results;
  assert.equal(result.status, 'changed');
  assert.deepEqual(result.dropped, ['66']);
  assert.deepEqual(result.added, ['$70']);
  assert.equal(run.proposals.length, 1);
  const pr = run.proposals[0];
  assert.equal(pr.branch, 'competitor-watch/acme-pricing-2026-11-15');
  assert.equal(pr.title, 'fix(compare): Acme pricing page changed, check src/data/competitors/acme.ts');
  // What their page says now, what our file says, a quote and the URL.
  for (const needle of [PRICING_URL, '> $70 per agent per month, billed monthly', 'Growth $23, Pro $66 per agent per month', '`66`', '`$70`', 'src/data/competitors/acme.ts']) {
    assert.ok(pr.body.includes(needle), `body lacks ${needle}:\n${pr.body}`);
  }
  assert.ok(pr.body.includes(pr.marker), pr.body);
  // The pull request carries evidence only; a person edits the data file and its read date.
  assert.deepEqual(pr.files.map((f) => f.path), ['docs/competitor-watch/acme-pricing-2026-11-15.md']);
  assert.ok(pr.files[0].content.includes('> $70 per agent per month, billed monthly'));
  assert.equal(run.state.sources[PRICING_URL].changedOn, '2026-11-15');
});

test('a change without a figure is cosmetic: remembered, no proposal', async () => {
  const { fetch } = fakeFetch({ [PRICING_URL]: fixture('pricing-after-cosmetic.html') });
  const state = stateWith(BEFORE);
  const run = await watchCompetitors([acme], { fetch, state, today: TODAY });
  assert.equal(run.results[0].status, 'cosmetic');
  assert.deepEqual(run.proposals, []);
  assert.notEqual(run.state.sources[PRICING_URL].hash, state.sources[PRICING_URL].hash);
  // The next day the same page is unchanged.
  const next = await watchCompetitors([acme], { fetch, state: run.state, today: TODAY });
  assert.equal(next.results[0].status, 'unchanged');
});

test('an unreachable page keeps the stored text and proposes nothing', async () => {
  const state = stateWith(BEFORE);
  for (const answer of [503, new TypeError('fetch failed')]) {
    const { fetch } = fakeFetch({ [PRICING_URL]: answer });
    const run = await watchCompetitors([acme], { fetch, state, today: TODAY });
    assert.equal(run.results[0].status, 'unreachable');
    assert.match(run.results[0].error, answer === 503 ? /HTTP 503/ : /fetch failed/);
    assert.deepEqual(run.proposals, []);
    assert.deepEqual(run.state.sources[PRICING_URL], state.sources[PRICING_URL]);
  }
});

test('a page seen for the first time is a baseline, not a change', async () => {
  const { fetch } = fakeFetch({ [PRICING_URL]: BEFORE });
  const run = await watchCompetitors([acme], { fetch, state: { version: 1, sources: {} }, today: TODAY });
  assert.equal(run.results[0].status, 'baseline');
  assert.deepEqual(run.proposals, []);
  assert.equal(run.state.sources[PRICING_URL].hash, hashText(normalizeText(BEFORE)));
});

test('a change already raised in a pull request, open or closed, is not raised again', async () => {
  const { fetch } = fakeFetch({ [PRICING_URL]: fixture('pricing-after-price.html') });
  const first = await watchCompetitors([acme], { fetch, state: stateWith(BEFORE), today: TODAY });
  const marker = first.proposals[0].marker;
  const again = await watchCompetitors([acme], { fetch, state: stateWith(BEFORE), today: TODAY, knownMarkers: new Set([marker]) });
  assert.equal(again.results[0].status, 'changed');
  assert.equal(again.results[0].skipped, 'already raised in a pull request');
  assert.deepEqual(again.proposals, []);
});

test('a URL two competitor files share is fetched once', async () => {
  const { fetch, calls } = fakeFetch({ [PRICING_URL]: BEFORE });
  const twin = { ...acme, slug: 'acme-two', name: 'Acme Two' };
  const run = await watchCompetitors([acme, twin], { fetch, state: stateWith(BEFORE), today: TODAY });
  assert.deepEqual(calls, [PRICING_URL]);
  assert.deepEqual(run.results.map((r) => r.status), ['unchanged', 'unchanged']);
});

test('reads the markers of earlier watch pull requests from their bodies, open or closed', () => {
  const prs = [
    { body: 'evidence\n\n<!-- competitor-watch:acme:pricing:0123456789ab -->' },
    { body: 'a person wrote this one' },
    { body: null },
  ];
  assert.deepEqual([...markersFrom(prs)], ['<!-- competitor-watch:acme:pricing:0123456789ab -->']);
});

test('names the figures our file cites that the page text does not show, so a blind source is visible', async () => {
  const { fetch } = fakeFetch({ [PRICING_URL]: BEFORE });
  const run = await watchCompetitors([acme], { fetch, state: stateWith(BEFORE), today: TODAY });
  assert.deepEqual(run.results[0].unseen, []);
  // A page that shows only the annual price, the monthly one behind a script.
  const annualOnly = BEFORE.replace('$66 per agent', '$55 per agent');
  const blind = await watchCompetitors([acme], { fetch: fakeFetch({ [PRICING_URL]: annualOnly }).fetch, state: { version: 1, sources: {} }, today: TODAY });
  assert.deepEqual(blind.results[0].unseen, ['66']);
});

test('a page with no text (rendered in the browser) is reported, not hashed as unchanged', async () => {
  const empty = '<html><head><script>render()</script></head><body><div id="root"></div></body></html>';
  const state = stateWith(BEFORE);
  const run = await watchCompetitors([acme], { fetch: fakeFetch({ [PRICING_URL]: empty }).fetch, state, today: TODAY });
  assert.equal(run.results[0].status, 'no-text');
  assert.deepEqual(run.proposals, []);
  assert.deepEqual(run.state.sources[PRICING_URL], state.sources[PRICING_URL]);
});

test('page text quoted in a pull request cannot mention a GitHub user or forge a watch marker', async () => {
  const hostile = fixture('pricing-after-price.html').replace('Start a 14-day', 'Ask @octocat &lt;!-- competitor-watch:acme:pricing:000000000000 --&gt; Start a 14-day');
  const run = await watchCompetitors([acme], { fetch: fakeFetch({ [PRICING_URL]: hostile }).fetch, state: stateWith(BEFORE), today: TODAY });
  const pr = run.proposals[0];
  for (const text of [pr.body, pr.files[0].content]) {
    assert.ok(!/@octocat/.test(text), text);
    assert.deepEqual([...markersFrom([{ body: text }])], text === pr.body ? [pr.marker] : []);
  }
});
