// Gorgias, as read from its own pricing page: one price per account, by tickets included.
import { andList, num, orList, usd, type Competitor } from '../../lib/competitor.ts';

interface Tier {
  name: string;
  /** USD per month, billed annually and billed monthly. */
  annual: number;
  monthly: number;
  tickets: number;
  /** AI Agent add-on per month, billed annually, and the automated interactions it includes. */
  ai: number;
  aiInteractions: number;
}
export const tiers: readonly Tier[] = [
  { name: 'Basic', annual: 50, monthly: 60, tickets: 300, ai: 27, aiInteractions: 30 },
  { name: 'Pro', annual: 300, monthly: 360, tickets: 2000, ai: 171, aiInteractions: 190 },
  { name: 'Advanced', annual: 750, monthly: 900, tickets: 5000, ai: 477, aiInteractions: 530 },
];
export const starter = { monthly: 10, tickets: 50 };
const trialDays = 7;
export const withAi = (t: Tier): number => t.annual + t.ai;

export const gorgias: Competitor = {
  slug: 'gorgias',
  name: 'Gorgias',
  currency: 'USD',
  readOn: '2026-10-16',
  sources: {
    pricing: { label: 'Gorgias pricing', link: 'gorgias.com/pricing', url: 'https://www.gorgias.com/pricing' },
  },
  facts: {
    plans: {
      source: 'pricing',
      text: `${tiers.map((t) => `${t.name} ${usd(t.annual)} (${num(t.tickets)}${t === tiers[0] ? ' tickets' : ''})`).join(', ')}; Starter ${usd(starter.monthly)} (${starter.tickets} tickets, monthly only)`,
    },
    monthly: { source: 'pricing', text: tiers.map((t) => `${t.name} ${usd(t.monthly)}`).join(', ') },
    ai: {
      source: 'pricing',
      text: `AI Agent adds ${orList(tiers.map((t) => usd(t.ai)))} per month on ${andList(tiers.map((t) => t.name))} (billed annually), with ${orList(tiers.map((t) => String(t.aiInteractions)))} automated interactions`,
    },
    free: { source: 'pricing', text: `${trialDays}-day trial` },
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
    ai_agent: { has: 'yes', text: 'AI Agent add-on, billed by automated interactions', source: 'pricing' },
    price_model: { has: 'no', text: 'by tickets per month, not by agent', source: 'pricing' },
    full_export: 'unread',
    self_host: { has: 'no', text: 'proprietary, cloud only', source: 'pricing' },
  },
};
