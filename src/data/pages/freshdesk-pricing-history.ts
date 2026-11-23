// Every Freshworks price below was read on the vendor's own page, or on a Wayback Machine copy of it, on READ.
// Monthly prices are the ones the pricing page shows after you switch its toggle to Monthly.
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { TRIAL_HREF } from '../../lib/site';
import { FOUNDING_ACTION, OUR_PLAN, OUR_PRICE } from '../../lib/cloud-price';

const READ = '23 November 2026';

const SRC = {
  pricing: 'https://www.freshworks.com/freshdesk/pricing/',
  omni: 'https://www.freshworks.com/freshdesk/omni/pricing/',
  chat: 'https://www.freshworks.com/live-chat-software/pricing/',
  phone: 'https://www.freshworks.com/freshcaller-cloud-pbx/pricing/',
  jun2021: 'https://web.archive.org/web/20210616043050/https://freshdesk.com/pricing',
  dec2022: 'https://web.archive.org/web/20221219171639/https://freshdesk.com/pricing',
  jan2024: 'https://web.archive.org/web/20240114154552/https://www.freshworks.com/freshdesk/pricing/',
  nov2024: 'https://web.archive.org/web/20241104200622/https://www.freshworks.com/freshdesk/pricing/',
  jan2025: 'https://web.archive.org/web/20250119100136/https://www.freshworks.com/freshdesk/pricing/',
  dec2025: 'https://web.archive.org/web/20251208031227/https://www.freshworks.com/freshdesk/pricing/',
  jan2026: 'https://web.archive.org/web/20260116021858/https://www.freshworks.com/freshdesk/pricing/',
} as const;

const faq: Faq[] = [
  {
    q: 'Does Freshdesk have a free plan?',
    a: `The [pricing page](${SRC.pricing}) read on ${READ} lists no free plan. It offers a 14-day free trial of Enterprise. The free tier shrank over five years: unlimited agents in 2021, up to 10 agents in 2022 and 2024, free forever for up to 2 agents in November 2024, and a 6-month free program for up to 2 agents in December 2025 and January 2026.`,
  },
  {
    q: 'How much more does Freshdesk cost billed monthly?',
    a: `About 20% more. Growth is $23 per agent a month billed monthly against $19 billed annually, Pro $66 against $55 and Enterprise $107 against $89 ([pricing](${SRC.pricing}), read ${READ}). Freshworks labels annual billing "Save 20%". For 5 agents on Pro that is $330 a month instead of $275.`,
  },
  {
    q: 'Is Freddy AI included in Freshdesk?',
    a: `Partly. Every plan gets 500 free Freddy AI Agent sessions, once per account. After that you buy packs at $49 per 100 sessions, and a pack expires with your payment cycle. Freddy AI Copilot is extra: $29 per agent a month billed annually, or $35 billed monthly, on Pro and Enterprise only. You do not have to buy it for every agent ([pricing](${SRC.pricing}), read ${READ}).`,
  },
  {
    q: 'When did Freshdesk last raise its prices?',
    a: `Between 8 December 2025 and 16 January 2026, judging by archived copies of the pricing page. Growth went from $15 to $19 per agent a month billed annually, Pro from $49 to $55 and Enterprise from $79 to $89 ([before](${SRC.dec2025}), [after](${SRC.jan2026})). On ${READ} the [pricing page](${SRC.pricing}) shows the same prices.`,
  },
  {
    q: 'What does a 5-agent team pay for Freshdesk Pro with Copilot?',
    a: `5 × ($55 + $29) = $420 a month billed annually, which is $5,040 a year. Billed monthly it is 5 × ($66 + $35) = $505 a month ([pricing page](${SRC.pricing}), read on ${READ}). In January 2025 the annual figure was 5 × ($49 + $29) = $390 a month ([archive](${SRC.jan2025})).`,
  },
];

