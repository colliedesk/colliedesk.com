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
    q: 'How do I export Help Scout conversations to Google Sheets or Excel?',
    a: 'Run the script on this page to get `threads.csv`, one row per thread with the message text. In Google Sheets, click **File > Import** and upload the file. In Excel, use **Data > From Text/CSV**. The Reports export also gives an XLSX file, but without the messages.',
  },
  {
    q: 'Can I connect Help Scout to Looker Studio?',
    a: 'Google\'s list of available connectors for Looker Studio, called Data Studio again since April 2026, has no Help Scout entry. Import `threads.csv` into Google Sheets and connect that sheet with the Google Sheets connector, or upload the file with the CSV file upload connector.',
  },
  {
    q: 'Can Colliedesk import my Help Scout inbox?',
    a: 'Yes. The `collie import helpscout` command reads one inbox through the Inbox API 2.0 and ends with a reconcile report. The documented steps run it on your own Colliedesk server. See [Import from Help Scout](/docs/import-helpscout).',
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

const body = `Help Scout's Reports export (CSV or XLSX) leaves out the conversation thread contents, so the messages come out only through the Inbox API 2.0, which the Free plan does not include. The script below writes every thread to \`threads.csv\`, closed conversations included, and you open that file in Google Sheets with **File > Import** or in Excel with **Data > From Text/CSV**.

| What you get | Reports export | Customer list on request | Inbox API 2.0 |
|---|---|---|---|
| Conversation fields | Yes | No | Yes |
| Reporting data | Yes | No | Plus and Pro plans only |
| Replies, notes and other threads | No | No | Yes |
| Format | CSV or XLSX | CSV | JSON |
| Who can get it | Users with the "Reports: Export reporting data" permission | Account Owners, by asking Help Scout support | Any user with an app, on a plan with API access |

Want the threads in a spreadsheet or a report? Run the script, then follow the steps for [Google Sheets](#export-help-scout-conversations-to-google-sheets), [Excel](#help-scout-to-excel) or [Looker Studio](#help-scout-to-looker-studio). Leaving Help Scout, not keeping a copy? Skip the script: [Moving to Colliedesk](#moving-to-colliedesk) covers the importer, a command that reads the same API.

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

Help Scout says that exporting through the API is currently the only means of getting the rest of your data out. You need someone who can run a shell script; if that is not you, send them this section. This script reads one inbox and writes \`threads.csv\` with one row per thread. It has not been run against a live Help Scout account, so check the counts before you cancel (see below).

1. **Create an app.** Go to **Your Profile > My apps** and click **Create My App**. Help Scout asks for a redirection URL. This script uses the Client Credentials flow, so a placeholder URL such as https://www.google.com is enough.
2. **Use an active user.** The app must belong to an active, invited user in the account, or the API returns 401.
3. **Set three values** in your shell: \`HELPSCOUT_APP_ID\`, \`HELPSCOUT_APP_SECRET\` and \`MAILBOX\` (the inbox id).
4. **Run the script.** It needs \`curl\` and \`jq\`.
5. **Open \`threads.csv\`** in a spreadsheet. The \`body\` column holds the message HTML.

<details>
<summary>Show the script (44 lines of bash)</summary>

\`\`\`bash
${script}
\`\`\`

</details>

The script stops at the first failed request other than a 404 and prints the error, for example for a 401 or a 429. A 404 is skipped and logged (see the merged-conversation trap below). Rows go to \`threads.csv.partial\` and become \`threads.csv\` only when the run reaches the end, so a stopped run never looks complete.

## 3. Traps the API docs mention

- **Closed conversations are missing.** List Conversations returns active conversations unless you add \`status=all\`.
- **The token expires after 2 days.** The token response says \`expires_in: 172800\`. A 401 means: get a new token.
- **Chat threads are cut short** when you use \`embed=threads\` on the conversation list. Call List Threads for each conversation, as the script does.
- **Merged conversations return 404** on List Threads. Get Conversation returns 301 with the new location in the \`Location\` header for 60 days after the merge, and 404 after that. The script skips a conversation that returns 404 and writes its id to \`skipped-404.txt\`.
- **Threads come newest first**, sorted by \`createdAt\`. Sort the CSV by \`created_at\` if you want to read a conversation in order.
- **Threads are paged too,** up to 50 per page (conversations come 25 per page). A script that reads only the first page silently drops the oldest messages of a long conversation. This script follows \`page.totalPages\` for conversations and for threads.
- **Rate limits depend on your plan:** up to 200 calls per minute on Standard, 400 on Plus, 800 on Pro. All users in the account share one limit. Help Scout answers 429 and sends \`X-RateLimit-Retry-After\`. The script waits 0.35 seconds after every request, so it makes at most about 170 calls per minute, under the Standard limit.

## Export Help Scout conversations to Google Sheets

Help Scout's integrations page lists Google Sheets with one job: "Create conversations from new Google Sheets rows". That goes the other way. To get your conversations into a sheet, import \`threads.csv\` with Google's steps for Sheets on a computer:

1. Open a spreadsheet in Google Sheets, or create one.
2. Click **File > Import** and upload \`threads.csv\`.
3. Pick an import option, for example **Create new spreadsheet** or **Insert new sheets**.
4. Under **Separator character**, choose **Comma**.
5. Click **Import**.

A spreadsheet in Google Sheets holds up to 20 million cells or 100 MB. The script writes 6 columns per thread, so check the size of a big inbox first.

## Help Scout to Excel

For conversation fields only, the Reports export in section 1 already gives an XLSX file. For the message text, open \`threads.csv\`. These are Microsoft's steps for newer versions of Excel, such as Excel for Microsoft 365:

1. Click the cell where the data should start.
2. On the **Data** tab, in the **Get & Transform Data** group, click **From Text/CSV**.
3. Double-click \`threads.csv\` and click **Import**.
4. Under **Delimiter**, choose **Comma** and check the preview.
5. Select **Load > Load To**, pick where the data goes and click **OK**.

You can also open the file with **File > Open**. Excel then reads each column with its current default data format settings, so a date column may not come out the way you expect. Excel imports up to 1,048,576 rows, and \`threads.csv\` uses one row per thread plus a header row. A cell holds at most 32,767 characters, so check the \`body\` of your longest messages.

## Help Scout to Looker Studio

Looker Studio is called Data Studio again since April 2026, and its menus use the new name. Google's list of available connectors has no Help Scout entry, so both routes below start from the CSV the script writes.

**Through Google Sheets (keeps the message text).** Import \`threads.csv\` into Google Sheets as above, then:

1. Sign in to Data Studio.
2. Click **Create**, then **Data Source**.
3. Select the **Google Sheets** connector.
4. Select the spreadsheet and the worksheet. One data source connects to one worksheet.
5. Click **CONNECT**, then **CREATE REPORT**.

Keep the sheet in a normal Drive folder: Google says Data Studio does not support files on Team Drive.

**CSV file upload.** Click **Create**, then **Data source**, select the **CSV file upload** connector, click **Add data set**, upload the file and click **Connect**. The script's header row already follows Google's rule for column names: letters, numbers and underscores, starting with a letter. But file upload does not support line breaks inside your data, even in quotes, and the \`body\` column holds message HTML. If your messages have line breaks, use the Google Sheets route. File upload has a 100 MB limit per data set.

## Before you cancel Help Scout

1. Count the conversations in each inbox, including closed ones.
2. Run the script once per inbox, each in its own folder, and keep \`threads.csv\`, \`conversation-ids.txt\` and \`skipped-404.txt\`.
3. Compare the number of ids in \`conversation-ids.txt\` with your count, and look up every id in \`skipped-404.txt\` with Get Conversation (\`/v2/conversations/<id>\`). For a merge in the last 60 days it answers 301, and its \`Location\` header names the conversation it was merged into. For an older merge it answers 404.
4. Search \`threads.csv\` for a few conversations you know, and check that the replies are there.
5. Cancel only after the counts match.

## Moving to Colliedesk

Colliedesk's importer reads the same Inbox API 2.0, copies one Help Scout inbox per run and ends with a reconcile report that lists the id of every conversation it could not copy. It runs as a command; the steps in [Import from Help Scout](/docs/import-helpscout) run it on your own Colliedesk server. Its own docs say it has not yet been checked against a live Help Scout account. Comparing the two products first? Read [Colliedesk vs Help Scout](/vs/help-scout), then see [pricing](/pricing) for Cloud and self-host. Leaving Zendesk too? Read [Export your tickets from Zendesk](/migrate/zendesk/export).

## Sources

All read 24 November 2026.

- Reports export: [docs.helpscout.com article 849](https://docs.helpscout.com/article/849-export-reporting-data)
- Export options and the customer list: [docs.helpscout.com article 466](https://docs.helpscout.com/article/466-data-export-options)
- Google Sheets entry on Help Scout's integrations page: [helpscout.com/help-desk-integration](https://www.helpscout.com/help-desk-integration/)
- API access, reporting endpoints and rate limits per plan: [docs.helpscout.com article 1140](https://docs.helpscout.com/article/1140-mailbox-api)
- Authentication and tokens: [developer.helpscout.com authentication](https://developer.helpscout.com/mailbox-api/overview/authentication/)
- List Conversations: [developer.helpscout.com](https://developer.helpscout.com/mailbox-api/endpoints/conversations/list/)
- Get Conversation (301 for 60 days after a merge): [developer.helpscout.com](https://developer.helpscout.com/mailbox-api/endpoints/conversations/get/)
- List Threads: [developer.helpscout.com](https://developer.helpscout.com/mailbox-api/endpoints/conversations/threads/list/)
- Rate limiting: [developer.helpscout.com rate limiting](https://developer.helpscout.com/mailbox-api/overview/rate-limiting/)
- Pagination (50 items per page, 25 for List Conversations, \`?page=\`): [developer.helpscout.com pagination](https://developer.helpscout.com/mailbox-api/overview/pagination/)
- Import a CSV into Google Sheets: [Google Docs Editors Help](https://support.google.com/docs/answer/40608?hl=en)
- Google Sheets size limit: [Google Drive Help](https://support.google.com/drive/answer/37603?hl=en)
- Import a CSV into Excel and the row limit: [Microsoft Support](https://support.microsoft.com/en-us/office/import-or-export-text-txt-or-csv-files-5250ac4c-663c-47ce-937b-339e391393ba)
- Excel cell limit: [Excel specifications and limits](https://support.microsoft.com/en-us/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3)
- Looker Studio renamed Data Studio: [Welcome to Data Studio](https://docs.cloud.google.com/data-studio/welcome)
- Data Studio connectors: [Available connectors](https://docs.cloud.google.com/data-studio/available-connectors)
- Connect a Google Sheet to Data Studio: [Connect to Google Sheets](https://docs.cloud.google.com/data-studio/connect-to-google-sheets)
- CSV upload rules and limits: [Upload CSV files to Data Studio](https://docs.cloud.google.com/data-studio/upload-csv-files)`;

const page: Page = {
  jsonLd: [],
  name: 'Export conversations from Help Scout',
  path: '/migrate/help-scout/export',
  updated: '2026-11-24',
  section: 'Migrate',
  title: 'Help Scout to Google Sheets or Excel: Every Thread as CSV',
  description:
    'Help Scout\'s Reports CSV leaves out the messages. Export every thread to one CSV, then open it in Google Sheets, Excel or Looker Studio with each tool\'s steps.',
  summary: 'Export Help Scout conversations to Google Sheets, Excel or Looker Studio: Reports export (fields only) vs Inbox API (every thread); a CSV script, import steps and the API traps',
  eyebrow: 'Migrate · Help Scout · Export',
  h1: 'Export Help Scout conversations to Google Sheets, Excel or Looker Studio, with the message text the Reports CSV leaves out',
  lede: 'The Reports CSV has the conversation fields but not the messages. This page gives a script for them, the import steps for Google Sheets, Excel and Looker Studio, and the counts to check before you cancel.',
  cta: true,
  ctaCall: { href: '/docs/import-helpscout', label: 'Import from Help Scout' },
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
