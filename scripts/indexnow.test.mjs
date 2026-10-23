import assert from 'node:assert/strict';
import { test } from 'node:test';
import { changedUrls, indexNowBody } from './indexnow.mjs';

const sitemap = (rows) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  rows.map(([loc, lastmod]) => `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`;

const LIVE = sitemap([
  ['https://colliedesk.com/', '2026-10-20'],
  ['https://colliedesk.com/pricing', '2026-10-20'],
  ['https://colliedesk.com/old-page', '2026-10-01'],
]);

test('a page added or with a newer lastmod is submitted; unchanged and removed pages are not', () => {
  const next = sitemap([
    ['https://colliedesk.com/', '2026-10-20'],
    ['https://colliedesk.com/pricing', '2026-10-24'],
    ['https://colliedesk.com/tlar/leave-freshdesk', '2026-10-24'],
  ]);
  assert.deepEqual(changedUrls(LIVE, next), [
    'https://colliedesk.com/pricing',
    'https://colliedesk.com/tlar/leave-freshdesk',
  ]);
});

test('nothing changed submits nothing', () => {
  assert.deepEqual(changedUrls(LIVE, LIVE), []);
});

test('when the live sitemap could not be read, every page is submitted once', () => {
  assert.deepEqual(changedUrls('', LIVE), [
    'https://colliedesk.com/',
    'https://colliedesk.com/pricing',
    'https://colliedesk.com/old-page',
  ]);
});

test('the request body names the host, the key and where the key file lives', () => {
  assert.deepEqual(indexNowBody(['https://colliedesk.com/pricing'], 'abc123'), {
    host: 'colliedesk.com',
    key: 'abc123',
    keyLocation: 'https://colliedesk.com/abc123.txt',
    urlList: ['https://colliedesk.com/pricing'],
  });
});
