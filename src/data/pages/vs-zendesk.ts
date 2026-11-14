import { AI_EXTRA, AI_RESOLUTION, dollars, TEAM, TEAM_25 } from '../../lib/site';
import { eur, eurCents, exportMd, readOnLabel, sourcesMd } from '../../lib/competitor';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { OURS } from '../competitors/colliedesk';
import { api, price, zendesk as z } from '../competitors/zendesk';
import { collieFacts as c, statusTable } from './collie-status';
import { FOUNDING_ACTION, OUR_CELL, OUR_PLAN, OUR_PRICE, foundingFirst, withFoundingLead } from '../../lib/cloud-price';

const PRICES_READ = readOnLabel(z.readOn);
const FIVE = 5;

const faq: Faq[] = [
  {
    q: 'Is there a Zendesk alternative that is not priced per agent?',
    a: `Yes. ${foundingFirst(`Colliedesk Cloud is one flat price per workspace: Team is ${dollars(TEAM.monthly)} a month for up to ${TEAM.agents} agents, ${TEAM_25.name} ${dollars(TEAM_25.monthly)} for up to ${TEAM_25.agents}.`)} Self-hosting is free. Colliedesk is open source (${OURS.license}) and generally available.`,
  },
  {
    q: 'How does Zendesk charge for AI?',
    a: `On the Zendesk pricing page read on ${PRICES_READ}: Copilot is ${eur(price.copilot)} per agent per month billed annually, and AI agents are billed per automated resolution, ${eurCents(price.resolutionCommitted)} committed or ${eurCents(price.resolutionPayg)} pay-as-you-go, with some resolutions included per agent.`,
  },
  {
    q: 'Can I export all my Zendesk tickets?',
    a: `Zendesk's native data export is off by default: the account owner must ask Zendesk Support to enable it, and it is not available on Team plans. The CSV format has no comments. The Incremental Export API returns full comments but is limited to ${api.perMinute} requests per minute. Step by step: [how to export tickets from Zendesk](/migrate/zendesk/export).`,
  },
  {
    q: 'Does Colliedesk import from Zendesk?',
    a: 'Not yet. Colliedesk imports from Freshdesk and Help Scout today. A Zendesk importer is on the roadmap for later.',
  },
];

const body = `## The short answer

- **Choose Zendesk** if you need the enterprise default: a huge app marketplace, many channels, and AI agents that are already in production.
- **Choose Colliedesk** if you are a small team where per-agent seats and per-resolution AI fees make up most of the bill, and you want an open-source helpdesk you can self-host or rent for a flat price. Colliedesk is generally available; read the status table for what is not built yet.

## Price, side by side

Zendesk prices below are from the Zendesk pricing page in euros (our request for zendesk.com/pricing was served the euro page), per agent per month, read on ${PRICES_READ}.

| Topic | Zendesk | Colliedesk |
|---|---|---|
| Plans (annual / monthly billing) | ${z.facts.plans.text} | ${c.price} |
| AI drafting | ${z.facts.ai.text} | ${c.ai} |
| AI agent | ${z.facts.aiAgent?.text} | Auto-answer with a human in the loop, ${AI_RESOLUTION} per resolution, only when no person is needed afterwards (not built yet) |
| Free option | ${z.facts.free.text} | ${c.free} |
| Source code | ${z.facts.license.text} | ${c.source} |

${z.facts.usThirdParty?.text}

### What five agents pay

| Team | Zendesk Suite Professional + Copilot (annual) | Colliedesk Cloud |
|---|---|---|
| ${FIVE} agents | ${FIVE} × (${eur(price.suitePro.annual)} + ${eur(price.copilot)}) = **${eur(FIVE * (price.suitePro.annual + price.copilot))} per month**, plus AI agent resolutions beyond the included amount | ${OUR_CELL} + ${AI_EXTRA} |

## Leaving: what Zendesk gives you

${exportMd(z)}

${c.export} A Zendesk importer is on the [roadmap](/roadmap) for later.

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

${sourcesMd(z)}`;

const page: Page = {
  jsonLd: [],
  path: '/vs/zendesk',
  section: 'Compare',
  title: 'Colliedesk vs Zendesk: a flat-priced, open-source Zendesk alternative',
  description:
    'Colliedesk vs Zendesk for small support teams: per-agent seats and per-resolution AI fees vs one flat workspace price. Sourced prices, export limits and honest status.',
  summary: `Zendesk per-agent seats, ${eur(price.copilot)} Copilot and per-resolution AI vs Colliedesk ${OUR_PLAN} at a flat ${OUR_PRICE} per workspace; export off by default`,
  eyebrow: 'Compare · Zendesk alternative',
  h1: 'Colliedesk vs Zendesk',
  lede: withFoundingLead('Zendesk is the enterprise default, and it earns that. For a team of five, the seat count and the AI meter decide the bill. Here are the numbers, with sources.'),
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
