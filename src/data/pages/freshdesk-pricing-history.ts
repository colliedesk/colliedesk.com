import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';

const READ = '16 October 2026';

const faq: Faq[] = [
  {
    q: 'When did Freshdesk raise its prices?',
    a: 'Between 8 December 2025 and 16 January 2026, judging by archived copies of the pricing page. Growth went from $15 to $19 per agent per month (+27%) and Pro from $49 to $55 (+12%), billed annually. Enterprise went from $79 to $89.',
  },
  {
    q: 'When did Freddy AI Copilot appear, and what does it cost?',
    a: 'It is on the archived pricing page by 4 November 2024, at $29 per agent per month billed annually. On 16 October 2026 it is still $29, as an add-on for Pro and Enterprise.',
  },
  {
    q: 'How much more does a 5-agent team pay now than in 2024?',
    a: 'On Pro with Copilot, billed annually: 5 × ($49 + $29) = $390 per month in 2025, and 5 × ($55 + $29) = $420 per month today, $360 more per year.',
  },
];

const body = `## Price per agent per month, billed annually

Each figure is read from an archived copy of the Freshdesk pricing page on the Wayback Machine, or from the live page on ${READ}.

| Snapshot | Growth | Pro | Enterprise | Freddy AI Copilot | Source |
|---|---|---|---|---|---|
| 16 June 2021 | Plans then: Blossom $15, Garden $35, Estate $49, Forest $99 | — | — | — | [archive](https://web.archive.org/web/20210616043050/https://freshdesk.com/pricing) |
| 19 December 2022 | $15 | $49 | $79 | — | [archive](https://web.archive.org/web/20221219171639/https://freshdesk.com/pricing) |
| 14 January 2024 | $15 | $49 | $79 | — | [archive](https://web.archive.org/web/20240114154552/https://www.freshworks.com/freshdesk/pricing/) |
| 19 January 2025 | $15 | $49 | $79 | $29 | [archive](https://web.archive.org/web/20250119100136/https://www.freshworks.com/freshdesk/pricing/) |
| 16 January 2026 | **$19** | **$55** | **$89** | — | [archive](https://web.archive.org/web/20260116021858/https://www.freshworks.com/freshdesk/pricing/) |
| ${READ} (live) | $19 | $55 | $89 | $29 | [freshworks.com](https://www.freshworks.com/freshdesk/pricing/) |

The Copilot price did not render in the 16 January 2026 archive; it is $29 before and after.

## What changed

- **Growth and Pro held for three years**, from December 2022 to December 2025, at $15 and $49.
- **The increase landed between 8 December 2025 and 16 January 2026**: Growth +27%, Pro +12%, Enterprise +13%.
- **AI became a per-agent add-on** by November 2024: Freddy AI Copilot at $29 per agent per month, on Pro and Enterprise.
- **The free plan** is "free forever, up to 2 agents" on the archived page from November 2024.

## What a 5-agent team pays

| Year | Pro | Pro + Copilot |
|---|---|---|
| 2024 | 5 × $49 = $245 per month | Copilot not yet offered |
| 2025 | 5 × $49 = $245 per month | 5 × ($49 + $29) = $390 per month |
| Today | 5 × $55 = $275 per month | 5 × ($55 + $29) = **$420 per month** |

For comparison, [Colliedesk Cloud](/pricing) is $49 per workspace per month for up to 10 agents, with AI at model cost +30% or on your own key. Planning to leave? Start with [Freshdesk alternatives](/freshdesk-alternative) and [migrate from Freshdesk](/migrate/freshdesk).

## Method

We fetched archived copies of freshdesk.com/pricing and freshworks.com/freshdesk/pricing from the Wayback Machine and read the prices from the page HTML. One snapshot per year is shown; the change window comes from the last old-price snapshot (8 December 2025) and the first new-price one (16 January 2026). Prices are list prices in USD before tax.`;

const page: Page = {
  jsonLd: [],
  name: 'Freshdesk pricing history',
  path: '/freshdesk-pricing-history',
  updated: '2026-10-16',
  section: 'Compare',
  title: 'Freshdesk pricing history 2021–2026, with archived sources',
  description:
    'Every Freshdesk price change from archived pricing pages: Growth $15 to $19, Pro $49 to $55 per agent, Freddy AI Copilot $29 per agent. Sources linked.',
  summary: 'Freshdesk price history 2021–2026 from Wayback snapshots: Growth $15→$19, Pro $49→$55 (Dec 2025–Jan 2026), Copilot $29 since Nov 2024',
  eyebrow: 'Compare · Freshdesk pricing',
  h1: 'Freshdesk pricing history',
  lede: 'Every Freshdesk price change since 2021, read from archived copies of its pricing page. Each figure links to its source.',
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
