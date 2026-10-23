// Front's pricing and export pages were read a day after the other comparison pages.
const PRICES_READ = '15 October 2026';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { collieFacts as c, statusTable } from './collie-status';

const faq: Faq[] = [
  {
    q: 'What is a good Front alternative that is not priced per seat?',
    a: 'Colliedesk Cloud is one flat price per workspace: Team is $69 a month for up to 10 agents, Small $39 for up to 3. Self-hosting is free. Colliedesk is an open-source (AGPL-3.0) shared inbox and helpdesk. It is in alpha, and the email channel works today.',
  },
  {
    q: 'How does Front charge for AI?',
    a: `On the Front pricing page read on ${PRICES_READ}: Copilot is $20 per seat per month as an add-on on Starter and Professional, and included on Enterprise. Autopilot starts at $0.05 per conversation.`,
  },
  {
    q: 'Can I export my conversations from Front?',
    a: 'Not by yourself. A company admin asks Front Support for an account data export. It covers shared inboxes only, and leaves out contacts, message templates, tags and individual inboxes. Front acknowledges the request within 72 hours.',
  },
  {
    q: 'Does Colliedesk import from Front?',
    a: 'Not yet. The first importer is Freshdesk (available now). Tell us on GitHub if you need a Front importer; requests decide the order.',
  },
];

const body = `## The short answer

- **Choose Front** if your team lives in email across many shared and personal inboxes, wants a Gmail-like workspace with comments on every thread, and needs many channels today. It is a mature product.
- **Choose Colliedesk** if you want a shared inbox whose price does not grow with every seat, and data you can export or self-host without asking anyone. Colliedesk is alpha; read the status table first.

## Price, side by side

Front prices below are from the Front pricing page, per seat per month billed annually, read on ${PRICES_READ}. The page does not list monthly-billing prices.

| | Front | Colliedesk |
|---|---|---|
| Plans | Starter $25 (up to 10 seats), Professional $65 (up to 50 seats), Enterprise $105 | ${c.price} |
| AI drafting | Copilot $20 per seat per month on Starter and Professional; included on Enterprise | ${c.ai} |
| AI agent | Autopilot from $0.05 per conversation | Auto-answer with a human in the loop, same AI pricing (not built yet) |
| Free option | No free plan; 14-day trial | ${c.free} |
| Source code | Proprietary | ${c.source} |

### What five agents pay

| Team | Front Professional + Copilot (annual) | Colliedesk Cloud |
|---|---|---|
| 5 agents | 5 × ($65 + $20) = **$425 per month** | $69 per month (Team) + AI usage |

## Leaving: what Front gives you

- There is **no self-serve export** of conversations. A company admin asks Front Support for an account data export.
- The export covers **shared inboxes**: conversations, messages, discussions, comments, and attachments as EML.
- It **leaves out** individual inboxes, contact data, message templates and tags.
- Front acknowledges the request within **72 hours**, then sends the files when they are ready.

${c.export}

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

- Front pricing: [front.com/pricing](https://front.com/pricing)
- Account data export: [help.front.com](https://help.front.com/t/182vg7)`;

const page: Page = {
  jsonLd: [],
  path: '/vs/front',
  updated: '2026-10-15',
  section: 'Compare',
  title: 'Colliedesk vs Front: an open-source Front alternative with flat pricing',
  description:
    'Colliedesk vs Front for small support teams: per-seat plans and a $20 Copilot add-on vs one flat workspace price. Sourced prices, export limits and honest status.',
  summary: 'Front $25–105 per seat plus $20 Copilot vs Colliedesk Team at a flat $69 per workspace; export only through Front Support',
  eyebrow: 'Compare · Front alternative',
  h1: 'Colliedesk vs Front',
  lede: 'Front is a polished shared inbox. For a team of five, the seat count and the AI add-on decide the bill. Here are the numbers, with sources.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
