const PRICES_READ = '16 October 2026';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { collieFacts as c, statusTable } from './collie-status';

const faq: Faq[] = [
  {
    q: 'What happened to Groove?',
    a: `Groove is now Helply. On ${PRICES_READ}, groovehq.com redirected to helply.com, whose about page says "Groove is now Helply, rebuilt around AI agents."`,
  },
  {
    q: 'How does Helply charge?',
    a: 'By AI credits, not by user. Plans start at $49 per month for a block of credits, with no per-user fees and 15% off annual billing. A simple AI action such as a draft uses 1 credit; harder ones use 4 or 12.',
  },
  {
    q: 'How do I export my Groove conversations?',
    a: 'The account owner or an admin downloads them from Settings > Company > More > Exports. Groove\'s help says the export is JSON only, with no CSV, one export at a time, and large exports can take up to 72 hours.',
  },
];

const body = `## The short answer

- **Choose Helply** (formerly Groove) if you want AI agents to answer most tickets and you are happy to pay by AI usage.
- **Choose Colliedesk** if you want a classic shared inbox and helpdesk with a flat price, where AI drafts (coming after beta) and a human decides, and your data in an open database. Colliedesk is alpha; read the status table first.

## Price, side by side

Read on ${PRICES_READ}.

| | Helply (formerly Groove) | Colliedesk |
|---|---|---|
| Plans | From $49 per month for a block of credits (500 to 32,000); no per-user fees; 15% off annual | ${c.price} |
| AI | Charged in credits: 1 for a draft or summary, 4 or 12 for harder actions; unused credits roll over | ${c.ai} |
| Free option | 14-day trial with 1,000 credits, no card | ${c.free} |
| Source code | Proprietary | ${c.source} |

Both start at $49. The difference: Helply's $49 is a credit budget for AI work, Colliedesk's $49 is the helpdesk for up to 10 agents, with AI billed at model cost +30% or on your own key.

## Leaving: what Groove gives you

- The account owner and admins can download **all conversation data**.
- The export is **JSON only**; Groove says a CSV export is not available.
- **One export at a time**; large exports can take **up to 72 hours**.

${c.export}

## What Colliedesk does today

${statusTable}

See [Colliedesk pricing](/pricing), or [compare Colliedesk with other helpdesks](/compare).

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

- Helply about (formerly Groove): [helply.com/about](https://helply.com/about)
- Helply pricing: [helply.com/pricing](https://helply.com/pricing)
- Groove export: [help.groovehq.com](https://help.groovehq.com/help/970-export-your-groove-conversations)`;

const page: Page = {
  jsonLd: [],
  path: '/vs/groove',
  updated: '2026-10-20',
  section: 'Compare',
  title: 'Colliedesk vs Groove (now Helply): flat price vs AI credits',
  description:
    'Groove is now Helply, priced by AI credits from $49 per month. Colliedesk is open source at a flat $49 per workspace. Export limits and honest status.',
  summary: 'Groove is now Helply: AI credits from $49 per month, JSON-only export vs Colliedesk flat $49 per workspace helpdesk',
  eyebrow: 'Compare · Groove alternative',
  h1: 'Colliedesk vs Groove (now Helply)',
  lede: 'Groove became Helply and rebuilt itself around AI agents priced by credits. If you chose Groove for a simple shared inbox, here is the difference, with sources.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
