const PRICES_READ = '16 October 2026';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { collieFacts as c, statusTable } from './collie-status';

const faq: Faq[] = [
  {
    q: 'How much is HubSpot Service Hub for 5 agents?',
    a: `From HubSpot's product catalog read on ${PRICES_READ}: a Professional Service seat is $100 per month, so 5 agents pay $500 per month. Starter uses Core seats at $20 per seat per month: $100 for 5, before any new-customer discount.`,
  },
  {
    q: 'How does HubSpot charge for its AI customer agent?',
    a: 'In HubSpot Credits. Resolving one text conversation uses 50 credits; extra credits are $0.010 each pay-as-you-go, so about $0.50 per resolved conversation beyond the credits in your plan.',
  },
  {
    q: 'Can I export tickets from HubSpot?',
    a: 'Yes, as CSV, XLS or XLSX from CRM > Tickets, with export permissions. Download links expire after 30 days.',
  },
];

const body = `## The short answer

- **Choose HubSpot Service Hub** if your sales and marketing already run on HubSpot and you want tickets on the same contact records.
- **Choose Colliedesk** if you need a helpdesk, not a CRM suite, and want one flat price with AI at cost. Colliedesk is alpha; read the status table first.

## Price, side by side

HubSpot prices are in USD per seat per month, from the HubSpot product and services catalog and the Service Hub product page, read on ${PRICES_READ}.

| | HubSpot Service Hub | Colliedesk |
|---|---|---|
| Plans | Free; Starter Core seat $20 (new-customer discounts advertised); Professional Service seat $100; Enterprise Service seat $150 per month | ${c.price} |
| AI customer agent | Professional and up; 50 HubSpot Credits per resolved conversation, extra credits $0.010 each | ${c.ai} |
| Free option | Free plan, no card | ${c.free} |
| Source code | Proprietary | ${c.source} |

### What five agents pay

| Team | HubSpot Service Hub Professional | Colliedesk Cloud |
|---|---|---|
| 5 agents | 5 × $100 = **$500 per month** + credits beyond the plan | $49 per month + AI usage |
| 10 agents | 10 × $100 = **$1,000 per month** + credits beyond the plan | $49 per month + AI usage |

## Leaving: what HubSpot gives you

- Tickets export from **CRM > Tickets** as **CSV, XLS or XLSX**; you need export permissions.
- Download links **expire after 30 days**.
- Up to **300 exports in 24 hours**, three at a time; very large exports split into several files.

${c.export}

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

- Service Hub product page: [hubspot.com/products/service](https://www.hubspot.com/products/service)
- Product and services catalog: [legal.hubspot.com](https://legal.hubspot.com/hubspot-product-and-services-catalog)
- Export records: [knowledge.hubspot.com](https://knowledge.hubspot.com/import-and-export/export-records)`;

const page: Page = {
  jsonLd: [],
  path: '/vs/hubspot-service-hub',
  updated: '2026-10-16',
  section: 'Compare',
  title: 'Colliedesk vs HubSpot Service Hub: $49 flat vs per seat',
  description:
    'HubSpot Service Hub costs $20–150 per seat with AI on credits. Colliedesk is a flat $49 per workspace with AI at cost. Sourced prices, export limits.',
  summary: 'HubSpot Service Hub $20–150 per seat, AI customer agent on credits (~$0.50 per resolution) vs Colliedesk flat $49 per workspace',
  eyebrow: 'Compare · HubSpot Service Hub alternative',
  h1: 'Colliedesk vs HubSpot Service Hub',
  lede: 'HubSpot Service Hub puts tickets inside a CRM suite and prices by seat. Colliedesk is a helpdesk with one flat price. Here are the numbers, with sources.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
