// Verifies the built site in _site/: every page has a Markdown twin, an llms.txt entry,
// a sitemap entry, canonical + alternate links and valid JSON-LD; every internal link and
// fragment resolves; the JavaScript budget holds. Exits 1 on any failure.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const ORIGIN = 'https://colliedesk.com';
const UPDATES_FORM_URL = 'https://app.colliedesk.com/api/v1/public/forms/hclabs';
const JS_BUDGET_BYTES = 100 * 1024;
// The page is neutral grey and ink (app brand guideline); the price has its own token (--price)
// (README, Design). Every var(--accent…) in styles.css counts. Raise this only with a reason in the commit.
const ACCENT_BUDGET = 26;
const REQUIRED_PAGES = [
  '/', '/pricing', '/migrate/freshdesk', '/vs/freshdesk', '/vs/zendesk', '/vs/help-scout',
  '/open-source', '/roadmap', '/docs', '/changelog', '/privacy', '/terms',
  '/self-hosted-helpdesk', '/migrate/freshdesk/done-for-you', '/helpdesk-for-small-teams',
  '/vs/zammad', '/vs/chatwoot', '/vs/freescout', '/vs/zoho-desk', '/vs/happyfox', '/vs/gorgias',
  '/vs/hubspot-service-hub', '/vs/groove', '/freshdesk-alternative', '/freshdesk-pricing-history', '/compare',
];
const AI_CRAWLERS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'];

const outDir = fileURLToPath(new URL('../_site/', import.meta.url));
const errors = [];
const fail = (msg) => { if (!errors.includes(msg)) errors.push(msg); };

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

// _site/pricing.html -> /pricing, _site/index.html -> /, _site/docs/install.html -> /docs/install
function urlPathOf(htmlFile) {
  const rel = relative(outDir, htmlFile).split(sep).join('/').replace(/\.html$/, '');
  return rel === 'index' ? '/' : `/${rel}`;
}
const mdPathOf = (urlPath) => (urlPath === '/' ? '/index.md' : `${urlPath}.md`);

// Same resolution rules as Cloudflare Pages and scripts/serve.mjs.
function fileFor(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  const base = join(outDir, clean);
  const candidates = clean.endsWith('/')
    ? [join(base, 'index.html')]
    : [base, `${base}.html`, join(base, 'index.html')];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
}

const idsCache = new Map();
function idsIn(file) {
  if (!idsCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idsCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsCache.get(file);
}

function checkLink(href, fromUrlPath, where) {
  if (/^(mailto:|tel:|data:)/.test(href)) return;
  let target = href;
  if (href.startsWith(ORIGIN)) target = href.slice(ORIGIN.length) || '/';
  else if (/^https?:\/\//.test(href)) return; // external, not crawled here
  if (target.startsWith('#')) target = fromUrlPath + target;
  if (!target.startsWith('/')) return fail(`${where}: relative link "${href}" (use root-relative)`);
  const [pathPart, fragment] = target.split('#');
  const file = fileFor(pathPart || '/');
  if (!file) return fail(`${where}: broken link "${href}"`);
  if (fragment && file.endsWith('.html') && !idsIn(file).has(fragment)) {
    fail(`${where}: missing fragment "#${fragment}" in ${pathPart}`);
  }
}

if (!existsSync(outDir)) {
  console.error('FAIL _site/ does not exist; run `pnpm build` first');
  process.exit(1);
}

const files = walk(outDir);
const pages = files.filter((f) => f.endsWith('.html') && !f.endsWith(`${sep}404.html`));
const read = (name) => (existsSync(join(outDir, name)) ? readFileSync(join(outDir, name), 'utf8') : '');
const llms = read('llms.txt');
const llmsFull = read('llms-full.txt');
const sitemap = read('sitemap.xml');
const robots = read('robots.txt');

if (!llms.startsWith('# ')) fail('llms.txt missing or has no H1');
if (!/^> /m.test(llms)) fail('llms.txt has no blockquote summary');
if (!llmsFull) fail('llms-full.txt missing');
if (!sitemap.includes('<urlset')) fail('sitemap.xml missing');
if (!/Sitemap: https:\/\/colliedesk\.com\/sitemap\.xml/.test(robots)) fail('robots.txt has no Sitemap line');
for (const bot of AI_CRAWLERS) {
  if (!new RegExp(`User-agent: ${bot}\\s*\\nAllow: /`).test(robots)) fail(`robots.txt does not allow ${bot}`);
}

const urlPaths = pages.map(urlPathOf);
for (const required of REQUIRED_PAGES) {
  if (!urlPaths.includes(required)) fail(`required page ${required} not built`);
}

let jsBytes = 0;
for (const file of files.filter((f) => f.endsWith('.js') || f.endsWith('.mjs'))) jsBytes += statSync(file).size;

for (const file of pages) {
  const urlPath = urlPathOf(file);
  const html = readFileSync(file, 'utf8');
  const mdUrl = mdPathOf(urlPath);
  const canonical = `${ORIGIN}${urlPath}`;
  const where = urlPath;

  if (!fileFor(mdUrl)) fail(`${where}: no Markdown twin at ${mdUrl}`);
  if (!llms.includes(`(${ORIGIN}${mdUrl})`)) fail(`${where}: no llms.txt entry for ${ORIGIN}${mdUrl}`);
  if (!llmsFull.includes(`Source: ${canonical}\n`)) fail(`${where}: not in llms-full.txt`);
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) fail(`${where}: not in sitemap.xml`);
  if (!html.includes(`<link rel="canonical" href="${canonical}">`)) fail(`${where}: canonical missing or wrong`);
  if (!html.includes(`<link rel="alternate" type="text/markdown" href="${mdUrl}">`)) fail(`${where}: markdown alternate link missing`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) fail(`${where}: <title> missing or too short`);
  if (!/<meta name="description" content="[^"]{50,}">/.test(html)) fail(`${where}: meta description missing or under 50 chars`);
  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) fail(`${where}: expected exactly one <h1>, found ${h1s.length}`);
  if (/Be Vietnam Pro/i.test(html)) fail(`${where}: banned typeface referenced`);
  // Every page offers the updates box: an email field with a label, posting to the web form
  // channel of HC Labs' own Colliedesk workspace, plus the empty honeypot the endpoint expects.
  const form = html.match(/<form[^>]*data-updates-form[^>]*>[\s\S]*?<\/form>/)?.[0] || '';
  if (!form) fail(`${where}: updates form missing`);
  else {
    if (!form.includes(`action="${UPDATES_FORM_URL}"`)) fail(`${where}: updates form does not post to ${UPDATES_FORM_URL}`);
    if (!/<label for="updates-email"/.test(form) || !/<input[^>]*id="updates-email"[^>]*type="email"[^>]*required/.test(form)) fail(`${where}: updates form has no labelled required email field`);
    if (!/<input[^>]*name="website"[^>]*tabindex="-1"/.test(form)) fail(`${where}: updates form has no honeypot`);
  }

  for (const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (m[1].includes('application/ld+json')) {
      try { JSON.parse(m[2]); } catch (e) { fail(`${where}: invalid JSON-LD (${e.message})`); }
    } else {
      jsBytes += Buffer.byteLength(m[2]);
    }
  }
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) checkLink(m[1], urlPath, where);

  const md = fileFor(mdUrl) ? readFileSync(fileFor(mdUrl), 'utf8') : '';
  for (const m of md.matchAll(/\]\(([^)\s]+)\)/g)) checkLink(m[1], urlPath, `${mdUrl}`);
}

