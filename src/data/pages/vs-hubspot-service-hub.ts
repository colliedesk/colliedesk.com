import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { exportMd, readOnLabel, sourcesMd, usd } from '../../lib/competitor';
import { collieFacts as c, statusTable } from './collie-status';
import { AI_EXTRA, TEAM } from '../../lib/site';
import { credits, exportLimits, hubspotServiceHub as hs, perResolution, price } from '../competitors/hubspot-service-hub';
import { FOUNDING_ACTION, OUR_CELL, OUR_PLAN, OUR_PRICE, withFoundingLead } from '../../lib/cloud-price';

const PRICES_READ = readOnLabel(hs.readOn);
const [FIVE, TEN] = [5, 10];
const perSeatRange = `${usd(price.starterCore)}–${price.enterprise}`;

const faq: Faq[] = [
  {
    q: `How much is HubSpot Service Hub for ${FIVE} agents?`,
    a: `From HubSpot's product catalog read on ${PRICES_READ}: a Professional Service seat is ${usd(price.professional)} per month, so ${FIVE} agents pay ${usd(FIVE * price.professional)} per month. Starter uses Core seats at ${usd(price.starterCore)} per seat per month: ${usd(FIVE * price.starterCore)} for ${FIVE}, before any new-customer discount.`,
  },
  {
    q: 'How does HubSpot charge for its AI customer agent?',
    a: `In HubSpot Credits. Resolving one text conversation uses ${credits.perResolution} credits; extra credits are ${credits.priceShown} each pay-as-you-go, so about ${usd(perResolution)} per resolved conversation beyond the credits in your plan.`,
  },
  {
    q: 'Can I export tickets from HubSpot?',
    a: `Yes, as CSV, XLS or XLSX from CRM > Tickets, with export permissions. Download links expire after ${exportLimits.linkDays} days.`,
  },
];

const body = `## The short answer

- **Choose HubSpot Service Hub** if your sales and marketing already run on HubSpot and you want tickets on the same contact records.
- **Choose Colliedesk** if you need a helpdesk, not a CRM suite, and want one flat price with AI drafts included. Colliedesk is generally available; read the status table for what is not built yet.

## Price, side by side

HubSpot prices are in USD per seat per month, from the HubSpot product and services catalog and the Service Hub product page, read on ${PRICES_READ}.

| Topic | HubSpot Service Hub | Colliedesk |
|---|---|---|
| Plans | ${hs.facts.plans.text} | ${c.price} |
| AI customer agent | ${hs.facts.ai.text} | ${c.ai} |
| Free option | ${hs.facts.free.text} | ${c.free} |
| Source code | ${hs.facts.license.text} | ${c.source} |

### What five agents pay

| Team | HubSpot Service Hub Professional | Colliedesk Cloud |
|---|---|---|
${[FIVE, TEN].map((n) => `| ${n} agents | ${n} × ${usd(price.professional)} = **${usd(n * price.professional)} per month** + credits beyond the plan | ${OUR_CELL} + ${AI_EXTRA} |`).join('\n')}

## Leaving: what HubSpot gives you

${exportMd(hs)}

${c.export}

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

${sourcesMd(hs)}`;

const page: Page = {
  jsonLd: [],
  path: '/vs/hubspot-service-hub',
  updated: '2026-10-16',
  section: 'Compare',
  title: `Colliedesk vs HubSpot Service Hub: a helpdesk at ${OUR_PRICE} flat for up to ${TEAM.agents} agents vs ${usd(price.professional)} per seat`,
  description:
    `Colliedesk vs HubSpot Service Hub: HubSpot ${perSeatRange} per seat with AI on credits vs Colliedesk at one flat price per workspace (${OUR_PLAN} ${OUR_PRICE} for up to ${TEAM.agents} agents) with AI drafts included. Sourced prices and export limits.`,
  summary: `HubSpot Service Hub ${perSeatRange} per seat, AI customer agent on credits (~${usd(perResolution)} per resolution) vs Colliedesk ${OUR_PLAN} at a flat ${OUR_PRICE} per workspace`,
  eyebrow: 'Compare · HubSpot Service Hub alternative',
  h1: 'Colliedesk vs HubSpot Service Hub',
  lede: withFoundingLead('HubSpot Service Hub puts tickets inside a CRM suite and prices by seat. Colliedesk is a helpdesk with one flat price. Here are the numbers, with sources.'),
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
