import { CLOUD_PLANS, SMALL, SOLO, TEAM, TEAM_25, TRIAL_HREF, agentsLabel, dollars } from '../../lib/site';
import { AFTER_FOUNDING, FOUNDING_LEAD, FOUNDING_OPEN, OUR_PLAN, OUR_PRICE, foundingFirst } from '../../lib/cloud-price';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';

// Vendor prices were read on their own pricing pages on READ; the links are in the Sources section.
const READ = '19 November 2026';

const CRISP = 'https://crisp.chat/en/pricing/';
const JITBIT = 'https://www.jitbit.com/saas-helpdesk/purchase/';
const HELPSPOT = 'https://www.helpspot.com/pricing';
const HAPPYFOX = 'https://www.happyfox.com/helpdesk/pricing/';
const FRAPPE = 'https://frappe.io/helpdesk/pricing';
const FREESCOUT = 'https://github.com/freescout-help-desk/freescout';
const FREESCOUT_MODULES = 'https://freescout.net/modules/';
const FRESHDESK = 'https://www.freshworks.com/freshdesk/pricing/';
const ZENDESK = 'https://www.zendesk.com/pricing/';
const HELP_SCOUT = 'https://www.helpscout.com/pricing/';

const selfServePlans = CLOUD_PLANS.filter((plan) => !plan.salesOnly);
const colliedeskPlans = selfServePlans.map((plan) => `${plan.name} ${dollars(plan.monthly)} (${agentsLabel(plan).toLowerCase()})`).join(', ');
// The smallest self-serve plan that seats a team of `agents`.
const planFor = (agents: number) => selfServePlans.find((plan) => plan.agents >= agents) ?? TEAM_25;
const bill = (agents: number): string => {
  const plan = planFor(agents);
  return `${dollars(plan.monthly)} (${plan.name})`;
};
const perAgent = (price: number, agents: number): string => dollars(price * agents);
// While Founding is open it is the only Cloud plan on sale, so the page leads with it and labels the
// monthly plans as the prices after its places are taken.
const LATER = FOUNDING_OPEN ? ' after Founding' : '';
// $99 every 3 months is $33 a month; the page says so wherever Founding sits next to a monthly price.
const OURS = FOUNDING_OPEN ? `${OUR_PRICE} ($33 a month) on Colliedesk Founding` : `${OUR_PRICE} on Colliedesk`;
const OURS_SHORT = `${OUR_PRICE} for up to 10 agents`;

const faq: Faq[] = [
  {
    q: 'Which helpdesk has no per-agent pricing?',
    a: `Seven that publish it: Colliedesk, Crisp, Jitbit, HelpSpot, HappyFox on its unlimited-agent plans, Frappe Helpdesk and FreeScout. The first four set one price for a team size. HappyFox sets one price for a yearly ticket allowance. Frappe Helpdesk and FreeScout have no licence fee, and you pay for the server.`,
  },
  {
    q: 'Is flat pricing cheaper than per-agent pricing?',
    a: `From three agents up, yes: the four flat-priced rows in the bill table above each cost less than a $55 per-agent plan. On Colliedesk, for one or two agents the difference is small. Freshdesk Growth and Zendesk Support Team list at $19 per agent a month billed yearly, so two agents cost $38 a month. Colliedesk ${SMALL.name}${LATER} is ${dollars(SMALL.monthly)} a month paid monthly.`,
  },
  {
    q: 'Does Help Scout have flat pricing?',
    a: `No. Its pricing page lists Standard at $25, Plus at $45 and Pro at $75 per user a month with annual billing selected, and a Free plan with 5 users. Source: [Help Scout pricing](${HELP_SCOUT}), read ${READ}.`,
  },
  {
    q: 'What does "unlimited agents" cost?',
    a: `On a cloud plan, HappyFox Growth is $1,999 a month billed annually, with 20,000 tickets a year. On your own server, FreeScout, Frappe Helpdesk and self-hosted Colliedesk have no agent limit and no licence fee.`,
  },
  {
    q: 'Does Colliedesk charge per agent?',
    a: `No. You pay one price for the workspace. ${foundingFirst(`${AFTER_FOUNDING ? 'the' : 'The'} monthly plans are ${colliedeskPlans}.`)} You move up a plan only when your team passes the agent limit. A year costs ten months. See [pricing](/pricing).`,
  },
];

