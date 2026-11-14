import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { andList, factText, num, readOnLabel, sourcesMd, usd } from '../../lib/competitor';
import { collieFacts as c, statusTable } from './collie-status';
import { AI_EXTRA, dollars, SMALL, TEAM } from '../../lib/site';
import { OURS } from '../competitors/colliedesk';
import { gorgias as g, tiers, withAi } from '../competitors/gorgias';
import { FOUNDING_ACTION, FOUNDING_OPEN, OUR_CELL, OUR_PLAN, OUR_PRICE, foundingFirst, withFoundingLead } from '../../lib/cloud-price';

const PRICES_READ = readOnLabel(g.readOn);
const [basic, pro, advanced] = tiers;
const amounts = (pick: (t: (typeof tiers)[number]) => number): string => andList(tiers.map((t) => usd(pick(t))));
const lowest = basic?.annual ?? 0;
const highest = advanced?.annual ?? 0;

const faq: Faq[] = [
  {
    q: 'How does Gorgias charge?',
    a: `By ticket volume, not by agent. On the Gorgias pricing page read on ${PRICES_READ}, the helpdesk is ${andList(tiers.map((t) => `${usd(t.annual)}${t === basic ? ' per month' : ''} for ${num(t.tickets)}${t === basic ? ' tickets' : ''}`))}, billed annually (${amounts((t) => t.monthly)} billed monthly). Adding AI Agent raises those plans to ${amounts(withAi)} per month billed annually.`,
  },
  {
    q: 'Is Gorgias or Colliedesk better for an online store?',
    a: 'Gorgias, if your support lives inside Shopify, BigCommerce or WooCommerce and you want order actions in the inbox today. Colliedesk has no store integrations yet; it is a general helpdesk with a flat price.',
  },
  {
    q: `What does Colliedesk cost at ${num(pro?.tickets ?? 0)} tickets a month?`,
    a: `The same flat price at any ticket volume. ${foundingFirst(`Team is ${dollars(TEAM.monthly)} per workspace per month for up to ${TEAM.agents} agents (Small ${dollars(SMALL.monthly)} for up to ${SMALL.agents}).`)} Every Colliedesk Cloud plan has unlimited conversations; AI reply drafts and triage are included with a monthly allowance, or use your own key.`,
  },
];

const body = `## The short answer

- **Choose Gorgias** if you run an e-commerce store and want store and order data next to every ticket, with order management automation. That is what it is built for.
- **Choose Colliedesk** if your ticket volume is growing and you do not want the bill to grow with it, or you are not an e-commerce team. Colliedesk is generally available; read the status table for what is not built yet.

## Price, side by side

Gorgias prices are per month for the whole account, by tickets included, read on ${PRICES_READ}.

| Topic | Gorgias | Colliedesk |
|---|---|---|
| Plans (billed annually) | ${g.facts.plans.text} | ${c.price} |
| Billed monthly | ${factText(g, 'monthly')} | ${FOUNDING_OPEN ? `Founding ${OURS.foundingPrice} for up to ${OURS.foundingAgents} agents; after the ${OURS.foundingPlaces} Founding places, ` : ''}Team ${dollars(TEAM.monthly)} per month for up to ${TEAM.agents} agents, or ${dollars(TEAM.yearly)} per year |
| AI | ${g.facts.ai.text} | ${c.ai} |
| Free option | ${g.facts.free.text} | ${c.free} |
| Source code | ${g.facts.license.text} | ${c.source} |

### What a growing store pays

| Tickets per month | Gorgias with AI Agent (annual) | Colliedesk Cloud |
|---|---|---|
${tiers.map((t) => `| ${num(t.tickets)} | ${t.name}: **${usd(withAi(t))} per month** | ${OUR_CELL} + ${AI_EXTRA} |`).join('\n')}

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

${sourcesMd(g)}`;

const page: Page = {
  jsonLd: [],
  path: '/vs/gorgias',
  updated: '2026-10-16',
  section: 'Compare',
  title: `Colliedesk vs Gorgias: flat ${OUR_PRICE} per workspace vs pricing by ticket volume`,
  description:
    `Colliedesk vs Gorgias: Gorgias ${usd(lowest)}–${highest} per month by tickets, plus AI Agent, vs Colliedesk at one flat price per workspace (${OUR_PLAN} ${OUR_PRICE} for up to ${TEAM.agents} agents) with unlimited conversations. Sourced prices and honest status.`,
  summary: `Gorgias ${usd(lowest)}–${highest} per month by ticket volume, ${usd(basic ? withAi(basic) : 0)}–${num(advanced ? withAi(advanced) : 0)} with AI Agent vs Colliedesk ${OUR_PLAN} at a flat ${OUR_PRICE} with unlimited conversations`,
  eyebrow: 'Compare · Gorgias alternative',
  h1: 'Colliedesk vs Gorgias',
  lede: withFoundingLead('Gorgias is a helpdesk for online stores, priced by how many tickets you get. Colliedesk is a general helpdesk with one flat price. Here are the numbers, with sources.'),
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
