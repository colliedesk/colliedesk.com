import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { exportMd, readOnLabel, sourcesMd, usd } from '../../lib/competitor';
import { collieFacts as c, statusTable } from './collie-status';
import { dollars, SOLO, TEAM } from '../../lib/site';
import { creditCost, exportHours, groove as g, price } from '../competitors/groove';
import { FOUNDING_ACTION, FOUNDING_OPEN, OUR_PLAN, OUR_PRICE, withFoundingLead } from '../../lib/cloud-price';

const PRICES_READ = readOnLabel(g.readOn);
const from = usd(price.from);

const faq: Faq[] = [
  {
    q: 'What happened to Groove?',
    a: `Groove is now Helply. On ${PRICES_READ}, groovehq.com redirected to helply.com, whose about page says "Groove is now Helply, rebuilt around AI agents."`,
  },
  {
    q: 'How does Helply charge?',
    a: `By AI credits, not by user. Plans start at ${from} per month for a block of credits, with no per-user fees and ${price.annualDiscount}% off annual billing. A simple AI action such as a draft uses ${creditCost.draft} credit; harder ones use ${creditCost.harder.join(' or ')}.`,
  },
  {
    q: 'How do I export my Groove conversations?',
    a: `The account owner or an admin downloads them from Settings > Company > More > Exports. Groove's help says the export is JSON only, with no CSV, one export at a time, and large exports can take up to ${exportHours} hours.`,
  },
];

const body = `## The short answer

- **Choose Helply** (formerly Groove) if you want AI agents to answer most tickets and you are happy to pay by AI usage.
- **Choose Colliedesk** if you want a classic shared inbox and helpdesk with a flat price, where AI drafts (off until an admin turns them on) and a human decides, and your data in an open database. Colliedesk is generally available; read the status table for what is not built yet.

## Price, side by side

Read on ${PRICES_READ}.

| Topic | Helply (formerly Groove) | Colliedesk |
|---|---|---|
| Plans | ${g.facts.plans.text} | ${c.price} |
| AI | ${g.facts.ai.text} | ${c.ai} |
| Free option | ${g.facts.free.text} | ${c.free} |
| Source code | ${g.facts.license.text} | ${c.source} |

Helply's ${from} is a credit budget for AI work. Colliedesk ${OUR_PLAN} at ${OUR_PRICE} is the helpdesk for up to ${TEAM.agents} agents${FOUNDING_OPEN ? '' : ` (Solo is ${dollars(SOLO.monthly)} for one)`}, with AI reply drafts and triage included (monthly allowance) or on your own key.

## Leaving: what Groove gives you

${exportMd(g)}

${c.export}

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

${sourcesMd(g)}`;

const page: Page = {
  jsonLd: [],
  path: '/vs/groove',
  updated: '2026-10-16',
  section: 'Compare',
  title: 'Colliedesk vs Groove (now Helply): a flat-price helpdesk vs AI credits',
  description:
    `Groove is now Helply, priced by AI credits from ${from} per month. Colliedesk is an open-source helpdesk at one flat price per workspace (${OUR_PLAN} ${OUR_PRICE} for up to ${TEAM.agents} agents) with AI drafts included. Export limits and honest status.`,
  summary: `Groove is now Helply: AI credits from ${from} per month, JSON-only export vs Colliedesk ${OUR_PLAN}, a flat ${OUR_PRICE} per workspace helpdesk`,
  eyebrow: 'Compare · Groove alternative',
  h1: 'Colliedesk vs Groove (now Helply)',
  lede: withFoundingLead('Groove became Helply and rebuilt itself around AI agents priced by credits. If you chose Groove for a simple shared inbox, here is the difference, with sources.'),
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
