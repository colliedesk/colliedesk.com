// The Colliedesk side of every comparison, in the shape of a competitor file: capability status from
// ROADMAP.md in colliedesk/colliedesk, prices from src/lib/site.ts. The status table renders from it.
import { FOUNDING_OPEN } from '../../lib/cloud-price.ts';
import type { Own } from '../../lib/competitor.ts';
import { FOUNDING_SLOTS } from '../../lib/founding.ts';
import { AI_RESOLUTION, GA_DOC, LADDER_LINE, REPO } from '../../lib/site.ts';

/** Figures the /vs pages state about Colliedesk, so no page writes one by hand. */
export const OURS = {
  foundingPrice: '$99 every 3 months',
  foundingYear: '$396 a year',
  foundingPlaces: FOUNDING_SLOTS,
  foundingAgents: 10,
  foundingGiB: 20,
  trialDays: 14,
  liveChat: 'Q1 2027',
  license: 'AGPL-3.0',
  postgres: 'PostgreSQL 16+',
  checksum: 'SHA-256',
  microsoft: 'Microsoft 365',
  resultsDays: '30 or 7 days',
  resultsWindow: '30 days',
} as const;

const SHIPPED = '**Shipped**';
const NOT_BUILT = '**Not built yet**';
// While Founding is open it leads the plans on sale; Team 25 is on sale beside it.
const cloudPlans = FOUNDING_OPEN ? `then Founding, ${OURS.foundingPrice}, ${OURS.foundingPlaces} places` : 'then a plan from Solo to Team 25, or Founding';

/** Capability and status, in the order of the status table. */
export const STATUS: readonly (readonly [string, string])[] = [
  ['Shared inbox: replies, Cc, private notes, status, priority, assignee, tags, search, bulk actions', SHIPPED],
  ['Email channel (inbound and outbound, threading), replies sent through your connected Gmail', SHIPPED],
  ['Freshdesk and Help Scout importers with reconcile report, Freshdesk import inside the app', SHIPPED],
  ['Knowledge base and public help center', SHIPPED],
  ['New conversation from the inbox, contact history', SHIPPED],
  ['Saved replies, attachments, live updates, browser notifications, see who else has a conversation open', SHIPPED],
  ['Passwordless sign-in, revocable sessions, isolated workspaces, full export', SHIPPED],
  ['MCP server for your AI agent: tokens that follow a role or a fixed list of permissions, never more than their person holds', SHIPPED],
  ['One-command install and published container image', SHIPPED],
  ['Upgrade guide, upgrades tested on real data', SHIPPED],
  [`Colliedesk Cloud with a ${OURS.trialDays}-day free trial, ${cloudPlans}`, SHIPPED],
  [`Replies sent from your ${OURS.microsoft} or Outlook.com mailbox (incoming mail still arrives by forwarding)`, SHIPPED],
  ['AI reply drafts and triage suggestions, off until an admin turns them on', SHIPPED],
  ['AI auto-answer with a human in the loop', NOT_BUILT],
  ['Response targets (SLA) by priority, counted in business hours, with due-soon and overdue alerts', SHIPPED],
  [`Results: your last ${OURS.resultsDays} in Freshdesk next to Colliedesk, every number linked to its conversations`, SHIPPED],
  ['Automations, macros and CSAT', NOT_BUILT],
  ['Live chat widget into the same inbox', `**Coming ${OURS.liveChat}**`],
  ['Zendesk importer', NOT_BUILT],
];

export const colliedesk: Own = {
  slug: 'colliedesk',
  name: 'Colliedesk',
  sources: {
    roadmap: { label: 'Colliedesk roadmap', link: 'ROADMAP.md', url: `${REPO}/blob/main/ROADMAP.md` },
    pricing: { label: 'Colliedesk pricing', link: 'colliedesk.com/pricing', url: 'https://colliedesk.com/pricing' },
    ga: { label: 'General availability', link: 'docs/general-availability.md', url: GA_DOC },
  },
  facts: {
    price: {
      source: 'pricing',
      text: FOUNDING_OPEN
        ? `Founding today: ${OURS.foundingPrice} per workspace for up to ${OURS.foundingAgents} agents, locked for life, ${OURS.foundingPlaces} workspaces only. After the ${OURS.foundingPlaces} places are taken, one flat price per workspace, no per-agent fees: ${LADDER_LINE}. A year costs ten months.`
        : `One flat price per workspace, no per-agent fees: ${LADDER_LINE}. A year costs ten months. Founding customers keep ${OURS.foundingPrice}, locked for life.`,
    },
    ai: {
      source: 'pricing',
      text: `Reply drafts and triage, off until an admin turns them on: included in every plan with a monthly allowance; your own key adds no fee. Auto-answer not built yet: ${AI_RESOLUTION} per resolution once it ships, charged only when the customer needs no person afterwards.`,
    },
    free: { source: 'pricing', text: `Self-host free, every feature. Cloud: ${OURS.trialDays}-day free trial, no card.` },
    source: { source: 'roadmap', text: `Open source, ${OURS.license}. Self-host or use Cloud.` },
    export: { source: 'ga', text: 'Your data lives in PostgreSQL. Self-hosted, you can take a database dump at any time.' },
  },
  features: {
    shared_inbox: { has: 'yes', text: 'yes, shipped', source: 'roadmap' },
    email_channel: { has: 'yes', text: 'yes, shipped', source: 'roadmap' },
    live_chat: { has: 'no', text: `coming ${OURS.liveChat}`, source: 'roadmap' },
    channels: { has: 'no', text: `live chat in ${OURS.liveChat}; email today`, source: 'roadmap' },
    automations: { has: 'no', text: 'not built yet', source: 'roadmap' },
    sla: { has: 'yes', text: 'yes: response targets by priority, in business hours', source: 'roadmap' },
    reports: { has: 'partial', text: `results only: your last ${OURS.resultsDays} next to Freshdesk`, source: 'roadmap' },
    kb_help_center: { has: 'yes', text: 'yes, shipped', source: 'roadmap' },
    app_marketplace: { has: 'no', text: 'no', source: 'roadmap' },
    ai_drafts: { has: 'yes', text: 'yes, shipped, off until an admin turns them on', source: 'roadmap' },
    ai_agent: { has: 'no', text: 'not built yet', source: 'roadmap' },
    price_model: { has: 'yes', text: 'one price per workspace', source: 'pricing' },
    full_export: { has: 'yes', text: 'whole workspace as a ZIP, any time', source: 'roadmap' },
    self_host: { has: 'yes', text: `${OURS.license}, self-host free`, source: 'roadmap' },
  },
};
