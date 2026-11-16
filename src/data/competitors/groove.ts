// Groove, now Helply, as read from helply.com and Groove's help center.
import { num, usd, type Competitor } from '../../lib/competitor.ts';

/** From this price per month, USD, for a block of credits; annual billing discount in percent. */
export const price = { from: 49, annualDiscount: 15 };
export const creditBlocks = { smallest: 500, largest: 32_000, trial: 1000 };
/** Credits one AI action uses: a draft or summary, then harder actions. */
export const creditCost = { draft: 1, harder: [4, 12] as const };
export const exportHours = 72;
const trialDays = 14;

export const groove: Competitor = {
  slug: 'groove',
  name: 'Helply (formerly Groove)',
  currency: 'USD',
  readOn: '2026-10-16',
  sources: {
    about: { label: 'Helply about (formerly Groove)', link: 'helply.com/about', url: 'https://helply.com/about' },
    pricing: { label: 'Helply pricing', link: 'helply.com/pricing', url: 'https://helply.com/pricing' },
    export: { label: 'Groove export', link: 'help.groovehq.com', url: 'https://help.groovehq.com/help/970-export-your-groove-conversations' },
  },
  facts: {
    plans: {
      source: 'pricing',
      text: `From ${usd(price.from)} per month for a block of credits (${num(creditBlocks.smallest)} to ${num(creditBlocks.largest)}); no per-user fees; ${price.annualDiscount}% off annual`,
    },
    ai: {
      source: 'pricing',
      text: `Charged in credits: ${creditCost.draft} for a draft or summary, ${creditCost.harder.join(' or ')} for harder actions; unused credits roll over`,
    },
    free: { source: 'pricing', text: `${trialDays}-day trial with ${num(creditBlocks.trial)} credits, no card` },
    license: { source: 'pricing', text: 'Proprietary' },
  },
  export: [
    { source: 'export', text: 'The account owner and admins can download **all conversation data**.' },
    { source: 'export', text: 'The export is **JSON only**; Groove says a CSV export is not available.' },
    { source: 'export', text: `**One export at a time**; large exports can take **up to ${exportHours} hours**.` },
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
    ai_drafts: { has: 'yes', text: `drafts in credits, ${creditCost.draft} per draft`, source: 'pricing' },
    ai_agent: { has: 'yes', text: 'rebuilt around AI agents', source: 'about' },
    price_model: { has: 'no', text: 'by AI credits, no per-user fees', source: 'pricing' },
    full_export: { has: 'yes', text: 'all conversation data as JSON, one export at a time', source: 'export' },
    self_host: { has: 'no', text: 'proprietary, cloud only', source: 'pricing' },
  },
};
