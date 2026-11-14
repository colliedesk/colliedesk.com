// Competitor watch (issue #137): read every source URL in src/data/competitors/<slug>.ts, keep a hash
// of its visible text and stop when nothing changed, which is most days. When a page changed, compare
// it with the text read last time:
//   - a figure our file cites from that source is gone from the page, or a price appeared → changed:
//     prepare a correction pull request with the evidence (URL, quote, what our file says);
//   - anything else (copy, layout, a nonce) → cosmetic: remember the new text, raise nothing.
// A page read for the first time is a baseline. An unreachable page, or one with no text in its HTML
// (rendered in the browser), keeps the text read last time. Each result lists the figures our file
// cites that the page text does not show (unseen): the watch cannot see those change.
// The pull request carries an evidence file only: a person edits the data file and its read date,
// so the watch never changes a figure, and never touches Colliedesk's own side, by itself.
// No paid service: plain HTTP GET and string comparison. scripts/competitor-watch-run.mjs runs it.
import { createHash } from 'node:crypto';

const DROP = /<(script|style|noscript|svg|template|head)\b[\s\S]*?<\/\1\s*>|<!--[\s\S]*?-->/gi;
const BLOCK = /<\/?(p|div|section|article|header|footer|main|nav|aside|h[1-6]|li|ul|ol|tr|td|th|table|dt|dd|br|hr|blockquote|figcaption|option|button|label)\b[^>]*>/gi;
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', euro: '€', pound: '£', ndash: '–', mdash: '—' };
const MAX_LINES = 8;
const MAX_QUOTE = 300;

const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
  e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : ENTITIES[e.toLowerCase()] ?? m);

/** The visible text of an HTML page, one block per line, whitespace collapsed. */
export function normalizeText(html) {
  const text = decode(html.replace(DROP, ' ').replace(BLOCK, '\n').replace(/<[^>]*>/g, ' '));
  return text.split('\n').map((line) => line.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
}

export const hashText = (text) => createHash('sha256').update(text).digest('hex');

const MARKER = /<!-- competitor-watch:[a-z0-9-]+:[A-Za-z0-9_-]+:[0-9a-f]{12} -->/g;

/** Markers of earlier watch pull requests ({ body } each, open or closed): a change is raised once. */
export const markersFrom = (prs) => new Set(prs.flatMap((pr) => pr.body?.match(MARKER) ?? []));

/** "30,000" and "2.00" compare as 30000 and 2. */
const figure = (raw) => String(Number(raw.replace(/,/g, '')));
const figures = (text) => new Set((text.match(/\d[\d,]*(?:\.\d+)?/g) ?? []).map(figure));
const prices = (text) => new Set((text.match(/[$€£]\s?\d[\d,]*(?:\.\d+)?/g) ?? []).map((p) => `${p[0]}${figure(p.slice(1).trim())}`));

/** Every fact, leaving bullet and feature of a competitor file that cites one source key. */
export function citing(c, key) {
  const lines = [];
  for (const [name, fact] of Object.entries(c.facts ?? {})) if (fact?.source === key) lines.push(`${name}: ${fact.text}`);
  for (const fact of c.export ?? []) if (fact.source === key) lines.push(`leaving: ${fact.text}`);
  for (const [name, value] of Object.entries(c.features ?? {})) if (value !== 'unread' && value?.source === key) lines.push(`feature ${name}: ${value.has}, ${value.text}`);
  return lines;
}

async function read(fetch, url) {
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'colliedesk-competitor-watch (+https://colliedesk.com)' } });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    return { text: normalizeText(await res.text()) };
  } catch (err) {
    return { error: `${err.name}: ${err.cause?.message ?? err.message}` };
  }
}

/** What changed between two texts of one page, for the figures our file cites from it. */
function compare(before, after, cited) {
  const old = figures(before);
  const now = figures(after);
  const dropped = [...figures(cited.join('\n'))].filter((f) => old.has(f) && !now.has(f));
  const oldPrices = prices(before);
  const added = [...prices(after)].filter((p) => !oldPrices.has(p));
  const beforeLines = new Set(before.split('\n'));
  const afterLines = new Set(after.split('\n'));
  return {
    dropped,
    added,
    removedLines: [...beforeLines].filter((l) => !afterLines.has(l)),
    addedLines: [...afterLines].filter((l) => !beforeLines.has(l)),
  };
}

