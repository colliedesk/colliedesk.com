import { FOUNDING_HREF, PRICES_READ } from '../../lib/site';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';

const faq: Faq[] = [
  {
    q: 'How do I migrate from Freshdesk without losing tickets?',
    a: 'Export through the Freshdesk API, not the CSV export: the CSV has ticket fields only. Walk the ticket list in date windows with `updated_since` to stay under the 30,000-ticket cap per filter, fetch archived tickets separately, fetch every conversation and attachment, then compare counts and checksums before you close the account. The Colliedesk importer (available now) does these steps and writes a reconcile report.',
  },
  {
    q: 'Does the Freshdesk CSV export include the conversation?',
    a: 'No. The ticket export in the Freshdesk UI exports the ticket fields you choose, as CSV or Excel. It does not include replies or notes, and archived tickets are excluded.',
  },
  {
    q: 'Is the Colliedesk Freshdesk importer available now?',
    a: `Yes, it is shipped, and Colliedesk as a whole is alpha. Run it in the app or from the command line; the [import guide](/docs/import-freshdesk) has both. Founding customers get their migration done for them, free. See [the founding offer](${FOUNDING_HREF}).`,
  },
  {
    q: 'Can we keep Freshdesk running while we try Colliedesk?',
    a: 'Yes, and we recommend it. The import only reads your Freshdesk account, so your team keeps answering in Freshdesk while you import the history, try Colliedesk on real tickets and run the import again to catch up. Forward your support mail to Colliedesk last, when your team is sure. See [switch gradually](#switch-gradually).',
  },
  {
    q: 'When should I close my Freshdesk account?',
    a: 'Only after the reconcile report shows every ticket, reply, note and attachment arrived. A third-party guide reports that inline images hosted on Freshdesk stop loading after the account closes, so the importer must copy them first.',
  },
];

