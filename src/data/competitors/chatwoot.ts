// Chatwoot, as read from its own pages and its Freshdesk migration guide.
import { num, usd, type Competitor } from '../../lib/competitor.ts';

/** Cloud, USD per agent per month. */
export const price = { startups: 19, business: 39, enterprise: 99, hackerAgents: 2 };
/** Captain AI credits included by plan, and the price of an extra block. */
export const aiCredits = { included: [300, 500, 800], extraPrice: 20, extraBlock: 1000 };
export const selfHosted = { premium: 19, enterprise: 99 };
export const freshdeskApiCap = 30_000;

export const chatwoot: Competitor = {
  slug: 'chatwoot',
  name: 'Chatwoot',
  currency: 'USD',
  readOn: '2026-10-16',
  sources: {
    pricing: { label: 'Chatwoot Cloud pricing', link: 'chatwoot.com/pricing', url: 'https://www.chatwoot.com/pricing' },
    selfHosted: { label: 'Self-hosted plans', link: 'chatwoot.com/pricing/self-hosted-plans', url: 'https://www.chatwoot.com/pricing/self-hosted-plans' },
    migration: { label: 'Freshdesk migration guide', link: 'chatwoot.com help center', url: 'https://www.chatwoot.com/hc/user-guide/articles/1696159781-how-to-migrate-from-freshdesk-to-chatwoot' },
    license: { label: 'Licence', link: 'github.com/chatwoot/chatwoot', url: 'https://github.com/chatwoot/chatwoot' },
  },
  facts: {
    plans: {
      source: 'pricing',
      text: `Hacker $0 (up to ${price.hackerAgents} agents, live chat only), Startups ${usd(price.startups)}, Business ${usd(price.business)}, Enterprise ${usd(price.enterprise)} per agent per month`,
    },
    ai: {
      source: 'pricing',
      text: `Captain AI credits included (${aiCredits.included.slice(0, -1).join(', ')} or ${aiCredits.included.at(-1)} by plan; none on Hacker); more at ${usd(aiCredits.extraPrice)} per ${num(aiCredits.extraBlock)}`,
    },
    free: { source: 'selfHosted', text: `Community Edition free; Premium ${usd(selfHosted.premium)} and Enterprise ${usd(selfHosted.enterprise)} per agent per month` },
    license: { source: 'license', text: 'MIT, except the `enterprise/` directory under its own licence' },
    importAvailability: { source: 'migration', text: 'Paid plans only' },
    importConversations: { source: 'migration', text: 'Yes, as resolved history' },
    importAttachments: { source: 'migration', text: 'Not imported' },
    importAgents: { source: 'migration', text: 'Not imported' },
    importCount: { source: 'migration', text: `Freshdesk API cap of ${num(freshdeskApiCap)} tickets` },
    importProof: { source: 'migration', text: 'Not described' },
  },
  export: [],
  features: {
    shared_inbox: 'unread',
    email_channel: 'unread',
    live_chat: { has: 'yes', text: 'yes', source: 'pricing' },
    channels: 'unread',
    automations: 'unread',
    sla: 'unread',
    reports: 'unread',
    kb_help_center: 'unread',
    app_marketplace: 'unread',
    ai_drafts: 'unread',
    ai_agent: 'unread',
    price_model: { has: 'no', text: 'per agent', source: 'pricing' },
    full_export: 'unread',
    self_host: { has: 'yes', text: 'Community Edition free, MIT except `enterprise/`', source: 'license' },
  },
};
