// Content QA for the marketing pages, read from their Markdown twins in _site/. A page fails when
// its prose reads above READING_GRADE_MAX, uses an em dash or an AI-slop phrase, has no call to
// action in the body, quotes a competitor price without a source link, has a title or meta
// description outside the length the top results use, or links fewer than 2 other pages here. Any
// page this site writes, legal pages and release notes included, fails when it says "beta" or states the
// retired AI price. While Founding is open (founding-state.json), a page, its Markdown twin or an llms
// file that names a monthly Cloud plan price before it names Founding fails. Pages listed in
// KNOWN_DEBT may miss a rule until they are fixed; the list can only shrink. Exits 1 on any failure.
// The judgement calls (is a claim true, is the article useful) are the content QA skill's job, in
// docs/seo/; this script only checks what a machine can check.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Flesch-Kincaid grade. Existing pages read at 5.7 to 9.2 on 20 October 2026.
export const READING_GRADE_MAX = 10;

// Words and phrases that mark generated filler. Match is case-insensitive, on word boundaries.
const SLOP = [
  'delve', 'seamless', 'seamlessly', 'leverage', 'unlock', 'game-changer', 'game changer', 'elevate',
  'robust', "in today's", 'navigate the', 'tapestry', 'supercharge', 'empower', 'cutting-edge',
  'streamline', 'effortless', 'effortlessly', 'revolutionize', 'revolutionise', 'harness',
  'look no further', 'whether you are', "whether you're", 'unparalleled', 'best-in-class',
];
const SLOP_RE = new RegExp(`\\b(${SLOP.map((s) => s.replace(/[-']/g, (c) => `\\${c}`)).join('|')})\\b`, 'gi');

const COMPETITORS = [
  'Freshdesk', 'Freshworks', 'Zendesk', 'Help Scout', 'Front', 'Zoho', 'Gorgias', 'HubSpot', 'HappyFox',
  'Groove', 'Helply', 'Intercom', 'Zammad', 'Chatwoot', 'FreeScout', 'Kayako', 'Jira Service',
];
const COMPETITOR_RE = new RegExp(`\\b(${COMPETITORS.join('|')})\\b`);
const PRICE_RE = /[$€£]\s?\d/;

// A body link to one of these is a call to action.
const CTA_RE = /\]\((?:https:\/\/colliedesk\.com)?(?:\/pricing|\/migrate\/[^)\s]*|\/#founding)\)|\]\(https:\/\/app\.colliedesk\.com[^)\s]*\)/;
// A competitor price is sourced by an outside link or by the page that carries its source.
const SOURCE_RE = /\]\((?:https:\/\/colliedesk\.com)?\/(?:vs\/[a-z-]+|freshdesk-pricing-history)\)|\]\(https?:\/\/(?!colliedesk\.com|app\.colliedesk\.com|github\.com\/colliedesk)[^)\s]+\)/;

