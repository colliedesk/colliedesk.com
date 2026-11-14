import { AI_EXTRA, dollars, SMALL, TEAM } from '../../lib/site';
import { exportMd, factText, readOnLabel, sourcesMd, usd } from '../../lib/competitor';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { OURS } from '../competitors/colliedesk';
import { helpScout as h, price } from '../competitors/help-scout';
import { collieFacts as c, statusTable } from './collie-status';
import { FOUNDING_ACTION, OUR_CELL, OUR_PLAN, OUR_PRICE, foundingFirst, withFoundingLead } from '../../lib/cloud-price';

const PRICES_READ = readOnLabel(h.readOn);
const FIVE = 5;
const perResolution = `${usd(price.aiAnswers)} per AI resolution`;

const faq: Faq[] = [
  {
    q: 'What is a good Help Scout alternative with flat pricing?',
    a: `${foundingFirst(`Colliedesk Cloud is one flat price per workspace with no per-user fees (Team is ${dollars(TEAM.monthly)} a month for up to ${TEAM.agents} agents, Small ${dollars(SMALL.monthly)} for up to ${SMALL.agents}).`)} The open-source code (${OURS.license}) is free to self-host. Colliedesk is generally available, and the email channel works today.`,
  },
  {
    q: 'Can I export my Help Scout conversations?',
    a: 'Help Scout has no full export in the app. Reports export without thread contents, and the account owner can request a CSV of customer names and emails. The Mailbox API is the only way to get conversations and threads out, and the Free plan has no API access.',
  },
  {
    q: 'How does Help Scout charge for AI?',
    a: `On the pricing page read on ${PRICES_READ}: AI Answers costs ${usd(price.aiAnswers)} per resolution on paid plans. AI Assist, Drafts and Summarize are listed as included.`,
  },
  {
    q: 'Does Colliedesk import from Help Scout?',
    a: 'Yes. The Help Scout importer copies one inbox at a time through the Help Scout API: conversations, replies, notes, attachments, inline images, tags and customers, with a reconcile report that lists anything missing. See [Import from Help Scout](/docs/import-helpscout).',
  },
];

const body = `## The short answer

- **Choose Help Scout** if you want one of the most polished email-first helpdesks, with AI drafting already included. It is a good product.
- **Choose Colliedesk** if you want a price that never depends on headcount or contacts, your data in a database you control, and code you can read and fork. Colliedesk is generally available; read the status table for what is not built yet.

## Price, side by side

Help Scout prices are per user per month as shown on the pricing page on ${PRICES_READ}. The page has a monthly/annual toggle; we could not confirm which billing cycle the shown price uses.

| Topic | Help Scout | Colliedesk |
|---|---|---|
| Plans | ${h.facts.plans.text} | ${c.price} |
| AI | ${h.facts.ai.text} | ${c.ai} |
| API | ${factText(h, 'api')} | Same API on every install (OpenAPI contract in the repo) |
| Source code | ${h.facts.license.text} | ${c.source} |

### What five agents pay

| Team | Help Scout Standard | Help Scout Plus | Colliedesk Cloud |
|---|---|---|---|
| ${FIVE} agents | ${FIVE} × ${usd(price.standard)} = **${usd(FIVE * price.standard)} per month** + ${perResolution} | ${FIVE} × ${usd(price.plus)} = **${usd(FIVE * price.plus)} per month** + ${perResolution} | ${OUR_CELL} + ${AI_EXTRA} |

## Trust and pricing changes

${factText(h, 'pricingChange')} We publish our pricing in the open and the code is ${OURS.license}: if we ever change course in a way you dislike, you can self-host the same software or fork it.

## Leaving: what Help Scout gives you

${exportMd(h)}

${c.export} The [Help Scout importer](/docs/import-helpscout) copies one inbox at a time through that API, with a reconcile report.

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

${sourcesMd(h)}`;

const page: Page = {
  jsonLd: [],
  path: '/vs/help-scout',
  section: 'Compare',
  title: 'Colliedesk vs Help Scout: open-source, flat-priced Help Scout alternative',
  description:
    `Colliedesk vs Help Scout: per-user plans and ${usd(price.aiAnswers)} AI resolutions vs one flat workspace price, plus what Help Scout lets you export. Prices read ${PRICES_READ}.`,
  summary: `Help Scout ${usd(price.standard)}–${price.pro} per user and ${perResolution} vs Colliedesk ${OUR_PLAN} at a flat ${OUR_PRICE} per workspace; no bulk export in Help Scout`,
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
