// Home page copy shared by the HTML sections (src/components/home/*) and the Markdown twin (home.ts).
// The layout and words follow the Paper design "L1-b Landing" (page 50 Landing); facts come from
// src/lib/site.ts and the product docs, and win where the design disagrees.
import { foundingState } from '../../lib/founding';
import { GA_BACKUPS, PRICES_READ, REPO, STATUS_PAGE, SWITCH_HREF, TEAM } from '../../lib/site';
import { billAt } from '../../lib/team-bill';

// While Founding is open it leads the plans we sell, so the home page prices Founding; once the
// places are taken (the site rebuilds on that change) it prices Cloud Team.
export const FOUNDING_OPEN = foundingState().open;
export const OURS_NAME = FOUNDING_OPEN ? 'Colliedesk Founding' : 'Colliedesk Cloud Team';

// The hero, the title and the description name what five agents pay Freshdesk in a year, from the
// cheapest plan (Growth, no AI) to the dearest (Pro + Copilot), against our yearly price.
const [FIVE_PRO, FIVE_GROWTH, FIVE_OURS] = billAt(5, FOUNDING_OPEN);
export interface HeroRange { name: string; currency: '$' | '€'; low: number; high: number }
export const FRESHDESK_RANGE: HeroRange = { name: 'Freshdesk', currency: '$', low: FIVE_GROWTH?.usd ?? 0, high: FIVE_PRO?.usd ?? 0 };
export const rangeLabel = (r: HeroRange): string =>
  `${r.currency}${r.low.toLocaleString('en-US')}–${r.high.toLocaleString('en-US')}`;
export const OURS_YEAR = FIVE_OURS?.usd ?? TEAM.yearly;

export const MIGRATE_REPORT_HREF = '/migrate/freshdesk#5-check-the-reconcile-report';

/** Three facts under the hero: cost, data safety, reliability; each links to its proof. */
export const FACTS: readonly (readonly [fact: string, line: string, link: string, href: string])[] = [
  [`$${OURS_YEAR} a year`, 'for 3 to 10 agents, not per agent', 'see pricing', '/pricing'],
  ['0 missing', 'records, counted on both sides', 'what it checks', MIGRATE_REPORT_HREF],
  ['1 restore test a week', 'backups in another EU data centre', 'how we test', GA_BACKUPS],
];

export const MIGRATE_LEDE =
  "Freshdesk's CSV export leaves the conversations out. Our importer brings tickets, replies, notes, attachments, tags, time entries, contacts, companies, saved replies and your help center, then counts both sides.";
/** The sample reconcile report: illustrative counts, labelled as an example account. */
export const REPORT_ROWS: readonly (readonly [record: string, count: string])[] = [
  ['Tickets, archived ones included', '18,422'],
  ['Messages: replies, notes, forwards', '96,310'],
  ['Attachments, each SHA-256 checked', '6,031'],
  ['Contacts', '3,902'],
  ['Companies', '216'],
  ['Time entries', '1,240'],
  ['Saved replies', '64'],
  ['Help-center articles', '214'],
];
export const REPORT_NOT_IMPORTED = 'Not imported, listed by Freshdesk id: 3 custom fields, 12 canned responses in personal folders.';
// The import time is the app's own estimate (web/src/features/settings/import-estimate.ts), not a measured run.
export const STEPS: readonly (readonly [title: string, text: string])[] = [
  ['We import it for you', 'You send an API key. The page estimates the time first: 10,000 tickets on Freshdesk Growth take about 5 to 9 hours, and the newest tickets arrive within the first minute.'],
  ['Run both', 'One queue answers in Colliedesk. Freshdesk keeps the rest until your team is sure.'],
  ['Catch up', 'Run the import again before you switch. It never copies a ticket twice.'],
  ['Move mail and help center', 'Point your support address and help-center domain here. Published articles keep their old links with a 301.'],
];
export const DONE_FOR_YOU = 'The migration is free and done by us, on Founding, Team 25 and Business.';
export const NOT_MOVED =
  'What does not move: custom fields (listed), custom statuses (they become Pending), canned responses in personal folders unless you ask, and files attached to canned responses. The report lists each one by Freshdesk id. If one count does not match, the migration failed and you keep Freshdesk.';
export const SWITCH_STEPS_HREF = SWITCH_HREF;