// The founding price is locked for life, so its storage cap must be stated wherever the offer is.
for (const path of ['/', '/pricing']) {
  const file = fileFor(path);
  if (file && !readFileSync(file, 'utf8').includes('20 GB of attachments')) fail(`${path}: founding offer does not state the 20 GB attachment cap`);
}

// A static Polar checkout link sells Founding to a buyer who has no workspace: the payment lands
// and nothing is created. Founding is bought inside the app, after sign-up, so the checkout carries
// the workspace.
for (const file of files.filter((f) => /\.(html|md|txt)$/.test(f))) {
  if (readFileSync(file, 'utf8').includes('buy.polar.sh/')) fail(`${file.slice(outDir.length - 1)}: links a static Polar checkout; send buyers to the app (${'app.colliedesk.com/settings/billing?buy=founding'})`);
}

// The Founding refund promise must sit wherever the Founding checkout is offered, and the terms
// must define it at /terms#refunds, the anchor those pages link to.
for (const file of files.filter((f) => /\.(html|md)$/.test(f))) {
  const text = readFileSync(file, 'utf8');
  if (text.includes('app.colliedesk.com/settings/billing?buy=founding') && !/30-day money-back|within 30 days/.test(text)) {
    fail(`${file.slice(outDir.length - 1)}: offers the Founding checkout without the 30-day money-back guarantee`);
  }
}
{
  const terms = fileFor('/terms');
  if (terms && !readFileSync(terms, 'utf8').includes('id="refunds"')) fail('/terms: no #refunds section for the Founding money-back guarantee');
}

// Founding is $99 every 3 months since 21/10/2026; a page still selling it at $100 a year is stale.
for (const file of files.filter((f) => /\.(html|md|txt)$/.test(f))) {
  if (/\$100 (a|per) (workspace per )?year|\$100\/year|refund the full \$100/.test(readFileSync(file, 'utf8'))) fail(`${file.slice(outDir.length - 1)}: still sells Founding at $100 a year; it is $99 a quarter`);
}

// Founding closes at ten places. A site built from a closed state must not link to the checkout,
// and an open state with a known count must show it on the home page.
const foundingFile = process.env.FOUNDING_STATE_FILE ?? 'founding-state.json';
if (existsSync(foundingFile)) {
  const founding = JSON.parse(readFileSync(foundingFile, 'utf8'));
  const checkout = 'app.colliedesk.com/settings/billing?buy=founding';
  if (founding.open === false) {
    for (const file of files.filter((f) => /\.(html|md|txt)$/.test(f))) {
      if (readFileSync(file, 'utf8').includes(checkout)) fail(`${file.slice(outDir.length - 1)}: founding is closed but the page links to its checkout`);
    }
  } else if (Number.isInteger(founding.taken)) {
    const home = fileFor('/');
    if (home && !readFileSync(home, 'utf8').includes('places left')) fail('/: founding is open with a known count but the home page does not show the places left');
  }
}