// Page text is untrusted: "@name" would notify a GitHub user and "<!--" could forge a watch marker.
const inert = (l) => l.replace(/</g, '&lt;').replace(/@/g, '@\u200b');
const quote = (lines) => lines.slice(0, MAX_LINES).map((l) => `> ${inert(l.length > MAX_QUOTE ? `${l.slice(0, MAX_QUOTE)}…` : l)}`).join('\n>\n') || '> (nothing)';
const codes = (list) => list.map((f) => `\`${f}\``).join(', ') || 'none';

/** The correction pull request for one changed source: branch, title, body, evidence file, marker. */
export function proposalFor(c, result, day) {
  const name = `${c.slug}-${result.source}-${day}`;
  const dataFile = `src/data/competitors/${c.slug}.ts`;
  const marker = `<!-- competitor-watch:${c.slug}:${result.source}:${result.hash.slice(0, 12)} -->`;
  const label = c.sources[result.source].label;
  const evidence = [
    `The competitor watch read ${result.url} on ${day}. Its text changed since ${result.changedSince}.`,
    '',
    `- Figures \`${dataFile}\` cites from this source that the page no longer shows: ${codes(result.dropped)}`,
    `- Prices on the page that were not there before: ${codes(result.added)}`,
    '',
    '## What their page says now',
    '',
    quote(result.addedLines),
    '',
    '## What it said before',
    '',
    quote(result.removedLines),
    '',
    `## What our file says (\`${dataFile}\`, source \`${result.source}\`)`,
    '',
    ...result.cited.map((l) => `- ${l}`),
  ].join('\n');
  const body = [
    evidence,
    '',
    '## Before merge',
    '',
    `1. Open ${result.url} and read it. The quotes above are the lines that changed, not the whole page.`,
    `2. Edit \`${dataFile}\`: the figures and \`readOn\` (or the source's \`readOn\`). The watch does not edit it.`,
    '3. Push to this branch, mark the pull request ready, and merge after review.',
    '4. Close it when the change does not matter. The watch does not raise the same page text again.',
    '',
    marker,
  ].join('\n');
  return {
    url: result.url,
    branch: `competitor-watch/${name}`,
    title: `fix(compare): ${label} page changed, check ${dataFile}`,
    body,
    marker,
    files: [{ path: `docs/competitor-watch/${name}.md`, content: `# ${label} changed on ${day}\n\n${evidence}\n` }],
  };
}

/**
 * Read every source of every competitor once and compare it with state.sources[url].
 * Returns { results, proposals, state }; the given state is not modified.
 * knownMarkers: markers of pull requests already opened, open or closed, so a change is raised once.
 */
export async function watchCompetitors(competitors, { fetch, state, today, knownMarkers = new Set() }) {
  const day = today.toISOString().slice(0, 10);
  const sources = { ...(state?.sources ?? {}) };
  const reads = new Map();
  const results = [];
  const proposals = [];
  for (const c of competitors) {
    for (const [key, source] of Object.entries(c.sources)) {
      const { url } = source;
      const previous = state?.sources?.[url];
      if (!reads.has(url)) reads.set(url, read(fetch, url));
      const page = await reads.get(url);
      const base = { slug: c.slug, source: key, url };
      if (page.error) {
        results.push({ ...base, status: 'unreachable', error: page.error });
        continue;
      }
      if (!page.text) {
        results.push({ ...base, status: 'no-text' });
        continue;
      }
      const hash = hashText(page.text);
      const cited = citing(c, key);
      const shown = figures(page.text);
      // Figures we cite that this page's text does not show: the watch cannot see them change.
      const unseen = [...figures(cited.join('\n'))].filter((f) => !shown.has(f));
      if (previous?.hash === hash) {
        results.push({ ...base, status: 'unchanged', hash, unseen });
        sources[url] = { ...previous, checkedOn: day };
        continue;
      }
      sources[url] = { hash, text: page.text, checkedOn: day, changedOn: day };
      if (!previous) {
        results.push({ ...base, status: 'baseline', hash, unseen });
        continue;
      }
      const diff = compare(previous.text, page.text, cited);
      const matters = diff.dropped.length > 0 || diff.added.length > 0;
      const result = { ...base, status: matters ? 'changed' : 'cosmetic', hash, unseen, changedSince: previous.changedOn, cited, ...diff };
      if (matters) {
        const proposal = proposalFor(c, result, day);
        if (knownMarkers.has(proposal.marker)) result.skipped = 'already raised in a pull request';
        else proposals.push(proposal);
      }
      results.push(result);
    }
  }
  return { results, proposals, state: { version: 1, sources } };
}