// "Your AI agent can do this too", as shipped in colliedesk (docs/user/mcp.md, roles-and-permissions.md).
export const MCP_URL = 'https://app.colliedesk.com/mcp';
export const AGENT_HEADING = 'Everything you see here, your AI agent can do too';
export const AGENT_LEDE = 'Give Claude Code, Codex or Cursor one URL and an agent token. It does what you allow, never more than you can.';
/** The terminal: [tool call, its result]; the last line is the outcome. */
export const AGENT_PROMPT = 'Triage open refund questions, draft replies, fix the refund article';
export const AGENT_CALLS: readonly string[] = [
  'colliedesk_inbox_search status=open "refund" → 14',
  'colliedesk_conversation_update #4821 assignee=Tom status=pending',
  'colliedesk_note_add #4821 → "Same cause as #4790"',
  'colliedesk_reply_draft #4821 → waiting for a person to send',
  'colliedesk_kb_article_update "Refunds" → new version, history kept',
];
export const AGENT_OUTCOME = '3 drafts ready. Nothing was sent: this token has no send permission.';
export const AGENT_POINTS: readonly (readonly [title: string, text: string])[] = [
  ['Never more than you', 'A token follows your role. Lose a permission and every token of yours loses it too.'],
  ['Most actions are MCP tools', "Inbox, help-center and settings work are MCP tools. A call outside the token's permissions is refused and names the permission it needs."],
  ['Some things stay with you', 'Only a person creates tokens. A reply it may not send waits as a draft. Your workspace content never trains AI models.'],
];

export const BILL_LEDE = `Pick your team size. Freshdesk list prices per year, billed annually, read on ${PRICES_READ}. Colliedesk is one flat price for the workspace${FOUNDING_OPEN ? ', and Founding is locked for life' : ''}.`;

/** What a team uses every day, each with a crop of the product (public/daily-*.webp). */
export const DAILY: readonly (readonly [title: string, text: string, image: string, alt: string])[] = [
  ['One owner per conversation', 'Assign, mark pending or resolved. Nobody answers the same customer twice.', 'owner', 'Conversation properties: status Open, priority Urgent, an assignee, tags and the due time.'],
  ['Saved replies', 'Your Freshdesk canned responses arrive as saved replies. Insert one with Ctrl+/ while you type.', 'saved-replies', 'The saved-reply picker searching "refund" with three matching replies.'],
  ['Private notes', 'Talk about a ticket next to it. The customer never sees a note.', 'notes', 'A private note from a teammate inside a conversation.'],
  ['Help center', 'Your Freshdesk articles and translations, on your own domain.', 'help-center', 'A help-center article about how long a refund takes, under Home and Billing.'],
  ['Response targets', 'First response and resolution targets, counted in your business hours.', 'targets', 'Response targets by priority: urgent, high, normal and low.'],
  ['Results', 'Your last 30 days in Freshdesk next to Colliedesk. Every number opens its tickets.', 'results', 'Results: first reply time in Freshdesk before the move next to Colliedesk now.'],
];

export const RELIABILITY_LEDE = 'Since 5 November 2026. What is guaranteed is written down, and what is still coming is listed below with its state.';
export const GUARANTEES: readonly (readonly [title: string, text: string])[] = [
  ['Copied within minutes', 'Every database change goes, encrypted, to a second data centre in Germany.'],
  ['Restore tested every week', 'Nightly encrypted backups, and a weekly test that we can bring them back.'],
  ['Your data, any time', 'Export the whole workspace as a ZIP. Open source, so you can also self-host it.'],
];
export const STATUS_NOTE = `Live from ${new URL(STATUS_PAGE).host}, checked from several regions. The written uptime commitment appears here only once it is published.`;
/** Roadmap items still to come, with their state on the roadmap and their issue. */
export const STILL_COMING: readonly { title: string; text: string; state: string; issue: number; soon?: boolean }[] = [
  { title: 'Live chat widget', text: 'Chats from your site land in the same inbox as email.', state: 'Coming Q1 2027', issue: 124, soon: true },
  { title: 'Zendesk importer', text: 'Move from Zendesk with the same reconcile report.', state: 'Later', issue: 122 },
  { title: 'Auto-answer where drafts proved right', text: 'Only for topics where drafts were accurate, with a person in the loop.', state: 'Planned', issue: 281 },
];
export const issueHref = (n: number): string => `${REPO}/issues/${n}`;
