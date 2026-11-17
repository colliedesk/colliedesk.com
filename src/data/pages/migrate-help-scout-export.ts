import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';

const faq: Faq[] = [
  {
    q: 'Does the Help Scout export include the conversation text?',
    a: 'No. The Reports export (CSV or XLSX) has conversation fields and reporting data, but Help Scout leaves out the conversation thread contents. The replies and notes come out only through the Inbox API.',
  },
  {
    q: 'Can I export Help Scout conversations on the Free plan?',
    a: 'Not the thread text. The Free plan does not include access to the API, and the Reports export leaves the thread contents out.',
  },
  {
    q: 'How long does a Help Scout API token last?',
    a: 'Two days: the token response says `expires_in: 172800` seconds. When the API answers 401, request a new token with the same app ID and secret.',
  },
  {
    q: 'Why does my export miss closed conversations?',
    a: 'List Conversations returns active conversations by default. Add `status=all` to the request to get every status.',
  },
  {
    q: 'Can Colliedesk import my Help Scout inbox?',
    a: 'Yes, on a self-hosted Colliedesk server. The `collie import helpscout` command reads one inbox through the Inbox API 2.0 and ends with a reconcile report. See [Import from Help Scout](/docs/import-helpscout).',
  },
];

const script = String.raw`set -euo pipefail
umask 077
API=https://api.helpscout.net/v2
trap 'rm -f auth-header.txt' EXIT
rm -f threads.csv skipped-404.txt

# 1. Get a token. The secret goes through stdin, not the command line.
TOKEN=$(printf 'grant_type=client_credentials&client_id=%s&client_secret=%s' \
  "$HELPSCOUT_APP_ID" "$HELPSCOUT_APP_SECRET" |
  curl -sSf -X POST "$API/oauth2/token" --data @- | jq -er .access_token)
printf 'Authorization: Bearer %s\n' "$TOKEN" > auth-header.txt

# 2. List every conversation id in one inbox, page by page.
: > conversation-ids.txt
page=1
while :; do
  curl -sSf -H @auth-header.txt \
    "$API/conversations?mailbox=$MAILBOX&status=all&page=$page" > conv-page.json
  sleep 0.35
  jq -r '(._embedded.conversations // [])[].id' conv-page.json >> conversation-ids.txt
  [ "$page" -ge "$(jq -er .page.totalPages conv-page.json)" ] && break
  page=$((page + 1))
done

# 3. Fetch every page of threads for each conversation: one CSV row per thread.
echo 'conversation_id,thread_id,type,created_at,author_email,body' > threads.csv.partial
: > skipped-404.txt
while read -r id; do
  page=1
  while :; do
    code=$(curl -sS -o thread-page.json -w '%{http_code}' -H @auth-header.txt \
      "$API/conversations/$id/threads?page=$page")
    sleep 0.35
    if [ "$code" = 404 ]; then echo "$id" >> skipped-404.txt; break; fi
    [ "$code" = 200 ] || { echo "HTTP $code on conversation $id" >&2; exit 1; }
    jq -r --arg c "$id" '(._embedded.threads // [])[]
      | [$c, .id, .type, .createdAt, (.createdBy.email // ""), (.body // "")]
      | @csv' thread-page.json >> threads.csv.partial
    [ "$page" -ge "$(jq -er .page.totalPages thread-page.json)" ] && break
    page=$((page + 1))
  done
done < conversation-ids.txt
mv threads.csv.partial threads.csv
echo "done: $(wc -l < conversation-ids.txt) conversations, $(wc -l < skipped-404.txt) skipped (404)"`;

