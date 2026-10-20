import { PRICES_READ } from '../../lib/site';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';

const faq: Faq[] = [
  {
    q: 'How do I export all tickets from Freshdesk?',
    a: 'For ticket fields only, use **Export** on the All tickets view (CSV or Excel). For everything, including replies, notes and archived tickets, run an account export from **Admin > Account > Account Details > Export data**, or read the account through the Freshdesk API.',
  },
  {
    q: 'Does the Freshdesk ticket export include the conversation?',
    a: 'No. The CSV or Excel export from the ticket list has the ticket fields you choose, and multiline fields such as Description if you turn them on. Replies, notes and archived tickets are not in it.',
  },
  {
    q: 'Can I export Freshdesk attachments?',
    a: 'Not from the ticket list export. The account export and the API give download links for attachments. The links are temporary, so download the files soon after the export finishes and check that each file opened.',
  },
  {
    q: 'Can I export Freshdesk tickets on the free plan?',
    a: 'Export needs an Admin or Supervisor role whose export permission is on. Check your own plan and role in Freshdesk before you depend on it, and finish the export before the plan or account ends.',
  },
];

const body = `There are three ways to get your tickets out of Freshdesk. They do not give you the same data.

| What you get | Ticket list export (CSV/Excel) | Account export (XML) | Freshdesk API |
|---|---|---|---|
| Ticket fields (subject, status, priority, dates) | Yes, fields you choose | Yes | Yes |
| Replies and private notes | No | Yes | Yes, extra call per ticket |
| Archived tickets | No | Yes | Separate endpoint |
| Attachments | No | Temporary download links | Temporary download links |
| Contacts and companies | No | Yes | Yes |
| Who can run it | Admin or Supervisor | Account admin | API key with access to the tickets |
| Good for | A spreadsheet or a report | A full backup | A migration you can check |

## 1. Ticket list export: fields only

Use this when you need a spreadsheet, not a backup.

1. Open **Tickets** and select the **All tickets** view.
2. On the list page, set **Created time** to **Any time**.
3. Select **Export** in the top-right corner.
4. Choose CSV or Excel, and the date range.
5. Select the ticket fields. To include Description, expand **Show multiline text fields**.
6. Download the file from **Admin > Account exports** when it is ready.

The export covers only tickets inside the list page's time frame, so set the list to **Any time** first and pick the range in the export window.

## 2. Account export: the full backup

Use this before you cancel, even if you migrate with a tool.

1. Sign in with an account admin.
2. Go to **Admin > Account > Account Details**.
3. Hover over **Export data**, then select **Export**.
4. Wait for the email, then download the zip file. It has one XML file per kind of record: tickets with their conversations, contacts, companies and more.
5. Download the attachments from the links in the export **the same day**. The links expire.
6. Open a few tickets in the XML and compare them with Freshdesk before you trust the backup.

XML is a backup format, not something another helpdesk imports directly. To move to a new helpdesk you still need an importer.

## 3. API: the export you can check

The API is the only route that lets a tool count what it read and prove nothing is missing. Plan for these limits, from Freshdesk's API documentation read on ${PRICES_READ}:

- **30-day default.** Listing tickets returns the last 30 days unless you pass \`updated_since\`.
- **30,000-ticket cap.** 100 tickets per page and 300 pages per filter. Walk larger accounts in date windows.
- **Archived tickets** are fetched one by one from a separate endpoint.
- **Conversations.** \`include=conversations\` embeds at most 10. Fetch the rest from \`/api/v2/tickets/{id}/conversations\`.
- **Rate limits** are shared across the account, so an export slows down your agents' integrations.

## Moving to Colliedesk

\`colliedesk import freshdesk\` does the API route for you: tickets with every reply and note, archived tickets, attachments with a SHA-256 checksum, tags, contacts, companies and time entries. It ends with a reconcile report. If one count does not match, the report says **FAILED** and you keep using Freshdesk. It is available now, in alpha; the [import guide](/docs/import-freshdesk) has the command and flags.

Founding customers get the migration done for them, free. The full exit plan is in [Migrate from Freshdesk](/migrate/freshdesk).

## Sources

- Ticket export: [support.freshdesk.com article 225158](https://support.freshdesk.com/support/solutions/articles/225158)
- API: [developers.freshdesk.com/api](https://developers.freshdesk.com/api/)`;

const page: Page = {
  jsonLd: [],
  name: 'Export tickets from Freshdesk',
  path: '/migrate/freshdesk/export',
  updated: '2026-10-15',
  section: 'Migrate',
  title: 'How to export Freshdesk tickets with conversations',
  description:
    'Three ways to export Freshdesk tickets: the CSV export (fields only), the account export (full XML backup) and the API. What each one keeps, and the steps.',
  summary: 'Export Freshdesk tickets: CSV export (fields only) vs account export (XML backup) vs API; steps and limits',
  eyebrow: 'Migrate · Freshdesk · Export',
  h1: 'Export your tickets from Freshdesk',
  lede: 'The CSV export leaves out every reply. Here is what each export method keeps, and how to get all of it.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
