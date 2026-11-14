// HubSpot Service Hub, as read from HubSpot's product catalog, product page and knowledge base.
import { usd, type Competitor } from '../../lib/competitor.ts';

/** USD per seat per month. */
export const price = { starterCore: 20, professional: 100, enterprise: 150 };
/** HubSpot Credits per resolved text conversation, and the pay-as-you-go price of one credit. */
export const credits = { perResolution: 50, price: 0.01, priceShown: '$0.010' };
export const perResolution = credits.perResolution * credits.price;
export const exportLimits = { linkDays: 30, perDay: 300, atOnce: 'three' };

export const hubspotServiceHub: Competitor = {
  slug: 'hubspot-service-hub',
  name: 'HubSpot Service Hub',
  currency: 'USD',
  readOn: '2026-10-16',
  sources: {
    product: { label: 'Service Hub product page', link: 'hubspot.com/products/service', url: 'https://www.hubspot.com/products/service' },
    catalog: { label: 'Product and services catalog', link: 'legal.hubspot.com', url: 'https://legal.hubspot.com/hubspot-product-and-services-catalog' },
    export: { label: 'Export records', link: 'knowledge.hubspot.com', url: 'https://knowledge.hubspot.com/import-and-export/export-records' },
  },
  facts: {
    plans: {
      source: 'catalog',
      text: `Free; Starter Core seat ${usd(price.starterCore)} (new-customer discounts advertised); Professional Service seat ${usd(price.professional)}; Enterprise Service seat ${usd(price.enterprise)} per month`,
    },
    ai: { source: 'catalog', text: `Professional and up; ${credits.perResolution} HubSpot Credits per resolved conversation, extra credits ${credits.priceShown} each` },
    free: { source: 'product', text: 'Free plan, no card' },
    license: { source: 'product', text: 'Proprietary' },
  },
  export: [
    { source: 'export', text: 'Tickets export from **CRM > Tickets** as **CSV, XLS or XLSX**; you need export permissions.' },
    { source: 'export', text: `Download links **expire after ${exportLimits.linkDays} days**.` },
    { source: 'export', text: `Up to **${exportLimits.perDay} exports in 24 hours**, ${exportLimits.atOnce} at a time; very large exports split into several files.` },
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
    ai_agent: { has: 'yes', text: `customer agent on Professional and up, about ${usd(perResolution)} per resolved conversation in credits`, source: 'catalog' },
    price_model: { has: 'no', text: 'per seat', source: 'catalog' },
    full_export: 'unread',
    self_host: { has: 'no', text: 'proprietary, cloud only', source: 'product' },
  },
};
