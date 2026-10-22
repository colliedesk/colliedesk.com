import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { dollars, PRICE, SMALL } from '../../lib/site';
import { readOnLabel, rowsAt, usd, vsMarkdown, type VsPricing } from '../../lib/vs-pricing';
import { collieFacts as c, statusTable } from './collie-status';

const pricing: VsPricing = {
  competitor: 'Freshdesk',
  readOn: '2026-10-17',
  // Monthly-billing prices, so they compare like for like with Colliedesk billed monthly. The
  // annual-billing prices (Growth $19, Pro $55, Copilot $29) only limit where we claim to cost less.
  billing: 'per agent, billed monthly',
  plans: [
    { name: 'Freshdesk Growth', perAgent: 23, annualPerAgent: 19 },
    { name: 'Freshdesk Pro', perAgent: 66, annualPerAgent: 55 },
    { name: 'Freshdesk Pro + Freddy AI Copilot', perAgent: 66, aiPerAgent: 35, annualPerAgent: 55 + 29 },
  ],
  forYou: [
    'You pay Freshdesk per agent, then again per agent for AI, and the bill grows with every hire.',
    'Most of your support is email. The email channel (inbound and outbound, threading) is available now.',
    'You want your tickets in a PostgreSQL database you control, or to self-host for free.',
    'Your Freshdesk renewal is months away, so you can plan the move around our [roadmap](/roadmap).',
  ],
  notForYou: [
    'You need live chat, phone, WhatsApp or a marketplace of apps today.',
    'You need a new conversation started from the inbox, contact history or AI today: they are not there yet (beta and later), and Colliedesk is alpha, so the interface may change.',
    'You want the founding price and have more than 20 GB of Freshdesk attachments: founding includes 20 GB, imported files included.',
  ],
};
const fiveAgents = rowsAt(pricing, 5).at(-1);
// One read date for the chart, the body, the FAQ and the meta description.
const PRICES_READ = readOnLabel(pricing.readOn);

const faq: Faq[] = [
  {
    q: 'What is the best open-source alternative to Freshdesk?',
    a: `Colliedesk is an open-source (AGPL-3.0) helpdesk built for small teams leaving Freshdesk: one flat price per workspace (Team is ${PRICE.monthly} a month for up to 10 agents), AI included at cost, and a Freshdesk importer (available now). It is alpha today, so check the status table before you switch.`,
  },
  {
    q: 'How much does Freshdesk cost for 5 agents with AI?',
    a: `At list prices read on ${PRICES_READ}, billed monthly: Freshdesk Pro is $66 per agent per month and Freddy AI Copilot is $35, so five agents pay 5 × ($66 + $35) = $505 a month. Billed annually it is 5 × ($55 + $29) × 12 = $5,040 a year. Colliedesk Cloud Team is ${PRICE.monthly} a month or ${PRICE.yearly} a year.`,
  },
  {
    q: 'Is Colliedesk ready to replace Freshdesk today?',
    a: 'Not for most teams. Colliedesk is alpha: released and running on Colliedesk Cloud, with the email channel, Cc on replies, saved replies, attachments and the Freshdesk importer. A new conversation from the inbox, contact history and AI are not there yet, and the interface or schema may change. If your renewal is months away, the founding offer locks $99 a quarter for life and includes the migration.',
  },
  {
    q: 'Can I get my tickets out of Freshdesk with the full conversation?',
    a: 'Not with the ticket export in the Freshdesk UI: it exports ticket fields to CSV or Excel, without the conversation. The full thread needs the account export or the Freshdesk API. See [how to export tickets from Freshdesk](/migrate/freshdesk/export).',
  },
];

