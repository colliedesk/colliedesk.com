const PRICES_READ = '15 November 2026';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { collieFacts as c, statusTable } from './collie-status';
import { FOUNDING_ACTION, FOUNDING_OPEN, OUR_PLAN, OUR_PRICE, withFoundingLead } from '../../lib/cloud-price';

const faq: Faq[] = [
  {
    q: 'What happened to Groove?',
    a: `Groove is now Helply. On ${PRICES_READ}, groovehq.com redirected to helply.com, whose about page says "Groove is now Helply, rebuilt around AI agents."`,
  },
  {
    q: 'How does Helply charge?',
    a: 'By plan, each with a cap on human agents and a monthly block of AI credits. Plans start at $99 per month billed yearly (Starter: up to 2 agents and 2,500 credits); paying yearly saves 15%. Summarizing a conversation uses 1 credit, drafting a reply 2, and resolving a conversation end to end 10.',
  },
  {
    q: 'How do I export my Groove conversations?',
    a: 'The account owner or an admin downloads them from Settings > Company > More > Exports. Groove\'s help says the export is JSON only, with no CSV, one export at a time, and large exports can take up to 72 hours.',
  },
];

const body = `## The short answer

- **Choose Helply** (formerly Groove) if you want AI agents to answer most tickets and you are happy to pay by AI usage.
- **Choose Colliedesk** if you want a classic shared inbox and helpdesk with a flat price, where AI drafts (off until an admin turns them on) and a human decides, and your data in an open database. Colliedesk is generally available; read the status table for what is not built yet.

## Price, side by side

Read on ${PRICES_READ}.

| Topic | Helply (formerly Groove) | Colliedesk |
|---|---|---|
| Plans | From $99 per month billed yearly (Starter: up to 2 agents, 2,500 AI credits); Plus is $199 for up to 5 agents; paying yearly saves 15% | ${c.price} |
| AI | Charged in credits: 1 for a summary, 2 for a reply draft, 10 to resolve a conversation end to end | ${c.ai} |
| Free option | 14-day trial, no card | ${c.free} |
| Source code | Proprietary | ${c.source} |

Helply's $99 Starter covers up to 2 agents and a budget of AI credits. Colliedesk ${OUR_PLAN} at ${OUR_PRICE} is the helpdesk for up to 10 agents${FOUNDING_OPEN ? '' : ' (Solo is $19 for one)'}, with AI reply drafts and triage included (monthly allowance) or on your own key.

## Leaving: what Groove gives you

- The account owner and admins can download **all conversation data**.
- The export is **JSON only**; Groove says a CSV export is not available.
- **One export at a time**; large exports can take **up to 72 hours**.

${c.export}

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

- Helply about (formerly Groove): [helply.com/about](https://helply.com/about)
- Helply pricing: [helply.com/pricing](https://helply.com/pricing)
- Helply AI credits: [helply.com/pricing/credits](https://helply.com/pricing/credits)
- Groove export: [help.groovehq.com](https://help.groovehq.com/help/970-export-your-groove-conversations)`;

const page: Page = {
  jsonLd: [],
  path: '/vs/groove',
  updated: '2026-11-15',
  section: 'Compare',
  title: 'Colliedesk vs Groove (now Helply): a flat-price helpdesk vs AI credits',
  description:
    `Groove is now Helply, with plans and AI credits from $99 per month. Colliedesk is an open-source helpdesk at one flat price per workspace (${OUR_PLAN} ${OUR_PRICE} for up to 10 agents) with AI drafts included. Export limits and honest status.`,
  summary: `Groove is now Helply: plans with AI credits from $99 per month, JSON-only export vs Colliedesk ${OUR_PLAN}, a flat ${OUR_PRICE} per workspace helpdesk`,
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