// Length limits from the pages ranking top 3 for our keywords (docs/seo/serp-patterns.md): Google
// cuts titles near 60 characters and descriptions near 160.
export const TITLE_MAX = 60;
export const DESCRIPTION_MIN = 120;
export const DESCRIPTION_MAX = 160;
export const INTERNAL_LINKS_MIN = 2;
// Body links to another page of this site; app.colliedesk.com is not one.
const INTERNAL_LINK_RE = /\]\((?:https:\/\/colliedesk\.com)?(\/[^)\s#]*)(?:#[^)\s]*)?\)/g;

// Docs, legal pages and release notes are not marketing copy.
const EXEMPT = [/^\/docs(\/|$)/, /^\/roadmap$/, /^\/changelog$/, /^\/privacy$/, /^\/terms$/];

// Pages that miss a rule today, by rule. Fix the page, then delete its line; never add one.
// The finding text each debt rule waives, so the gate can tell when a listed page passes.
const RULE_FINDING = {
  cta: 'no call to action', source: 'competitor price', title: 'title is',
  description: 'meta description is', links: 'other page',
};
export const KNOWN_DEBT = {
  cta: [
    '/migrate/zendesk/export', '/open-source', '/vs/chatwoot', '/vs/front', '/vs/gorgias', '/vs/groove',
    '/vs/happyfox', '/vs/help-scout', '/vs/hubspot-service-hub', '/vs/zoho-desk',
  ],
  title: [
    '/', '/compare', '/freshdesk-alternative', '/freshdesk-pricing-history', '/migrate/freshdesk',
    '/migrate/freshdesk/export', '/migrate/zendesk/export', '/open-source', '/pricing', '/self-hosted-helpdesk',
    '/vs/chatwoot', '/vs/freescout', '/vs/freshdesk', '/vs/front', '/vs/gorgias', '/vs/groove', '/vs/happyfox',
    '/vs/help-scout', '/vs/hubspot-service-hub', '/vs/zammad', '/vs/zendesk', '/vs/zoho-desk',
  ],
  description: [
    '/', '/compare', '/freshdesk-alternative', '/freshdesk-pricing-history', '/helpdesk-for-small-teams',
    '/migrate/freshdesk', '/migrate/freshdesk/done-for-you', '/migrate/zendesk/export', '/open-source', '/pricing',
    '/self-hosted-helpdesk', '/vs/freescout', '/vs/freshdesk', '/vs/front', '/vs/gorgias', '/vs/groove',
    '/vs/happyfox', '/vs/help-scout', '/vs/hubspot-service-hub', '/vs/zammad', '/vs/zendesk', '/vs/zoho-desk',
  ],
  links: [
    '/open-source', '/vs/chatwoot', '/vs/freescout', '/vs/front', '/vs/gorgias', '/vs/groove', '/vs/happyfox',
    '/vs/help-scout', '/vs/hubspot-service-hub', '/vs/zammad', '/vs/zoho-desk',
  ],
};

// Lines a reader reads as sentences: no headings, tables, lists, quotes, images, HTML or code.
function proseOf(md) {
  return md
    .replace(/```[\s\S]*?```/g, '')
    .split('\n')
    .filter((line) => line.trim() && !/^\s*(\||#|>|[-*+]\s|\d+\.\s|!\[|<)/.test(line))
    .join('\n');
}

function syllables(word) {
  let w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  return w.match(/[aeiouy]{1,2}/g)?.length ?? 1;
}

/** Flesch-Kincaid grade of plain text; null when there are too few words to judge. */
export function readingGrade(text) {
  const plain = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/`[^`]*`/g, 'code').replace(/\*\*?/g, '');
  const sentences = plain.split(/[.!?]+(?:\s|$)/).filter((s) => s.trim().split(/\s+/).length > 2);
  const words = plain.split(/\s+/).filter((w) => /[a-z]/i.test(w));
  if (!sentences.length || words.length < 50) return null;
  const syl = words.reduce((sum, w) => sum + syllables(w), 0);
  return 0.39 * (words.length / sentences.length) + 11.8 * (syl / words.length) - 15.59;
}

/** Findings for one page's Markdown twin; an empty array means it passes. */
export function checkPage({ path, md, title, description }, debt = {}) {
  const findings = [];
  const prose = proseOf(md);
  const owes = (rule) => debt[rule]?.includes(path);

  const grade = readingGrade(prose);
  if (grade !== null && grade > READING_GRADE_MAX) {
    findings.push(`${path}: reading grade ${grade.toFixed(1)} is above ${READING_GRADE_MAX}; use shorter sentences and plainer words`);
  }
  const dashes = prose.split('\n').filter((line) => line.includes('—'));
  if (dashes.length) findings.push(`${path}: em dash in prose (${dashes.length} line(s)), e.g. "${dashes[0].trim().slice(0, 80)}"`);

  const slop = [...new Set([...md.matchAll(SLOP_RE)].map((m) => m[0]))];
  if (slop.length) findings.push(`${path}: AI-slop phrase(s): ${slop.join(', ')}`);

  if (!CTA_RE.test(md) && !owes('cta')) {
    findings.push(`${path}: no call to action in the body; link /pricing, /migrate/..., /#founding or app.colliedesk.com`);
  }

  const priced = md.split('\n').find((line) => PRICE_RE.test(line) && COMPETITOR_RE.test(line));
  if (priced && !SOURCE_RE.test(md) && !owes('source')) {
    findings.push(`${path}: competitor price with no source link on the page: "${priced.trim().slice(0, 80)}"`);
  }

  if (title !== undefined && title.length > TITLE_MAX && !owes('title')) {
    findings.push(`${path}: title is ${title.length} characters; keep it at ${TITLE_MAX} or fewer so Google shows all of it`);
  }
  if (description !== undefined && (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX) && !owes('description')) {
    findings.push(`${path}: meta description is ${description.length} characters; keep it between ${DESCRIPTION_MIN} and ${DESCRIPTION_MAX}`);
  }
  const linked = new Set([...md.matchAll(INTERNAL_LINK_RE)].map((m) => m[1].replace(/\/$/, '') || '/').filter((p) => p !== path));
  if (linked.size < INTERNAL_LINKS_MIN && !owes('links')) {
    findings.push(`${path}: body links ${linked.size} other page(s) on this site; link at least ${INTERNAL_LINKS_MIN} related pages`);
  }
  return findings;
}

// Colliedesk as a whole is alpha. Until HC Labs announces beta, nothing this site writes calls the
// product, a release or a feature beta: a feature is shipped or not built yet. Link targets and bare
// URLs are not copy. /docs and /roadmap bodies come from the product repository, which has the same
// rule for its own text; their titles and descriptions are written here and are checked.
const BETA_RE = /\bbeta\b/i;
const URL_RE = /\]\([^)\s]*\)|https?:\/\/[^\s)"'<>]+/g;
const PRODUCT_DOCS = [/^\/docs(\/|$)/, /^\/roadmap$/];

