// FreeScout, as read from freescout.net and the FreeScout wiki.
import type { Competitor } from '../../lib/competitor.ts';

const php = '8.2+';

export const freescout: Competitor = {
  slug: 'freescout',
  name: 'FreeScout',
  currency: 'USD',
  readOn: '2026-10-16',
  sources: {
    home: { label: 'FreeScout', link: 'freescout.net', url: 'https://freescout.net' },
    modules: { label: 'Modules and licence terms', link: 'freescout.net/modules', url: 'https://freescout.net/modules/' },
    hosting: { label: 'Hosting options', link: 'FreeScout wiki, one-click installs', url: 'https://github.com/freescout-help-desk/freescout/wiki/One-Click-Installs' },
    migration: { label: 'Migration', link: 'FreeScout wiki, migrate to FreeScout', url: 'https://github.com/freescout-help-desk/freescout/wiki/Migrate-to-FreeScout' },
    community: { label: 'Community modules', link: 'FreeScout wiki, community modules', url: 'https://github.com/freescout-help-desk/freescout/wiki/Community-Modules' },
    requirements: { label: 'Requirements', link: 'FreeScout installation guide', url: 'https://github.com/freescout-help-desk/freescout/wiki/Installation-Guide' },
  },
  facts: {
    license: { source: 'home', text: 'AGPL-3.0' },
    plans: { source: 'modules', text: 'Free core, unlimited agents; paid modules with lifetime licences per instance' },
    free: { source: 'modules', text: 'Free core, unlimited agents; paid modules with lifetime licences per instance' },
    hosting: { source: 'hosting', text: 'None; the FreeScout wiki lists third-party hosts' },
    stack: { source: 'requirements', text: `PHP ${php} (Laravel) with MySQL, MariaDB or PostgreSQL; runs on shared hosting` },
    modules: { source: 'modules', text: 'Paid modules' },
    ai: { source: 'modules', text: 'Free AI Integration module' },
    importer: { source: 'migration', text: 'No official one. Third-party paid service, or a community module "not guaranteed" by the FreeScout team' },
    importAttachments: { source: 'migration', text: 'Depends on the tool' },
    importProof: { source: 'migration', text: 'Not described' },
    importDoneForYou: { source: 'migration', text: 'Through the third-party service, priced by them' },
  },
  export: [],
  features: {
    shared_inbox: 'unread',
    email_channel: 'unread',
    live_chat: { has: 'partial', text: 'paid module', source: 'modules' },
    channels: 'unread',
    automations: { has: 'partial', text: 'workflows as a paid module', source: 'modules' },
    sla: 'unread',
    reports: 'unread',
    kb_help_center: { has: 'partial', text: 'paid module', source: 'modules' },
    app_marketplace: 'unread',
    ai_drafts: 'unread',
    ai_agent: 'unread',
    price_model: { has: 'yes', text: 'free core with unlimited agents; modules bought once per instance', source: 'modules' },
    full_export: 'unread',
    self_host: { has: 'yes', text: 'AGPL-3.0, self-host only', source: 'home' },
  },
};
