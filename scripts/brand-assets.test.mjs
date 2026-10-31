// The public brand files follow the guideline: ink, paper and one orange. The lockup's letters are true greys
// (no hue), and every page has a share image so a link to colliedesk.com shows the brand.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const hex = (h) => h.match(/^#(..)(..)(..)$/).slice(1).map((v) => parseInt(v, 16));

test('the public lockup letters are true greys, ink on paper', () => {
  const fills = [...read('public/logo-wordmark.svg').matchAll(/fill="(#[0-9a-f]{6})"/gi)].map((m) => m[1].toLowerCase())
    .filter((f) => !['#c2410c', '#fafafa'].includes(f));
  assert.ok(fills.length >= 2, 'the lockup has its two letter fills');
  for (const f of fills) { const [r, g, b] = hex(f); assert.ok(r === g && g === b, `${f} carries a hue`); }
});

test('every page shares a large image', () => {
  const base = read('src/layouts/Base.astro');
  const og = base.match(/<meta property="og:image" content="([^"]+)"/);
  assert.ok(og, 'og:image meta is missing');
  assert.match(base, /<meta name="twitter:card" content="summary_large_image">/);
  assert.ok(existsSync(new URL(`../public${new URL(og[1], 'https://colliedesk.com').pathname}`, import.meta.url)), `${og[1]} is not in public/`);
});
