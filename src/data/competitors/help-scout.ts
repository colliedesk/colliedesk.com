// Help Scout, as read from its own pages.
import { usd, type Competitor } from '../../lib/competitor.ts';

/** Per user per month, USD, as the pricing page shows it. */
export const price = { standard: 25, plus: 45, pro: 75, proMinUsers: 10, aiAnswers: 0.75 };
const freePlan = { users: 5, inboxes: 1, contacts: 100 };
const free = `Free $0 (${freePlan.users} users, ${freePlan.inboxes} inbox, ${freePlan.contacts} contacts per month)`;

export const helpScout: Competitor = {
  slug: 'help-scout',
  name: 'Help Scout',
  currency: 'USD',
  readOn: '2026-10-14',
  sources: {
    pricing: { label: 'Help Scout pricing', link: 'helpscout.com/pricing', url: 'https://www.helpscout.com/pricing/' },
    dataExport: { label: 'Data export', link: 'docs.helpscout.com article 466', url: 'https://docs.helpscout.com/article/466-data-export' },
    mailboxApi: { label: 'Mailbox API and plan access', link: 'docs.helpscout.com article 1140', url: 'https://docs.helpscout.com/article/1140-mailbox-api' },
    pricingChange: { label: '2025 pricing change', link: 'mjtsai.com', url: 'https://mjtsai.com/blog/2025/04/30/whither-help-scout', suffix: '(third-party account)' },
  },
  facts: {
    plans: { source: 'pricing', text: `${free}, Standard ${usd(price.standard)}, Plus ${usd(price.plus)}, Pro ${usd(price.pro)} (minimum ${price.proMinUsers} users)` },
    ai: { source: 'pricing', text: `AI Answers ${usd(price.aiAnswers)} per resolution; AI Assist, Drafts and Summarize included` },
    api: { source: 'mailboxApi', text: 'Not on the Free plan' },
    free: { source: 'pricing', text: free },
    license: { source: 'pricing', text: 'Proprietary' },
    pricingChange: {
      source: 'pricingChange',
      text: 'In 2025 Help Scout moved to contact-based pricing and then reversed it after customer pushback ([Michael Tsai, 30 April 2025](https://mjtsai.com/blog/2025/04/30/whither-help-scout)).',
    },
  },
  export: [
    { source: 'dataExport', text: '**No bulk export button.** Reports export without conversation threads.' },
    { source: 'dataExport', text: 'The account owner can request a **CSV of customer names and emails**, without history.' },
    { source: 'mailboxApi', text: 'The **Mailbox API** returns conversations with threads (pass `status=all`; the default is active only). The Free plan has **no API**.' },
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
    ai_drafts: { has: 'yes', text: 'AI Assist, Drafts and Summarize included', source: 'pricing' },
    ai_agent: { has: 'yes', text: `AI Answers, ${usd(price.aiAnswers)} per resolution`, source: 'pricing' },
    price_model: { has: 'no', text: 'per user', source: 'pricing' },
    full_export: { has: 'no', text: 'no bulk export; conversations only through the Mailbox API, not on Free', source: 'dataExport' },
    self_host: { has: 'no', text: 'proprietary, cloud only', source: 'pricing' },
  },
};