// While founding is open, /pricing sells one offer: Founding. The Cloud ladder appears only once the
// ten places are taken (the site rebuilds when the state changes). No state file reads as open.
const foundingOpen = existsSync(foundingFile) ? JSON.parse(readFileSync(foundingFile, 'utf8')).open !== false : true;
{
  const open = foundingOpen;
  const ladder = /\bTeam 25\b|\bSolo\b/;
  for (const path of ['/pricing', '/pricing.md']) {
    const file = fileFor(path);
    if (!file) continue;
    const text = readFileSync(file, 'utf8');
    if (open && ladder.test(text)) fail(`${path}: founding is open but the page lists the Cloud ladder; sell Founding only`);
    if (open && !text.includes('$99 a quarter')) fail(`${path}: founding is open but the page does not show the $99 a quarter price`);
    if (!open && !ladder.test(text)) fail(`${path}: founding is closed but the page does not list the Cloud ladder`);
    // Founding is sold to one customer: 3 to 10 agents, paying for Freshdesk, facing a price rise.
    // The page names them and names who it is not for, so the wrong buyer leaves before paying.
    if (open && (!text.includes('3 to 10 agents') || !text.includes('Who Founding is for') || !text.includes('Not for you if'))) {
      fail(`${path}: founding is open but the page does not name who Founding is for and who it is not for`);
    }
  }
}
// The home page follows /pricing: while Founding is open it quotes Founding only, never the ladder.
// Hand-worked: Founding is 4 x $99 = $396 a year; a year of Freshdesk Pro + Copilot for five agents is
// $5,040; $5,040 - $396 = $4,644.
if (foundingOpen) {
  for (const name of ['index.html', 'index.md']) {
    const text = read(name);
    if (/\bSolo\b|\bTeam 25\b|Plans from/.test(text)) fail(`/${name}: founding is open but the home page quotes the Cloud ladder`);
    if (!text.includes('$396 a year') || !text.includes('$4,644')) fail(`/${name}: founding is open but the home page does not price Founding at $396 a year against Freshdesk's $5,040 ($4,644 kept)`);
  }
}

for (const m of llms.matchAll(/\]\(([^)\s]+)\)/g)) checkLink(m[1], '/', 'llms.txt');

// PostHog counts every visit: without cookies until the visitor accepts cookies in the consent
// banner, with its cookie after. It never creates a person profile. A browser driven by
// automation (Playwright, Puppeteer, Selenium, an agent's DevTools session) is not a visitor.
const analytics = join(outDir, 'analytics.js');
if (!existsSync(analytics)) fail('analytics.js not built');
else {
  const source = readFileSync(analytics, 'utf8');
  const run = ({ webdriver = false, choice = null } = {}) => {
    const calls = { init: [], optIn: 0, optOut: 0 };
    const posthog = {
      __SV: 1,
      init: (key, config) => { calls.init.push(config); },
      opt_in_capturing: () => { calls.optIn++; },
      opt_out_capturing: () => { calls.optOut++; },
    };
    const localStorage = { getItem: (key) => (key === 'colliedesk-consent' ? choice : null) };
    runInNewContext(source, { posthog, window: { posthog }, document: {}, localStorage, location: { hostname: 'colliedesk.com' }, navigator: { webdriver } });
    return calls;
  };
  const fresh = run();
  const config = fresh.init[0] ?? {};
  if (fresh.init.length !== 1) fail('analytics.js: PostHog must start in a normal browser on colliedesk.com');
  if (config.cookieless_mode !== 'on_reject' || config.opt_out_capturing_by_default !== true) fail("analytics.js: PostHog must count visitors without cookies until they accept (cookieless_mode: 'on_reject', opt_out_capturing_by_default: true)");
  if (config.person_profiles !== 'never') fail("analytics.js: PostHog must run with person_profiles: 'never'");
  // Replay is allowed only with every form field masked; PostHog starts it only after Accept.
  if (config.disable_session_recording === true || config.session_recording?.maskAllInputs !== true) fail('analytics.js: session replay must run with session_recording.maskAllInputs: true');
  if (config.capture_exceptions !== true) fail('analytics.js: PostHog must capture JavaScript errors (capture_exceptions: true)');
  if (fresh.optIn !== 0) fail('analytics.js: PostHog must not use cookies before the visitor accepts');
  if (run({ choice: 'granted' }).optIn !== 1) fail('analytics.js: an earlier Accept must turn on PostHog cookies');
  if (run({ choice: 'denied' }).optIn !== 0) fail('analytics.js: a Decline must keep PostHog without cookies');
  if (run({ webdriver: true }).init.length !== 0) fail('analytics.js: PostHog must not start in an automated browser (navigator.webdriver)');
}
for (const file of pages) {
  if (!readFileSync(file, 'utf8').includes('<script src="/analytics.js" defer></script>')) fail(`${urlPathOf(file)}: analytics.js not loaded`);
}