const body = `## Price, side by side

Freshdesk prices are per agent per month, as published on ${PRICES_READ}. The first figure is billed monthly, the second billed annually.

| | Freshdesk | Colliedesk |
|---|---|---|
| Plans | Growth $23 / $19, Pro $66 / $55, Enterprise $107 / $89 per agent per month | ${c.price} |
| AI drafting | Freddy AI Copilot $35 / $29 per agent per month, add-on for Pro and Enterprise only | ${c.ai} |
| AI agent | 500 sessions free once per account, then $49 per 100 sessions | Auto-answer with a human in the loop, same AI pricing (coming after beta) |
| Free option | No free plan on the pricing page; 14-day trial | ${c.free} |
| Source code | Proprietary | ${c.source} |

List prices before tax. AI usage on Colliedesk depends on ticket volume and the model you pick; with your own key it is billed by your provider.

## Leaving: what Freshdesk gives you

- The ticket export in the Freshdesk UI gives **ticket fields only**, as CSV or Excel. It does not include the conversation, and archived tickets are excluded.
- The API lists **100 tickets per page, up to 300 pages** (30,000 tickets) per filter, and only the **last 30 days** unless you pass \`updated_since\`.
- Closed tickets with no activity for 120 days are **archived** and fetched through a separate endpoint.
- API rate limits are **100, 400 or 700 calls per minute** on Growth, Pro and Enterprise.

Colliedesk keeps your data in PostgreSQL with an open, documented model. ${c.export} The step-by-step guide: [migrate from Freshdesk](/migrate/freshdesk).

## Where Freshdesk does more, and where Colliedesk does

Freshdesk has had more than a decade to grow. If you need a row marked "Freshdesk" today, stay on Freshdesk for now.

| Feature | Freshdesk | Colliedesk |
|---|---|---|
| Automations, SLA and business hours | **Freshdesk**: yes | Coming later |
| Reports and dashboards | **Freshdesk**: yes | Coming later |
| Channels beyond email (chat, phone, social) | **Freshdesk**: yes | Live chat later; email today |
| App marketplace | **Freshdesk**: yes | No |
| Shared inbox, Cc, private notes, saved replies | Yes | Yes, available now |
| Knowledge base and help center | Yes | Yes, available now |
| Price as the team grows | Per agent, AI per agent on top | **Colliedesk**: one price per workspace |
| Full export with conversations | Account export or API; the ticket export has fields only | **Colliedesk**: whole workspace as a ZIP, any time |
| Source code and self-hosting | Proprietary, cloud only | **Colliedesk**: AGPL-3.0, self-host free |

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

- Freshdesk pricing: [freshworks.com/freshdesk/pricing](https://www.freshworks.com/freshdesk/pricing/)
- Ticket export (fields only, archived excluded): [support.freshdesk.com article 225158](https://support.freshdesk.com/support/solutions/articles/225158)
- API pagination, 30-day default, archived tickets: [developers.freshdesk.com/api](https://developers.freshdesk.com/api/)
- API rate limits: [support.freshdesk.com article 225439](https://support.freshdesk.com/support/solutions/articles/225439-what-are-the-rate-limits-for-the-api-calls-to-freshdesk-)`;

const page: Page = {
  jsonLd: [],
  path: '/vs/freshdesk',
  section: 'Compare',
  title: `Colliedesk vs Freshdesk: ${PRICE.monthly} a month for up to 10 agents, not $19–107 per agent`,
  description:
    `An honest comparison of Colliedesk and Freshdesk: published prices, AI add-on costs, export limits and what Colliedesk can and cannot do yet. Prices read ${PRICES_READ}.`,
  summary: `Freshdesk $19–107 per agent plus $29–35 Copilot vs Colliedesk flat plans from ${PRICE.range} per workspace (Team ${PRICE.monthly} for up to 10 agents); export limits; honest status`,
  eyebrow: 'Compare · Freshdesk alternative',
  h1: 'Colliedesk vs Freshdesk',
  lede: `Five agents on ${fiveAgents?.name ?? 'Freshdesk'} pay ${usd(fiveAgents?.usd ?? 0)} a month. Colliedesk Cloud Team is ${PRICE.monthly} for the whole workspace, up to 10 agents (Small ${dollars(SMALL.monthly)} for up to 3, Team 25 ${PRICE.team25Monthly} for up to 25). Pick your team size to see where Colliedesk fits, and where it does not.`,
  cta: true,
  vs: pricing,
  preMd: vsMarkdown(pricing),
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