const body = `Seven helpdesks publish a price for the team, not for each agent: Colliedesk, Crisp, Jitbit, HelpSpot, HappyFox, Frappe Helpdesk and FreeScout. For five agents you pay ${OURS}, $95 a month on Crisp and $129 a month on Jitbit. Freshdesk Pro at $55 per agent comes to ${perAgent(55, 5)} a month, billed annually.

Every price below comes from the vendor's own pricing page, read on ${READ} (Frappe Helpdesk on 23 November 2026). Prices are in US dollars, before tax.${FOUNDING_LEAD ? `

${FOUNDING_LEAD} The tables show the monthly Cloud plans after that.` : ''}

## Three kinds of flat price

"Flat" means three different things on these pricing pages.

1. **One price for a team size.** The plan includes a number of agents. You pay more only when you pass that number. Colliedesk, Crisp, Jitbit and HelpSpot work this way.
2. **One price for a ticket allowance.** Agents are unlimited, and the plan sets how many tickets you can handle in a year. HappyFox sells this.
3. **No licence fee.** The software is open source. You pay for the server, or you run it on your own. Frappe Helpdesk, FreeScout and self-hosted Colliedesk work this way.

## The seven, side by side

| Helpdesk | What you pay for | Plans, per month | Past the limit |
|---|---|---|---|
| Colliedesk${LATER} | The workspace | ${colliedeskPlans} | Move up a plan |
| [Crisp](${CRISP}) | The workspace | Free (2 seats), Mini $45 (4 seats), Essentials $95 (10 seats), Plus $295 (20+ seats) | On Plus, $10 a month for each more agent |
| [Jitbit](${JITBIT}) | The plan | Freelancer $29 (1 agent), Startup $69 (4 agents), Company $129 (7 agents), Enterprise $249 (9 agents) | Enterprise lists "9 agents, $29 extra" |
| [HelpSpot](${HELPSPOT}) | The agent tier, sold by the year | $899 a year (3 agents), $1,299 (5), $1,799 (7), $2,199 (10), $4,999 (25) | Move up a tier; HelpSpot prorates the difference |
| [HappyFox](${HAPPYFOX}) | A yearly ticket allowance | Growth $1,999 (20,000 tickets a year), Scale $3,999 (150,000), Scale Plus $5,999 (300,000), each billed annually | A fee for each ticket over the allowance |
| [Frappe Helpdesk](${FRAPPE}) | The site size on Frappe Cloud | From $20 a month (Starter, read 23 November 2026). Every size has every feature and unlimited agents. | Move to a larger size; each size is billed for the days your site was on it |
| [FreeScout](${FREESCOUT}) | Nothing for the core app. You run the server. | $0. No limit on agents, tickets or mailboxes. | Official [modules](${FREESCOUT_MODULES}) are sold as lifetime licences for one install |

Colliedesk plans differ in agents and attachment storage, and in how much of the move from your old helpdesk we do. Every feature is on every plan. A year costs ten months.

Jitbit lists a lower monthly figure when you pay for a year: $24.92, $58.25, $108.25 and $208.25. HappyFox also sells per-agent plans, from $24 per agent a month billed annually.

## The bill for 3, 5 and 10 agents

Each cell is the smallest plan that seats the team.

| Helpdesk | 3 agents | 5 agents | 10 agents |
|---|---|---|---|
| Colliedesk${LATER}, monthly | ${bill(3)} | ${bill(5)} | ${bill(10)} |
| Crisp, monthly | $45 (Mini) | $95 (Essentials) | $95 (Essentials) |
| Jitbit, monthly | $69 (Startup) | $129 (Company) | $249 for 9 agents, plus "$29 extra" |
| HelpSpot, yearly | $899 a year | $1,299 a year | $2,199 a year |
| Freshdesk Growth, $19 per agent, billed annually | ${perAgent(19, 3)} | ${perAgent(19, 5)} | ${perAgent(19, 10)} |
| Freshdesk Pro, $55 per agent, billed annually | ${perAgent(55, 3)} | ${perAgent(55, 5)} | ${perAgent(55, 10)} |
| Zendesk Suite Team, $55 per agent, paid yearly | ${perAgent(55, 3)} | ${perAgent(55, 5)} | ${perAgent(55, 10)} |

The per-agent rows are the list price times the number of agents, per month. HelpSpot sells by the year only, so its row shows the yearly price.

Two things stand out:

- At 10 agents, Colliedesk ${TEAM.name}${LATER} is ${dollars(TEAM.monthly)} a month. Ten seats on a $55 per-agent plan are ${perAgent(55, 10)}.
- A flat price moves in steps. On Colliedesk the fourth agent takes you from ${dollars(SMALL.monthly)} to ${dollars(TEAM.monthly)}. On Crisp the fifth takes you from $45 to $95. On Jitbit the fifth takes you from $69 to $129.

See the one price your workspace would pay on [Colliedesk pricing](/pricing), or [start the 14-day trial, no card](${TRIAL_HREF}).

## Where a flat price still grows

Read these lines on a pricing page before you count on a flat bill.

- **The agent limit.** Each plan in the table seats a fixed number of agents. Count the people who will answer customers next year, not today.
- **A ticket allowance.** The three priced HappyFox unlimited-agent plans include 20,000 to 300,000 tickets a year and charge for each ticket over that.
- **A customer limit.** Crisp lists 5,000 customer profiles on Mini and 50,000 on Essentials.
- **AI credits.** Crisp includes $5 of AI credits on Mini and $25 on Essentials. Freshdesk lists Freddy AI Copilot at $29 per agent a month, billed annually, on Pro.
- **The billing period.** HelpSpot sells by the year only. Freshdesk and Zendesk show the yearly-billing price first. Freshdesk's monthly prices, and every change since 2021, are on [Freshdesk pricing](/freshdesk-pricing-history).

## When a flat price saves little

- **One or two agents.** Freshdesk Growth and Zendesk Support Team list at $19 per agent a month, billed yearly. Two agents cost $38 a month. Colliedesk ${SOLO.name}${LATER} is ${dollars(SOLO.monthly)} for one agent, and ${SMALL.name} is ${dollars(SMALL.monthly)} for up to three, both paid monthly.
- **A team that sits just past a step.** Four agents on Colliedesk pay for ${TEAM.name}, which seats ten.
- **You need what a larger suite has.** Zendesk lists a Contact Center plan and a Workforce Engagement bundle. Compare by feature on [Colliedesk vs Freshdesk](/vs/freshdesk) and [Colliedesk vs Zendesk](/vs/zendesk).

From three agents up, each of the four flat-priced rows in the bill table costs less than a $55 per-agent plan. Read [the helpdesk guide for small teams](/helpdesk-for-small-teams) for what such a team needs. To pay no licence at all, read [the self-hosted helpdesk page](/self-hosted-helpdesk). Leaving Freshdesk? [Freshdesk alternatives by team size](/freshdesk-alternative) shows what each import keeps.

## Sources

All read ${READ}, except Frappe Helpdesk.

- Crisp: [Pricing and plans](${CRISP}).
- Jitbit: [SaaS help desk pricing](${JITBIT}).
- HelpSpot: [Simple Annual Pricing](${HELPSPOT}).
- HappyFox: [Help Desk pricing](${HAPPYFOX}), agent-based and unlimited-agent plans.
- Frappe Helpdesk: [Pricing](${FRAPPE}), read 23 November 2026.
- FreeScout: [the GitHub repository](${FREESCOUT}) and [the modules page](${FREESCOUT_MODULES}).
- Freshdesk: [Pricing and plans](${FRESHDESK}).
- Zendesk: [Pricing plans](${ZENDESK}).
- Help Scout: [Pricing](${HELP_SCOUT}).
- Colliedesk: [Pricing](/pricing).`;

const page: Page = {
  jsonLd: [],
  name: 'Helpdesks with flat pricing compared',
  path: '/helpdesk-flat-pricing',
  updated: '2026-11-23',
  section: 'Compare',
  title: `Helpdesk flat pricing: 7 compared. Ours: ${OUR_PRICE}`,
  description:
    'Seven helpdesks that do not charge per agent, with prices read on 19 November 2026 and the bill for 3, 5 and 10 agents next to Freshdesk and Zendesk.',
  summary: 'Seven helpdesks without per-agent pricing compared from vendor pricing pages: price unit, plans, agent limits and the bill for 3, 5 and 10 agents.',
  eyebrow: 'Prices read on vendor pages, 19 November 2026',
  h1: `Which helpdesks have flat pricing? 7 compared; ours is ${OURS_SHORT}`,
  lede: `Four set one price for a team size, one sells a yearly ticket allowance, and two charge no licence fee. Ten agents cost ${OURS} and ${perAgent(55, 10)} a month on a $55 per-agent plan billed annually.`,
  cta: true,
  ctaCall: { href: '/pricing', label: `See ${OUR_PLAN}: ${OUR_PRICE}` },
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];

export default page;
