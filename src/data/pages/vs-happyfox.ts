const PRICES_READ = '16 October 2026';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { collieFacts as c, statusTable } from './collie-status';
import { AI_EXTRA } from '../../lib/site';

const faq: Faq[] = [
  {
    q: 'How much is HappyFox for 5 agents?',
    a: `On the HappyFox pricing page read on ${PRICES_READ}: Basic is $24 per agent per month billed annually ($29 monthly) and caps at 5 agents, so 5 agents pay $120 per month. Team is $49 ($69 monthly): $245 per month for 5 agents.`,
  },
  {
    q: 'Is AI included in HappyFox?',
    a: 'No. HappyFox sells its AI as separate products with their own pricing. Its Autopilot page says "as low as 2¢ per successful action".',
  },
];

const body = `## The short answer

- **Choose HappyFox** if you need a mature, established helpdesk today and the per-agent price fits your budget.
- **Choose Colliedesk** if you have 3 to 10 agents and want one flat price with AI drafts included. Colliedesk is alpha; read the status table first.

## Price, side by side

HappyFox prices are per agent per month, read on ${PRICES_READ}.

| | HappyFox | Colliedesk |
|---|---|---|
| Plans (billed annually) | Basic $24 (max 5 agents), Team $49, Pro $99 per agent per month; Enterprise Pro on request | ${c.price} |
| Billed monthly | Basic $29, Team $69, Pro $119 | Colliedesk Team $69 per month for up to 10 agents, or $690 per year |
| AI | Separate products with their own pricing; Autopilot from 2¢ per successful action | ${c.ai} |
| Free option | 14-day trial, no card | ${c.free} |
| Source code | Proprietary | ${c.source} |

### What a team pays

| Team | HappyFox (annual) | Colliedesk Cloud |
|---|---|---|
| 5 agents | Basic: 5 × $24 = **$120 per month** | $69 per month (Team) + ${AI_EXTRA} |
| 6 agents | Team (Basic caps at 5): 6 × $49 = **$294 per month** | $69 per month (Team) + ${AI_EXTRA} |
| 10 agents | Team: 10 × $49 = **$490 per month** | $69 per month (Team) + ${AI_EXTRA} |

AI is extra on HappyFox.

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

- HappyFox pricing: [happyfox.com/help-desk-price](https://www.happyfox.com/help-desk-price/)
- HappyFox Autopilot: [happyfox.com/autopilot](https://www.happyfox.com/autopilot/)`;

const page: Page = {
  jsonLd: [],
  path: '/vs/happyfox',
  updated: '2026-10-16',
  section: 'Compare',
  title: 'Colliedesk vs HappyFox: flat $69 for up to 10 agents vs $24–99 per agent',
  description:
    'Colliedesk vs HappyFox: HappyFox $24–99 per agent with AI sold separately vs Colliedesk at one flat price per workspace (Team $69 for up to 10 agents) with AI drafts included. Sourced prices and honest status.',
  summary: 'HappyFox $24–99 per agent (Basic capped at 5), AI sold separately vs Colliedesk Team at a flat $69 per workspace',
  eyebrow: 'Compare · HappyFox alternative',
  h1: 'Colliedesk vs HappyFox',
  lede: 'HappyFox is a mature helpdesk priced per agent, with AI sold on top. Past five agents its cheapest plan stops. Here are the numbers, with sources.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
