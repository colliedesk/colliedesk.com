// Zendesk, as read from its own pages (the euro pricing page: zendesk.com/pricing served it to us).
import { eur, eurCents, num, usd, type Competitor } from '../../lib/competitor.ts';

/** Per agent per month, EUR: billed annually and billed monthly. */
export const price = {
  supportTeam: { annual: 19, monthly: 25 },
  suiteTeam: { annual: 55, monthly: 69 },
  suitePro: { annual: 115, monthly: 149 },
  /** Copilot per agent per month, billed annually. */
  copilot: 50,
  /** Per automated resolution. */
  resolutionCommitted: 1.5,
  resolutionPayg: 2,
};
/** Incremental Export API: tickets per page and requests per minute. */
export const api = { perPage: 1000, perMinute: 10 };
const trialDays = 14;
const both = (p: { annual: number; monthly: number }): string => `${eur(p.annual)} / ${eur(p.monthly)}`;

export const zendesk: Competitor = {
  slug: 'zendesk',
  name: 'Zendesk',
  currency: 'EUR',
  readOn: '2026-10-14',
  sources: {
    pricing: { label: 'Zendesk pricing (euro page)', link: 'zendesk.de/pricing', url: 'https://www.zendesk.de/pricing/' },
    export: { label: 'Native data export', link: 'support.zendesk.com article 203662346', url: 'https://support.zendesk.com/hc/en-us/articles/203662346-Exporting-data-to-a-JSON-CSV-or-XML-file' },
    incremental: { label: 'Incremental Export API', link: 'developer.zendesk.com', url: 'https://developer.zendesk.com/api-reference/ticketing/ticket-management/incremental_exports/' },
    rateLimits: { label: 'API rate limits', link: 'developer.zendesk.com rate limits', url: 'https://developer.zendesk.com/api-reference/introduction/rate-limits/' },
  },
  facts: {
    plans: { source: 'pricing', text: `Support Team ${both(price.supportTeam)}, Suite Team ${both(price.suiteTeam)}, Suite Professional ${both(price.suitePro)}; Enterprise on quote` },
    ai: { source: 'pricing', text: `Copilot ${eur(price.copilot)} per agent per month, billed annually` },
    aiAgent: { source: 'pricing', text: `Per automated resolution: ${eurCents(price.resolutionCommitted)} committed, ${eurCents(price.resolutionPayg)} pay-as-you-go; some included per agent` },
    free: { source: 'pricing', text: `No free plan; ${trialDays}-day trial` },
    license: { source: 'pricing', text: 'Proprietary' },
    // No source we hold: see KNOWN_UNSOURCED in scripts/vs-facts-gate.mjs.
    usThirdParty: {
      source: '',
      text: `Third-party sites list US prices of ${usd(price.supportTeam.annual)}, ${usd(price.suiteTeam.annual)} and ${usd(price.suitePro.annual)} for the same three plans; we could not confirm them on Zendesk's own site.`,
    },
  },
  export: [
    { source: 'export', text: 'The native export (JSON, CSV, XML) is **off by default**. The account owner asks Zendesk Support to turn it on. It is **not available on Team plans**.' },
    { source: 'export', text: 'The **CSV export has no comments**, so it cannot carry a conversation.' },
    { source: 'incremental', text: `The **Incremental Export API** returns tickets with full comments (\`include=comment_events\`), ${num(api.perPage)} per page, at **${api.perMinute} requests per minute**.` },
  ],
  features: {
    shared_inbox: 'unread',
    email_channel: 'unread',
    live_chat: 'unread',
    channels: 'unread',
    automations: 'unread',
    sla: 'unread',
    reports: 'unread',
    kb_help_center: 'unread',
    app_marketplace: 'unread',
    ai_drafts: { has: 'yes', text: `Copilot, ${eur(price.copilot)} per agent per month`, source: 'pricing' },
    ai_agent: { has: 'yes', text: 'AI agents, billed per automated resolution', source: 'pricing' },
    price_model: { has: 'no', text: 'per agent, Copilot per agent on top', source: 'pricing' },
    full_export: { has: 'partial', text: 'native export off by default and not on Team plans; CSV has no comments', source: 'export' },
    self_host: { has: 'no', text: 'proprietary, cloud only', source: 'pricing' },
  },
};
