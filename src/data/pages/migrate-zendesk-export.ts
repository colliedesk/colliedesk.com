import { TRIAL_HREF } from '../../lib/site';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';

const faq: Faq[] = [
  {
    q: 'How do I export Zendesk tickets with comments?',
    a: 'Two routes keep the conversation. The JSON or XML data export in **Admin Center > Account > Tools > Reports** has comments, but Zendesk Support must turn it on first and it is not on Team plans. The Incremental Ticket Event Export API with `include=comment_events` returns every comment on any plan.',
  },
  {
    q: 'Does the Zendesk CSV export include ticket comments?',
    a: 'No. The CSV export has ticket fields and metrics. It leaves out ticket comments, ticket descriptions, deleted tickets, multi-line text and multi-select fields, custom date fields and tickets larger than 1 MB.',
  },
  {
    q: 'Can I export Zendesk tickets on the Team plan?',
    a: 'Not with the built-in data export: Zendesk lists it for Growth, Professional, Enterprise and Enterprise Plus (Suite), and Professional and Enterprise (Support). Zendesk says customers on all plans can use the REST API to export data instead.',
  },
  {
    q: 'How do I export users and organizations from Zendesk?',
    a: 'In the JSON export, pick users or organizations as the data type. The XML user export holds users, groups and organizations, without custom user or organization fields. On any plan, the Incremental User Export and Incremental Organization Export endpoints return them through the API.',
  },
  {
    q: 'Can Colliedesk import my Zendesk export?',
    a: 'Not yet. Colliedesk imports from Freshdesk and Help Scout today. A Zendesk importer is on the [roadmap](/roadmap) under Later. Export your data now anyway: a backup taken before you cancel cannot be taken after.',
  },
];

const script = String.raw`set -euo pipefail
umask 077
Z="https://$ZENDESK_SUBDOMAIN.zendesk.com"
trap 'rm -f auth-header.txt page.json headers.txt' EXIT

# 1. Get a read-only token that lasts 2 days. The secret goes through stdin.
TOKEN=$(printf '%s' "$ZENDESK_CLIENT_SECRET" |
  curl -sSf -X POST "$Z/oauth/tokens" --data-urlencode client_secret@- \
    -d grant_type=client_credentials --data-urlencode "client_id=$ZENDESK_CLIENT_ID" \
    -d scope=read -d expires_in=172800 | jq -er .access_token)
printf 'Authorization: Bearer %s\n' "$TOKEN" > auth-header.txt

# 2. Read one incremental export from the start, one page every 6 seconds.
export_all() { # $1 = name in the response, $2 = extra query parameters
  local name=$1 extra=$2 start=0 code wait
  : > "$name.ndjson.partial"
  while :; do
    code=$(curl -sS -o page.json -D headers.txt -w '%{http_code}' -H @auth-header.txt \
      "$Z/api/v2/incremental/$name.json?start_time=$start$extra")
    if [ "$code" = 429 ]; then
      wait=$(awk -F': ' 'tolower($1)=="retry-after" {print $2+0}' headers.txt)
      [ -n "$wait" ] || wait=60
      sleep "$wait"; continue
    fi
    [ "$code" = 200 ] || { echo "HTTP $code on $name" >&2; exit 1; }
    jq -c --arg n "$name" '.[$n][]' page.json >> "$name.ndjson.partial"
    [ "$(jq -r .end_of_stream page.json)" = true ] && break
    start=$(jq -er .end_time page.json)
    sleep 6
  done
  mv "$name.ndjson.partial" "$name.ndjson"
}

# 3. Every comment, every user, every organization.
export_all ticket_events '&include=comment_events&support_type_scope=all'
export_all users ''
export_all organizations ''
# Time-based exports can repeat an item, so count unique ids.
count() { jq -r "$1" "$2" | sort -u | wc -l; }
echo "done: $(count .ticket_id ticket_events.ndjson) tickets," \
  "$(count .id users.ndjson) users, $(count .id organizations.ndjson) organizations"`;

