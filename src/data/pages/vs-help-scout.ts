import { AI_EXTRA, PRICES_READ } from '../../lib/site';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { collieFacts as c, statusTable } from './collie-status';
import { FOUNDING_ACTION, OUR_CELL, OUR_PLAN, OUR_PRICE, foundingFirst, withFoundingLead } from '../../lib/cloud-price';

const faq: Faq[] = [
  {
    q: 'What is a good Help Scout alternative with flat pricing?',
    a: `${foundingFirst('Colliedesk Cloud is one flat price per workspace with no per-user fees (Team is $69 a month for up to 10 agents, Small $39 for up to 3).')} The open-source code (AGPL-3.0) is free to self-host. Colliedesk is in alpha, and the email channel works today.`,
  },
  {
    q: 'Can I export my Help Scout conversations?',
    a: 'Help Scout has no full export in the app. Reports export without thread contents, and the account owner can request a CSV of customer names and emails. The Mailbox API is the only way to get conversations and threads out, and the Free plan has no API access.',
  },
  {
    q: 'How does Help Scout charge for AI?',
    a: `On the pricing page read on ${PRICES_READ}: AI Answers costs $0.75 per resolution on paid plans. AI Assist, Drafts and Summarize are listed as included.`,
  },
  {
    q: 'Does Colliedesk import from Help Scout?',
    a: 'Yes. The Help Scout importer copies one inbox at a time through the Help Scout API: conversations, replies, notes, attachments, inline images, tags and customers, with a reconcile report that lists anything missing. See [Import from Help Scout](/docs/import-helpscout).',
  },
];

const body = `## The short answer

- **Choose Help Scout** if you want one of the most polished email-first helpdesks, with AI drafting already included. It is a good product.
- **Choose Colliedesk** if you want a price that never depends on headcount or contacts, your data in a database you control, and code you can read and fork. Colliedesk is alpha; read the status table first.

## Price, side by side

Help Scout prices are per user per month as shown on the pricing page on ${PRICES_READ}. The page has a monthly/annual toggle; we could not confirm which billing cycle the shown price uses.

| Topic | Help Scout | Colliedesk |
|---|---|---|
| Plans | Free $0 (5 users, 1 inbox, 100 contacts per month), Standard $25, Plus $45, Pro $75 (minimum 10 users) | ${c.price} |
| AI | AI Answers $0.75 per resolution; AI Assist, Drafts and Summarize included | ${c.ai} |
| API | Not on the Free plan | Same API on every install (OpenAPI contract in the repo) |
| Source code | Proprietary | ${c.source} |

### What five agents pay

| Team | Help Scout Standard | Help Scout Plus | Colliedesk Cloud |
|---|---|---|---|
| 5 agents | 5 × $25 = **$125 per month** + $0.75 per AI resolution | 5 × $45 = **$225 per month** + $0.75 per AI resolution | ${OUR_CELL} + ${AI_EXTRA} |

## Trust and pricing changes

In 2025 Help Scout moved to contact-based pricing and then reversed it after customer pushback ([Michael Tsai, 30 April 2025](https://mjtsai.com/blog/2025/04/30/whither-help-scout)). We publish our pricing in the open and the code is AGPL-3.0: if we ever change course in a way you dislike, you can self-host the same software or fork it.

## Leaving: what Help Scout gives you

- **No bulk export button.** Reports export without conversation threads.
- The account owner can request a **CSV of customer names and emails**, without history.
- The **Mailbox API** returns conversations with threads (pass \`status=all\`; the default is active only). The Free plan has **no API**.

${c.export} The [Help Scout importer](/docs/import-helpscout) copies one inbox at a time through that API, with a reconcile report.

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

- Help Scout pricing: [helpscout.com/pricing](https://www.helpscout.com/pricing/)
- Data export: [docs.helpscout.com article 466](https://docs.helpscout.com/article/466-data-export)
- Mailbox API and plan access: [docs.helpscout.com article 1140](https://docs.helpscout.com/article/1140-mailbox-api)
- 2025 pricing change: [mjtsai.com](https://mjtsai.com/blog/2025/04/30/whither-help-scout) (third-party account)`;

const page: Page = {
  jsonLd: [],
  path: '/vs/help-scout',
  section: 'Compare',
  title: 'Colliedesk vs Help Scout: open-source, flat-priced Help Scout alternative',
  description:
    'Colliedesk vs Help Scout: per-user plans and $0.75 AI resolutions vs one flat workspace price, plus what Help Scout lets you export. Prices read 14 October 2026.',
  summary: `Help Scout $25–75 per user and $0.75 per AI resolution vs Colliedesk ${OUR_PLAN} at a flat ${OUR_PRICE} per workspace; no bulk export in Help Scout`,
  eyebrow: 'Compare · Help Scout alternative',
  h1: 'Colliedesk vs Help Scout',
  lede: withFoundingLead('Help Scout has some of the best email UX in the category. Colliedesk is younger, open source and flat-priced. Here is where each one fits, with sources.'),
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
