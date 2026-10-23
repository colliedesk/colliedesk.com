// Tells Bing and the other IndexNow engines which pages a deploy added or changed, so a new page
// is crawled within hours instead of waiting to be discovered. Google does not use IndexNow; it
// reads the sitemap through Search Console.
//
//   node scripts/indexnow.mjs changed <live sitemap URL> <built sitemap path>  -> JSON list on stdout
//   node scripts/indexnow.mjs submit '<JSON list>'                             -> POST to IndexNow
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ENDPOINT = 'https://api.indexnow.org/indexnow';
const KEY_FILE = /^([0-9a-f]{32})\.txt$/;

function entries(xml) {
  const map = new Map();
  for (const m of xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)) {
    map.set(m[1].trim(), (m[2] ?? '').trim());
  }
  return map;
}

// Pages that are new or whose lastmod moved since the live sitemap. Removed pages are left out:
// the engines drop them when the crawl gets a 404.
export function changedUrls(liveXml, nextXml) {
  const live = entries(liveXml);
  return [...entries(nextXml)].filter(([loc, lastmod]) => live.get(loc) !== lastmod).map(([loc]) => loc);
}

export function indexNowBody(urls, key) {
  const host = new URL(urls[0]).host;
  return { host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urls };
}

function siteKey() {
  const dir = fileURLToPath(new URL('../public/', import.meta.url));
  const match = readdirSync(dir).map((f) => KEY_FILE.exec(f)).find(Boolean);
  if (!match) throw new Error('no IndexNow key file (32 hex characters + .txt) in public/');
  return match[1];
}

async function main([command, a, b]) {
  if (command === 'changed') {
    const live = await fetch(a, { signal: AbortSignal.timeout(15000) })
      .then((r) => (r.ok ? r.text() : ''))
      .catch(() => '');
    console.log(JSON.stringify(changedUrls(live, readFileSync(b, 'utf8'))));
    return;
  }
  if (command === 'submit') {
    const urls = JSON.parse(a || '[]');
    if (urls.length === 0) return console.log('indexnow: no changed pages');
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(indexNowBody(urls, siteKey())),
      signal: AbortSignal.timeout(15000),
    });
    console.log(`indexnow: ${urls.length} URL(s), HTTP ${res.status}`);
    // 200 and 202 mean accepted. Anything else is a real fault (bad key, wrong host) and must show.
    if (res.status !== 200 && res.status !== 202) process.exitCode = 1;
    return;
  }
  throw new Error('usage: indexnow.mjs changed <live sitemap URL> <built sitemap> | submit <JSON list>');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main(process.argv.slice(2));
