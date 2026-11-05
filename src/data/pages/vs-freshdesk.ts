import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { FOUNDING_ACTION, FOUNDING_LEAD, OUR_PLAN, OUR_PRICE } from '../../lib/cloud-price';
import { AI_RESOLUTION, BUSINESS, BUSINESS_AGENTS, dollars, PRICE, SMALL, SWITCH_OFFER_BLOCK_MD, TEAM_25 } from '../../lib/site';
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
    'You need AI that answers tickets on its own today: auto-answer is not built yet (reply drafts and triage are shipped).',
    'You want the founding price and have more than 20 GiB of Freshdesk attachments: founding includes 20 GiB, imported files included.',
  ],
};
const fiveAgents = rowsAt(pricing, 5).at(-1);
// One read date for the chart, the body, the FAQ and the meta description.
const PRICES_READ = readOnLabel(pricing.readOn);

const faq: Faq[] = [
  {
    q: 'What is the best open-source alternative to Freshdesk?',
    a: `Colliedesk is an open-source (AGPL-3.0) helpdesk built for small teams leaving Freshdesk: one flat price per workspace (${OUR_PLAN} is ${OUR_PRICE} for up to 10 agents), AI reply drafts included, and a Freshdesk importer (available now). It is generally available; check the status table for what is not built yet before you switch.`,
  },
  {
    q: 'How much does Freshdesk cost for 5 agents with AI?',
    a: `At list prices read on ${PRICES_READ}, billed monthly: Freshdesk Pro is $66 per agent per month and Freddy AI Copilot is $35, so five agents pay 5 × ($66 + $35) = $505 a month. Billed annually it is 5 × ($55 + $29) × 12 = $5,040 a year. ${FOUNDING_LEAD ? 'Colliedesk Founding is $99 every 3 months, $396 a year, locked for life. After the 10 Founding places are taken, ' : ''}Colliedesk Cloud Team is ${PRICE.monthly} a month or ${PRICE.yearly} a year.`,
  },
  {
    q: 'Is Colliedesk ready to replace Freshdesk today?',
    a: 'For a small team that mostly answers email, yes. Colliedesk is generally available on Colliedesk Cloud, with the email channel, Cc on replies, saved replies, attachments, a new conversation from the inbox, contact history, AI reply drafts and the Freshdesk importer. Response targets in business hours and a Results page that compares your last 30 days with Freshdesk are shipped too. Not built yet: AI auto-answer, automations, macros, CSAT, live chat and phone. If you rely on those, stay on Freshdesk for now. If your renewal is months away, the founding offer locks $99 every 3 months for life and includes the migration.',
  },
  {
    q: 'Can I get my tickets out of Freshdesk with the full conversation?',
    a: 'Not with the ticket export in the Freshdesk UI: it exports ticket fields to CSV or Excel, without the conversation. The full thread needs the account export or the Freshdesk API. See [how to export tickets from Freshdesk](/migrate/freshdesk/export).',
  },
];

const body = `## Price, side by side

Freshdesk prices are per agent per month, as published on ${PRICES_READ}. The first figure is billed monthly, the second billed annually.

| Topic | Freshdesk | Colliedesk |
|---|---|---|
| Plans | Growth $23 / $19, Pro $66 / $55, Enterprise $107 / $89 per agent per month | ${c.price} |
| AI drafting | Freddy AI Copilot $35 / $29 per agent per month, add-on for Pro and Enterprise only | ${c.ai} |
| AI agent | 500 sessions free once per account, then $49 per 100 sessions | Auto-answer with a human in the loop, same AI pricing (not built yet) |
| Free option | No free plan on the pricing page; 14-day trial | ${c.free} |
| Source code | Proprietary | ${c.source} |

List prices before tax. On Colliedesk, AI reply drafts and triage are included with a monthly allowance; with your own key your provider bills you. Auto-answer, once it ships, is ${AI_RESOLUTION} per resolution.

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
| Automations, macros and CSAT | **Freshdesk**: yes | Not built yet |
| Reports and dashboards | **Freshdesk**: custom reports and dashboards | Results only: your last 30 or 7 days next to Freshdesk |
| SLA and business hours | Yes | Yes: response targets by priority, in business hours |
| Channels beyond email (chat, phone, social) | **Freshdesk**: yes | Live chat later; email today |
| App marketplace | **Freshdesk**: yes | No |
| Shared inbox, Cc, private notes, saved replies | Yes | Yes, shipped |
| Knowledge base and help center | Yes | Yes, shipped |
| Price as the team grows | Per agent, AI per agent on top | **Colliedesk**: one price per workspace |
| Full export with conversations | Account export or API; the ticket export has fields only | **Colliedesk**: whole workspace as a ZIP, any time |
| Source code and self-hosting | Proprietary, cloud only | **Colliedesk**: AGPL-3.0, self-host free |

## Switching with 11 to 100 agents

${TEAM_25.name} (${dollars(TEAM_25.monthly)} a month for up to ${TEAM_25.agents} agents) and ${BUSINESS.name} (${dollars(BUSINESS.monthly)} a month for ${BUSINESS_AGENTS} agents) come with two offers for teams leaving Freshdesk.

${SWITCH_OFFER_BLOCK_MD}

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
  title: `Colliedesk vs Freshdesk: ${OUR_PRICE} for up to 10 agents, not $19–107 per agent`,
  description:
    `An honest comparison of Colliedesk and Freshdesk: published prices, AI add-on costs, export limits and what Colliedesk can and cannot do yet. Prices read ${PRICES_READ}.`,
  summary: `Freshdesk $19–107 per agent plus $29–35 Copilot vs Colliedesk ${OUR_PLAN} at a flat ${OUR_PRICE} per workspace for up to 10 agents; export limits; honest status`,
  eyebrow: 'Compare · Freshdesk alternative',
  h1: 'Colliedesk vs Freshdesk',
  lede: `Five agents on ${fiveAgents?.name ?? 'Freshdesk'} pay ${usd(fiveAgents?.usd ?? 0)} a month. ${FOUNDING_LEAD ? `${FOUNDING_LEAD} The chart shows the Cloud plans after that.` : `Colliedesk Cloud Team is ${PRICE.monthly} for the whole workspace, up to 10 agents (Small ${dollars(SMALL.monthly)} for up to 3, Team 25 ${PRICE.team25Monthly} for up to 25).`} Pick your team size to see where Colliedesk fits, and where it does not.`,
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  vs: pricing,
  preMd: vsMarkdown(pricing),
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