const body = `Help Scout's Reports export (CSV or XLSX) leaves out the conversation thread contents, so the messages come out only through the Inbox API 2.0, which the Free plan does not include. The script below writes every thread to \`threads.csv\`, including closed conversations, which the API hides unless you add \`status=all\`.

| What you get | Reports export | Customer list on request | Inbox API 2.0 |
|---|---|---|---|
| Conversation fields | Yes | No | Yes |
| Reporting data | Yes | No | Plus and Pro plans only |
| Replies, notes and other threads | No | No | Yes |
| Format | CSV or XLSX | CSV | JSON |
| Who can get it | Users with the "Reports: Export reporting data" permission | Account Owners, by asking Help Scout support | Any user with an app, on a plan with API access |

## 1. Reports export: fields only

1. Open **Reports** and pick a report: All Channels, Email, Company, User or Happiness.
2. Set the date range.
3. Click the **Export/Print** icon, then **Export**.
4. Choose **CSV** or **XLSX** and click **Export**.
5. Open the email titled "Data export from Help Scout" and click **Download**. Log in as the same user who ran the export.

Each report exports a different set of conversations:

| Report | Conversations in the export |
|---|---|
| All Channels | Conversations with activity in the date range, without spam and deleted ones |
| Email | Resolved email conversations |
| Company | Unique conversations |
| User or Team | That user's or team's conversations |
| Happiness | Rated conversations |

Times in the XLSX file are in UTC. Times in the CSV file use the company time zone from **Settings > Company**.

## 2. Inbox API: every thread, as a CSV

Help Scout says that exporting through the API is currently the only means of getting the rest of your data out. This script reads one inbox and writes \`threads.csv\` with one row per thread. It has not been run against a live Help Scout account, so check the counts before you cancel (see below).

1. **Create an app.** Go to **Your Profile > My apps** and click **Create My App**. Help Scout asks for a redirection URL. This script uses the Client Credentials flow, so a placeholder URL such as https://www.google.com is enough.
2. **Use an active user.** The app must belong to an active, invited user in the account, or the API returns 401.
3. **Set three values** in your shell: \`HELPSCOUT_APP_ID\`, \`HELPSCOUT_APP_SECRET\` and \`MAILBOX\` (the inbox id).
4. **Run the script.** It needs \`curl\` and \`jq\`.
5. **Open \`threads.csv\`** in a spreadsheet. The \`body\` column holds the message HTML.

\`\`\`bash
${script}
\`\`\`

The script stops at the first failed request other than a 404 and prints the error, for example for a 401 or a 429. A 404 is skipped and logged (see the merged-conversation trap below). Rows go to \`threads.csv.partial\` and become \`threads.csv\` only when the run reaches the end, so a stopped run never looks complete.

## 3. Traps the API docs mention

- **Closed conversations are missing.** List Conversations returns active conversations unless you add \`status=all\`.
- **The token expires after 2 days.** The token response says \`expires_in: 172800\`. A 401 means: get a new token.
- **Chat threads are cut short** when you use \`embed=threads\` on the conversation list. Call List Threads for each conversation, as the script does.
- **Merged conversations return 404** on List Threads. Get Conversation returns 301 with the new location in the \`Location\` header for 60 days after the merge, and 404 after that. The script skips a conversation that returns 404 and writes its id to \`skipped-404.txt\`.
- **Threads come newest first**, sorted by \`createdAt\`. Sort the CSV by \`created_at\` if you want to read a conversation in order.
- **Threads are paged too,** up to 50 per page (conversations come 25 per page). A script that reads only the first page silently drops the oldest messages of a long conversation. This script follows \`page.totalPages\` for conversations and for threads.
- **Rate limits depend on your plan:** up to 200 calls per minute on Standard, 400 on Plus, 800 on Pro. All users in the account share one limit. Help Scout answers 429 and sends \`X-RateLimit-Retry-After\`. The script waits 0.35 seconds after every request, so it makes at most about 170 calls per minute, under the Standard limit.

## Before you cancel Help Scout

1. Count the conversations in each inbox, including closed ones.
2. Run the script once per inbox, each in its own folder, and keep \`threads.csv\`, \`conversation-ids.txt\` and \`skipped-404.txt\`.
3. Compare the number of ids in \`conversation-ids.txt\` with your count, and look up every id in \`skipped-404.txt\` with Get Conversation (\`/v2/conversations/<id>\`). For a merge in the last 60 days it answers 301, and its \`Location\` header names the conversation it was merged into. For an older merge it answers 404.
4. Search \`threads.csv\` for a few conversations you know, and check that the replies are there.
5. Cancel only after the counts match.

## Moving to Colliedesk

Colliedesk's importer reads the same Inbox API 2.0, copies one Help Scout inbox per run and ends with a reconcile report that lists the id of every conversation it could not copy. It runs as a command on a self-hosted Colliedesk server; read [Import from Help Scout](/docs/import-helpscout) for the steps. Its own docs say it has not yet been checked against a live Help Scout account. Comparing the two products first? Read [Colliedesk vs Help Scout](/vs/help-scout), then see [pricing](/pricing) for Cloud and self-host. Leaving Zendesk too? Read [Export your tickets from Zendesk](/migrate/zendesk/export).

## Sources

All read 17 November 2026.

- Reports export: [docs.helpscout.com article 849](https://docs.helpscout.com/article/849-export-reporting-data)
- Export options and the customer list: [docs.helpscout.com article 466](https://docs.helpscout.com/article/466-export-data)
- API access, reporting endpoints and rate limits per plan: [docs.helpscout.com article 1140](https://docs.helpscout.com/article/1140-mailbox-api)
- Authentication and tokens: [developer.helpscout.com authentication](https://developer.helpscout.com/mailbox-api/overview/authentication/)
- List Conversations: [developer.helpscout.com](https://developer.helpscout.com/mailbox-api/endpoints/conversations/list/)
- Get Conversation (301 for 60 days after a merge): [developer.helpscout.com](https://developer.helpscout.com/mailbox-api/endpoints/conversations/get/)
- List Threads: [developer.helpscout.com](https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/list/)
- Rate limiting: [developer.helpscout.com rate limiting](https://developer.helpscout.com/mailbox-api/overview/rate-limiting/)
- Pagination (50 items per page, 25 for List Conversations, \`?page=\`): [developer.helpscout.com pagination](https://developer.helpscout.com/mailbox-api/overview/pagination/)`;

const page: Page = {
  jsonLd: [],
  name: 'Export conversations from Help Scout',
  path: '/migrate/help-scout/export',
  updated: '2026-11-17',
  section: 'Migrate',
  title: 'Help Scout Export: Thread Text to CSV, Closed Ones Too',
  description:
    'The Help Scout Reports export leaves out the messages. Export every thread to CSV through the Inbox API, with status=all so closed conversations come too.',
  summary: 'Export Help Scout conversations: Reports export (fields only) vs Inbox API (every thread); steps, a CSV script and the API traps',
  eyebrow: 'Migrate · Help Scout · Export',
  h1: 'Export the Help Scout thread text the Reports CSV leaves out, closed conversations included',
  lede: 'A 44-line bash script reads every conversation in one inbox from the Inbox API and writes one CSV row per thread: customer messages, replies, notes, chats and line items.',
  cta: true,
  ctaCall: { href: '/docs/import-helpscout', label: 'Import from Help Scout' },
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
