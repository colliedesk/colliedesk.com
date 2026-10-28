import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';

const REPORT = '/receipts/freshdesk-import-2026-10-27-report.txt';
const CSV = '/receipts/freshdesk-import-2026-10-27.csv';

const faq: Faq[] = [
  {
    q: 'Whose Freshdesk account is this?',
    a: 'Our own. HC Labs ran its support on hclabs.freshdesk.com until September 2026. No customer data is in this run, and only counts are published.',
  },
  {
    q: 'Why does the report say UNVERIFIED?',
    a: 'Freshdesk refused its archived-ticket endpoint on this account (HTTP 403). Without it, the importer cannot prove that no archived ticket exists, so it refuses to say OK. Every ticket Freshdesk search reports (388) arrived, and 13 ticket numbers stay open: each may be deleted or archived. We publish it as it came out.',
  },
  {
    q: 'Why did it take 35 minutes for 388 tickets?',
    a: 'Freshdesk rate limits its API. The importer waits when Freshdesk answers HTTP 429: 34 times in this run, 29 minutes 13 seconds in total. The import work itself took under 6 minutes.',
  },
  {
    q: 'What did it cost?',
    a: 'Nothing. The importer is open source and free, on Colliedesk Cloud and on your own server. Freshdesk API calls are part of the Freshdesk plan, limited per minute, not billed per call.',
  },
];

const body = `> **Status:** the Freshdesk importer is **Shipped**, in alpha. This page is one real run, published as the importer reported it.

On 27 October 2026 we moved our own Freshdesk account into a new Colliedesk Cloud workspace with the [Freshdesk importer](/docs/import-freshdesk). Nothing was cleaned up first. Below are the numbers from the reconcile report, the full report and a CSV of the counts.

## What arrived

| Record | In Freshdesk | In Colliedesk | Failed |
|---|---:|---:|---:|
| Tickets | 388 | 388 | 0 |
| Messages (replies, notes, forwards) | 451 | 451 | 0 |
| Contacts | 37 | 37 | 0 |
| Companies (kept as the contact's organization) | 6 | 6 | 0 |
| Attachments | 74 | 74 | 0 |
| Inline images | 11 | 11 | 0 |

Attachments: 11,385,147 bytes in Freshdesk, 11,385,147 bytes stored. Each of the 74 files and 11 inline images was read back from storage and its SHA-256 checked.

## How long it took

| Step | Time |
|---|---:|
| Start to finish | 34 min 55 s |
| Waiting for Freshdesk's rate limit (34 × HTTP 429) | 29 min 13 s |
| Import work | about 5 min 42 s |

## What it cost

| Item | Cost |
|---|---:|
| Colliedesk importer | $0 (open source) |
| Freshdesk API calls, inside the plan's rate limit ([Freshdesk API docs](https://developers.freshdesk.com/api/#ratelimit), read 27 October 2026) | $0 |
| **Total** | **$0** |

## What the report could not prove

The report status is **UNVERIFIED**, not OK. Freshdesk refused the archived-ticket endpoint on this account (HTTP 403), so archived tickets could not be counted or imported. The importer looked up every ticket number from 1 to 401 and kept probing up to 601. 13 numbers (32, 34, 44, 45, 62, 73 to 78, 87, 88) did not answer as normal tickets: each may be deleted or archived. Before closing a Freshdesk account in this state, check those ticket numbers in Freshdesk.

Other warnings from the run:

- One of two Freshdesk agents had no Colliedesk agent with the same email, so their replies keep the author name only. Invite the agent first, then re-run.
- One contact had no email address and was given a reserved \`.invalid\` address.
- One message has images on a host the importer does not fetch from. They stay links and break when the Freshdesk account closes.

## Check it yourself

- [Full reconcile report](${REPORT}) (plain text, as the importer wrote it)
- [Counts as CSV](${CSV})
- Run the same importer on your account: [import guide](/docs/import-freshdesk), or let us do it: [done-for-you migration](/migrate/freshdesk/done-for-you).`;

const page: Page = {
  jsonLd: [],
  name: 'Freshdesk import receipt',
  path: '/migrate/freshdesk/receipt',
  section: 'Migrate',
  title: 'Freshdesk import receipt: 388 tickets, 74 attachments, $0',
  description:
    'One real Freshdesk import into Colliedesk, unedited: 388/388 tickets, 74/74 attachments checked by SHA-256, 35 minutes, and what it could not prove.',
  summary: 'Receipt of a real Freshdesk import (our own account, 27 Oct 2026): 388/388 tickets, 451 messages, 74 attachments by SHA-256, 35 min (29 min rate limit), $0; status UNVERIFIED because the archive endpoint was refused',
  eyebrow: 'Migrate · Receipt',
  h1: 'Receipt: our own Freshdesk import, unedited',
  lede: '388 tickets, 451 messages and 74 attachments moved from Freshdesk to Colliedesk in 35 minutes, at no cost. Here is the reconcile report, including the part it could not prove.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
