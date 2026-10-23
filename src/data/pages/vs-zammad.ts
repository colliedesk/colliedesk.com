// Zammad, Chatwoot and FreeScout pages were read on the same day.
const PRICES_READ = '16 October 2026';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { collieFacts as c, statusTable } from './collie-status';

const faq: Faq[] = [
  {
    q: 'Is Colliedesk or Zammad better for leaving Freshdesk today?',
    a: 'Zammad, today. Its Freshdesk migrator is released and self-serve. The Colliedesk Freshdesk importer is available now, in alpha, so its interface may still change. Choose Colliedesk if you can accept alpha software and want a flat price, AI at model cost and a reconcile report that proves every record arrived.',
  },
  {
    q: 'How much does hosted Zammad cost?',
    a: `On the Zammad pricing page read on ${PRICES_READ}: Starter €7–9 per agent per month (up to 5 agents), Professional €16–18 (up to 35 agents), Plus €25–27 (unlimited agents), depending on annual or monthly billing. AI features cost €0.03 per AI call.`,
  },
  {
    q: 'Are Zammad and Colliedesk both open source?',
    a: 'Yes. Both are licensed AGPL-3.0 and free to self-host. Zammad is a Ruby on Rails application that runs on PostgreSQL, with Elasticsearch strongly recommended. Colliedesk is one server container plus PostgreSQL.',
  },
];

const body = `## The short answer

- **Choose Zammad** if you need a mature open-source helpdesk now: many channels (email, chat, Telegram, Facebook, WhatsApp, SMS, phone), SLAs, a knowledge base, and a released Freshdesk migrator.
- **Choose Colliedesk** if your team is 3 to 10 agents and you want one flat price instead of per-agent fees, AI without a per-call fee on top, and an import that proves nothing was lost. Colliedesk is alpha; read the status table first.

## Price, side by side

Zammad hosted prices are in euros, per agent per month, excluding VAT, as published on ${PRICES_READ}. The lower figure is billed annually.

| | Zammad | Colliedesk |
|---|---|---|
| Hosted plans | Starter €7–9 (max 5 agents), Professional €16–18 (max 35), Plus €25–27 (unlimited) per agent per month | ${c.price} |
| AI | Optional on Professional and Plus, €0.03 per AI call | ${c.ai} |
| Self-host | Free; paid support from €2,999 per year | ${c.free} |
| Licence | AGPL-3.0 | ${c.source} |

### What five agents pay

| Team | Zammad Professional (hosted) | Colliedesk Cloud |
|---|---|---|
| 5 agents | 5 × €16–18 = **€80–90 per month** + €0.03 per AI call | $69 per month (Team) + AI usage |
| 10 agents | 10 × €16–18 = **€160–180 per month** + €0.03 per AI call | $69 per month (Team) + AI usage |

## Moving from Freshdesk

Zammad is ahead here, and we say so.

| | Zammad migrator | Colliedesk importer (**Shipped**) |
|---|---|---|
| Status | Released, self-serve wizard or console | Shipped, alpha |
| Imports | Groups, organizations, users, tickets | Tickets (archived ones included), replies, notes, attachments, tags, contacts, companies, time entries |
| Into an existing instance | No: "Migrations are only possible on new instances" | Into one workspace |
| Catch-up after the first run | No: "Differential migrations are not supported" | Yes, \`--since\` |
| Proof that nothing was lost | Not described | Reconcile report: counts per record type and a SHA-256 checksum per attachment |
| Done for you | Paid migration workshop, price on request | [Free for founding customers](/migrate/freshdesk/done-for-you) |

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

- Zammad pricing: [zammad.com/en/pricing](https://zammad.com/en/pricing)
- Freshdesk migration: [docs.zammad.org migration/freshdesk](https://docs.zammad.org/en/latest/migration/freshdesk.html)
- Migration overview: [docs.zammad.org migration](https://docs.zammad.org/en/latest/migration/index.html)
- Software requirements: [docs.zammad.org prerequisites](https://docs.zammad.org/en/latest/prerequisites/software.html)
- Licence: [github.com/zammad/zammad](https://github.com/zammad/zammad)`;

const page: Page = {
  jsonLd: [],
  path: '/vs/zammad',
  updated: '2026-10-16',
  section: 'Compare',
  title: 'Colliedesk vs Zammad: two open-source helpdesks, flat price vs per agent',
  description:
    'Colliedesk vs Zammad, both AGPL-3.0: Zammad hosted €7–27 per agent plus €0.03 per AI call vs Colliedesk at one flat price per workspace (Team $69 for up to 10 agents). Freshdesk migration compared honestly.',
  summary: 'Zammad €7–27 per agent hosted, €0.03 per AI call, released Freshdesk migrator vs Colliedesk Team at a flat $69, importer available now (alpha) with reconcile report',
  eyebrow: 'Compare · Open source',
  h1: 'Colliedesk vs Zammad',
  lede: 'Both are open source under AGPL-3.0. Zammad is mature and charges per agent; Colliedesk is young and charges per workspace. Here is where each one wins, with sources.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