/** One finding per line of text that says "beta" outside a URL. */
export function betaFindings(path, text) {
  return text.split('\n').flatMap((raw) => {
    const line = raw.replace(URL_RE, '');
    const at = line.search(BETA_RE);
    if (at < 0) return [];
    const quote = line.slice(Math.max(0, at - 50), at + 40).replace(/\s+/g, ' ').trim();
    return [`${path}: says "beta"; Colliedesk is alpha as a whole, so say shipped or not built yet: "${quote}"`];
  });
}

// AI on Colliedesk Cloud is no longer sold at the model provider's cost plus a margin: reply drafts and
// triage are included with a monthly allowance, auto-answer is priced per resolution, and your own key
// adds no fee (src/lib/site.ts). Any wording of the retired price fails, so it cannot come back.
const OLD_AI_PRICE_RE = /\+\s?30\s?%|\bplus 30\s?%|\b(?:LLM|model) cost\b|\bAI (?:included )?at cost\b/i;

/** One finding per line of text that states the retired "model cost +30%" AI price. */
export function oldAiPriceFindings(path, text) {
  return text.split('\n').flatMap((raw) => {
    const line = raw.replace(URL_RE, '');
    const at = line.search(OLD_AI_PRICE_RE);
    if (at < 0) return [];
    const quote = line.slice(Math.max(0, at - 50), at + 40).replace(/\s+/g, ' ').trim();
    return [`${path}: states the retired AI price (model cost +30%); use the AI price in src/lib/site.ts: "${quote}"`];
  });
}

// While Founding is open it is the only Colliedesk Cloud plan on sale (src/lib/founding.ts); the monthly
// plans are the prices after its ten places are taken. A page that names a monthly plan with a dollar
// price must name Founding before it, so a visitor from search meets the offer they can buy first.
const PLAN_PRICE_RE = /\b(?:Solo|Small|Team 25|Team|Unlimited)\b[^.;|\n$€£]{0,40}\$\d|\$\d[\d,.]*\**\s*\((?:Solo|Small|Team|Unlimited)\b/;
const FOUNDING_RE = /\bfounding\b/i;

/** One finding when, with Founding open, the text names a Cloud plan price before it names Founding. */
export function foundingLeadFindings(path, text, open) {
  if (!open) return [];
  const price = text.search(PLAN_PRICE_RE);
  if (price < 0) return [];
  const founding = text.search(FOUNDING_RE);
  if (founding >= 0 && founding < price) return [];
  const quote = text.slice(Math.max(0, price - 40), price + 50).replace(/\s+/g, ' ').trim();
  return [`${path}: names a Cloud plan price before Founding while Founding is open; lead with Founding ($99 a quarter) and give the monthly plans as the prices after the 10 places: "${quote}"`];
}

/** Whether the site was built with Founding open; no state file reads as open, as in the build. */
export function foundingOpenFrom(file) {
  if (!existsSync(file)) return true;
  try {
    return JSON.parse(readFileSync(file, 'utf8')).open !== false;
  } catch {
    return true;
  }
}

/** The words a visitor sees in an HTML page: no scripts, styles or tags. */
const visibleText = (html) => decode(html.replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' '));

