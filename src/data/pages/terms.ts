import { techArticle } from '../../lib/schema';
import type { Page } from '../../lib/page';
import { LEGAL_UPDATED, CONTACT_EMAIL } from './privacy';

const body = `## The short version

- Colliedesk is open source. These terms cover **Colliedesk Cloud**, the version we run for you. Self-hosting follows the [AGPL-3.0 license](/open-source) only.
- Every workspace starts with a 14-day free trial, no card (30 days if you import from Freshdesk). One trial per person and company.
- When the trial or subscription ends, the workspace locks. You can still export everything.
- Your data stays yours. You can export it and leave at any time.
- Do not use Colliedesk to send spam or to break the law.
- Every paid Cloud plan comes with 99.9% monthly uptime, measured on [status.colliedesk.com](https://status.colliedesk.com), service credits if we miss it, and a first response within 2 hours, any hour, when your workspace is down. See [Availability and service level](#availability-and-service-level).

## Who you agree with

These terms are an agreement between you and **HC Labs Co., Ltd.** (CÔNG TY TNHH HC LABS), Hanoi, Vietnam ("we"). If you create a workspace for a company, you agree for that company and confirm that you may do so.

## Your account and workspace

- Give a real email address that you control. Sign-in codes go there.
- The workspace admins decide who joins, and are responsible for what their agents do in the workspace.
- Keep access to your email account secure. Anyone who can read it can sign in as you.

## Free trial

- A new workspace gets a 14-day trial of the Team plan with every feature. It extends to 30 days if you import from Freshdesk during the trial.
- One trial per person and company. Creating extra accounts to get more trials is not allowed. See the [privacy policy](/privacy) for how we check this.
- During the trial, Colliedesk sends replies only to customers who wrote to the workspace first, emails up to 200 people in 24 hours (everyone on a reply counts, including people copied on it), and stores up to 2 GiB of attachments. These limits stop spammers; a paid plan removes the trial limits, but each plan has its own attachment storage limit, shown on the [pricing page](/pricing).
- When the trial ends without a plan, the workspace is locked. You can sign in, export all your data and choose a plan. Choosing a plan unlocks it at once with nothing lost.

## Plans and payment

- Prices are on the [pricing page](/pricing). Payment is handled by Polar, our merchant of record, which also charges the applicable tax.
- Plans are paid in advance, monthly, quarterly (the Founding plan) or yearly, and renew automatically until you cancel.
- You can cancel at any time. The plan stays active until the end of the period you paid for, then the workspace locks.
- **Switch offer** (Team 25 and Business): we migrate your Freshdesk data and take the first payment only after your team answers its first real ticket in Colliedesk. **Invoice offer** (Team 25 and Business): send an invoice from Zendesk, Freshdesk, Help Scout or Intercom dated in the last 3 months. On a monthly plan your first paid month is free, up to the amount on that invoice; on a yearly plan you get 13 months for the price of one year. Once per workspace. The 14-day free trial is unchanged.
- A price change applies from your next renewal, never to a period you already paid for, and we email workspace admins before it applies. The Founding price stays locked for as long as you keep the subscription.

## Refunds

- **Founding 30-day money-back guarantee.** If Colliedesk is not right for you, email support@colliedesk.com within 30 days of your first Founding payment and we refund it in full. No questions asked, and a free Freshdesk migration we already did does not reduce the refund.
- **Switch offer 30-day money-back.** If we migrated your team to Team 25 or Business through the [switch offer](/migrate/freshdesk/switch), email support@colliedesk.com within 30 days of your first payment and we refund it in full.
- The guarantees cover the first payment, not renewals.
- We refund through Polar to the card you paid with. Your bank may take 5 to 10 business days to show it.
- When we refund, the Founding subscription ends and the workspace locks. You can still sign in and export everything.

## Your content

Everything you and your customers put into your workspace stays yours. You give us permission to store, process and display it only to run Colliedesk for you. We do not use it for anything else (see the [privacy policy](/privacy)).

You are responsible for having the right to put that content into Colliedesk, including your customers' personal data.

## Acceptable use

Do not use Colliedesk Cloud to:

- send spam or messages people did not ask for,
- send or store anything illegal, or anything that infringes other people's rights,
- attack, overload or probe the service or other workspaces,
- get around plan limits, trial rules or security controls.

## Suspension and ending

- You can stop using Colliedesk at any time and export your data first.
- We may suspend a workspace that breaks these terms or puts the service or other customers at risk. Where we can, we tell the admins first and give them a chance to fix the problem.
- A workspace that stays locked for 12 months is deleted. We email the admins 30 days before.

## Availability and service level

This section is our service level agreement. It applies to every paid Colliedesk Cloud workspace.

### Uptime

- **99.9% uptime per calendar month**, about 43 minutes of downtime at most.
- Uptime is measured on [status.colliedesk.com](https://status.colliedesk.com), which checks the service from several regions outside our servers. That page is the only source for the uptime figure and for any service credit.

### What does not count as downtime

- Maintenance we announce at least 48 hours ahead, on the status page and by email to workspace admins.
- Trial and Free workspaces. This service level applies to paid plans only.
- Problems outside our service, such as your own network or a third-party service you connected to your workspace.

### Service credits

If a month falls below 99.9%, a workspace admin can ask for a service credit. Email support@colliedesk.com within 30 days after that month ends. We check the month against the status page and apply the credit to your next invoice.

| Monthly uptime | Credit |
| --- | --- |
| Below 99.9% (more than about 43 minutes down) | 10% of that month's fee |
| Below 99.0% (more than about 7 hours down) | 25% of that month's fee |
| Below 95.0% (more than about 36 hours down) | 50% of that month's fee |

50% is the most we credit for one month. The fee is the monthly share of what you paid: a quarterly plan counts one third of the quarter, a yearly plan one twelfth of the year. Credits are not paid in cash. Credits and the right to leave below are the only remedies for missed uptime.

### Right to leave

If uptime is below 99.9% for 3 months in a row within any 12 months, you can cancel and get a pro-rata refund of what you prepaid.

### Support response

On every paid plan:

- **Workspace down or unusable:** first response within 2 hours, any hour, any day.
- **Everything else:** first response within 1 business day. Billing questions are support too.

Write to support@colliedesk.com.

### Backups

Every change to a Cloud database (conversations, messages, contacts, the knowledge base, settings) is copied continuously, encrypted, to another data centre in the EU, so losing a server loses at most 5 minutes of those changes. Attachment files, and a second copy of the database, are backed up every night, encrypted, in another data centre in the EU. We test a restore at least every 30 days. Features change; we write each change in the [changelog](/changelog).

## Warranty and liability

Colliedesk Cloud is provided "as is", without warranties beyond those the law requires.

To the extent the law allows, our total liability for any claim about Colliedesk Cloud is limited to the amount you paid us in the 12 months before the claim. We are not liable for indirect losses, such as lost profits or lost business. Nothing in these terms limits liability that cannot be limited by law.

## Law

These terms are governed by the laws of Singapore. If we disagree, we will first try to settle it by email in good faith. If that fails, the courts of Singapore decide.

## Changes to these terms

When we change these terms, we update the date at the top of this page and note it in the [changelog](/changelog). For changes that affect your rights, we email workspace admins before they apply.

## Contact

**${CONTACT_EMAIL}**. HC Labs Co., Ltd., Hanoi, Vietnam.`;

const page: Page = {
  jsonLd: [],
  name: 'Terms of service',
  path: '/terms',
  section: 'Product',
  title: 'Terms of service | Colliedesk',
  description:
    'The terms for Colliedesk Cloud: free trial, plans and payment, the 99.9% uptime commitment with service credits, support response times, your content, liability and the law that applies.',
  summary: 'Terms for Colliedesk Cloud: trial rules, payment through Polar, 99.9% uptime with service credits, support response times, your content, liability',
  eyebrow: 'Legal',
  h1: 'Terms of service',
  lede: `Short and readable. Last updated ${LEGAL_UPDATED}.`,
  updated: LEGAL_UPDATED,
  body,
};
page.jsonLd = [techArticle(page)];
export default page;
