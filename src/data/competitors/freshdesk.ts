// Freshdesk, as read from its own pages. Change a price here and every page that names it follows.
import { usd, type Competitor } from '../../lib/competitor.ts';
import type { VsPlan } from '../../lib/vs-pricing';

/** List prices per agent per month, USD: billed monthly and billed annually. */
export const price = {
  growth: { monthly: 23, annual: 19 },
  pro: { monthly: 66, annual: 55 },
  enterprise: { monthly: 107, annual: 89 },
  copilot: { monthly: 35, annual: 29 },
};
const trialDays = 14;

/** Plans in the price-by-team-size chart, billed monthly; the annual price limits where we claim to cost less. */
export const chartPlans: readonly VsPlan[] = [
  { name: 'Freshdesk Growth', perAgent: price.growth.monthly, annualPerAgent: price.growth.annual },
  { name: 'Freshdesk Pro', perAgent: price.pro.monthly, annualPerAgent: price.pro.annual },
  { name: 'Freshdesk Pro + Freddy AI Copilot', perAgent: price.pro.monthly, aiPerAgent: price.copilot.monthly, annualPerAgent: price.pro.annual + price.copilot.annual },
];

const both = (p: { monthly: number; annual: number }): string => `${usd(p.monthly)} / ${usd(p.annual)}`;
/** "$19–107": lowest annual to highest monthly per-agent price. */
export const perAgentRange = `${usd(price.growth.annual)}–${price.enterprise.monthly}`;
export const copilotRange = `${usd(price.copilot.annual)}–${price.copilot.monthly}`;

export const freshdesk: Competitor = {
  slug: 'freshdesk',
  name: 'Freshdesk',
  currency: 'USD',
  readOn: '2026-10-17',
  sources: {
    pricing: { label: 'Freshdesk pricing', link: 'freshworks.com/freshdesk/pricing', url: 'https://www.freshworks.com/freshdesk/pricing/' },
    ticketExport: { label: 'Ticket export (fields only, archived excluded)', link: 'support.freshdesk.com article 225158', url: 'https://support.freshdesk.com/support/solutions/articles/225158' },
    api: { label: 'API pagination, 30-day default, archived tickets', link: 'developers.freshdesk.com/api', url: 'https://developers.freshdesk.com/api/' },
    rateLimits: { label: 'API rate limits', link: 'support.freshdesk.com article 225439', url: 'https://support.freshdesk.com/support/solutions/articles/225439-what-are-the-rate-limits-for-the-api-calls-to-freshdesk-' },
  },
  facts: {
    plans: { source: 'pricing', text: `Growth ${both(price.growth)}, Pro ${both(price.pro)}, Enterprise ${both(price.enterprise)} per agent per month` },
    ai: { source: 'pricing', text: `Freddy AI Copilot ${both(price.copilot)} per agent per month, add-on for Pro and Enterprise only` },
    aiAgent: { source: 'pricing', text: '500 sessions free once per account, then $49 per 100 sessions' },
    free: { source: 'pricing', text: `No free plan on the pricing page; ${trialDays}-day trial` },
    license: { source: 'pricing', text: 'Proprietary' },
  },
  export: [
    { source: 'ticketExport', text: 'The ticket export in the Freshdesk UI gives **ticket fields only**, as CSV or Excel. It does not include the conversation, and archived tickets are excluded.' },
    { source: 'api', text: 'The API lists **100 tickets per page, up to 300 pages** (30,000 tickets) per filter, and only the **last 30 days** unless you pass `updated_since`.' },
    { source: 'api', text: 'Closed tickets with no activity for 120 days are **archived** and fetched through a separate endpoint.' },
    { source: 'rateLimits', text: 'API rate limits are **100, 400 or 700 calls per minute** on Growth, Pro and Enterprise.' },
  ],
  features: {
    shared_inbox: { has: 'yes', text: 'yes', source: 'pricing' },
    email_channel: { has: 'yes', text: 'yes', source: 'pricing' },
    live_chat: 'unread',
    channels: { has: 'yes', text: 'yes', source: 'pricing' },
    automations: { has: 'yes', text: 'yes', source: 'pricing' },
    sla: { has: 'yes', text: 'yes', source: 'pricing' },
    reports: { has: 'yes', text: 'custom reports and dashboards', source: 'pricing' },
    kb_help_center: { has: 'yes', text: 'yes', source: 'pricing' },
    app_marketplace: { has: 'yes', text: 'yes', source: 'pricing' },
    ai_drafts: { has: 'yes', text: 'Freddy AI Copilot, add-on for Pro and Enterprise', source: 'pricing' },
    ai_agent: { has: 'yes', text: 'AI agent sessions, 500 free once per account', source: 'pricing' },
    price_model: { has: 'no', text: 'per agent, AI per agent on top', source: 'pricing' },
    full_export: { has: 'partial', text: 'account export or API; the ticket export has fields only', source: 'ticketExport' },
    self_host: { has: 'no', text: 'proprietary, cloud only', source: 'pricing' },
  },
};
