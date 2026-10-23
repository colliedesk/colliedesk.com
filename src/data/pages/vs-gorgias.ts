const PRICES_READ = '16 October 2026';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { collieFacts as c, statusTable } from './collie-status';
import { AI_EXTRA } from '../../lib/site';

const faq: Faq[] = [
  {
    q: 'How does Gorgias charge?',
    a: `By ticket volume, not by agent. On the Gorgias pricing page read on ${PRICES_READ}, the helpdesk is $50 per month for 300 tickets, $300 for 2,000 and $750 for 5,000, billed annually ($60, $360 and $900 billed monthly). Adding AI Agent raises those plans to $77, $471 and $1,227 per month billed annually.`,
  },
  {
    q: 'Is Gorgias or Colliedesk better for an online store?',
    a: 'Gorgias, if your support lives inside Shopify, BigCommerce or WooCommerce and you want order actions in the inbox today. Colliedesk has no store integrations yet; it is a general helpdesk with a flat price.',
  },
  {
    q: 'What does Colliedesk cost at 2,000 tickets a month?',
    a: 'The same flat price at any ticket volume: Team is $69 per workspace per month for up to 10 agents (Small $39 for up to 3). Every Colliedesk Cloud plan has unlimited conversations; AI reply drafts and triage are included with a monthly allowance, or use your own key.',
  },
];

const body = `## The short answer

- **Choose Gorgias** if you run an e-commerce store and want store and order data next to every ticket, with order management automation. That is what it is built for.
- **Choose Colliedesk** if your ticket volume is growing and you do not want the bill to grow with it, or you are not an e-commerce team. Colliedesk is alpha; read the status table first.

## Price, side by side

Gorgias prices are per month for the whole account, by tickets included, read on ${PRICES_READ}.

| | Gorgias | Colliedesk |
|---|---|---|
| Plans (billed annually) | Basic $50 (300 tickets), Pro $300 (2,000), Advanced $750 (5,000); Starter $10 (50 tickets, monthly only) | ${c.price} |
| Billed monthly | Basic $60, Pro $360, Advanced $900 | Team $69 per month for up to 10 agents, or $690 per year |
| AI | AI Agent adds $27, $171 or $477 per month on Basic, Pro and Advanced (billed annually), with 30, 190 or 530 automated interactions | ${c.ai} |
| Free option | 7-day trial | ${c.free} |
| Source code | Proprietary | ${c.source} |

### What a growing store pays

| Tickets per month | Gorgias with AI Agent (annual) | Colliedesk Cloud |
|---|---|---|
| 300 | Basic: **$77 per month** | $69 per month (Team) + ${AI_EXTRA} |
| 2,000 | Pro: **$471 per month** | $69 per month (Team) + ${AI_EXTRA} |
| 5,000 | Advanced: **$1,227 per month** | $69 per month (Team) + ${AI_EXTRA} |

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

- Gorgias pricing: [gorgias.com/pricing](https://www.gorgias.com/pricing)`;

const page: Page = {
  jsonLd: [],
  path: '/vs/gorgias',
  updated: '2026-10-16',
  section: 'Compare',
  title: 'Colliedesk vs Gorgias: flat $69 per workspace vs pricing by ticket volume',
  description:
    'Colliedesk vs Gorgias: Gorgias $50–750 per month by tickets, plus AI Agent, vs Colliedesk at one flat price per workspace (Team $69 for up to 10 agents) with unlimited conversations. Sourced prices and honest status.',
  summary: 'Gorgias $50–750 per month by ticket volume, $77–1,227 with AI Agent vs Colliedesk Team at a flat $69 with unlimited conversations',
  eyebrow: 'Compare · Gorgias alternative',
  h1: 'Colliedesk vs Gorgias',
  lede: 'Gorgias is a helpdesk for online stores, priced by how many tickets you get. Colliedesk is a general helpdesk with one flat price. Here are the numbers, with sources.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