// Google Analytics sets cookies, so it may load only after the visitor accepts in the consent
// banner, and the visitor must be able to change that choice from every page. No page may load
// gtag directly, and the privacy page must name Google Analytics and its cookies.
const GA_MEASUREMENT_ID = 'G-7VBE3TER7E';
const consent = join(outDir, 'consent.js');
if (!existsSync(consent)) fail('consent.js not built');
else {
  const source = readFileSync(consent, 'utf8');
  if (!source.includes(GA_MEASUREMENT_ID)) fail(`consent.js: must load Google Analytics ${GA_MEASUREMENT_ID}`);
  if (!/function loadAnalytics\(\)[\s\S]*googletagmanager\.com\/gtag\/js/.test(source)) fail('consent.js: gtag.js must load only inside loadAnalytics()');
  if (!/if \(choice === 'granted'\) loadAnalytics\(\)/.test(source)) fail("consent.js: loadAnalytics() must run only when the stored choice is 'granted'");
  if (!/function choose\(value\)[\s\S]*?setPostHogConsent\(value\)/.test(source)) fail('consent.js: a choice in the banner must reach PostHog');
  if (!/posthog\.opt_in_capturing\(/.test(source) || !/posthog\.opt_out_capturing\(/.test(source)) fail('consent.js: setPostHogConsent must opt PostHog in on Accept and out on Decline');
  if (!/indexOf\('ph_'\) === 0/.test(source)) fail('consent.js: declining must delete the PostHog cookies');
}
for (const file of pages) {
  const page = readFileSync(file, 'utf8');
  if (!page.includes('<script src="/consent.js" defer></script>')) fail(`${urlPathOf(file)}: consent.js not loaded`);
  if (page.includes('googletagmanager.com')) fail(`${urlPathOf(file)}: loads Google Analytics without consent`);
  if (!page.includes('data-consent-open')) fail(`${urlPathOf(file)}: no way to change the cookie choice`);
}
const privacyPage = fileFor('/privacy');
if (privacyPage) {
  const text = readFileSync(privacyPage, 'utf8');
  if (!text.includes('Google Analytics')) fail('/privacy: must name Google Analytics');
  if (!text.includes('ph_')) fail('/privacy: must name the PostHog cookie set after Accept');
  if (/PostHog without cookies and without a profile|Cookieless website statistics/.test(text)) fail('/privacy: still says PostHog never sets cookies');
  if (!/record/i.test(text) || !/masked/i.test(text)) fail('/privacy: must say PostHog records visits after Accept, with form fields masked');
  if (/sets <strong>no cookies<\/strong>|sets no cookies/.test(text)) fail('/privacy: still says the website sets no cookies');
}

// The Freshdesk page leads with price, so its chart must let a visitor pick a team size, say where
// Colliedesk stops being the cheaper choice, and carry a price read date that is kept fresh.
// Expected figures are worked by hand from Freshdesk's monthly-billing list prices (Growth $23,
// Pro $66, Copilot $35 per agent) against the Colliedesk plan that covers the team, also billed
// monthly: Solo $19 (1 agent), Small $39 (3), Team $69 (10), Team 25 $149 (25). The "costs less"
// line is held to Freshdesk's annual prices too (Growth $19): at 1 agent Solo $19 only matches it,
// and at 2 agents 2 x $19 = $38 is under Small $39, so the claim starts at 3 agents (3 x $19 = $57).
const PRICE_MAX_AGE_DAYS = 90;
{
  const vsHtml = read('vs/freshdesk.html');
  const vsMd = read('vs/freshdesk.md');
  const chart = vsHtml.match(/<figure class="vs-chart"[\s\S]*?<\/figure>/)?.[0] ?? '';
  if (!chart) fail('/vs/freshdesk: price chart (figure.vs-chart) missing');
  for (const n of [1, 3, 5, 10, 25]) {
    if (!new RegExp(`<input[^>]*name="agents"[^>]*value="${n}"`).test(chart)) fail(`/vs/freshdesk: no ${n}-agent option in the price chart`);
    if (!chart.includes(`data-agents="${n}"`)) fail(`/vs/freshdesk: no price list for ${n} agents`);
  }
  if ((chart.match(/name="agents"[^>]*checked/g) ?? []).length !== 1) fail('/vs/freshdesk: price chart needs exactly one team size checked by default');
  const list = (n) => chart.match(new RegExp(`<ol[^>]*data-agents="${n}"[\\s\\S]*?</ol>`))?.[0] ?? '';
  // A bar total renders as "$19<small>", so this cannot match $190 or $490.
  const total = (html, amount) => html.includes(`>${amount}<small>`);
  const block = (n) => chart.match(new RegExp(`data-size="${n}"[\\s\\S]*?(?=data-size=|<p class="vs-fit-line")`))?.[0] ?? '';
  if (!total(list(3), '$69') || !total(list(3), '$39')) fail('/vs/freshdesk: 3 agents must show Freshdesk Growth $69 and Colliedesk Small $39');
  // 5 agents: Pro + Copilot 5 x ($66 + $35) = $505 against Team $69: $436 a month, $5,232 a year.
  if (!total(list(5), '$505') || !total(list(5), '$69') || !block(5).includes('$5,232 a year')) fail('/vs/freshdesk: 5 agents must show Freshdesk Pro + Copilot $505, Colliedesk Team $69 and a $5,232 yearly saving');
  if (!total(list(1), '$23') || !total(list(1), '$19')) fail('/vs/freshdesk: 1 agent must show Freshdesk Growth $23 and Colliedesk Solo $19');
  if (!/billed monthly/.test(chart)) fail('/vs/freshdesk: chart must say Freshdesk prices are billed monthly, like the Colliedesk prices');
  if (!/from 3 to 25 agents/.test(chart)) fail('/vs/freshdesk: chart must say Colliedesk costs less from 3 to 25 agents');
  if (/from [12] to 25 agents|every team size from 1/.test(vsHtml + vsMd)) fail('/vs/freshdesk: must not claim Colliedesk costs less at 1 or 2 agents; Solo $19 matches Freshdesk Growth billed annually');
  // 25 agents: Growth 25 x $23 = $575, Colliedesk Team 25 is $149 flat.
  if (!total(list(25), '$575') || !total(list(25), '$149')) fail('/vs/freshdesk: 25 agents must show Freshdesk Growth $575 and Colliedesk Team 25 $149');
  if (!/more than 25 agents/.test(vsHtml)) fail('/vs/freshdesk: "not for you yet" must stop at 25 agents');
  const readOn = chart.match(/data-read-on="(\d{4}-\d{2}-\d{2})"/)?.[1];
  if (!readOn) fail('/vs/freshdesk: price chart has no data-read-on date');
  else if ((Date.now() - Date.parse(readOn)) / 86_400_000 > PRICE_MAX_AGE_DAYS) {
    fail(`/vs/freshdesk: competitor prices read ${readOn}, older than ${PRICE_MAX_AGE_DAYS} days; read them again`);
  }
  if (!/id="fit"/.test(vsHtml) || !/Not for you yet/.test(vsHtml)) fail('/vs/freshdesk: "who it fits" section missing');
  if (!vsMd.includes('## Who Colliedesk fits') || !vsMd.includes('| 3 agents |')) fail('/vs/freshdesk.md: twin lacks the price-by-team-size table or the fit section');
}

// Price comparisons outside /vs/freshdesk must also put both sides on one billing period. Expected
// figures are worked by hand: five agents on Freshdesk Pro + Copilot billed annually are
// 5 x ($55 + $29) x 12 = $5,040 a year against Colliedesk Team $690 a year (five agents need Team:
// Small stops at 3); billed monthly they are 5 x ($66 + $35) = $505 a month against $69.
{
  const homeMd = read('index.md');
  const ours = foundingOpen ? '$396' : '$690';
  if (!homeMd.includes('$5,040') || !homeMd.includes(ours) || !/per year, billed annually/.test(homeMd)) fail('/: five-agent bill must compare yearly totals billed annually ($5,040 vs $690)');
  const pricingMd = read('pricing.md');
  if (foundingOpen) {
    if (!pricingMd.includes('$5,040 a year') || !pricingMd.includes('$396 a year')) fail('/pricing: while founding is open, the five-agent comparison must be $5,040 a year against Founding $396 a year');
  } else if (!pricingMd.includes('$5,040 a year') || !pricingMd.includes('$690 a year') || pricingMd.includes('$420 per month')) fail('/pricing: five-agent comparison must be $5,040 a year billed annually or $505 a month billed monthly, against Team $690 a year');
  // Monthly billing on both sides: 2 agents $46 / $202 vs Small $39; 5 agents $115 / $505 vs Team $69.
  const small = read('helpdesk-for-small-teams.md');
  if (!small.includes('| 2 | $46 | $202 | $39 (Small) |') || !small.includes('| 5 | $115 | $505 | $69 (Team) |')) fail('/helpdesk-for-small-teams: table must use Freshdesk monthly-billing prices (2 agents: $46, $202; 5 agents: $115, $505) against Small $39 and Team $69 a month');
  // $690 / 12 = $57.50.
  if (!read('freshdesk-alternative.md').includes('$57.50')) fail('/freshdesk-alternative: annual-billed table must show Colliedesk at $57.50 a month ($690 a year)');
}

// Colliedesk is never "the lowest" or "the cheapest": with up to five agents, plans capped at five
// cost less (Zammad Starter and Zoho Desk Express, 5 x €7 = €35 a month, against Team $57.50 a
// month billed annually). The Freshdesk alternatives page must show those plans next to ours.
{
  const superlative = /Colliedesk(?:[^.|]|\.\d){0,160}\bis the (lowest|cheapest)\b|\bthe (lowest|cheapest)(?:[^.|]|\.\d){0,60}\bis Colliedesk\b/i;
  for (const urlPath of urlPaths) {
    const name = urlPath === '/' ? 'index' : urlPath.slice(1);
    if (name.startsWith('docs')) continue;
    const m = read(`${name}.md`).match(superlative);
    if (m) fail(`${urlPath}: claims Colliedesk is the lowest price ("${m[0].slice(0, 90)}"); Zammad Starter and Zoho Desk Express cost less up to five agents`);
  }
  const alt = read('freshdesk-alternative.md');
  if (!/€35 \(Starter, max 5 agents\)/.test(alt) || !/€35 \(Express, max 5 users\)/.test(alt)) fail('/freshdesk-alternative: 5-agent table must list Zammad Starter and Zoho Desk Express at €35');
}

// The old prices (Team $49 / $490, Team 25 $99 / $990) must not survive anywhere on the site. Other
// vendors may still charge $49 or $99 per agent, so only phrases that describe Colliedesk count.
// /docs and llms-full.txt (which embeds them) render docs/user from colliedesk/colliedesk; their
// prices are fixed there, and every site page in llms-full.txt is already checked through its twin.
{
  const stale = /\$490 (a|per) year|\$990|\$49 per workspace|flat \$49|\$49 (per month|a month) \+ AI usage|\$99 per workspace|\$99 a month for up to 25|\$40\.83/;
  const ownCopy = (f) => /\.(html|md|txt)$/.test(f) && !/[\\/]docs[\\/]/.test(f.slice(outDir.length - 1)) && !f.endsWith('llms-full.txt');
  for (const file of files.filter(ownCopy)) {
    const m = readFileSync(file, 'utf8').match(stale);
    if (m) fail(`${file.slice(outDir.length - 1)}: old Colliedesk price "${m[0]}"; the ladder is Solo $19, Small $39, Team $69, Team 25 $149, Unlimited $349`);
  }
}

// Cloud plan ladder (owner decision 20/10/2026), one flat price per workspace, a year = 10 months:
// Solo $19 / $190, 1 agent, 10 GB; Small $39 / $390, 3 agents, 30 GB; Team $69 / $690, 10 agents,
// 100 GB; Team 25 $149 / $1,490, 25 agents, 250 GB; Unlimited $349 a month billed annually only
// ($3,490 a year), unlimited agents, 1 TB, coming soon with no checkout. No free Cloud plan.
// Extra storage is not sold self-serve, so no add-on price may appear. Teams above the caps are
// never sent to "contact us" for 10 agents: Team 25 covers up to 25.
const LADDER = [
  { monthly: '$19', yearly: '$190', agents: '1 agent', storage: '10 GB' },
  { monthly: '$39', yearly: '$390', agents: 'Up to 3 agents', storage: '30 GB' },
  { monthly: '$69', yearly: '$690', agents: 'Up to 10 agents', storage: '100 GB' },
  { monthly: '$149', yearly: '$1,490', agents: 'Up to 25 agents', storage: '250 GB' },
  { monthly: '$349', yearly: '$3,490', agents: 'Unlimited agents', storage: '1 TB' },
];
// The ladder facts below hold once Founding closes; while it is open /pricing sells Founding only.
if (!foundingOpen) {
  const supportMail = 'support@colliedesk.com';
  for (const name of ['pricing.html', 'pricing.md']) {
    const text = read(name);
    for (const { monthly, yearly, agents, storage } of LADDER) {
      for (const needle of [monthly, yearly, agents, `${storage} of attachments`]) if (!text.includes(needle)) fail(`/${name}: missing "${needle}"`);
    }
    for (const needle of ['Coming soon', 'billed annually', 'Need more storage? Email us', supportMail, 'no card', 'No automatic charge', 'Cancel anytime', 'Limited to 10 workspaces']) {
      if (!text.includes(needle)) fail(`/${name}: missing "${needle}"`);
    }
    if (/\+\s?100 GB|\$10 (a|per) month/.test(text)) fail(`/${name}: shows an extra-storage price; it is not sold self-serve`);
    if (!/customer email/i.test(text)) fail(`/${name}: does not say customer email keeps arriving over the cap`);
  }
  const ld = read('pricing.html');
  for (const [name, price] of [['Colliedesk Cloud Solo', '19'], ['Colliedesk Cloud Small', '39'], ['Colliedesk Cloud Team', '69'], ['Colliedesk Cloud Team 25', '149']]) {
    if (!ld.includes(`"name":"${name}","price":"${price}"`)) fail(`/pricing: JSON-LD has no ${name} offer at ${price}`);
  }
  if (ld.includes('"name":"Colliedesk Cloud Unlimited"')) fail('/pricing: JSON-LD offers Unlimited, which cannot be bought yet');
}
{
  const stale = /(more than|above|over) 10 agents|Above that, email us/i;
  for (const file of pages) {
    const urlPath = urlPathOf(file);
    const md = read(`${urlPath === '/' ? 'index' : urlPath.slice(1)}.md`);
    if (stale.test(readFileSync(file, 'utf8')) || stale.test(md)) fail(`${urlPath}: still sends teams above 10 agents to "contact us"; Team 25 covers up to 25`);
  }
}

// Status honesty: the product is alpha and live on Colliedesk Cloud. No page may promise a
// release that has already happened ("v0.2"), call the product pre-alpha or say checkout is
// coming. The Solo, Small, Team and Team 25 cards must start the free trial at the real signup
// entry, every "Start free trial" button must go to the same place, and the Unlimited card (coming
// soon) must offer no link at all. The trial link carries ?intent=trial so the app titles the page for a
// new workspace; the bare sign-in page is only for "Log in".
const SIGN_IN_URL = 'https://app.colliedesk.com/sign-in';
const TRIAL_URL = `${SIGN_IN_URL}?intent=trial`;
{
  const stale = /v0\.[2-9]|pre-alpha|checkout link is coming soon|\bin testing\b/i;
  for (const file of files.filter((f) => /\.(html|md|txt)$/.test(f))) {
    const m = readFileSync(file, 'utf8').match(stale);
    if (m) fail(`${file.slice(outDir.length - 1)}: stale status claim "${m[0]}"`);
  }
  const pricing = foundingOpen ? '' : read('pricing.html');
  const cardOf = (plan) => pricing.match(new RegExp(`<article class="plan[^"]*"[^>]*>\\s*<h2 class="plan-name"[^>]*>${plan}</h2>[\\s\\S]*?</article>`))?.[0] ?? '';
  for (const plan of foundingOpen ? [] : ['Solo', 'Small', 'Team', 'Team 25']) {
    const card = cardOf(plan);
    if (!card) fail(`/pricing: ${plan} card missing`);
    else if (!card.includes(`href="${TRIAL_URL}"`)) fail(`/pricing: ${plan} card has no free-trial CTA to ${TRIAL_URL}`);
  }
  const unlimited = cardOf('Unlimited');
  if (foundingOpen) { /* no ladder cards while Founding is the only plan */ } else if (!unlimited) fail('/pricing: Unlimited card missing');
  else if (!unlimited.includes('Coming soon') || unlimited.includes('<a ')) fail('/pricing: Unlimited card must say Coming soon and offer no checkout or trial link');
  for (const file of pages) {
    for (const m of readFileSync(file, 'utf8').matchAll(/<a[^>]*href="([^"]*)"[^>]*>\s*Start free trial/g)) {
      if (m[1] !== TRIAL_URL) fail(`${urlPathOf(file)}: "Start free trial" links to ${m[1]}, not ${TRIAL_URL}`);
    }
    for (const m of readFileSync(file, 'utf8').matchAll(new RegExp(`<a[^>]*href="${SIGN_IN_URL}"[^>]*>([\\s\\S]*?)</a>`, 'g'))) {
      if (m[1].trim() !== 'Log in') fail(`${urlPathOf(file)}: "${m[1].trim().slice(0, 40)}" links to ${SIGN_IN_URL}; only "Log in" may, a trial link goes to ${TRIAL_URL}`);
    }
  }
  for (const file of files.filter((f) => f.endsWith('.md'))) {
    if (readFileSync(file, 'utf8').includes(`(${SIGN_IN_URL})`)) fail(`${file.slice(outDir.length - 1)}: links to ${SIGN_IN_URL}; a trial link goes to ${TRIAL_URL}`);
  }
}

// Shipped features must not be labelled as missing. Cc on replies shipped in colliedesk#75; a
// sentence or table row that names Cc must not call it "not built yet" or "not there yet". The
// changelog is history: the 0.0.x notes correctly say Cc was not in that release.
{
  const notYet = /not there yet|not built yet/i;
  for (const file of files.filter((f) => /\.(html|md)$/.test(f) && !/[\\/]changelog\.(html|md)$/.test(f))) {
    const text = readFileSync(file, 'utf8').replace(/<\/(tr|p|li)>/g, '\n');
    for (const part of text.split(/[.!?]\s|\n/)) {
      if (/\bCc\b/.test(part) && notYet.test(part)) fail(`${file.slice(outDir.length - 1)}: lists Cc as not shipped: "${part.trim().slice(0, 90)}"`);
    }
  }
}

// A status cell holds its badge and nothing else: text beside a badge ("(alpha)") renders larger and
// lighter than the badge and wraps under it on a phone. A qualifier goes inside the badge.
for (const file of files.filter((f) => f.endsWith('.html'))) {
  for (const m of readFileSync(file, 'utf8').matchAll(/<td>((?:(?!<\/td>)[\s\S])*?class="badge[\s\S]*?)<\/td>/g)) {
    if (!/^<span class="badge [^"]+">[^<]+<\/span>$/.test(m[1].trim())) fail(`${file.slice(outDir.length - 1)}: status cell has text beside its badge: "${m[1].replace(/<[^>]+>/g, '').trim()}"`);
  }
}

// Marketing pages say "alpha", never a version number ("0.0.x", "0.1.0"). Versions belong
// to the changelog, the roadmap and the docs, which come from the product repo; JSON-LD is not shown.
for (const file of files.filter((f) => f.endsWith('.html') && !/[\\/](changelog|roadmap)\.html$|[\\/]docs[\\/]|[\\/]docs\.html$/.test(f))) {
  const shown = readFileSync(file, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  const m = shown.match(/\b0\.\d+\.(?:x|\d+)\b/);
  if (m) fail(`${file.slice(outDir.length - 1)}: shows version "${m[0]}"; say alpha instead`);
}

// /compare is the hub of every comparison page: each /vs page is linked from it, the header
// "Compare" link opens it, and every comparison page says the names are their owners' trademarks.
{
  const hub = read('compare.html');
  if (!hub) fail('/compare: hub page not built');
  for (const urlPath of urlPaths.filter((p) => p.startsWith('/vs/'))) {
    if (!hub.includes(`href="${urlPath}"`)) fail(`/compare: does not link ${urlPath}`);
  }
  const home = read('index.html');
  const nav = home.match(/<nav[\s\S]*?<\/nav>/)?.[0] ?? '';
  if (!/href="\/compare"[^>]*>Compare</.test(nav)) fail('header: "Compare" does not link /compare');
  for (const urlPath of urlPaths.filter((p) => p.startsWith('/vs/') || p === '/compare')) {
    const name = urlPath.slice(1);
    if (!read(`${name}.html`).includes('trademarks of their owners')) fail(`${urlPath}: no trademark note`);
    if (!read(`${name}.md`).includes('trademarks of their owners')) fail(`${urlPath}.md: no trademark note`);
  }
}

// Home hero: the h1 names why our buyer stays on Freshdesk (leaving is hard) and that we made
// leaving easy; the lede carries the buyer, the proof (a reconcile report) and the price as evidence:
// our yearly price against what five agents pay Freshdesk in a year, cheapest to dearest plan, worked
// by hand: Growth 5 x $19 x 12 = $1,140 to Pro + Copilot 5 x ($55 + $29) x 12 = $5,040. No "% cheaper"
// claim: the top of that range includes AI that Colliedesk prices separately.
{
  const home = read('index.html');
  const h1 = home.match(/<h1[\s\S]*?<\/h1>/)?.[0] ?? '';
  // The home page speaks to one buyer: a team of 3 to 10 agents paying for Freshdesk.
  if (/Zendesk|Help Scout/.test(h1)) fail('/: h1 must speak about Freshdesk only, the one tool our buyer pays for');
  if (!/leaving is hard/.test(h1) || !/made leaving easy/.test(h1)) fail('/: h1 must say leaving Freshdesk is hard and that we made it easy');
  if (/h1-rotate/.test(h1)) fail('/: h1 is one static sentence, no rotating words');
  const lede = home.match(/<p class="lede">([\s\S]*?)<\/p>/)?.[1] ?? '';
  if (!lede.includes('3 to 10 agents') || !lede.includes('pay for Freshdesk')) fail('/: hero lede must name the buyer: 3 to 10 agents who pay for Freshdesk');
  if (!lede.includes('proves nothing was lost')) fail('/: hero lede must promise the reconcile report');
  for (const claim of [`${foundingOpen ? '$396' : '$690'} a year for your whole team`, '$1,140–5,040']) {
    if (!lede.includes(claim)) fail(`/: hero lede lacks "${claim}"`);
  }
  if (/% cheaper/.test(h1) || /% cheaper/.test(lede) || /% cheaper/.test(read('index.md'))) fail('/: hero must state prices, not a "% cheaper" claim');
  if (!/locked for life/.test(home.match(/<p class="hero-note">[\s\S]*?<\/p>/)?.[0] ?? '')) fail('/: hero note must say the founding price is locked for life');
  // Closing block: a year of Freshdesk bills for five agents against Colliedesk Team billed yearly.
  // 12 x $420 = $5,040; $5,040 - $690 = $4,350.
  if (!home.includes('Keep the difference')) fail('/: closing block "Keep the difference" missing');
  // While Founding is open: $5,040 - $396 = $4,644.
  if (!home.includes('$5,040') || !home.includes(foundingOpen ? '$4,644' : '$4,350')) fail(`/: closing block must show $5,040 a year and the ${foundingOpen ? '$4,644' : '$4,350'} difference`);
  for (const [name, needles] of [
    ['index.html', ['Why per workspace, not per agent?', 'Who is behind Colliedesk?', 'What happens over the limit?']],
    ['pricing.html', foundingOpen ? ['Why is there only one plan?', 'Limited to 10 workspaces', 'no card'] : ['Why per workspace, not per agent?', 'Every feature on every plan']],
    ['vs/freshdesk.html', ['Where Freshdesk does more']],
  ]) {
    for (const needle of needles) if (!read(name).includes(needle)) fail(`/${name}: missing "${needle}"`);
  }
}

// Home "your AI agent can do this too": the MCP server, the four agent token tiers and the requests a
// person approves shipped in colliedesk (live on Cloud). The section, its Markdown twin and llms.txt
// must say so, and link the MCP guide rendered from the product docs.
{
  const section = read('index.html').match(/<section[^>]*aria-labelledby="agents"[\s\S]*?<\/section>/)?.[0] ?? '';
  const homeMd = read('index.md');
  const heading = 'Everything you see here, your AI agent can do too';
  if (!section) fail('/: AI agent section (aria-labelledby="agents") missing');
  else {
    if (!section.includes(heading)) fail(`/: AI agent section lacks the heading "${heading}"`);
    for (const t of ['read', 'draft', 'send', 'admin']) if (!section.includes(`<code>${t}</code>`)) fail(`/: AI agent section does not name the ${t} tier`);
    for (const needle of ['https://app.colliedesk.com/mcp', 'href="/docs/mcp"', 'href="/docs/agent-requests"', 'approves or rejects', 'seven days']) {
      if (!section.includes(needle)) fail(`/: AI agent section lacks "${needle}"`);
    }
  }
  if (!homeMd.includes(`## ${heading}`)) fail('/index.md: twin lacks the AI agent section');
  for (const t of ['read', 'draft', 'send', 'admin']) if (!homeMd.includes(`\`${t}\``)) fail(`/index.md: twin does not name the ${t} tier`);
  if (!homeMd.includes('/docs/mcp)') || !homeMd.includes('seven days')) fail('/index.md: twin lacks the MCP guide link or the seven-day expiry');
  if (!/\| MCP server[^\n]*\| \*\*Shipped\*\*/.test(homeMd)) fail('/index.md: status table does not list the MCP server as shipped');
  if (!/\(https:\/\/colliedesk\.com\/index\.md\)[^\n]*AI agents/.test(llms)) fail('llms.txt: home entry does not mention AI agents');
}

const accentUses = (readFileSync(join(outDir, 'styles.css'), 'utf8').match(/var\(--accent/g) ?? []).length;
if (accentUses > ACCENT_BUDGET) fail(`styles.css uses var(--accent…) ${accentUses} times > ${ACCENT_BUDGET}: the accent is for the primary action, focus and selection (README, Design)`);

// Brand guideline (app docs/internals/design.md): the price is the one coloured thing on the site
// (rule 2), and cards sit on a shadow ring, never a border (rule 4), the featured plan included.
{
  const css = readFileSync(join(outDir, 'styles.css'), 'utf8');
  if (!/\.plan-price strong\s*\{[^}]*color:\s*var\(--price\)/.test(css)) fail('styles.css: .plan-price strong is not coloured var(--price); the price has its own colour');
  for (const rule of css.match(/\.plan-featured\s*\{[^}]*\}/g) ?? []) {
    if (/\bborder(-[a-z]+)?\s*:/.test(rule) || /inset/.test(rule)) fail(`styles.css: "${rule.slice(0, 80)}" outlines the featured plan; use a shadow ring (--shadow-*), not a border`);
  }
}

// The hero screenshot is the largest paint on a phone. It offers AVIF and WebP by width with a sizes
// hint, so a 390px screen does not download the 2880px JPEG; every file it names must be built.
{
  const shot = read('index.html')?.match(/<figure class="hero-shot">[\s\S]*?<\/figure>/)?.[0] ?? '';
  const tags = shot.match(/<(?:source|img)\b[^>]*>/g) ?? [];
  for (const type of ['image/avif', 'image/webp']) {
    if (!tags.some((t) => t.startsWith('<source') && t.includes(`type="${type}"`) && /srcset="[^"]*\s\d+w/.test(t) && t.includes('sizes="'))) {
      fail(`/: hero screenshot has no ${type} <source> with width descriptors and sizes`);
    }
  }
  const img = tags.find((t) => t.startsWith('<img')) ?? '';
  if (!/srcset="[^"]*\s\d+w/.test(img) || !img.includes('sizes="')) fail('/: hero <img> has no width-described srcset with sizes');
  for (const t of tags) {
    for (const [, url] of (t.match(/srcset="([^"]*)"/)?.[1] ?? '').matchAll(/(\S+)\s+\d+w/g)) {
      if (!existsSync(join(outDir, url))) fail(`/: hero image ${url} is not built`);
    }
  }
}

// Browsers keep a favicon per URL for days and ignore Cache-Control, so a new icon file is only
// seen when its URL changes. Every icon link must carry ?v=<hash of the file it points to>.
for (const file of [...pages, join(outDir, '404.html')].filter(existsSync)) {
  for (const [, href] of readFileSync(file, 'utf8').matchAll(/<link rel="(?:icon|apple-touch-icon)"[^>]*href="([^"]+)"/g)) {
    const [path, version] = href.split('?v=');
    const asset = join(outDir, path);
    if (!existsSync(asset)) { fail(`${urlPathOf(file)}: icon ${path} not built`); continue; }
    const hash = createHash('sha256').update(readFileSync(asset)).digest('hex').slice(0, 10);
    if (version !== hash) fail(`${urlPathOf(file)}: icon link ${href} must be ${path}?v=${hash} so browsers drop the old icon`);
  }
}

if (jsBytes > JS_BUDGET_BYTES) fail(`JavaScript budget exceeded: ${jsBytes} bytes > ${JS_BUDGET_BYTES}`);

const summary = `${pages.length} pages, ${urlPaths.length} Markdown twins checked, JS ${jsBytes} bytes (budget ${JS_BUDGET_BYTES})`;
if (errors.length) {
  for (const e of errors) console.error(`FAIL ${e}`);
  console.error(`\n${errors.length} problem(s); ${summary}`);
  process.exit(1);
}
console.log(`OK ${summary}`);
