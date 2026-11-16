// The feature dictionary every comparison uses: one key keeps one meaning on every /vs page. Each
// competitor file, and the Colliedesk side, gives a value for every key (scripts/vs-facts-gate.mjs).
export const FEATURES = {
  shared_inbox: { label: 'Shared inbox, Cc, private notes, saved replies', meaning: 'Several agents answer from one inbox, with Cc, private notes and saved replies.' },
  email_channel: { label: 'Email channel', meaning: 'Customers write by email and agents reply by email, in threads.' },
  live_chat: { label: 'Live chat', meaning: 'A chat widget on your own site whose chats land in the inbox.' },
  channels: { label: 'Channels beyond email (chat, phone, social)', meaning: 'Live chat, phone or social messaging next to email.' },
  automations: { label: 'Automations, macros and CSAT', meaning: 'Rules that act on tickets, one-click macros and satisfaction surveys.' },
  sla: { label: 'SLA and business hours', meaning: 'Response targets by priority, counted in business hours.' },
  reports: { label: 'Reports and dashboards', meaning: 'Built-in reports on volume and response times.' },
  kb_help_center: { label: 'Knowledge base and help center', meaning: 'Articles published on a public help center.' },
  app_marketplace: { label: 'App marketplace', meaning: 'A catalogue of third-party apps that plug into the helpdesk.' },
  ai_drafts: { label: 'AI reply drafts', meaning: 'AI writes a reply that an agent reads, edits and sends.' },
  ai_agent: { label: 'AI agent', meaning: 'AI answers a customer on its own, with no agent sending the reply.' },
  price_model: { label: 'Price as the team grows', meaning: 'Yes when one price covers the workspace; no when the bill grows with agents or ticket volume.' },
  full_export: { label: 'Full export with conversations', meaning: 'Every ticket with its whole conversation, taken out of the helpdesk.' },
  self_host: { label: 'Source code and self-hosting', meaning: 'The code is published and you can run it on your own server.' },
} as const satisfies Record<string, { label: string; meaning: string }>;

export type FeatureKey = keyof typeof FEATURES;
export const FEATURE_KEYS = Object.keys(FEATURES) as FeatureKey[];
