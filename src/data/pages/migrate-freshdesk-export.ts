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
  {
    q: 'What does the Colliedesk import leave out?',
    a: 'Custom ticket and contact fields, ticket groups and products, watchers, parent/child and merge links, contact phone numbers and addresses, satisfaction ratings, SLA policies, automations, files on canned responses, and tickets in Trash or Spam. Every import report lists them under **Not imported by design**, so keep the Freshdesk account export if you need any of them.',
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

## What the Colliedesk import brings

Colliedesk's importer does the API route for you, from **Settings → Data → Import from Freshdesk** or the \`collie import freshdesk\` command. It reads your Freshdesk account and does not change it. It brings over:

- **Tickets, including archived ones**, with their subject, status, priority, assignee, tags and dates.
- **Every message**: the description, replies, private and public notes and forwards, with the original author and time.
- **Attachments**, each stored with a SHA-256 checksum, and the **images inside messages** that Freshdesk hosts, so they still show after you close the account.
- **Contacts** (matched by email), **companies** (as the contact's organization) and **agents** (matched by email to your Colliedesk agents).
- **Time entries**, shown on the conversation timeline.
- **Canned responses**, as shared saved replies.
- **The knowledge base**: categories, folders and articles. While your Colliedesk help center is on, old Freshdesk help center addresses lead to the imported articles.

## What the import leaves out

The importer does not bring everything. Each report ends with this list, under **Not imported by design**:

- Custom ticket fields and custom contact fields.
- A ticket's group, product, watchers, and parent/child and merge links.
- Contact phone numbers, other emails, addresses and job titles, and company details other than the name.
- Satisfaction ratings, SLA policies and automations.
- Files attached to canned responses: saved replies hold text only.
- Tickets in the Freshdesk Trash or Spam. The report lists them by id.
- Time entries of archived tickets. The report lists those tickets; check them in Freshdesk.
- Images in messages that other sites host, such as a newsletter banner. They stay links.

Canned responses in personal folders are not imported unless you ask for them, because saved replies are shared by the whole workspace. If you need any item on the list, keep the Freshdesk account export as well.

## What the reconcile report shows

Every import ends with a reconcile report, as Markdown for people and JSON for tools. Its status is one of three:

- **OK**: every count matches and the totals were verified.
- **FAILED**: something is missing. A table lists each missing item with its Freshdesk id and ticket id.
- **UNVERIFIED**: nothing failed, but completeness could not be proven. This happens, for example, when your Freshdesk plan does not let the importer read archived tickets.

The report has a **Counts** table with three numbers for each kind of data: in Freshdesk, in Colliedesk and failed. It covers contacts, tickets, messages, attachments, inline images, time entries, saved replies and the knowledge base. It also gives the attachment bytes in Freshdesk and in storage, and how many files had their SHA-256 checksum read again from storage.

Freshdesk's ticket list leaves out archived, trashed and spam tickets. So the importer also checks every ticket number from 1, and the report says how each total was verified. Do not close the Freshdesk account until the last report says **OK**. The [import guide](/docs/import-freshdesk) has the command, the flags and every section of the report.

Founding customers get the migration done for them, free. The full exit plan is in [Migrate from Freshdesk](/migrate/freshdesk).

## Sources

- Ticket export: [support.freshdesk.com article 225158](https://support.freshdesk.com/support/solutions/articles/225158)
- API: [developers.freshdesk.com/api](https://developers.freshdesk.com/api/)`;

const page: Page = {
  jsonLd: [],
  name: 'Export tickets from Freshdesk',
  path: '/migrate/freshdesk/export',
  updated: '2026-11-15',
  section: 'Migrate',
  title: 'How to export tickets from Freshdesk (with conversations and attachments)',
  description:
    'Three ways to export Freshdesk tickets: the CSV export (fields only), the account export (XML backup) and the API. What each keeps; what an import leaves out.',
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
