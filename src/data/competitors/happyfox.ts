// HappyFox, as read from its own pages.
import { usd, type Competitor } from '../../lib/competitor.ts';

/** Per agent per month, USD: billed annually and billed monthly. */
export const price = {
  basic: { annual: 24, monthly: 29 },
  team: { annual: 49, monthly: 69 },
  pro: { annual: 99, monthly: 119 },
};
export const basicMaxAgents = 5;
export const autopilotCents = 2;
const trialDays = 14;

export const happyfox: Competitor = {
  slug: 'happyfox',
  name: 'HappyFox',
  currency: 'USD',
  readOn: '2026-10-16',
  sources: {
    pricing: { label: 'HappyFox pricing', link: 'happyfox.com/help-desk-price', url: 'https://www.happyfox.com/help-desk-price/' },
    autopilot: { label: 'HappyFox Autopilot', link: 'happyfox.com/autopilot', url: 'https://www.happyfox.com/autopilot/' },
  },
  facts: {
    plans: {
      source: 'pricing',
      text: `Basic ${usd(price.basic.annual)} (max ${basicMaxAgents} agents), Team ${usd(price.team.annual)}, Pro ${usd(price.pro.annual)} per agent per month; Enterprise Pro on request`,
    },
    monthly: { source: 'pricing', text: `Basic ${usd(price.basic.monthly)}, Team ${usd(price.team.monthly)}, Pro ${usd(price.pro.monthly)}` },
    ai: { source: 'autopilot', text: `Separate products with their own pricing; Autopilot from ${autopilotCents}¢ per successful action` },
    autopilotQuote: { source: 'autopilot', text: `"as low as ${autopilotCents}¢ per successful action"` },
    free: { source: 'pricing', text: `${trialDays}-day trial, no card` },
    license: { source: 'pricing', text: 'Proprietary' },
  },
  export: [],
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
    ai_drafts: 'unread',
    ai_agent: { has: 'yes', text: `Autopilot, from ${autopilotCents}¢ per successful action`, source: 'autopilot' },
    price_model: { has: 'no', text: 'per agent; Basic stops at five agents', source: 'pricing' },
    full_export: 'unread',
    self_host: { has: 'no', text: 'proprietary, cloud only', source: 'pricing' },
  },
};