const body = `The Zendesk CSV export has no comments, so the full conversation comes out only through the JSON or XML data export or the Incremental Ticket Event Export API with \`include=comment_events\`. Team plans have no data export and Zendesk stopped new API tokens on 27 October 2026, so section 3 gives a 41-line script that gets an OAuth token and exports every comment, user and organization on any plan.

| What you get | Data export: CSV | Data export: JSON | Data export: XML | Incremental Export API |
|---|---|---|---|---|
| Ticket fields, tags, status, timestamps | Yes | Yes | Yes, without custom ticket fields | Yes |
| Ticket comments (the conversation) | No | Yes, except tickets over 1 MB | Yes | Yes, from \`ticket_events\` with \`include=comment_events\` |
| Users and organizations | No | Yes, one data type per export | Yes, without custom fields | Yes, separate endpoints |
| Account size | Any | Any; above 1 million tickets it comes in 31-day parts | Up to 200,000 tickets and 500 MB | Any |
| Plans | Growth and up (Suite), Professional and up (Support) | Same | Same | Every plan |
| Turned on by default | No | No | No | Yes, for an admin's OAuth token |

Leaving Zendesk with no backup needed? Skip to [Moving to Colliedesk](#moving-to-colliedesk).

## 1. Turn on the data export

Data export is **off by default**.

1. The account owner contacts Zendesk Customer Support.
2. Include your Zendesk subdomain in the request.
3. Wait until Zendesk confirms that exports are on.

## 2. Run the data export

1. In **Admin Center**, select **Account**, then **Tools > Reports**.
2. Select the **Export** tab.
3. Choose the format:
   - **JSON:** pick a date range and a data type: tickets, users or organizations. Zendesk recommends JSON above 200,000 tickets.
   - **CSV:** pick a date range. Ticket fields only, no comments.
   - **XML:** select **request file** next to **Full XML export** (tickets with comments, users, organizations, groups, account settings) or **User XML export** (users, groups, organizations). No date range.
4. Wait for the email. Zendesk says a large export can take a day or more.
5. Download the zip from the link. Zendesk keeps the link valid for at least three days.

JSON and CSV exports skip anything updated in the 6 minutes before you ask. Run a last export after your team stops working in Zendesk. AI agent tickets cannot be exported this way.

## 3. Export tickets with comments through the API

The API is the route for Team plans, and the one that lets a script count what it read. One request returns up to 1,000 ticket events, with each comment's author, text and attachments:

\`\`\`bash
curl -sS -H @auth-header.txt \\
  "https://yoursubdomain.zendesk.com/api/v2/incremental/ticket_events.json?start_time=0&include=comment_events"
\`\`\`

\`auth-header.txt\` holds one line, \`Authorization: Bearer <token>\`; the script below writes it. Without \`include=comment_events\`, the events say only that a comment exists, not what it says.

**Get a token first.** Zendesk stopped all new API tokens on 27 October 2026. An existing token works until 30 April 2027 only if it is used at least once every 30 days; an unused one deactivates after 30 days. Use an OAuth token instead:

1. In **Admin Center**, open **Apps and integrations > APIs > OAuth clients** and add a client. You must be an admin.
2. Set the client kind to **Confidential**. The script uses the client credentials flow, which needs no redirect URL.
3. Copy the **Identifier** and the **Secret**. Zendesk shows the secret only once.
4. Set three values in your shell: \`ZENDESK_SUBDOMAIN\`, \`ZENDESK_CLIENT_ID\` (the Identifier) and \`ZENDESK_CLIENT_SECRET\`.

The script below writes \`ticket_events.ndjson\` (every comment), \`users.ndjson\` and \`organizations.ndjson\`, one JSON object per line. It needs \`curl\` and \`jq\`. We ran it against a local stand-in for the Zendesk API, not a live Zendesk account, so check the counts before you cancel.

<details>
<summary>Show the script (41 lines of bash)</summary>

\`\`\`bash
${script}
\`\`\`

</details>

The script waits 6 seconds between pages to stay under the rate limit below. On a 429 it waits for the time in the \`Retry-After\` header. Rows go to a \`.partial\` file that is renamed only when Zendesk reports \`end_of_stream\`, so a stopped run never looks complete.

## Limits and traps in the Zendesk docs

- **Rate limit.** Incremental exports allow 10 requests per minute on every plan, or 30 with the High Volume API add-on. The add-on needs Suite Growth or Support Professional and up, with at least 10 agent seats.
- **Duplicates.** Time-based exports can return the same item twice. Zendesk says to filter ticket events by \`id\` and \`created_at\`, users and organizations by \`id\` and \`updated_at\`. The script counts unique ids for the same reason.
- **AI agent tickets.** The API leaves them out unless you add \`support_type_scope=all\`, as the script does.
- **Deleted tickets** stay in the API stream. Zendesk scrubs their content 30 days after deletion, or at once when you permanently delete them, and drops the record 90 days after permanent deletion.
- **The last minute is missing.** The ticket and ticket event exports never return the most recent minute.
- **Third-party apps lose access.** Zendesk is closing the incremental APIs to third-party apps and integrations between 2 December 2026 and 19 January 2027, Marketplace or not. Zendesk keeps them open for internal integrations, such as a script your own admin runs. A migration vendor that exports for you must use other endpoints; an admin can request a 60-day extension for it in **Apps & integrations > APIs > API Configuration**.

## Messaging tickets: who wrote each comment

Zendesk stores messaging comments differently. In the ticket event export, a messaging ticket shows the chat transcript, but without \`author_id\`, because the comment appears as a system update. To get the author of each message, call the ticket audits endpoint for that ticket: \`/api/v2/tickets/{ticket_id}/audits\`. Take the ticket ids from \`ticket_events.ndjson\` first.

## Storage limits: a reason to export

Zendesk storage is a base amount per account plus an amount per agent:

| Plan | Data storage | File storage |
|---|---|---|
| Team | 10 GB + 50 MB per agent | 10 GB + 2 GB per agent |
| Growth, Professional | 10 GB + 100 MB per agent | 10 GB + 5 GB per agent |
| Enterprise, Enterprise Plus | 10 GB + 200 MB per agent | 10 GB + 10 GB per agent |

Archived tickets count; deleted tickets do not. Admins see a warning above 80%. To free space, Zendesk suggests exporting the data as a backup, through the data export or the Incremental Exports API, and then deleting it from the account. Your usage is in **Admin Center > Account > Usage > Storage**.

## Before you cancel Zendesk

1. Count your tickets in Zendesk, including closed ones.
2. Take a JSON or XML export, or run the script, and keep the files.
3. Download the attachments from the URLs in the comments, and open a few to check them.
4. Compare the ticket count in your export with the count in Zendesk. Deleted and AI agent tickets explain some differences.
5. Cancel only after the counts match.

## Moving to Colliedesk

Colliedesk imports from Freshdesk and Help Scout today, and each import ends with a reconcile report that compares what the old helpdesk holds with what Colliedesk holds. A Zendesk importer is on the [roadmap](/roadmap) under Later. Leaving Zendesk before it ships? Keep your export as the backup and start fresh on Colliedesk Cloud: one flat price for the workspace with no per-agent fees, every feature on every plan, and a 14-day free trial with no card. [Start the free trial](${TRIAL_HREF}), or compare the plans on [Colliedesk pricing](/pricing). Comparing the two products first? Read [Colliedesk vs Zendesk](/vs/zendesk). Leaving Help Scout too? Read [Export conversations from Help Scout](/migrate/help-scout/export).

## Sources

All read 24 November 2026.

- Data export, formats, plans and limits: [support.zendesk.com article 4408886165402](https://support.zendesk.com/hc/en-us/articles/4408886165402-Exporting-ticket-user-or-organization-data-from-your-account)
- Incremental Exports API (endpoints, \`comment_events\`, \`per_page\`, \`support_type_scope\`, 10 requests per minute): [developer.zendesk.com incremental exports](https://developer.zendesk.com/api-reference/ticketing/ticket-management/incremental_exports/)
- Start time, \`end_of_stream\`, duplicates and deleted tickets: [developer.zendesk.com using the Incremental Exports API](https://developer.zendesk.com/documentation/api-basics/working-with-data/using-the-incremental-export-api/)
- Rate limits and the High Volume add-on: [developer.zendesk.com rate limits](https://developer.zendesk.com/api-reference/introduction/rate-limits/)
- API tokens stop: [support.zendesk.com article 10840968198042](https://support.zendesk.com/hc/en-us/articles/10840968198042-Announcing-the-removal-of-API-tokens-as-an-authentication-method-for-API-requests)
- OAuth client and client credentials: [developer.zendesk.com OAuth migration](https://developer.zendesk.com/documentation/authentication/oauth-migration/) and [token scopes and expiry](https://developer.zendesk.com/api-reference/ticketing/oauth/grant_type_tokens/)
- Third-party access to incremental APIs ends: [support.zendesk.com article 11275429993498](https://support.zendesk.com/hc/en-us/articles/11275429993498-Announcing-end-of-availability-of-Incremental-APIs-for-third-party-developers)
- Messaging ticket comments: [support.zendesk.com article 7513261399706](https://support.zendesk.com/hc/en-us/articles/7513261399706-How-to-export-messaging-ticket-comments-with-author-information)
- Storage limits: [support.zendesk.com article 4408835043994](https://support.zendesk.com/hc/en-us/articles/4408835043994-Managing-data-storage-in-your-Zendesk-account)
- Attachments in comments: [developer.zendesk.com ticket comments](https://developer.zendesk.com/api-reference/ticketing/tickets/ticket_comments/)`;

const page: Page = {
  jsonLd: [],
  name: 'Export tickets from Zendesk',
  path: '/migrate/zendesk/export',
  updated: '2026-11-24',
  section: 'Migrate',
  title: 'Export Zendesk tickets with comments: a 41-line OAuth script',
  description:
    'The Zendesk CSV export has no comments and new API tokens stopped on 27 October 2026. Export every comment, user and organization, on any plan, step by step.',
  summary: 'Export Zendesk tickets with comments, users and organizations: CSV vs JSON/XML vs Incremental Export API with OAuth; plans, limits, a script and the 2026 API changes',
  eyebrow: 'Migrate · Zendesk · Export',
  h1: 'Export every Zendesk comment, user and organization with one 41-line script, on any plan',
  lede: 'The CSV leaves out every comment, the built-in export is not on Team plans, and Zendesk stopped new API tokens on 27 October 2026. Here is the route that still works in each case.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