const body = `> **Status:** Colliedesk as a whole is alpha: the Freshdesk importer is shipped, and any release may change the interface or the database schema. This page explains the full process so you can plan, or do it yourself with the Freshdesk API. Founding customers get the migration done for them, free.

## Switch gradually

We recommend you do not switch in one day. Keep Freshdesk as your live inbox and bring Colliedesk up beside it until your team is sure:

1. **Keep answering customers in Freshdesk.** The import reads your Freshdesk account through its API and does not change it.
2. **Import your history.** In the app, the tickets updated in the last 90 days come first, so your team can look around while older and archived tickets follow. On Colliedesk Cloud, the first import during the trial extends the trial to 30 days.
3. **Try Colliedesk on your real tickets:** search, tags, saved replies, teammates and the knowledge base.
4. **Run the import again to catch up** as often as you like. It brings over tickets that changed in Freshdesk since the last run, and it never copies an imported ticket twice.
5. **Switch when your team is sure**, for example before your Freshdesk renewal: forward your support address to Colliedesk ([Connect email](/docs/email-channel)), run one last catch-up import (from the command line, \`--since\` makes it shorter), and close Freshdesk only after the last reconcile report matches.

Move the mail forwarding last. If Freshdesk and Colliedesk both receive the same email, it can show twice after a catch-up import, because the importer matches tickets by their Freshdesk id. Keeping Colliedesk in step with Freshdesk automatically until you switch is on the [roadmap](/roadmap).

Founding customers get all of this done for them: [free migration with Founding](/migrate/freshdesk/done-for-you).

## 1. Know what you are moving

Write down, from your Freshdesk admin:

1. The number of tickets, including closed ones.
2. The number of agents, groups, tags and custom ticket fields.
3. Roughly how much attachment storage you use.
4. Your renewal date. Plan to finish before it, with a margin.

## 2. Do not rely on the CSV export

Freshdesk's ticket export in the UI gives you **ticket fields only**, as CSV or Excel. It is useful for a spreadsheet. It is not a migration. Before you cancel, also take a full account export as a backup: [how to export tickets from Freshdesk](/migrate/freshdesk/export).

| Data | Freshdesk UI export (CSV/Excel) | Freshdesk API | Colliedesk importer (**Shipped**) |
|---|---|---|---|
| Ticket fields (subject, status, priority, dates) | Yes | Yes | Yes |
| Full conversation: replies and private notes | No | Yes, extra calls per ticket | Yes |
| Attachments | Not included | Download URLs | Downloaded and checksummed (SHA-256) |
| Archived tickets (closed, inactive 120 days) | Excluded | Separate endpoint | Yes |
| Tags and contacts | Tags as a field | Yes | Yes |
| Proof that nothing was lost | No | No | Reconcile report |
| Time entries | No | Yes | Yes (shown on the timeline; logging new time comes later) |

## 3. Know the API traps

From Freshdesk's API documentation, read on ${PRICES_READ}:

- **30-day default.** Listing tickets returns only the last 30 days unless you pass \`updated_since\`.
- **30,000-ticket cap.** Up to 100 tickets per page and 300 pages per filter. Larger accounts must walk the list in date windows.
- **Archived tickets.** Closed tickets inactive for 120 days are archived and fetched one by one from a separate endpoint.
- **Conversations.** \`include=conversations\` embeds at most 10; fetch the rest from \`/api/v2/tickets/{id}/conversations\`.
- **Rate limits.** 100, 400 or 700 calls per minute on Growth, Pro and Enterprise, shared across your account.

## 4. Run the import

The importer reads your Freshdesk account through its API with an API key from your Freshdesk profile. It moves tickets (including archived ones), replies, private notes, attachments, tags, contacts, companies and time entries into one Colliedesk workspace. The command and flags are in the [import guide](/docs/import-freshdesk).

## 5. Check the reconcile report

Every import ends with a reconcile report: counts for each kind of record in Freshdesk and in Colliedesk, and a checksum for every attachment. **A partial import is a failed import.** If one number does not match, the import has failed and you keep using Freshdesk.

## 6. Switch over

1. Point your support address at Colliedesk (see [Connect email](/docs/email-channel)).
2. Run a final catch-up import with \`--since\` for tickets that changed after the first import.
3. Keep Freshdesk read-only for a short overlap.
4. Close Freshdesk only after the final reconcile report matches.

Moving into HubSpot instead? Use the [Freshdesk to HubSpot migration checklist](/blog/freshdesk-to-hubspot-migration-checklist) to verify history, files, workflows and email cutover.

## Sources

- Ticket export: [support.freshdesk.com article 225158](https://support.freshdesk.com/support/solutions/articles/225158)
- API: [developers.freshdesk.com/api](https://developers.freshdesk.com/api/)
- Rate limits: [support.freshdesk.com article 225439](https://support.freshdesk.com/support/solutions/articles/225439-what-are-the-rate-limits-for-the-api-calls-to-freshdesk-)
- Inline images after account closure (third-party report): [meticulosity.com](https://www.meticulosity.com/freshdesk-to-hubspot-migration)`;

const page: Page = {
  jsonLd: [],
  name: 'Migrate from Freshdesk',
  path: '/migrate/freshdesk',
  section: 'Migrate',
  title: 'Migrate from Freshdesk without losing tickets: step-by-step guide',
  description:
    'How to leave Freshdesk with every ticket, reply, note and attachment: why the CSV export is not enough, the API limits to plan around, and the reconcile check before you close the account.',
  summary: 'Step-by-step Freshdesk exit: CSV vs API vs Colliedesk importer (available now), API traps, reconcile report',
  eyebrow: 'Migrate · Freshdesk',
  h1: 'Leave Freshdesk with all your data',
  lede: 'An honest, step-by-step guide: what the Freshdesk export keeps, what it loses, and how to prove nothing was left behind.',
  cta: true,
  ctaFounding: { href: '/migrate/freshdesk/done-for-you', label: 'Free migration with Founding' },
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
