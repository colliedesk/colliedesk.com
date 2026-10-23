// Home page facts shared by the HTML sections (src/components/home/*) and the Markdown twin.
import { FOUNDING_SLOTS, foundingState } from '../../lib/founding';
import { LADDER_LINE, PRICE, PRICES_READ, TEAM } from '../../lib/site';

// While Founding is open it is the only plan we sell, so the home page prices Founding; once the
// places are taken (the site rebuilds on that change) it prices Cloud Team.
export const FOUNDING_OPEN = foundingState().open;
export const OURS_NAME = FOUNDING_OPEN ? 'Colliedesk Founding' : 'Colliedesk Cloud Team';

export interface PriceBar {
  name: string;
  /** List price per year for five agents, billed annually, USD. */
  usd: number;
  math: string;
  href: string;
  ours?: boolean;
}

// 5 agents, list price per year, billed annually on every bar so the billing periods match.
// Freshdesk only: it is the one tool our buyer pays for.
export const BARS: readonly PriceBar[] = [
  { name: 'Freshdesk Pro + Freddy AI Copilot', usd: 5040, math: '5 × ($55 + $29) × 12', href: '/vs/freshdesk' },
  { name: 'Freshdesk Growth, no AI', usd: 1140, math: '5 × $19 × 12', href: '/vs/freshdesk' },
  FOUNDING_OPEN
    ? { name: OURS_NAME, usd: 4 * 99, math: `4 × $99, one workspace, up to 10 agents, locked for life, only ${FOUNDING_SLOTS} places, + AI usage at cost +30%`, href: '/pricing', ours: true }
    : { name: OURS_NAME, usd: TEAM.yearly, math: 'one workspace, up to 10 agents, + AI usage at cost +30%', href: '/pricing', ours: true },
];
export const BAR_MAX = Math.max(...BARS.map((b) => b.usd));
const OURS = BARS.find((b) => b.ours)?.usd;
if (OURS === undefined) throw new Error('BARS needs one entry with ours: true');

// The hero names Freshdesk with what five agents pay it in a year, from the
// cheapest plan to the dearest. The top of each range includes AI that Colliedesk does not ship
// yet, so the hero states prices instead of a "% cheaper" claim.
export interface HeroRange { name: string; currency: '$' | '€'; low: number; high: number }
// Freshdesk Growth 5 × $19 × 12 to Pro + Copilot.
export const FRESHDESK_RANGE: HeroRange = { name: 'Freshdesk', currency: '$', low: 5 * 19 * 12, high: BAR_MAX };
// Our buyer pays for Freshdesk, so the hero names Freshdesk only.
export const HERO_RANGES: readonly HeroRange[] = [FRESHDESK_RANGE];
export const rangeLabel = (r: HeroRange): string =>
  `${r.currency}${r.low.toLocaleString('en-US')}–${r.high.toLocaleString('en-US')}`;
// A year of Freshdesk Pro + Copilot for five agents, billed annually, against Cloud Team billed yearly.
export const FRESHDESK_YEAR = BAR_MAX;
export const FRESHDESK_MONTH = BAR_MAX / 12;
export const OURS_YEAR = OURS;

// Answers "you can't just build a helpdesk over a weekend": the unglamorous parts, each already on
// main and running on Colliedesk Cloud. Only list what shipped; anything else belongs in the status table.
// `short` is the line on the home page; the Markdown twin keeps the full text.
export const BORING: readonly (readonly [title: string, text: string, short: string])[] = [
  ['Mail that lands', 'Replies leave signed with DKIM and pass SPF and DMARC. Tested against real Gmail inboxes, in the customer\'s thread.', 'Signed with DKIM, passing SPF and DMARC.'],
  ['Mail you can trust', 'Inbound mail is checked on arrival. Spoofed senders and auto-reply loops are stopped before they become tickets.', 'Spoofed senders and auto-reply loops never become tickets.'],
  ['Threading', 'A customer\'s reply joins its conversation, so one problem stays one ticket.', 'A reply joins its conversation. One problem, one ticket.'],
  ['Nothing lost on import', 'The reconcile report counts tickets, replies, notes, tags and contacts on both sides, and checks every attachment by SHA-256.', 'Every count compared, every attachment checked by SHA-256.'],
  ['Your data out, any time', 'Export the whole workspace as a ZIP, even after a trial ends or a plan lapses.', 'The whole workspace as a ZIP, even after a plan lapses.'],
  ['Workspaces kept apart', 'PostgreSQL row-level security keeps each workspace\'s rows apart. Passwordless sign-in, revocable sessions.', 'Row-level security in PostgreSQL. Passwordless sign-in.'],
  ['A supply chain you can check', 'Signed container images with provenance and SBOM. CodeQL and an OSV gate on every pull request, the email parser fuzzed.', 'Signed images with provenance and SBOM, checked on every pull request.'],
  ['Nothing to stitch together', 'Self-hosted, it is one server and PostgreSQL. Bring an SMTP account for outgoing mail and a forwarder, such as Cloudflare Email Routing, for incoming mail. That is the list.', 'Self-hosted, it is one server and PostgreSQL.'],
];

// "Your AI agent can do this too": the MCP server, agent token tiers and agent requests, as shipped in
// colliedesk (docs/user/mcp.md, docs/user/sessions.md#agent-tokens, docs/user/agent-requests.md). Each
// tier includes the one above it. Only state what those guides say.
export const MCP_URL = 'https://app.colliedesk.com/mcp';
export const AGENT_HEADING = 'Everything you see here, your AI agent can do too';
// The home page's shorter lede; the Markdown twin keeps AGENT_LEDE.
export const AGENT_LEDE_SHORT =
  'Give Claude Code, Codex or Cursor one URL and an agent token. The risky things wait for your yes.';
