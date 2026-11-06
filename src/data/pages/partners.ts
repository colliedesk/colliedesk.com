import { techArticle } from '../../lib/schema';
import type { Page } from '../../lib/page';
import { CONTACT_EMAIL } from '../../lib/site';

const body = `## The short version

- You get **30% of what each customer you refer actually pays Colliedesk, for their first 12 months.**
- We pay by hand, once a month, by bank transfer or PayPal, after the customer's payment has cleared.
- There is no sign-up form and no dashboard. You email us, the founder answers, and you get a link.

## Who it suits

Consultants and writers who help teams leave Freshdesk or Zendesk, and who would recommend Colliedesk to them anyway. Read what you would be recommending first: the [Freshdesk migration](/migrate/freshdesk), the [pricing](/pricing) and the [open-source license](/open-source). If you would not suggest it, this is not for you.

## How to join

1. Email **${CONTACT_EMAIL}** and tell us who you are and who your audience is.
2. The founder replies personally.
3. If it fits, you get your link: \`https://colliedesk.com/?via=yourname\`.

## How the link works

When someone opens your link, the site remembers it for that visit, up to 1 day, in the browser tab. If they start a trial from the same visit, the workspace is marked with your name. That is all it does. It is **not** a long-lasting cookie: if a visitor comes back another day, or opens a new tab later, the link no longer counts. Send people to your link at the moment you recommend us.

## Commission

- **30%** of the amount the referred customer actually pays Colliedesk, for their first **12 months** of paying.
- Refunds and chargebacks are not commissioned. If we refund a payment, no commission is due on it.
- We pay once a month, after the customer's payment has cleared, by bank transfer or PayPal. We ask you for the details when the first payment arrives.

## Rules

- No self-referrals. Do not use your own link for your own workspace or your own company.
- No paid ads that bid on the Colliedesk brand name.
- No spam. Do not send unrequested messages or post the link where it is not welcome.
- Say that it is a partner link. Your readers should know you may earn a commission.

We can end a partnership if these rules are broken, and commission for payments that came from rule-breaking is not paid. Questions: **${CONTACT_EMAIL}**.`;

const page: Page = {
  jsonLd: [],
  name: 'Partners',
  path: '/partners',
  section: 'Product',
  title: 'Partner program | Colliedesk',
  description:
    'Recommend Colliedesk and earn 30% of what each customer you refer pays for their first 12 months. Paid by hand each month. Email us to get your link.',
  summary: 'Partner program: 30% of what a referred customer pays for 12 months, paid monthly by hand; join by email',
  eyebrow: 'Partners',
  h1: 'Partner program',
  lede: 'Recommend Colliedesk to teams leaving Freshdesk or Zendesk and earn 30% of what they pay for their first 12 months.',
  updated: '2026-11-06',
  body,
};
page.jsonLd = [techArticle(page)];
export default page;