const body = `## Every Freshdesk price change since 2021

Price per agent per month, billed annually. Each row is read from an archived copy of the Freshdesk pricing page on the Wayback Machine, or from the live page on ${READ}.

| Snapshot | Free tier | Growth | Pro | Enterprise | Freddy AI Copilot | Source |
|---|---|---|---|---|---|---|
| 16 June 2021 | Sprout: free, unlimited agents | Plans then: Blossom $15, Garden $35, Estate $49, Forest $99 | | | | [archive](${SRC.jun2021}) |
| 19 December 2022 | Free, up to 10 agents | $15 | $49 | $79 | | [archive](${SRC.dec2022}) |
| 14 January 2024 | Free, up to 10 agents | $15 | $49 | $79 | | [archive](${SRC.jan2024}) |
| 4 November 2024 | Free forever, up to 2 agents | $15 | $49 | $79 | $29 | [archive](${SRC.nov2024}) |
| 19 January 2025 | Free forever, up to 2 agents | $15 | $49 | $79 | $29 | [archive](${SRC.jan2025}) |
| 8 December 2025 | 6-month free program, up to 2 agents | $15 | $49 | $79 | | [archive](${SRC.dec2025}) |
| 16 January 2026 | 6-month free program, 1 or 2 agents | **$19** | **$55** | **$89** | | [archive](${SRC.jan2026}) |
| ${READ} (live) | None listed | $19 | $55 | $89 | $29 | [freshworks.com](${SRC.pricing}) |

An empty Copilot cell means we did not see the Copilot price in that copy. The 2021 plans had other names, so they sit in one cell.

## What changed

- **The last rise came between 8 December 2025 and 16 January 2026.** The rise added 27% on Growth, 12% on Pro and 13% on Enterprise, billed annually (our arithmetic; [before](${SRC.dec2025}), [after](${SRC.jan2026})).
- **Before that, Growth and Pro held for three years**, at $15 and $49 per agent a month billed annually, from [December 2022](${SRC.dec2022}) to [December 2025](${SRC.dec2025}).
- **Monthly billing went up too.** In January 2024 Growth was $18, Pro $59 and Enterprise $95 billed monthly ([archive](${SRC.jan2024})). On ${READ} they are $23, $66 and $107 ([pricing page](${SRC.pricing})).
- **The free tier shrank** from unlimited agents (2021) to 10 agents (2022), then 2 agents (November 2024), then 6 months for 2 agents (December 2025). The live page lists no free plan.
- **AI became a per-agent add-on.** Freddy AI Copilot is on the page by November 2024 at $29 per agent a month billed annually ([archive](${SRC.nov2024})). Today it is $29 billed annually or $35 billed monthly ([pricing page](${SRC.pricing})).
- **AI Agent sessions cost more each.** In November 2024 extra sessions were $100 per 1,000 ([archive](${SRC.nov2024})). By December 2025 they were $49 per 100 ([archive](${SRC.dec2025})). By our arithmetic, that is 10 cents a session going to 49 cents.

## Plans today

Read on the [Freshdesk pricing page](${SRC.pricing}) on ${READ}. Prices are per agent per month. The monthly column is what the page shows when you switch it to Monthly.

| Plan | Billed annually | Billed monthly | What the plan adds |
|---|---|---|---|
| Growth | $19 | $23 | Freddy AI Agent (first 500 sessions), ticketing and shared inbox, customer portal and knowledge base, built-in analytics and reports, threads and tasks, roles and permissions |
| Pro | $55 | $66 | Everything in Growth, plus a multilingual helpdesk, custom dashboards and reports, intelligent routing, multiple SLA policies and external collaborators |
| Enterprise | $89 | $107 | Everything in Pro, plus Freddy AI Insights, skill-based routing, a sandbox, audit logs, and allowed domains and IP whitelisting |

For the free plan, the trial and the annual discount, see the [questions below](#faq).

## Add-ons and what they cost

Read on the [Freshdesk pricing page](${SRC.pricing}) on ${READ}.

| Add-on | Price | Plans |
|---|---|---|
| Freddy AI Copilot | $29 per agent a month billed annually, $35 billed monthly | Pro and Enterprise |
| Extra Freddy AI Agent sessions | $49 per 100 sessions, after 500 free sessions once per account | Growth, Pro and Enterprise |
| Day passes | $2 a pass on Growth, $7 on Pro, $12 on Enterprise | All three; none for Copilot |
| Connector app tasks | $80 per 5,000 tasks | All three |
| MCP actions | $15 per 1,000 actions | All three |

You can buy Copilot for some agents only. On email, one AI Agent session is a 72-hour window from the customer's first email.

**If you need chat or phone.** The Freshdesk pricing page lists no chat or phone add-on. Freshworks prices chat in Freshdesk Omni or Freshchat, and phone as the Omni Voice add-on or Freshcaller. Prices are per agent per month, billed annually, then monthly.

- **Freshdesk Omni** (Freshworks' omnichannel plan): Growth $29 or $35, Pro $79 or $95, Enterprise $119 or $143. Its Voice add-on is $15 or $18, $39 or $47, and $69 or $83 ([Omni pricing](${SRC.omni})).
- **Freshchat** (live chat): free for up to 10 agents. Growth $19 or $23, Pro $49 or $59, Enterprise $79 or $95 ([Freshchat pricing](${SRC.chat})).
- **Freshcaller** (phone): Growth $15 or $18, Pro $39 or $47, Enterprise $69 or $83, each plus a price per minute ([Freshcaller pricing](${SRC.phone})). Paid plans include 2,000, 3,000 or 5,000 incoming minutes a month.

## Hidden costs

Each line is stated on, or computed from, the [pricing page](${SRC.pricing}) read on ${READ}, unless it says "our reading".

- **AI is billed per agent.** Copilot adds $29 to each Pro seat that has it, so one Pro agent with Copilot costs $84 a month billed annually.
- **Copilot is on Pro and Enterprise only.** Our reading: a Growth team must move to Pro before it can buy Copilot.
- **The 500 free AI Agent sessions come once per account.** Then you pay $49 per 100, and an unused pack expires with your payment cycle.
- **Downgrades and cancellations wait for the end of the term.** An upgrade is instant. A downgrade or a cancellation takes effect at the end of your term. Freshworks states there are no cancellation fees.
- **No PayPal.** Freshworks takes Visa, Mastercard, Discover and American Express. Offline payments are in USD, and it takes no purchase orders over the phone.
- **No seat minimum is stated.** The page states no minimum number of agents.

## What 3, 5 and 10 agents pay, monthly vs annual

| Plan and billing | 3 agents | 5 agents | 10 agents |
|---|---|---|---|
| Growth, annual ($19) | $57 a month ($684 a year) | $95 a month ($1,140 a year) | $190 a month ($2,280 a year) |
| Growth, monthly ($23) | $69 a month | $115 a month | $230 a month |
| Pro, annual ($55) | $165 a month ($1,980 a year) | $275 a month ($3,300 a year) | $550 a month ($6,600 a year) |
| Pro, monthly ($66) | $198 a month | $330 a month | $660 a month |
| Pro + Copilot, annual ($55 + $29) | $252 a month ($3,024 a year) | $420 a month ($5,040 a year) | $840 a month ($10,080 a year) |
| Pro + Copilot, monthly ($66 + $35) | $303 a month | $505 a month | $1,010 a month |
| Enterprise, annual ($89) | $267 a month ($3,204 a year) | $445 a month ($5,340 a year) | $890 a month ($10,680 a year) |
| Enterprise, monthly ($107) | $321 a month | $535 a month | $1,070 a month |

How we computed it: each cell is the per-agent price times the number of agents. The yearly figure is 12 times the monthly one. Prices come from the [Freshdesk pricing page](${SRC.pricing}) read on ${READ}. Tax, day passes and extra AI Agent sessions are left out.

A per-agent bill grows with every hire. A flat price stays the same as you add agents, up to the plan's limit. Compare seven of them in [helpdesks with flat pricing](/helpdesk-flat-pricing).

## One price for the team instead

Five agents on Freshdesk Pro with Copilot pay $5,040 a year billed annually ([pricing page](${SRC.pricing}), read on ${READ}). Colliedesk ${OUR_PLAN} is ${OUR_PRICE} for up to 10 agents, with AI reply drafts included up to a monthly allowance. [Start the 14-day trial, no card](${TRIAL_HREF}).

Compare features on [Colliedesk vs Freshdesk](/vs/freshdesk), or see other options in [Freshdesk alternatives](/freshdesk-alternative). The [Freshdesk import](/migrate/freshdesk) moves tickets, replies, private notes and attachments. See what your workspace would pay on [Colliedesk pricing](/pricing).

## Method

We read archived copies of freshdesk.com/pricing and freshworks.com/freshdesk/pricing on the Wayback Machine, and the live pages on ${READ}. The change window runs from the last copy with old prices (8 December 2025) to the first with new ones (16 January 2026). Prices are list prices in USD before tax.

## Sources

- Freshdesk: [pricing](${SRC.pricing}), [Omni pricing](${SRC.omni}).
- Freshchat: [pricing](${SRC.chat}).
- Freshcaller: [pricing](${SRC.phone}).
- Wayback Machine copies of the Freshdesk pricing page: [June 2021](${SRC.jun2021}), [December 2022](${SRC.dec2022}), [January 2024](${SRC.jan2024}), [November 2024](${SRC.nov2024}), [January 2025](${SRC.jan2025}), [December 2025](${SRC.dec2025}), [January 2026](${SRC.jan2026}).`;

