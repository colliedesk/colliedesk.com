// Front, as read from its own pages. Its pricing and export pages were read on another day than most
// comparison pages.
import { usd, type Competitor } from '../../lib/competitor.ts';

/** Per seat per month, USD, billed annually (the page lists no monthly-billing prices). */
export const price = { starter: 25, professional: 65, enterprise: 105, copilot: 20, autopilot: 0.05 };
export const seats = { starter: 10, professional: 50 };
export const exportAckHours = 72;
const trialDays = 14;

export const front: Competitor = {
  slug: 'front',
  name: 'Front',
  currency: 'USD',
  readOn: '2026-10-15',
  sources: {
    pricing: { label: 'Front pricing', link: 'front.com/pricing', url: 'https://front.com/pricing' },
    export: { label: 'Account data export', link: 'help.front.com', url: 'https://help.front.com/t/182vg7' },
  },
  facts: {
    plans: {
      source: 'pricing',
      text: `Starter ${usd(price.starter)} (up to ${seats.starter} seats), Professional ${usd(price.professional)} (up to ${seats.professional} seats), Enterprise ${usd(price.enterprise)}`,
    },
    ai: { source: 'pricing', text: `Copilot ${usd(price.copilot)} per seat per month on Starter and Professional; included on Enterprise` },
    aiAgent: { source: 'pricing', text: `Autopilot from ${usd(price.autopilot)} per conversation` },
    free: { source: 'pricing', text: `No free plan; ${trialDays}-day trial` },
    license: { source: 'pricing', text: 'Proprietary' },
  },
  export: [
    { source: 'export', text: 'There is **no self-serve export** of conversations. A company admin asks Front Support for an account data export.' },
    { source: 'export', text: 'The export covers **shared inboxes**: conversations, messages, discussions, comments, and attachments as EML.' },
    { source: 'export', text: 'It **leaves out** individual inboxes, contact data, message templates and tags.' },
    { source: 'export', text: `Front acknowledges the request within **${exportAckHours} hours**, then sends the files when they are ready.` },
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
    ai_drafts: { has: 'yes', text: `Copilot, ${usd(price.copilot)} per seat on Starter and Professional`, source: 'pricing' },
    ai_agent: { has: 'yes', text: `Autopilot, from ${usd(price.autopilot)} per conversation`, source: 'pricing' },
    price_model: { has: 'no', text: 'per seat', source: 'pricing' },
    full_export: { has: 'partial', text: 'through Front Support only, shared inboxes only', source: 'export' },
    self_host: { has: 'no', text: 'proprietary, cloud only', source: 'pricing' },
  },
};
