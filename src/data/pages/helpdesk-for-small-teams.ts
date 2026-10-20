import { FOUNDING_HREF, TRIAL_HREF } from '../../lib/site';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { statusTable } from './collie-status';

// Date the Freshdesk monthly-billing prices on this page were read from freshworks.com.
const FRESHDESK_READ = '17 October 2026';

const faq: Faq[] = [
  {
    q: 'What is the cheapest helpdesk for a team of 3 to 10 agents?',
    a: `Among the paid options we compare, Colliedesk Cloud is one flat price per workspace: Small is $39 a month for up to 3 agents and Team $69 for up to 10, so the price does not grow with every hire. Freshdesk Growth is $23 per agent per month billed monthly (read on ${FRESHDESK_READ}): $69 at 3 agents, $230 at 10. Self-hosting Colliedesk is free.`,
  },
  {
    q: 'Is a flat price worse for a one- or two-person team?',
    a: 'Not much. One agent on Freshdesk Growth costs $19 a month billed annually, the same as Colliedesk Solo at $19 a month. Two Growth agents cost $38 a month billed annually, against Colliedesk Small at $39 for up to three. The flat price pays off from three agents ($57 on Growth billed annually against $39), or when you want AI without a per-seat add-on.',
  },
  {
    q: 'What if my team outgrows Cloud Team?',
    a: 'Cloud Team 25 covers up to 25 agents for a flat $149 per workspace per month ($1,490 per year). Above 25 agents, Unlimited is coming soon at $349 a month, billed annually; until then, email us. Self-hosting has no agent limit.',
  },
];

const body = `## What a small support team needs

- **One shared inbox** where everyone sees who owns a ticket: assignee, status, priority, tags, private notes.
- **Email in and out** on your own support address.
- **A price you can predict** when you hire the next person.
- **Your history**, moved in from the old tool without losing replies or attachments.
- **AI drafts** that do not cost another seat licence.

## What it costs as you grow

Prices per month, billed monthly on both sides, read on ${FRESHDESK_READ}.

| Agents | Freshdesk Growth ($23) | Freshdesk Pro + Freddy AI Copilot ($66 + $35) | Colliedesk Cloud |
|---|---|---|---|
| 2 | $46 | $202 | $39 (Small) |
| 3 | $69 | $303 | $39 (Small) |
| 5 | $115 | $505 | $69 (Team) |
| 10 | $230 | $1,010 | $69 (Team) |

Colliedesk AI (coming after beta) is billed at model cost +30% on our key, or by your provider on your own key. Full sources: [Colliedesk vs Freshdesk](/vs/freshdesk).

## What Colliedesk does today

Colliedesk is alpha. The shared inbox, email channel and Freshdesk importer are released and run on Colliedesk Cloud; the interface or schema may change between releases. Read the table before you plan a move.

${statusTable}

## How small teams start

1. **Try it:** [start the 14-day Cloud trial](${TRIAL_HREF}), or self-host free.
2. **Plan the move before your renewal:** the [founding offer](${FOUNDING_HREF}) is $100 per workspace per year, locked for life, and we [migrate your Freshdesk data for you](/migrate/freshdesk/done-for-you).
3. **Switch only when the reconcile report matches.**`;

const page: Page = {
  jsonLd: [],
  name: 'Helpdesk for small teams',
  path: '/helpdesk-for-small-teams',
  section: 'Product',
  title: 'Helpdesk for small teams: one flat price for 2 to 10 agents',
  description:
    'A helpdesk for small support teams of 2 to 10 agents: one flat price per workspace ($39 for up to 3 agents, $69 for up to 10) instead of per-agent fees, AI included at cost, open source. Price by team size and honest status.',
  summary: 'Small-team helpdesk: price by team size (2, 3, 5, 10 agents) vs Freshdesk, what small teams need, honest status',
  eyebrow: 'For small teams',
  h1: 'A helpdesk priced for a small team',
  lede: 'Two to ten people answering customers do not need an enterprise suite. They need a shared inbox, their history, and a bill that does not grow with every hire.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
