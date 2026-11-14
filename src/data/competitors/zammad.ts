// Zammad, as read from its own pages and docs. Zammad, Chatwoot and FreeScout were read on the same day.
import { eur, type Competitor } from '../../lib/competitor.ts';

/** Hosted, EUR per agent per month excluding VAT: billed annually (low) and monthly (high). */
export const price = {
  starter: { low: 7, high: 9, maxAgents: 5 },
  professional: { low: 16, high: 18, maxAgents: 35 },
  plus: { low: 25, high: 27 },
  aiCall: 0.03,
  supportPerYear: 2999,
};
export const range = (p: { low: number; high: number }): string => `${eur(p.low)}–${p.high}`;

export const zammad: Competitor = {
  slug: 'zammad',
  name: 'Zammad',
  currency: 'EUR',
  readOn: '2026-10-16',
  sources: {
    pricing: { label: 'Zammad pricing', link: 'zammad.com/en/pricing', url: 'https://zammad.com/en/pricing' },
    migration: { label: 'Freshdesk migration', link: 'docs.zammad.org migration/freshdesk', url: 'https://docs.zammad.org/en/latest/migration/freshdesk.html' },
    migrationOverview: { label: 'Migration overview', link: 'docs.zammad.org migration', url: 'https://docs.zammad.org/en/latest/migration/index.html' },
    requirements: { label: 'Software requirements', link: 'docs.zammad.org prerequisites', url: 'https://docs.zammad.org/en/latest/prerequisites/software.html' },
    license: { label: 'Licence', link: 'github.com/zammad/zammad', url: 'https://github.com/zammad/zammad' },
  },
  facts: {
    plans: {
      source: 'pricing',
      text: `Starter ${range(price.starter)} (max ${price.starter.maxAgents} agents), Professional ${range(price.professional)} (max ${price.professional.maxAgents}), Plus ${range(price.plus)} (unlimited) per agent per month`,
    },
    ai: { source: 'pricing', text: `Optional on Professional and Plus, ${eur(price.aiCall)} per AI call` },
    free: { source: 'pricing', text: `Free; paid support from ${eur(price.supportPerYear)} per year` },
    license: { source: 'license', text: 'AGPL-3.0' },
    stack: { source: 'requirements', text: 'a Ruby on Rails application that runs on PostgreSQL, with Elasticsearch strongly recommended' },
    migrationStatus: { source: 'migration', text: 'Released, self-serve wizard or console' },
    migrationImports: { source: 'migration', text: 'Groups, organizations, users, tickets' },
    migrationExisting: { source: 'migrationOverview', text: 'No: "Migrations are only possible on new instances"' },
    migrationCatchUp: { source: 'migrationOverview', text: 'No: "Differential migrations are not supported"' },
    migrationProof: { source: 'migration', text: 'Not described' },
    migrationDoneForYou: { source: 'pricing', text: 'Paid migration workshop, price on request' },
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
    ai_agent: 'unread',
    price_model: { has: 'no', text: 'per agent, AI per call on top', source: 'pricing' },
    full_export: 'unread',
    self_host: { has: 'yes', text: 'AGPL-3.0, self-host free', source: 'license' },
  },
};
