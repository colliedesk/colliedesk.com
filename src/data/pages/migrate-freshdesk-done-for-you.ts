import { FOUNDING_SLOTS, foundingState } from '../../lib/founding';
import { FOUNDING_CHECKOUT } from '../../lib/site';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';

const foundingOpen = foundingState().open;

const faq: Faq[] = [
  {
    q: 'Who runs the migration?',
    a: 'We do. You create a Freshdesk API key and give it to us; we run the Colliedesk importer against your account, check the reconcile report, and send it to you before you switch.',
  },
  {
    q: 'What does a done-for-you Freshdesk migration cost?',
    a: 'Nothing extra. It is part of the founding plan ($99 every 3 months per workspace) and is not sold separately. When founding places close, the offer closes with them; the importer stays free to run yourself.',
  },
  {
    q: 'When can you start?',
    a: 'The Freshdesk importer is available now in alpha, and Colliedesk Cloud is live. Migrations for founding customers can start now. Tell us your renewal date so we plan before it.',
  },
  {
    q: 'What if something does not arrive?',
    a: 'Then the migration has failed and you keep using Freshdesk. The reconcile report compares counts for every kind of record and a checksum for every attachment; one mismatch is a failure, not a footnote.',
  },
];

const body = `> **Status:** the Freshdesk importer is available now, in alpha. Done-for-you migrations start now. Book to plan around your renewal date.

## What we move

Tickets (archived ones included), replies, private notes, attachments, tags, contacts, companies and time entries, into one Colliedesk workspace. The data model and the command are public: [import guide](/docs/import-freshdesk).

## How it works

1. You create a Freshdesk API key from your Freshdesk profile and send it to us.
2. We run a first full import into your Colliedesk Cloud workspace.
3. You get the **reconcile report**: Freshdesk count vs Colliedesk count for each kind of record, and a SHA-256 checksum for every attachment.
4. You check your own tickets in Colliedesk while Freshdesk keeps running.
5. On switch day we run a catch-up import of everything that changed since step 2, and you point your support address at Colliedesk.
6. You close Freshdesk only when the final report matches. Then revoke the API key.

## What it costs

| You are | Migration price |
|---|---|
| A founding customer ($99 every 3 months per workspace, locked for life) | **Included.** Done-for-you migration is a founding benefit and is not sold separately. |
| Self-hosting | Free: run the same importer yourself with the [import guide](/docs/import-freshdesk) |

When founding places close, the done-for-you offer closes with them.

${foundingOpen ? `[Become a founding customer, $99 every 3 months](${FOUNDING_CHECKOUT}). 30-day money-back guarantee: if it is not right for you, we refund the full $99, even after the migration ([terms](/terms#refunds)).` : `**Founding is closed: all ${FOUNDING_SLOTS} places are taken.** New teams can run the importer themselves with the [import guide](/docs/import-freshdesk).`}

## What we need from you

- A Freshdesk API key from an admin profile. We use it only for the import; revoke it after the final report.
- Your renewal date, so the switch lands before it.
- One person on your team who checks a sample of tickets after the first import.

If you prefer to do it yourself, the step-by-step guide is [migrate from Freshdesk](/migrate/freshdesk).`;

const page: Page = {
  jsonLd: [],
  name: 'Freshdesk migration, done for you',
  path: '/migrate/freshdesk/done-for-you',
  section: 'Migrate',
  title: 'Freshdesk migration done for you, with a reconcile report',
  description:
    'We move your Freshdesk tickets, replies, notes and attachments into Colliedesk and prove nothing was lost with a reconcile report. Included with the founding plan.',
  summary: 'Done-for-you Freshdesk migration: included with the founding plan, not sold separately; reconcile report before you switch; available now',
  eyebrow: 'Migrate · Done for you',
  h1: 'We move your Freshdesk data for you',
  lede: 'Hand us a Freshdesk API key. We import everything, prove it with a reconcile report, and you switch only when every number matches.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
