// Home page facts shared by the HTML sections (src/components/home/*) and the Markdown twin.
import { FOUNDING_SLOTS, foundingState } from '../../lib/founding';
import { AI_EXTRA, LADDER_LINE, PRICE, PRICES_READ, TEAM } from '../../lib/site';

// While Founding is open it leads the plans we sell, so the home page prices Founding; once the
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
    ? { name: OURS_NAME, usd: 4 * 99, math: `4 × $99, one workspace, up to 10 agents, locked for life, only ${FOUNDING_SLOTS} places, + ${AI_EXTRA}`, href: '/pricing', ours: true }
    : { name: OURS_NAME, usd: TEAM.yearly, math: `one workspace, up to 10 agents, + ${AI_EXTRA}`, href: '/pricing', ours: true },
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

// "Your AI agent can do this too": the MCP server, roles and permissions and agent tokens, as shipped in
// colliedesk (docs/user/mcp.md, docs/user/roles-and-permissions.md, docs/user/sessions.md#agent-tokens).
// Only state what those guides say.
export const MCP_URL = 'https://app.colliedesk.com/mcp';
export const AGENT_HEADING = 'Everything you see here, your AI agent can do too';
// The home page's shorter lede; the Markdown twin keeps AGENT_LEDE.
export const AGENT_LEDE_SHORT =
  'Give Claude Code, Codex or Cursor one URL and an agent token. It does what you allow, never more than you can.';
export const AGENT_LEDE =
  'Colliedesk has an MCP server. Give an MCP client, such as Claude Code, Codex, Cursor or Claude Desktop, one URL and an agent token, and it works the same inbox your team does, with the permissions you gave the token and never more than you hold.';
export const AGENT_ACCESS: readonly (readonly [title: string, text: string, short: string])[] = [
  ['Roles', 'A role is a set of permissions, such as messages:send or workspace:export. Admin and Agent are built in; make your own, and give a person several.', 'Admin, Agent, or roles you make. A person can hold several.'],
  ['Follow a role', 'A token can follow any role whose permissions you hold, such as Agent for an admin: change the role and the token changes with it. Lose a permission of the role and the token stops.', 'The token follows a role as it changes.'],
  ['Pick permissions', 'Or tick the permissions the token gets, out of the ones you hold. The list is fixed when you create it.', 'Or a fixed list, out of the permissions you hold.'],
  ['Never more than you', 'A token never does more than its person can do right now. Lose a permission and every token of yours loses it too.', 'Lose a permission and every token of yours loses it too.'],
];
export const AGENT_POINTS: readonly (readonly [title: string, text: string, short: string])[] = [
  ['Every action, not a subset', 'Each action in the web app has an API route and an MCP tool. A test in the product repository fails the build when one is missing.', "Every action in the web app has an MCP tool. A test keeps it that way."],
  ['It acts, or says what is missing', 'A token with the permission acts at once; nothing waits in a queue. A call without it is refused with the permission it lacks and how to get it.', 'With the permission it acts at once. Without it, it is told which permission is missing.'],
  ['Some things stay with you', 'Only a person creates tokens. Connecting Gmail, Microsoft 365 or GitHub, and paying, happen in your browser: the agent gets the address and you finish it. A reply the agent may not send waits as a draft you edit, send or discard.', 'Only a person creates tokens. A reply it may not send waits as a draft.'],
  ['Saved replies keep their history', 'Every edit, by a person or an agent, is a version you can restore, and a deleted reply stays in the trash for 30 days.', "Every edit is a version you can restore."],
];
const agentSectionMd = `## ${AGENT_HEADING}

${AGENT_LEDE} MCP endpoint on Colliedesk Cloud: \`${MCP_URL}\`, with the agent token as a bearer token. [Connect an AI agent](/docs/mcp).

${AGENT_ACCESS.map(([t, v]) => `- **${t}.** ${v}`).join('\n')}

${AGENT_POINTS.map(([k, v]) => `- **${k}.** ${v}`).join('\n')}

Who can do what: [Roles and permissions](/docs/roles-and-permissions).`;

const cloudLine = FOUNDING_OPEN
  ? `Founding: $99 every 3 months per workspace for up to 10 agents, locked for life, for ${FOUNDING_SLOTS} teams. [Who it is for](/pricing#who-founding-is-for).`
  : `One flat price per workspace, never per agent: ${LADDER_LINE}. Team is ${PRICE.monthly} a month or ${PRICE.yearly} a year.`;
const flatLine = FOUNDING_OPEN
  ? 'Founding is $99 every 3 months per workspace for up to 10 agents, no per-agent fees. Self-host for $0.'
  : `Team is ${PRICE.monthly} per workspace per month for up to 10 agents, no per-agent fees. Self-host for $0.`;
const foundingTail = FOUNDING_OPEN ? '' : ` Cloud plans: ${LADDER_LINE}.`;

export const homeSectionsMd = `## Wait, what are you selling me?

Self-hosting is free, forever, with every feature. We sell two things:

1. **Colliedesk Cloud**: we run it for you. ${cloudLine}
2. **Migration**: we move your Freshdesk history (tickets, replies, attachments, tags) and give you a reconcile report that proves nothing was lost.

## Why teams switch

- **Leave Freshdesk with all your data** (importer shipped): tickets, replies, notes, checksummed attachments, tags and contacts, with a reconcile report. Switch gradually: keep answering in Freshdesk, import, run the import again to catch up, and move your mail forwarding last. [Migration guide](/migrate/freshdesk).
- **AI drafts and triage, included** (shipped, off until an admin turns them on; auto-answer not built yet). Included in every plan with a monthly allowance, or your own key at no extra fee.
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

$99 every 3 months per workspace, locked for life, with free Freshdesk migration and a reconcile report. Only 10 workspaces get it. Up to 10 agents, no per-agent fees, 20 GiB of attachments including imported files.${foundingTail} AI reply drafts and triage included with a monthly allowance, or your own key. Colliedesk Cloud is live; every workspace starts with a 14-day free trial.`;
