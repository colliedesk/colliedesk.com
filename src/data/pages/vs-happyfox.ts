import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { factText, readOnLabel, sourcesMd, usd } from '../../lib/competitor';
import { collieFacts as c, statusTable } from './collie-status';
import { AI_EXTRA, dollars, FOUNDING_AGENTS, TEAM } from '../../lib/site';
import { OURS } from '../competitors/colliedesk';
import { basicMaxAgents, happyfox as h, price } from '../competitors/happyfox';
import { FOUNDING_ACTION, FOUNDING_OPEN, OUR_CELL, OUR_PLAN, OUR_PRICE, withFoundingLead } from '../../lib/cloud-price';

const PRICES_READ = readOnLabel(h.readOn);
const [FIVE, TEN] = [5, 10];
const perAgentRange = `${usd(price.basic.annual)}–${price.pro.annual}`;

const faq: Faq[] = [
  {
    q: `How much is HappyFox for ${FIVE} agents?`,
    a: `On the HappyFox pricing page read on ${PRICES_READ}: Basic is ${usd(price.basic.annual)} per agent per month billed annually (${usd(price.basic.monthly)} monthly) and caps at ${basicMaxAgents} agents, so ${FIVE} agents pay ${usd(FIVE * price.basic.annual)} per month. Team is ${usd(price.team.annual)} (${usd(price.team.monthly)} monthly): ${usd(FIVE * price.team.annual)} per month for ${FIVE} agents.`,
  },
  {
    q: 'Is AI included in HappyFox?',
    a: `No. HappyFox sells its AI as separate products with their own pricing. Its Autopilot page says ${factText(h, 'autopilotQuote')}.`,
  },
];

const body = `## The short answer

- **Choose HappyFox** if you need a mature, established helpdesk today and the per-agent price fits your budget.
- **Choose Colliedesk** if you have ${FOUNDING_AGENTS} agents and want one flat price with AI drafts included. Colliedesk is generally available; read the status table for what is not built yet.

## Price, side by side

HappyFox prices are per agent per month, read on ${PRICES_READ}.

| Topic | HappyFox | Colliedesk |
|---|---|---|
| Plans (billed annually) | ${h.facts.plans.text} | ${c.price} |
| Billed monthly | ${factText(h, 'monthly')} | ${FOUNDING_OPEN ? `Colliedesk Founding ${OURS.foundingPrice} for up to ${OURS.foundingAgents} agents; after the ${OURS.foundingPlaces} Founding places, ` : ''}Colliedesk Team ${dollars(TEAM.monthly)} per month for up to ${TEAM.agents} agents, or ${dollars(TEAM.yearly)} per year |
| AI | ${h.facts.ai.text} | ${c.ai} |
| Free option | ${h.facts.free.text} | ${c.free} |
| Source code | ${h.facts.license.text} | ${c.source} |

### What a team pays

| Team | HappyFox (annual) | Colliedesk Cloud |
|---|---|---|
| ${FIVE} agents | Basic: ${FIVE} × ${usd(price.basic.annual)} = **${usd(FIVE * price.basic.annual)} per month** | ${OUR_CELL} + ${AI_EXTRA} |
| ${basicMaxAgents + 1} agents | Team (Basic caps at ${basicMaxAgents}): ${basicMaxAgents + 1} × ${usd(price.team.annual)} = **${usd((basicMaxAgents + 1) * price.team.annual)} per month** | ${OUR_CELL} + ${AI_EXTRA} |
| ${TEN} agents | Team: ${TEN} × ${usd(price.team.annual)} = **${usd(TEN * price.team.annual)} per month** | ${OUR_CELL} + ${AI_EXTRA} |

AI is extra on HappyFox.

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

${sourcesMd(h)}`;

const page: Page = {
  jsonLd: [],
  path: '/vs/happyfox',
  updated: '2026-10-16',
  section: 'Compare',
  title: `Colliedesk vs HappyFox: flat ${OUR_PRICE} for up to ${TEAM.agents} agents vs ${perAgentRange} per agent`,
  description:
    `Colliedesk vs HappyFox: HappyFox ${perAgentRange} per agent with AI sold separately vs Colliedesk at one flat price per workspace (${OUR_PLAN} ${OUR_PRICE} for up to ${TEAM.agents} agents) with AI drafts included. Sourced prices and honest status.`,
  summary: `HappyFox ${perAgentRange} per agent (Basic capped at ${basicMaxAgents}), AI sold separately vs Colliedesk ${OUR_PLAN} at a flat ${OUR_PRICE} per workspace`,
  eyebrow: 'Compare · HappyFox alternative',
  h1: 'Colliedesk vs HappyFox',
  lede: withFoundingLead('HappyFox is a mature helpdesk priced per agent, with AI sold on top. Past five agents its cheapest plan stops. Here are the numbers, with sources.'),
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
