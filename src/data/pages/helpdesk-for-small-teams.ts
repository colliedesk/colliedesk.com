import { AI_RESOLUTION, FOUNDING_HREF, TRIAL_HREF } from '../../lib/site';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { statusTable } from './collie-status';
import { FOUNDING_ACTION, FOUNDING_LEAD, FOUNDING_OPEN, foundingFirst, withFoundingLead } from '../../lib/cloud-price';

// Date the Freshdesk monthly-billing prices on this page were read from freshworks.com.
const FRESHDESK_READ = '17 October 2026';

const faq: Faq[] = [
  {
    q: 'What is the cheapest helpdesk for a team of 3 to 10 agents?',
    a: `${FOUNDING_LEAD ? `${FOUNDING_LEAD} After the 10 Founding places are taken, it depends` : 'It depends'} on the size. With 3 to 5 agents, plans capped at five cost less: [Zammad Starter](/vs/zammad) and [Zoho Desk Express](/vs/zoho-desk) are €7 per agent per month, €21–35, and Zoho's free plan covers 3 users. Colliedesk Cloud is one flat price per workspace: Small is $39 a month for up to 3 agents and Team $69 for up to 10, so the price does not grow with every hire. Freshdesk Growth is $23 per agent per month billed monthly (read on ${FRESHDESK_READ}): $69 at 3 agents, $230 at 10. Self-hosting Colliedesk is free.`,
  },
  {
    q: 'Is a flat price worse for a one- or two-person team?',
    a: `Not much. ${foundingFirst('Colliedesk Solo is $19 a month, the same as one agent on Freshdesk Growth billed annually. Colliedesk Small is $39 for up to three, against $38 for two Growth agents billed annually.')} The flat price pays off from three agents ($57 on Growth billed annually against $39), or when you want AI without a per-seat add-on.`,
  },
  {
    q: 'What if my team outgrows Cloud Team?',
    a: `${FOUNDING_OPEN ? 'Founding covers up to 10 agents; a bigger team moves to a Cloud plan. ' : ''}Cloud Team 25 covers up to 25 agents for a flat $149 per workspace per month ($1,490 per year). Above 25 agents, Unlimited is coming soon at $349 a month, billed annually; until then, email us. Self-hosting has no agent limit.`,
  },
];

const body = `## What a small support team needs

- **One shared inbox** where everyone sees who owns a ticket: assignee, status, priority, tags, private notes.
- **Email in and out** on your own support address.
- **A price you can predict** when you hire the next person.
- **Your history**, moved in from the old tool without losing replies or attachments.
- **AI drafts** that do not cost another seat licence.

## What it costs as you grow

${FOUNDING_LEAD ? `${FOUNDING_LEAD} The table shows the Cloud plans after that.

` : ''}Prices per month, billed monthly on both sides, read on ${FRESHDESK_READ}.

| Agents | Freshdesk Growth ($23) | Freshdesk Pro + Freddy AI Copilot ($66 + $35) | Colliedesk Cloud${FOUNDING_OPEN ? ' after Founding' : ''} |
|---|---|---|---|
| 2 | $46 | $202 | $39 (Small) |
| 3 | $69 | $303 | $39 (Small) |
| 5 | $115 | $505 | $69 (Team) |
| 10 | $230 | $1,010 | $69 (Team) |

AI reply drafts and triage are included in every plan with a monthly allowance; on your own key your provider bills you and Colliedesk adds no fee. Auto-answer is not built yet; while Colliedesk is alpha it will cost ${AI_RESOLUTION} per resolution. Full sources: [Colliedesk vs Freshdesk](/vs/freshdesk).

## What Colliedesk does today

Colliedesk is alpha. The shared inbox, email channel and Freshdesk importer are released and run on Colliedesk Cloud; the interface or schema may change between releases. Read the table before you plan a move.

${statusTable}

## How small teams start

1. **Try it:** [start the 14-day Cloud trial](${TRIAL_HREF}), or self-host free.
2. **Plan the move before your renewal:** the [founding offer](${FOUNDING_HREF}) is $99 a quarter per workspace, locked for life, and we [migrate your Freshdesk data for you](/migrate/freshdesk/done-for-you).
3. **Switch only when the reconcile report matches.**`;

const page: Page = {
  jsonLd: [],
  name: 'Helpdesk for small teams',
  path: '/helpdesk-for-small-teams',
  section: 'Product',
  title: 'Helpdesk for small teams: one flat price for 2 to 10 agents',
  description:
    `A helpdesk for small support teams of 2 to 10 agents: one flat price per workspace (${FOUNDING_OPEN ? 'Founding: $99 a quarter for up to 10 agents' : '$39 for up to 3 agents, $69 for up to 10'}) instead of per-agent fees, AI drafts included, open source. Price by team size and honest status.`,
  summary: 'Small-team helpdesk: price by team size (2, 3, 5, 10 agents) vs Freshdesk, what small teams need, honest status',
  eyebrow: 'For small teams',
  h1: 'A helpdesk priced for a small team',
  lede: withFoundingLead('Two to ten people answering customers do not need an enterprise suite. They need a shared inbox, their history, and a bill that does not grow with every hire.'),
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
