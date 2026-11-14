import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { exportMd, factText, readOnLabel, sourcesMd, usd } from '../../lib/competitor';
import { collieFacts as c, statusTable } from './collie-status';
import { AI_EXTRA, dollars, SMALL, TEAM } from '../../lib/site';
import { OURS } from '../competitors/colliedesk';
import { exportAckHours, front as f, price } from '../competitors/front';
import { FOUNDING_ACTION, OUR_CELL, OUR_PLAN, OUR_PRICE, foundingFirst, withFoundingLead } from '../../lib/cloud-price';

const PRICES_READ = readOnLabel(f.readOn);
const FIVE = 5;

const faq: Faq[] = [
  {
    q: 'What is a good Front alternative that is not priced per seat?',
    a: `${foundingFirst(`Colliedesk Cloud is one flat price per workspace: Team is ${dollars(TEAM.monthly)} a month for up to ${TEAM.agents} agents, Small ${dollars(SMALL.monthly)} for up to ${SMALL.agents}.`)} Self-hosting is free. Colliedesk is an open-source (${OURS.license}) shared inbox and helpdesk. It is generally available, and the email channel works today.`,
  },
  {
    q: 'How does Front charge for AI?',
    a: `On the Front pricing page read on ${PRICES_READ}: Copilot is ${usd(price.copilot)} per seat per month as an add-on on Starter and Professional, and included on Enterprise. Autopilot starts at ${usd(price.autopilot)} per conversation.`,
  },
  {
    q: 'Can I export my conversations from Front?',
    a: `Not by yourself. A company admin asks Front Support for an account data export. It covers shared inboxes only, and leaves out contacts, message templates, tags and individual inboxes. Front acknowledges the request within ${exportAckHours} hours.`,
  },
  {
    q: 'Does Colliedesk import from Front?',
    a: 'Not yet. Colliedesk imports from Freshdesk and Help Scout today. Tell us on GitHub if you need a Front importer; requests decide the order.',
  },
];

const body = `## The short answer

- **Choose Front** if your team lives in email across many shared and personal inboxes, wants a Gmail-like workspace with comments on every thread, and needs many channels today. It is a mature product.
- **Choose Colliedesk** if you want a shared inbox whose price does not grow with every seat, and data you can export or self-host without asking anyone. Colliedesk is generally available; read the status table for what is not built yet.

## Price, side by side

Front prices below are from the Front pricing page, per seat per month billed annually, read on ${PRICES_READ}. The page does not list monthly-billing prices.

| Topic | Front | Colliedesk |
|---|---|---|
| Plans | ${f.facts.plans.text} | ${c.price} |
| AI drafting | ${f.facts.ai.text} | ${c.ai} |
| AI agent | ${factText(f, 'aiAgent')} | Auto-answer with a human in the loop, same AI pricing (not built yet) |
| Free option | ${f.facts.free.text} | ${c.free} |
| Source code | ${f.facts.license.text} | ${c.source} |

### What five agents pay

| Team | Front Professional + Copilot (annual) | Colliedesk Cloud |
|---|---|---|
| ${FIVE} agents | ${FIVE} × (${usd(price.professional)} + ${usd(price.copilot)}) = **${usd(FIVE * (price.professional + price.copilot))} per month** | ${OUR_CELL} + ${AI_EXTRA} |

## Leaving: what Front gives you

${exportMd(f)}

${c.export}

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

${sourcesMd(f)}`;

const page: Page = {
  jsonLd: [],
  path: '/vs/front',
  updated: '2026-10-15',
  section: 'Compare',
  title: 'Colliedesk vs Front: an open-source Front alternative with flat pricing',
  description:
    `Colliedesk vs Front for small support teams: per-seat plans and a ${usd(price.copilot)} Copilot add-on vs one flat workspace price. Sourced prices, export limits and honest status.`,
  summary: `Front ${usd(price.starter)}–${price.enterprise} per seat plus ${usd(price.copilot)} Copilot vs Colliedesk ${OUR_PLAN} at a flat ${OUR_PRICE} per workspace; export only through Front Support`,
  eyebrow: 'Compare · Front alternative',
  h1: 'Colliedesk vs Front',
  lede: withFoundingLead('Front is a polished shared inbox. For a team of five, the seat count and the AI add-on decide the bill. Here are the numbers, with sources.'),
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
