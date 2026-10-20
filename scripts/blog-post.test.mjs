import assert from 'node:assert/strict';
import { test } from 'node:test';
import { longDate, parsePost } from '../src/lib/blog-post.ts';

const FILE = 'freshdesk-export.md';
const post = (front, body = 'Body with a [link](/pricing).\n') => `---\n${front}\n---\n\n${body}`;
const FRONT = `title: "What a Freshdesk export leaves out"
description: "The CSV export has no replies or notes."
summary: "What each Freshdesk export contains"
h1: "What a Freshdesk export leaves out"
lede: "Check the export before you cancel."
published: "2026-10-21"
category: "Migration"
about:
  - "Freshdesk"`;

test('a post becomes its page fields, with the slug from the file name', () => {
  assert.deepEqual(parsePost(FILE, post(FRONT)), {
    slug: 'freshdesk-export',
    path: '/blog/freshdesk-export',
    title: 'What a Freshdesk export leaves out',
    description: 'The CSV export has no replies or notes.',
    summary: 'What each Freshdesk export contains',
    h1: 'What a Freshdesk export leaves out',
    lede: 'Check the export before you cancel.',
    published: '2026-10-21',
    updated: '2026-10-21',
    category: 'Migration',
    about: ['Freshdesk'],
    body: 'Body with a [link](/pricing).',
  });
});

test('updated is kept when given; lede and about are optional', () => {
  const front = FRONT.replace(/\nlede: .*/, '').replace(/\nabout:\n  - "Freshdesk"/, '') + '\nupdated: "2026-10-25"';
  const p = parsePost(FILE, post(front));
  assert.equal(p.updated, '2026-10-25');
  assert.equal(p.lede, undefined);
  assert.deepEqual(p.about, []);
});

test('the editor writing dates unquoted still gives an ISO date', () => {
  assert.equal(parsePost(FILE, post(FRONT.replace('"2026-10-21"', '2026-10-21'))).published, '2026-10-21');
});

test('a missing field, an unknown field, a bad date or no front matter fails and names the file', () => {
  const cases = [
    [post(FRONT.replace(/\nsummary: .*/, '')), /summary/],
    [post(`${FRONT}\nauthor: "x"`), /unknown field author/],
    [post(FRONT.replace('"2026-10-21"', '"21/10/2026"')), /published/],
    [post(FRONT.replace('"Migration"', '""')), /category/],
    ['No front matter here.', /front matter/],
  ];
  for (const [raw, re] of cases) {
    assert.throws(() => parsePost(FILE, raw), (err) => err.message.includes(FILE) && re.test(err.message), String(re));
  }
});

test('a date reads the way the site writes dates', () => {
  assert.equal(longDate('2026-10-19'), '19 October 2026');
  assert.equal(longDate('2026-01-05'), '5 January 2026');
});
