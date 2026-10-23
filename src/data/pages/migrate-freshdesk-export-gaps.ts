import { foundingState } from '../../lib/founding';
import { TRIAL_HREF } from '../../lib/site';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';

// Every Freshdesk statement below was read in Freshdesk's own help center or API reference on READ.
const READ = '23 October 2026';
// The commit of colliedesk/colliedesk whose importer code and tests back the Colliedesk claims.
const foundingOpen = foundingState().open;
const IMPORTER = 'https://github.com/colliedesk/colliedesk/blob/9d6041185a4f5bf8edb86e794b4fbcdd2c9b8f6f/server/internal/freshdesk';

const faq: Faq[] = [
  {
    q: 'Does the Freshdesk export include conversations?',
    a: 'The export from the All tickets view does not. Freshdesk says it will not give you the entire conversation or archived tickets. The account export (XML) and the API do include replies and notes.',
  },
  {
    q: 'Does the Freshdesk account export include time entries?',
    a: `The account export API lists the records it can include: tickets, archived tickets, contacts, companies, groups, forums, canned responses, surveys and solutions. Time entries and agents are not on that list (Freshdesk API reference, read ${READ}).`,
  },
  {
    q: 'How do I know my Freshdesk export is complete?',
    a: 'Count. Write down the number of tickets, replies, attachments and contacts in Freshdesk, then compare them with what you hold after the export. The Colliedesk importer does this for you and writes a reconcile report. Its status is OK only when every count matches.',
  },
  {
    q: 'Does the Colliedesk import bring custom fields?',
    a: 'No. Custom ticket fields and custom contact fields are not imported today. The reconcile report lists them under "Not imported by design", so you know what to keep from Freshdesk.',
  },
  {
    q: 'Can I try the import before I leave Freshdesk?',
    a: 'Yes. The import only reads your Freshdesk account. Your team keeps working in Freshdesk, and you can run the import again to catch up as often as you like.',
  },
];