const page: Page = {
  jsonLd: [],
  name: 'Freshdesk pricing',
  path: '/freshdesk-pricing-history',
  updated: '2026-11-23',
  section: 'Compare',
  title: 'Freshdesk pricing 2026: $19 to $89 per agent billed yearly',
  description:
    'Freshdesk costs $19 to $89 per agent a month billed annually, or $23 to $107 billed monthly, in November 2026. Every plan, add-on and price change since 2021.',
  summary:
    'Freshdesk pricing on 23 November 2026: plans $19 to $89 per agent billed annually ($23 to $107 monthly), add-ons, hidden costs, the bill for 3, 5 and 10 agents, and every price change since 2021 from 7 Wayback snapshots',
  eyebrow: 'Compare · Freshdesk pricing',
  h1: 'Freshdesk pricing: $19 to $89 per agent billed annually ($23 to $107 monthly), and every change since 2021',
  lede: `We compared 7 dated copies of the Freshdesk pricing page since June 2021 with the [live page](${SRC.pricing}) on ${READ}, where it costs $19 to $89 per agent a month billed annually. The last rise came between [8 December 2025](${SRC.dec2025}) and [16 January 2026](${SRC.jan2026}), when Growth went from $15 to $19 per agent a month billed annually, and Pro from $49 to $55.`,
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
