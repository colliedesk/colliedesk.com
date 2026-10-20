import { PRICES_READ } from '../../lib/site';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';

const faq: Faq[] = [
  {
    q: 'How do I export all tickets from Zendesk?',
    a: 'Ask Zendesk Support to turn on data export, then run a JSON export from **Admin Center > Account > Tools > Reports > Export**. JSON includes comments, except for tickets over 1 MB, which Zendesk lists in a separate file. Fetch those through the API.',
  },
  {
    q: 'Does the Zendesk CSV export include ticket comments?',
    a: 'No. The CSV export has ticket fields and metrics. It leaves out ticket comments, ticket descriptions, deleted tickets, multi-line text fields and tickets larger than 1 MB.',
  },
  {
    q: 'Can I export Zendesk tickets on the Team plan?',
    a: 'Not with the built-in export: Zendesk lists it for Growth, Professional, Enterprise and Enterprise Plus (Suite), and Professional and Enterprise (Support). Team plans use the REST API instead.',
  },
  {
    q: 'Can Colliedesk import my Zendesk export?',
    a: 'Not yet. The first Colliedesk importer is Freshdesk. A Zendesk importer is on the [roadmap](/roadmap) for later. Export your data now anyway: you own it, and a backup taken before you cancel cannot be taken after.',
  },
];

const body = `Zendesk has three ways out. They do not give you the same data, and the main one is switched off until you ask.

| What you get | Data export: CSV | Data export: JSON or XML | Incremental Export API |
|---|---|---|---|
| Ticket fields, tags, status, timestamps | Yes | Yes | Yes |
| Ticket comments (the conversation) | No | Yes, except tickets over 1 MB (JSON) | Yes, with \`include=comment_events\` |
| Users and organizations | No | Yes | Separate endpoints |
| Turned on by default | No | No | Yes, with an API token |
| Team plans | No | No | Yes |
| Good for | A spreadsheet | A full backup | A migration you can check |

## 1. Turn on data export

Data export is **off by default**.

1. The account owner contacts Zendesk Customer Support.
2. Include your Zendesk subdomain in the request.
3. Wait until Zendesk confirms that exports are on.

## 2. Run the export

1. In **Admin Center**, select **Account**, then **Tools > Reports**.
2. Select the **Export** tab.
3. Choose the format:
   - **JSON:** pick a date range and a data type (tickets, users or organizations). Use JSON above 200,000 tickets. A ticket with more than 1 MB of data comes without its comments; Zendesk lists those tickets in a second file. Fetch their comments through the API.
   - **CSV:** pick a date range. Fields only, no comments.
   - **XML:** select **request file**. No date range. Capped at 500 MB, about 200,000 tickets.
4. Wait for the email. A large account can take a day or more.
5. Download the zip from the link. Zendesk keeps the link valid for at least three days.

The export skips tickets updated in the last 6 minutes. Run a last export after your team stops working in Zendesk.

## 3. Incremental Export API: the export you can check

The API is the route that works on every plan and lets a tool count what it read. From Zendesk's developer documentation, read on ${PRICES_READ}:

- **Full comments** with \`include=comment_events\`.
- **1,000 tickets per page.**
- **10 requests per minute** for incremental exports, so a large account takes hours.
- **Attachments** come as URLs in the comments. Download them before the account closes.

## Before you cancel Zendesk

1. Count your tickets in Zendesk, including closed ones.
2. Take a JSON or XML export as a backup, and keep it.
3. Download the attachments, and open a few to check them.
4. Compare the ticket count in your export with the count in Zendesk.
5. Cancel only after the counts match.

## Moving to Colliedesk

Colliedesk imports from Freshdesk today, with a reconcile report that proves nothing was lost. A Zendesk importer is on the [roadmap](/roadmap). Comparing the two products first? Read [Colliedesk vs Zendesk](/vs/zendesk).

## Sources

- Data export: [support.zendesk.com article 203662346](https://support.zendesk.com/hc/en-us/articles/203662346-Exporting-data-to-a-JSON-CSV-or-XML-file)
- Incremental Export API: [developer.zendesk.com](https://developer.zendesk.com/api-reference/ticketing/ticket-management/incremental_exports/)
- API rate limits: [developer.zendesk.com rate limits](https://developer.zendesk.com/api-reference/introduction/rate-limits/)`;

const page: Page = {
  jsonLd: [],
  name: 'Export tickets from Zendesk',
  path: '/migrate/zendesk/export',
  updated: '2026-10-15',
  section: 'Migrate',
  title: 'How to export Zendesk tickets with comments: CSV, JSON, API',
  description:
    'Zendesk data export is off by default and the CSV has no comments. How to turn it on, which format keeps the conversation, and the API limits.',
  summary: 'Export Zendesk tickets: export off by default, CSV without comments vs JSON/XML vs Incremental Export API; steps and limits',
  eyebrow: 'Migrate · Zendesk · Export',
  h1: 'Export your tickets from Zendesk',
  lede: 'The export is switched off until you ask, and the CSV leaves out every comment. Here is how to get all of it.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