const body = `A Freshdesk export leaves things out, and Freshdesk's export articles describe no way to check what you received. The export from the All tickets view has no conversations and no archived tickets. The account export has the conversations, but you get XML that your developers must convert first.

One developer who audited both exports on a Freshdesk trial account put it this way:

> "Nothing in either export tells you whether you got everything." ([r/msp, September 2026](https://www.reddit.com/r/msp/comments/1wap8ls/))

This page lists what each Freshdesk export holds, from Freshdesk's own documentation read on ${READ}. Then it lists what the Colliedesk import brings over, and what it does not.

## What each Freshdesk export holds

| Data | Ticket list export (CSV or Excel) | Account export: XML file, or the export API | Freshdesk API, record by record |
|---|---|---|---|
| Ticket fields | The fields you choose | XML file: yes | Yes |
| Replies and notes | No | XML file: yes, tickets with their content | Yes, from the conversations endpoint |
| Archived tickets | Not from All tickets; a separate export from the Archive view, fields only | Export API: an option | Separate endpoint, one ticket at a time |
| Attachments | No, fields only | Export API: an option | A URL per file; you download it |
| Time entries | No, fields only | Export API: not on its list | Yes, per ticket |
| Agent records | No, fields only | Export API: not on its list | Yes |

What the Freshdesk sources say:

- **Ticket list export.** You choose CSV or Excel and the ticket fields. Freshdesk's help article says this export "will NOT give you the entire conversation from the ticket or historical data (archived tickets)."
- **Archived tickets** have their own export: open the **Archive view**, choose the fields and select **Export**. You can run one archived ticket export at a time.
- **Account export.** An account admin runs it from **Admin > Account > Account Details > Export data**. You get tickets with their content, solutions, forums and the list of customers as XML. Freshdesk asks you to convert it "with the assistance of developers."
- **What the export API can include.** The account export endpoint in the API reference lists tickets (with notes and attachments), archived tickets, contacts, companies, groups, forums, canned responses, surveys and solutions. Time entries and agents are not on that list.
- **Contact and company export files** stay at their download URL for 15 days, then Freshdesk removes them.

## The API traps

The API lets a tool read each record and count it. It has limits you must plan around:

1. **By default, listing tickets returns only tickets created in the last 30 days.** For older tickets you pass \`updated_since\`.
2. **One list returns at most 300 pages, or 30,000 tickets.** Walk a larger account in date windows.
3. **Archived tickets are not in the ticket filter.** Freshdesk archives closed tickets that are inactive for 120 days, depending on ticket traffic. You read each one from \`/api/v2/tickets/archived/[id]\`.
4. **\`include=conversations\` returns up to ten conversations.** A longer ticket needs the conversations endpoint.
5. **The rate limit is per minute, for the whole account.** It depends on your plan, and trial accounts get 50 calls a minute.

If you write your own script, it has to handle all five. A script that forgets \`updated_since\` finishes without an error and holds only 30 days of tickets.

## What the Colliedesk import brings

The Colliedesk import reads your Freshdesk account through the API and copies it into a workspace. This list is what the importer code and its tests do today ([source](${IMPORTER})).

| Freshdesk | In Colliedesk |
|---|---|
| Tickets, including archived tickets | Conversations with subject, status, priority, assignee, tags and original times |
| Description, replies, notes and forwards | Messages with the original author and time |
| Attachments | Stored files, each with a SHA-256 checksum |
| Images inside messages that Freshdesk hosts | Stored files, shown in the message |
| Time entries | Time entries on the timeline |
| Contacts and companies | Contacts, with the company kept as their organization |
| Canned responses | Shared saved replies (personal folders only on request) |
| Knowledge base categories, folders and articles | Knowledge base collections and articles |
| An agent who has no Colliedesk account | Their replies keep the author name; the report lists them |

To find archived tickets, the importer checks every ticket number from 1, not just the ones the list returns. When Freshdesk refuses the archive, the report says **UNVERIFIED** and lists the ticket numbers to check by hand.

## What it does not bring

The report names these under "Not imported by design", so nothing is dropped without a line in writing:

- Custom ticket fields and custom contact fields.
- Satisfaction ratings, SLA policies and automations.
- Contact phone numbers, other emails, addresses and job titles.
- Time entries of archived tickets. The report lists those tickets.
- Tickets in Freshdesk Trash or Spam. The report lists them by id.

Save what you still need from this list in Freshdesk before you leave.

## The reconcile report

Every import ends with a report that puts each count from Freshdesk next to the count in Colliedesk. This is the counts table from the importer's own test, on a test account, not a customer:

| Record | In Freshdesk | In Colliedesk |
|---|---:|---:|
| Contacts | 4 | 4 |
| Tickets | 5 | 5 |
| Messages | 11 | 11 |
| Attachments | 3 | 3 |
| Time entries | 3 | 3 |

Status: **OK**. The test also checks that the attachment bytes match and that all 3 checksums were verified from storage ([test](${IMPORTER}/import_test.go)).

A finished import ends with one of three statuses:

- **OK**: every count matches and the totals were verified.
- **FAILED**: something is missing. The report lists each item by its Freshdesk id.
- **UNVERIFIED**: nothing failed, but the totals could not be proven, for example when the archive was refused.

Close Freshdesk only when the last report says OK.

## Next step

Read the full exit plan in [migrate from Freshdesk](/migrate/freshdesk), or [start a trial](${TRIAL_HREF}) and run the import on your own account. ${foundingOpen ? 'The founding plan ($99 a quarter) includes the migration, [done for you](/migrate/freshdesk/done-for-you).' : 'New teams run the importer themselves; it is free.'} For the export steps themselves, see [how to export tickets from Freshdesk](/migrate/freshdesk/export). The import guide has every flag: [import from Freshdesk](/docs/import-freshdesk).

## Sources

Read on ${READ}:

- Ticket list export: [support.freshdesk.com article 225158](https://support.freshdesk.com/support/solutions/articles/225158)
- Archived ticket export: [support.freshdesk.com article 212901](https://support.freshdesk.com/support/solutions/articles/212901)
- Account export: [support.freshdesk.com article 226393](https://support.freshdesk.com/support/solutions/articles/226393-how-do-i-export-the-data-in-my-account-) and [article 237405](https://support.freshdesk.com/support/solutions/articles/237405-how-can-i-export-tickets-including-the-content-of-the-ticket-)
- API limits, archive, account export resources, contact and company exports: [developers.freshdesk.com/api](https://developers.freshdesk.com/api/)
- Colliedesk importer and tests: [colliedesk/colliedesk, server/internal/freshdesk](${IMPORTER})`;

const page: Page = {
  jsonLd: [],
  name: 'What a Freshdesk export leaves out',
  path: '/migrate/freshdesk/export-gaps',
  updated: '2026-10-23',
  section: 'Migrate',
  title: 'What a Freshdesk export leaves out, and how to check it',
  description:
    'What each Freshdesk export holds, from Freshdesk docs: no conversations in the CSV, no time entries on the export API list. What the Colliedesk import brings.',
  summary: 'What the Freshdesk CSV, XML and API exports leave out, what the Colliedesk import brings and does not, and the reconcile report',
  eyebrow: 'Migrate · Freshdesk · Export gaps',
  h1: 'What a Freshdesk export leaves out',
  lede: 'The export is the hard part of leaving Freshdesk. Here is what each export leaves out, and how to check what you got.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
