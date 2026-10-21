import { techArticle } from '../../lib/schema';
import type { Page } from '../../lib/page';
import { CONTACT_EMAIL } from '../../lib/site';

export const LEGAL_UPDATED = '2026-10-21';
export { CONTACT_EMAIL };

const body = `## The short version

- Your tickets, replies, notes, contacts and attachments belong to you. We store them to run your helpdesk and for nothing else.
- We do not sell personal data, show ads, or train AI models on your content.
- Colliedesk Cloud runs on servers in Germany. Backups are encrypted and also stay in Germany.
- You can export your whole workspace as a ZIP file at any time, even after your trial ends.
- A locked workspace is deleted 12 months after it locks. We email the admins 30 days before.
- To stop repeated free trials, we keep a one-way, keyed fingerprint of your email address. We cannot turn it back into your address.
- This website sets analytics cookies (Google Analytics and PostHog) only if you accept them in the cookie banner. Without them it counts visits without cookies.
- If you self-host Colliedesk, your data never reaches us.

The rest of this page says the same thing in more detail.

## Who we are

Colliedesk is made by **HC Labs Co., Ltd.** (CÔNG TY TNHH HC LABS), Hanoi, Vietnam, enterprise code 0111487156. In this policy, "we" means HC Labs.

- For your **account, billing and this website**, we decide how the data is used (we are the controller).
- For the **content of your workspace** (customer emails, replies, notes, contacts, attachments), your company decides. We process it only on your instructions, to run the service (we are the processor).

## What this policy covers

- Colliedesk Cloud at \`app.colliedesk.com\`.
- This website, \`colliedesk.com\`.

It does **not** cover a Colliedesk server that you run yourself. A self-hosted server sends us nothing except, if you leave it on, one anonymous usage report a day (a random install id, the version and counts: workspaces, active agents, replies sent) and which screens and buttons its agents use in the web app, with every piece of text masked. Never names, email addresses or message content. Turn both off with \`DISABLE_TELEMETRY=true\` or \`DO_NOT_TRACK=1\`.

## What we collect and why

| Data | Why | Where it comes from |
|---|---|---|
| Your email address and name | To sign you in and to tell you about your account | You, or Google if you sign in with Google |
| Workspace content: customer emails, replies, notes, contacts, tags, attachments | To run your helpdesk | You, your teammates and your customers |
| Permission to send email from a Gmail account an admin connects, and that account's address | To send your team's replies from your own address | Google, when an admin connects Gmail |
| Billing details: name, email, country, plan, invoices | To charge for Colliedesk Cloud | Polar, our payment provider. We never see your card number |
| A keyed fingerprint of your verified email address and of your IP address at sign-up | To allow one free trial per person and stop mass sign-ups | Your sign-up |
| Technical data: IP address, browser, request times, errors | To keep the service secure and to fix problems | Your browser |
| Usage counts: active agents, replies sent | To understand how Colliedesk is used, without names or content | The Colliedesk server |
| Your email address, if you subscribe to release notes | To send one email per release | You |

**About the sign-up fingerprint.** We store an HMAC (a one-way hash made with a secret key) of your verified email address and of your IP address. With it we can answer one question: "did this email already have a trial?" Nobody can read your email address from it. We keep it for as long as Colliedesk Cloud runs, because deleting it would allow a new trial.

## What we do not do

- We do not sell or rent personal data.
- We do not use your data for advertising or share it with ad networks.
- We do not use your workspace content to train AI models.
- We do not read your conversations. We look at workspace content only when you ask us for help, or when we must to keep the service secure or to follow the law.

## Google user data

Colliedesk's use and transfer of information received from Google APIs adheres to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.

When an admin connects Gmail, Colliedesk asks Google only for permission to send email and to see the account's address. It cannot read the mailbox. We use this access only to send the replies your team writes. The access Google gives us is encrypted and stored on our servers in Germany. We do not sell or transfer data received from Google, use it for advertising, or use it to train AI models, and people at Colliedesk do not read it except to keep the service secure, to follow the law, or when you ask us to.

## Where your data is stored

Colliedesk Cloud runs on Hetzner servers in Falkenstein, Germany. Database and attachment backups are encrypted before they leave the server and are kept on other Hetzner servers in Germany.

Some of the providers below are outside the European Union (for example in the United States). When personal data goes to them, we rely on their standard contractual clauses or an equivalent legal safeguard.

## Who helps us run Colliedesk

| Provider | What they do | Location |
|---|---|---|
| Hetzner | Servers and encrypted backups | Germany |
| Clerk | Sign-in with an email code or Google | United States |
| Google | Sign-in, only if you choose "Continue with Google" | United States |
| Google | Sends your replies through the Gmail API, only for workspaces that connect Gmail | United States |
| Polar | Payments, invoices and tax, as merchant of record | United States |
| Resend | Sends the replies your team writes, and our service emails | United States |
| Cloudflare | DNS and network protection | Global |
| PostHog | Website statistics (with a cookie only after you accept cookies) and anonymous usage counts. It does not store your IP address | United States |
| Google | Google Analytics website statistics, only after you accept cookies | United States |
| GitHub | Hosts this website and the Colliedesk source code | United States |

We will list a new provider on this page before it receives personal data.

## Cookies

Until you choose, or if you decline, this website counts visits with PostHog without cookies: nothing is stored in your browser and PostHog never builds a profile of you.

If you click **Accept** in the cookie banner, PostHog sets a \`ph_\` cookie so a later visit is recognised as yours, and the website loads Google Analytics, which sets the \`_ga\` cookies to tell visits apart. Both cookies last up to 1 year (\`_ga\` up to 14 months). Google Analytics is not loaded and sets nothing until you accept. We do not use either for advertising. Your choice is kept in your browser's local storage as \`colliedesk-consent\`, and PostHog keeps a copy of it in local storage too. You can change it at any time with **Cookie settings** at the bottom of every page; declining deletes the Google Analytics and PostHog cookies.

After you accept, PostHog also records how you move through this website (clicks, scrolling and page changes) so we can see where a page is unclear. Every form field is masked, so nothing you type is recorded, and recordings are deleted after 30 days. If a page shows a JavaScript error, PostHog receives the error message and the page address, with or without cookies.

If you accepted cookies and then start a Colliedesk Cloud trial, the app reads the random ID in that PostHog cookie and adds it to our record of the new trial, so we can see which page led you to us. It is never sent with your email address or workspace name.

The Colliedesk app uses only the cookies and storage that sign-in needs (set by us and by Clerk). There are no advertising or tracking cookies.

The Colliedesk app reports to PostHog which screens agents open and which buttons they click, so we can see what is used and what is confusing. On Colliedesk Cloud it names the agent by email address and display name, and the workspace by its name, so we know which customer we are helping. Every piece of text on screen is masked, so no conversation, message, contact or form content is sent; addresses are sent without search terms, and nothing is recorded or stored in the browser for it. The Cloud also counts, per workspace, when a support address is saved, a reply is sent and a teammate is invited, and once a day sends the workspace name with counts for each workspace (plan, active agents, replies, open conversations, connected channels), never any message text. Near the end of a trial an admin may see one question about what is still missing; the answer is sent to us only if the admin types it and presses Send. A self-hosted Colliedesk sends the same screen and button counts, with random ids instead of names and addresses, unless its operator sets \`DISABLE_TELEMETRY=true\`; the per-workspace counts are sent by Colliedesk Cloud only.

When you use **Report a problem** in Colliedesk Cloud, we receive what you write, any screenshots you attach, your name, email address and role, your workspace's name and plan, and the diagnostics listed under "What will be sent" before you press Send: app version, browser, the page you were on, recent error messages, recent failed requests with their request ids, and the names of your last actions. It becomes a support conversation in our own Colliedesk. Nothing from your conversations or contacts is included. On a self-hosted server the same button opens a prefilled GitHub issue instead, and nothing is sent to us unless you submit it.

## How long we keep data

- **Active workspace:** as long as your subscription or trial runs.
- **Ended trial or subscription:** the workspace is locked. You can still sign in and export everything.
- **Locked for 12 months:** we delete the workspace with all its content and attachments. We email the admins 30 days before.
- **Gmail access:** until an admin disconnects Gmail or the workspace is deleted. Disconnecting deletes it from our servers and asks Google to revoke it. You can also remove it at any time in your Google Account, under [Third-party connections](https://myaccount.google.com/connections).
- **Backups:** an encrypted copy can stay in backups for up to 30 days after a deletion, then it expires.
- **Sign-up fingerprints:** as long as Colliedesk Cloud runs (see above).
- **Billing records:** as long as tax and accounting law requires.

You can ask us to delete your workspace or account earlier. Email ${CONTACT_EMAIL} from an admin's address.

## Your rights

Wherever you live, you can ask us to:

- show you the personal data we hold about you,
- correct it,
- delete it,
- give you a copy in a portable format,
- stop using it for a purpose you object to.

A workspace admin can export the whole workspace (conversations, contacts, attachments) as a ZIP file from **Settings**, at any time. Customers of a company that uses Colliedesk should contact that company first: it controls their data, and we will help it answer.

If you are in the EU or the UK, you can also complain to your data protection authority.

## Security

- All traffic uses HTTPS.
- Colliedesk has no passwords. You sign in with a one-time code sent to your email, or with Google.
- Each workspace is isolated in the database with PostgreSQL row-level security. A query for one workspace cannot read another.
- Backups are encrypted, and the key is kept apart from the servers.

No system is perfectly secure. If we learn of a breach that affects your data, we will tell you without undue delay.

## Children

Colliedesk is a tool for businesses. It is not meant for anyone under 16, and we do not knowingly collect their data.

## Changes to this policy

When we change this policy, we update the date at the top of this page and note it in the [changelog](/changelog). If a change reduces your rights, we email workspace admins before it takes effect.

## Contact

Questions or requests: **${CONTACT_EMAIL}**. HC Labs Co., Ltd., Hanoi, Vietnam.

See also our [terms of service](/terms).`;

const page: Page = {
  jsonLd: [],
  name: 'Privacy policy',
  path: '/privacy',
  section: 'Product',
  title: 'Privacy policy | Colliedesk',
  description:
    'How Colliedesk Cloud and colliedesk.com handle personal data: what we collect, the providers we use, where data is stored (Germany), how long we keep it and your rights.',
  summary: 'What Colliedesk collects, why, who helps run it, where it is stored, how long it is kept, your rights',
  eyebrow: 'Legal',
  h1: 'Privacy policy',
  lede: `Plain English, no surprises. Last updated ${LEGAL_UPDATED}.`,
  updated: LEGAL_UPDATED,
  body,
};
page.jsonLd = [techArticle(page)];
export default page;