const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

/** Title and meta description of the HTML page next to a Markdown twin. */
export function headOf(html) {
  return {
    title: decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''),
    description: decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ''),
  };
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const outDir = fileURLToPath(new URL('../_site/', import.meta.url));
  if (!existsSync(outDir)) {
    console.error('FAIL _site/ does not exist; run `pnpm build` first');
    process.exit(1);
  }
  const pages = walk(outDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const rel = relative(outDir, f).split(sep).join('/').replace(/\.md$/, '');
      const html = f.replace(/\.md$/, '.html');
      const head = existsSync(html) ? headOf(readFileSync(html, 'utf8')) : {};
      return { path: rel === 'index' ? '/' : `/${rel}`, md: readFileSync(f, 'utf8'), ...head };
    })
    .filter(({ path }) => !EXEMPT.some((re) => re.test(path)));

  const errors = pages.flatMap((p) => checkPage(p, KNOWN_DEBT));

  const urlPathOf = (file) => {
    const rel = relative(outDir, file).split(sep).join('/').replace(/\.(html|md)$/, '').replace(/(^|\/)index$/, '');
    return `/${rel}`;
  };
  const sitewide = new Set();
  const foundingOpen = foundingOpenFrom(process.env.FOUNDING_STATE_FILE ?? 'founding-state.json');
  for (const file of walk(outDir)) {
    const path = urlPathOf(file);
    const fromProduct = PRODUCT_DOCS.some((re) => re.test(path));
    if (file.endsWith('.html')) {
      const html = readFileSync(file, 'utf8');
      const { title, description } = headOf(html);
      for (const f of betaFindings(path, `${title}\n${description}`)) sitewide.add(f);
      if (!fromProduct) for (const f of betaFindings(path, visibleText(html))) sitewide.add(f);
      // JSON-LD included: search engines quote it.
      for (const f of oldAiPriceFindings(path, fromProduct ? `${title}\n${description}` : decode(html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ')))) sitewide.add(f);
      if (!fromProduct) {
        for (const text of [title, description, visibleText(html.replace(/<head>[\s\S]*?<\/head>/, ''))]) {
          for (const f of foundingLeadFindings(path, text, foundingOpen)) sitewide.add(f);
        }
      }
    } else if (file.endsWith('.md') && !fromProduct) {
      for (const f of betaFindings(path, readFileSync(file, 'utf8'))) sitewide.add(f);
      for (const f of oldAiPriceFindings(path, readFileSync(file, 'utf8'))) sitewide.add(f);
      for (const f of foundingLeadFindings(`${path}.md`, readFileSync(file, 'utf8'), foundingOpen)) sitewide.add(f);
    } else if (/llms(-full)?\.txt$/.test(file)) {
      const text = readFileSync(file, 'utf8');
      const name = `/${relative(outDir, file)}`;
      if (file.endsWith('/llms.txt')) for (const f of betaFindings(name, text)) sitewide.add(f);
      for (const f of oldAiPriceFindings(name, text)) sitewide.add(f);
      // llms.txt: one line per page; llms-full.txt: one section per page, split by "---".
      const units = file.endsWith('/llms.txt') ? text.split('\n') : text.split(/\n---\n/);
      for (const unit of units) for (const f of foundingLeadFindings(name, unit, foundingOpen)) sitewide.add(f);
    }
  }
  errors.push(...sitewide);
  // A debt entry for a page that now passes, or that no longer exists, must be deleted.
  for (const [rule, paths] of Object.entries(KNOWN_DEBT)) {
    for (const path of paths) {
      const p = pages.find((x) => x.path === path);
      if (!p) errors.push(`KNOWN_DEBT.${rule}: ${path} is not built; delete the entry`);
      else if (!checkPage(p).some((f) => f.includes(RULE_FINDING[rule]))) {
        errors.push(`KNOWN_DEBT.${rule}: ${path} passes now; delete the entry`);
      }
    }
  }
  for (const e of errors) console.error(`FAIL ${e}`);
  if (errors.length) process.exit(1);
  console.log(`ok content QA: ${pages.length} pages, ${Object.values(KNOWN_DEBT).flat().length} known-debt entries`);
}
