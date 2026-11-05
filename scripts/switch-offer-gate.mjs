// The Business plan and the switch offer, applied by scripts/check.mjs to the built site. Business is
// for teams of 26 to 100 agents at $499 a month ($4,990 a year), 1 TB of attachments, sold through a
// call with the founder, never a checkout; it replaces the Unlimited plan, so "Unlimited" is gone from
// the site. Teams of 11 to 100 agents on Freshdesk get two offers on Team 25 and Business: we migrate
// them and they pay when their team answers its first real ticket in Colliedesk, and the last invoice
// of their old helpdesk buys their first month, capped at that invoice. The 14-day trial is unchanged.
// /migrate/freshdesk/switch is the page ads and emails link to. Each function returns findings; an
// empty array passes.

export const SWITCH_PATH = '/migrate/freshdesk/switch';
export const SWITCH_CALL = 'https://cal.com/chinh/colliedesk-switch';
const TRIAL = 'https://app.colliedesk.com/sign-in?intent=trial';

const decode = (s) => s.replace(/&#x27;|&#39;|&rsquo;|’/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const linksIn = (html) => [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(([, href, label]) => ({
  href: decode(href), label: label.replace(/<[^>]+>/g, '').trim(),
}));

/** The plan card named `plan` in an HTML page, or ''. */
export const cardOf = (html, plan) =>
  html.match(new RegExp(`<article class="plan[^"]*"[^>]*>\\s*<h2 class="plan-name"[^>]*>${plan}</h2>[\\s\\S]*?</article>`))?.[0] ?? '';

/** Findings for the Business card of an HTML page that sells it. */
export function businessCardFindings({ path, html }) {
  const card = cardOf(html, 'Business');
  if (!card) return [`${path}: no Business card`];
  const findings = [];
  for (const needle of ['$499', '$4,990', '26 to 100 agents', '1 TB of attachments']) {
    if (!card.includes(needle)) findings.push(`${path}: Business card lacks "${needle}"`);
  }
  const links = linksIn(card);
  if (!links.some((l) => l.href === SWITCH_CALL && l.label === 'Talk to us')) findings.push(`${path}: Business card has no "Talk to us" link to ${SWITCH_CALL}`);
  const checkout = links.find((l) => /app\.colliedesk\.com|polar\.sh/.test(l.href));
  if (checkout) findings.push(`${path}: Business card links ${checkout.href}; Business is sold through a call, not a checkout or a trial`);
  return findings;
}

// The two offers, word for word where a buyer relies on them.
export const SWITCH_LINE = 'you pay when your team answers its first real ticket in Colliedesk';
export const INVOICE_LINE = "Don't pay twice while you switch.";
const OFFER_TERMS = [SWITCH_LINE, INVOICE_LINE, 'up to the amount on that invoice', 'Team 25 and Business only', 'The 14-day free trial is unchanged'];

/** Findings for a page (HTML or Markdown twin) that must carry the switch and invoice offers. */
export function offerFindings({ path, text }) {
  const plain = decode(text);
  const findings = OFFER_TERMS.filter((t) => !plain.includes(t)).map((t) => `${path}: switch offer lacks "${t}"`);
  if (!plain.includes(SWITCH_CALL)) findings.push(`${path}: switch offer has no link to the switch call ${SWITCH_CALL}`);
  return findings;
}

// What the done-for-you migration moves (the Freshdesk importer), and the reasons to trust Colliedesk.
const WHAT_MOVES = ['archived', 'replies', 'private notes', 'attachments', 'tags', 'contacts', 'companies', 'time entries', 'reconcile report', 'SHA-256'];
const TRUST = ['generally available', 'next to Freshdesk', 'We run the import', 'nightly', 'restore', 'open source'];

/** Findings for the switch page HTML. */
export function switchPageFindings({ path, html }) {
  const findings = [];
  const lower = decode(html).toLowerCase();
  const links = linksIn(html);
  if (!links.some((l) => l.href === TRIAL && l.label === 'Start free trial')) findings.push(`${path}: no "Start free trial" link to ${TRIAL}`);
  if (!links.some((l) => l.href === SWITCH_CALL && l.label === 'Book a 30-min switch call')) findings.push(`${path}: no "Book a 30-min switch call" link to ${SWITCH_CALL}`);
  for (const plan of ['Team 25', 'Business']) if (!cardOf(html, plan)) findings.push(`${path}: no ${plan} card`);
  for (const w of WHAT_MOVES) if (!lower.includes(w.toLowerCase())) findings.push(`${path}: does not say the migration moves "${w}"`);
  for (const w of TRUST) if (!lower.includes(w.toLowerCase())) findings.push(`${path}: trust paragraph lacks "${w}"`);
  // Perceived latency: the page is static HTML with the site's own scripts, styles and fonts; no
  // resource from another origin loads with it (the canonical link is not a resource).
  for (const [tag] of html.matchAll(/<(?:script|img|iframe|link|source|video|audio)\b[^>]*>/g)) {
    if (/rel="canonical"/.test(tag)) continue;
    if (/\b(?:src|href|srcset)="(?:https?:)?\/\//.test(tag)) findings.push(`${path}: loads a resource from another origin: ${tag.slice(0, 100)}`);
  }
  return findings;
}

/** Findings for the done-for-you page: it sends teams of 11 to 100 agents to the switch page. */
export function doneForYouFindings({ path, text }) {
  const findings = [];
  if (!text.includes(SWITCH_PATH)) findings.push(`${path}: does not link the switch offer at ${SWITCH_PATH}`);
  if (!/\bBusiness\b/.test(text)) findings.push(`${path}: does not say Team 25 and Business include the migration`);
  return findings;
}

// Business replaced Unlimited (owner decision 03/11/2026). "Unlimited conversations" is a feature.
const UNLIMITED = /\bUnlimited\b(?! conversations)/;
// No uptime number until the terms publish the commitment (owner decision 04/11/2026: only after the
// night-time outage call, backups and the rebuild drill are proven). The SLA pull request lifts this.
const UPTIME_NUMBER = /\b99\.9\s?%/;

/** Findings for any page, Markdown twin or llms file this site writes. */
export function retiredClaimFindings({ path, text }) {
  const findings = [];
  const unlimited = text.match(UNLIMITED);
  if (unlimited) findings.push(`${path}: names the retired Unlimited plan ("${text.slice(Math.max(0, unlimited.index - 30), unlimited.index + 40).replace(/\s+/g, ' ')}"); Business replaced it`);
  if (UPTIME_NUMBER.test(text)) findings.push(`${path}: states a 99.9% uptime number before the terms publish it; say "a written uptime commitment is coming"`);
  return findings;
}
