// Colliedesk's own capability status, from ROADMAP.md. Shared by comparison pages.
import { foundingState } from '../../lib/founding';
import { LADDER_LINE } from '../../lib/site';

// While Founding is open it is the only plan on sale.
const cloudPlans = foundingState().open ? 'then Founding, $99 a quarter, 10 places' : 'then a plan from Solo to Team 25, or Founding';
export const statusTable = `| Capability | Colliedesk |
|---|---|
| Shared inbox: replies, Cc, private notes, status, priority, assignee, tags, search, bulk actions | **Available now** (alpha) |
| Email channel (inbound and outbound, threading) | **Available now** (alpha) |
| Freshdesk and Help Scout importers with reconcile report | **Available now** (alpha) |
| Knowledge base and public help center | **Available now** (alpha) |
| New conversation from the inbox, contact history | **Available now** (alpha) |
| Saved replies, attachments, live updates and browser notifications | **Available now** (alpha) |
| Passwordless sign-in, revocable sessions, isolated workspaces, full export | **Available now** (alpha) |
| MCP server for your AI agent: read, draft, send and admin tokens, risky actions approved by a person | **Available now** (alpha) |
| One-command install and published container image | **Available now** |
| Upgrade guide, upgrades tested on real data | **Available now** |
| Colliedesk Cloud with a 14-day free trial, ${cloudPlans} | **Available now** (alpha) |
| Gmail and Microsoft 365 mailboxes in one click, Freshdesk import inside the app, see who is replying | **Beta** (0.1.0) |
| AI draft replies, triage, auto-answer with a human in the loop | **Coming after beta** |
| Automations, macros, SLA, business hours, CSAT and reports | **Coming later** |
| Zendesk importer, live chat widget | **Coming later** |`;

export const collieFacts: Readonly<Record<'price' | 'ai' | 'free' | 'source' | 'export', string>> = {
  price: `One flat price per workspace, no per-agent fees: ${LADDER_LINE}. A year costs ten months. Founding customers (10 workspaces only): $99 per quarter, locked for life.`,
  ai: 'Included (coming after beta). LLM cost +30% on our key, or bring your own key.',
  free: 'Self-host free, every feature. Cloud: 14-day free trial, no card.',
  source: 'Open source, AGPL-3.0. Self-host or use Cloud.',
  export: 'Your data lives in PostgreSQL. Self-hosted, you can take a database dump at any time.',
};
