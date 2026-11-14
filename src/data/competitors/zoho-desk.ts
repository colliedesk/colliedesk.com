// Zoho Desk, as read from its own pages (Zoho showed us euro prices).
import { eur, num, type Competitor } from '../../lib/competitor.ts';

/** Per user per month, EUR, billed annually. */
export const price = { express: 7, standard: 14, professional: 23, enterprise: 40 };
export const limits = { freeUsers: 3, expressMaxUsers: 5, trialDays: 15 };
/** Backups: records per file, days a custom backup covers, days the file stays available. */
export const backup = { records: 10_000_000, customDays: 31, availableDays: 7 };

export const zohoDesk: Competitor = {
  slug: 'zoho-desk',
  name: 'Zoho Desk',
  currency: 'EUR',
  readOn: '2026-10-16',
  sources: {
    pricing: { label: 'Zoho Desk pricing', link: 'zoho.com/desk/pricing', url: 'https://www.zoho.com/desk/pricing.html' },
    express: { label: 'Express plan', link: 'zoho.com/desk/express', url: 'https://www.zoho.com/desk/express/' },
    backups: { label: 'Backups', link: 'help.zoho.com, backing up your help desk data', url: 'https://help.zoho.com/portal/en/kb/desk/data-administration/backup-and-data-archive/articles/backing-up-your-help-desk-data' },
  },
  facts: {
    plans: {
      source: 'pricing',
      text: `Free (${limits.freeUsers} users), Express ${eur(price.express)} (max ${limits.expressMaxUsers} users), Standard ${eur(price.standard)}, Professional ${eur(price.professional)}, Enterprise ${eur(price.enterprise)} per user per month`,
    },
    ai: { source: 'pricing', text: "Zia on Professional and Enterprise; Express AI agents with your own key or Zoho's LLM" },
    free: { source: 'pricing', text: `Free plan for ${limits.freeUsers} users; ${limits.trialDays}-day trial` },
    license: { source: 'pricing', text: 'Proprietary' },
  },
  export: [
    { source: 'backups', text: 'Only the **primary contact** can create and download a backup.' },
    { source: 'backups', text: `The backup is a ZIP of **CSV files per module**, up to **${num(backup.records / 1_000_000)} million records**; a custom backup covers up to **${backup.customDays} days**.` },
    { source: 'backups', text: '**Attachments are not in the file.** It holds secure download links; you fetch each file separately.' },
    { source: 'backups', text: `The file stays available for **${backup.availableDays} days**.` },
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
    ai_drafts: 'unread',
    ai_agent: { has: 'yes', text: "AI agents on Express, with your own key or Zoho's LLM", source: 'express' },
    price_model: { has: 'no', text: 'per user', source: 'pricing' },
    full_export: { has: 'partial', text: 'backup ZIP of CSV files, attachments only as links, primary contact only', source: 'backups' },
    self_host: { has: 'no', text: 'proprietary, cloud only', source: 'pricing' },
  },
};
