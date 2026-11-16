// A page rendered from the product repo is dated by its own file's git history. When that history is
// missing (a shallow clone), it has no date: the site-wide date would claim a change that never happened.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pageDate } from '../src/lib/page-date.mjs';

const SITE = '2026-10-20';

test('a page with its own date keeps it', () => {
  assert.equal(pageDate({ updated: '2026-11-14', sourceUrl: 'https://github.com/x/y/blob/main/docs/user/inbox.md' }, SITE), '2026-11-14');
});

test('a page rendered from the product repo without a git date has no date', () => {
  assert.equal(pageDate({ sourceUrl: 'https://github.com/x/y/blob/main/docs/user/inbox.md' }, SITE), undefined);
});

test('a page written in this repo falls back to the site-wide date', () => {
  assert.equal(pageDate({ path: '/pricing' }, SITE), '2026-10-20');
});