export const AGENT_LEDE =
  'Colliedesk has an MCP server. Give an MCP client, such as Claude Code, Codex, Cursor or Claude Desktop, one URL and an agent token, and it works the same inbox your team does. The risky things wait for your yes.';
export const AGENT_TIERS: readonly (readonly [tier: string, text: string, short: string])[] = [
  ['read', 'Searches and reads conversations, customers, saved replies and settings. Anything more becomes a request.', 'Reads everything. Anything more becomes a request.'],
  ['draft', 'Also sets status, priority, assignee and tags, and adds private notes. Nothing reaches a customer.', 'Also triages and adds notes. Nothing reaches a customer.'],
  ['send', 'Also replies to customers, adds customers and conversations, and edits saved replies.', 'Also replies to customers.'],
  ['admin', 'Also changes workspace settings, the team and the channels, with the role of the admin who created it.', 'Also changes settings, the team and the channels.'],
];
export const AGENT_POINTS: readonly (readonly [title: string, text: string, short: string])[] = [
  ['Every action, not a subset', 'Each action in the web app has an API route and an MCP tool. A test in the product repository fails the build when one is missing.', "Every action in the web app has an MCP tool. A test keeps it that way."],
  ['Above its tier, it asks', 'A call above the token\'s tier is not refused. It becomes a request, and a person approves or rejects it in one click. A reply from a token below send becomes a draft you edit, send or discard.', "A call above the token's tier becomes a request. A person approves or rejects it in one click."],
  ['Some things always ask', 'New tokens, invites, admin role changes, signing out another person, export, billing, disconnecting the email channel, a new inbound secret and the workspace address wait for a person, admin tokens included. A request expires after seven days.', "Tokens, invites, export and billing always wait for a person. A request expires after seven days."],
  ['Saved replies keep their history', 'A send token edits saved replies directly; lower tiers propose a change you see before and after. Every edit is a version you can restore, and a deleted reply stays in the trash for 30 days.', "Every edit is a version you can restore."],
];
const agentSectionMd = `## ${AGENT_HEADING}

${AGENT_LEDE} MCP endpoint on Colliedesk Cloud: \`${MCP_URL}\`, with the agent token as a bearer token. [Connect an AI agent](/docs/mcp).

${AGENT_TIERS.map(([t, v]) => `- \`${t}\`: ${v}`).join('\n')}

${AGENT_POINTS.map(([k, v]) => `- **${k}.** ${v}`).join('\n')}

How approval works: [Agent requests and reply drafts](/docs/agent-requests).`;

const cloudLine = FOUNDING_OPEN
  ? `One plan while we are young: Founding, $99 a quarter per workspace for up to 10 agents, locked for life, for ${FOUNDING_SLOTS} teams. [Who it is for](/pricing#who-founding-is-for).`
  : `One flat price per workspace, never per agent: ${LADDER_LINE}. Team is ${PRICE.monthly} a month or ${PRICE.yearly} a year.`;
const flatLine = FOUNDING_OPEN
  ? 'Founding is $99 a quarter per workspace for up to 10 agents, no per-agent fees. Self-host for $0.'
  : `Team is ${PRICE.monthly} per workspace per month for up to 10 agents, no per-agent fees. Self-host for $0.`;
const foundingTail = FOUNDING_OPEN ? '' : ` Cloud plans: ${LADDER_LINE}.`;

export const homeSectionsMd = `## Wait, what are you selling me?

Self-hosting is free, forever, with every feature. We sell two things:

1. **Colliedesk Cloud**: we run it for you. ${cloudLine}
2. **Migration**: we move your Freshdesk history (tickets, replies, attachments, tags) and give you a reconcile report that proves nothing was lost.

## Why teams switch

- **Leave Freshdesk with all your data** (importer shipped): tickets, replies, notes, checksummed attachments, tags and contacts, with a reconcile report. Switch gradually: keep Freshdesk running while a copy of your support mail comes to Colliedesk, and run the import again to catch up. [Migration guide](/migrate/freshdesk).
- **AI that answers tickets, included** (not built yet): drafts, triage and auto-answer with a human in the loop. Model cost +30%, or bring your own key.
- **Flat price**: ${flatLine}

## The bill for five agents

Freshdesk list prices per year, billed annually, read on ${PRICES_READ} ([details](/vs/freshdesk)).

${BARS.map((b) => `- ${b.name}: $${b.usd.toLocaleString('en-US')} (${b.math})`).join('\n')}

## The boring parts already work

We are not rebuilding every Freshdesk feature. We build what a team of three to ten uses every day, and we label the rest. HC Labs runs its own support on Colliedesk Cloud.

${BORING.map(([k, v]) => `- **${k}.** ${v}`).join('\n')}

${agentSectionMd}

## Why a collie?

A collie does not own the flock. It brings every sheep back to the pen and the shepherd decides what happens next. That is the job of Colliedesk's AI once it is built: sort, draft and chase every ticket so none is lost, while a person on your team approves what goes out.

## If you don't like something, fork it

Colliedesk is AGPL-3.0. The code, your data and the export format are yours. [How the license and the business fit together](/open-source).

## Founding offer

$99 a quarter per workspace, locked for life, with free Freshdesk migration and a reconcile report. Only 10 workspaces get it. Up to 10 agents, no per-agent fees, 20 GB of attachments including imported files.${foundingTail} AI, once it is built, at model cost +30% or your own key. Colliedesk Cloud is live; every workspace starts with a 14-day free trial.`;
