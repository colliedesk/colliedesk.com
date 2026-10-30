// Colliedesk's own capability status, from ROADMAP.md. Shared by comparison pages.
import { FOUNDING_OPEN } from '../../lib/cloud-price';
import { AI_RESOLUTION, LADDER_LINE } from '../../lib/site';

// While Founding is open it leads the plans on sale; Team 25 is on sale beside it.
const cloudPlans = FOUNDING_OPEN ? 'then Founding, $99 every 3 months, 10 places' : 'then a plan from Solo to Team 25, or Founding';
export const statusTable = `Colliedesk as a whole is alpha. Everything marked shipped runs on Colliedesk Cloud today, and any release may still change the interface or the database schema.

| Capability | Status |
|---|---|
| Shared inbox: replies, Cc, private notes, status, priority, assignee, tags, search, bulk actions | **Shipped** |
| Email channel (inbound and outbound, threading), replies sent through your connected Gmail | **Shipped** |
| Freshdesk and Help Scout importers with reconcile report, Freshdesk import inside the app | **Shipped** |
| Knowledge base and public help center | **Shipped** |
| New conversation from the inbox, contact history | **Shipped** |
| Saved replies, attachments, live updates, browser notifications, see who else has a conversation open | **Shipped** |
| Passwordless sign-in, revocable sessions, isolated workspaces, full export | **Shipped** |
| MCP server for your AI agent: read, draft, send and admin tokens, risky actions approved by a person | **Shipped** |
| One-command install and published container image | **Shipped** |
| Upgrade guide, upgrades tested on real data | **Shipped** |
| Colliedesk Cloud with a 14-day free trial, ${cloudPlans} | **Shipped** |
| Replies sent from your Microsoft 365 or Outlook.com mailbox (incoming mail still arrives by forwarding) | **Shipped** |
| AI reply drafts and triage suggestions, off until an admin turns them on | **Shipped** |
| AI auto-answer with a human in the loop | **Not built yet** |
| Automations, macros, SLA, business hours, CSAT and reports | **Not built yet** |
| Zendesk importer, live chat widget | **Not built yet** |`;

export const collieFacts: Readonly<Record<'price' | 'ai' | 'free' | 'source' | 'export', string>> = {
  price: FOUNDING_OPEN
    ? `Founding today: $99 every 3 months per workspace for up to 10 agents, locked for life, 10 workspaces only. After the 10 places are taken, one flat price per workspace, no per-agent fees: ${LADDER_LINE}. A year costs ten months.`
    : `One flat price per workspace, no per-agent fees: ${LADDER_LINE}. A year costs ten months. Founding customers keep $99 every 3 months, locked for life.`,
  ai: `Reply drafts and triage, off until an admin turns them on: included in every plan with a monthly allowance; your own key adds no fee. Auto-answer not built yet: ${AI_RESOLUTION} per resolution while alpha, charged only when the customer needs no person afterwards.`,
  free: 'Self-host free, every feature. Cloud: 14-day free trial, no card.',
  source: 'Open source, AGPL-3.0. Self-host or use Cloud.',
  export: 'Your data lives in PostgreSQL. Self-hosted, you can take a database dump at any time.',
};
