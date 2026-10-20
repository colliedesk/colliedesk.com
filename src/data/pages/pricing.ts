import {
  agentsLabel, CLOUD_PLANS, CONTACT_EMAIL, dollars, FOUNDING_HREF, LADDER_LINE, PRICE, REPO, SMALL, SOLO, TEAM, TRIAL_HREF, UNLIMITED,
} from '../../lib/site';
import { faqPage, softwareApplication } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';

// Shared with the home FAQ.
export const PER_WORKSPACE_FAQ: Faq = {
  q: 'Why per workspace, not per agent?',
  a: 'Because a helpdesk should not cost more each time you hire. Per-agent pricing pushes teams to share logins or keep part-time helpers out of the inbox. With one price for the workspace, everyone who answers customers gets their own login. Our costs follow storage and AI usage, not the number of people who sign in, so that is what the plans limit: agents per plan, attachment storage, and AI at model cost +30%.',
};

const faq: Faq[] = [
  PER_WORKSPACE_FAQ,
  {
    q: 'Does Colliedesk charge per agent?',
    a: `No. You pay one flat price for the workspace: ${LADDER_LINE}. A year costs ten months. A workspace is one support team. Adding an agent does not change the price; you move up one plan only when you pass your plan's agent limit.`,
  },
  {
    q: 'Is there a free plan?',
    a: `Not on Cloud. Every Cloud workspace starts with a 14-day free trial, no card, and the cheapest plan is Solo at ${dollars(SOLO.monthly)} a month. Self-hosting is free forever, with every feature.`,
  },
  {
    q: 'How much storage is included?',
    a: `${CLOUD_PLANS.map((p) => `${p.name} ${p.storage}`).join(', ')} of attachments. Imported files count. We warn you at 80%. Customer email is always accepted, even over the cap, with its attachments; only your own uploads and new imports pause until you free space or move up. Need more storage? Email us at ${CONTACT_EMAIL}. We do not sell extra storage self-serve yet.`,
  },
  {
    q: 'What happens above 25 agents?',
    a: `Team 25 covers up to 25 agents. Unlimited, for any number of agents and ${UNLIMITED.storage} of attachments, is coming soon at ${dollars(UNLIMITED.monthly)} a month billed annually (${dollars(UNLIMITED.yearly)} a year). Until it opens, email us at ${CONTACT_EMAIL} if you have more than 25 agents. Self-hosting has no agent limit.`,
  },
  {
    q: 'What does "AI at LLM cost +30%" mean?',
    a: 'On Colliedesk Cloud you can use our AI key. You pay what the model provider charges for the tokens your tickets used, plus 30%. Example: if the provider charges $1.00, you pay $1.30. Or bring your own key and pay your provider directly.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. Every Cloud workspace starts with a 14-day free trial of the Team plan, every feature, no card. If you import from Freshdesk during the trial, it extends to 30 days so you can run both side by side. There is no automatic charge: when the trial ends without a plan, the workspace is locked, you can still sign in to export all your data, and choosing a plan unlocks it at once with nothing lost. Cancel anytime. Self-hosting stays free forever.',
  },
  {
    q: 'Is self-hosting really free?',
    a: `Yes. Self-hosting is free, forever, with every feature. The code is AGPL-3.0 on [GitHub](${REPO}). Read the [install guide](/docs/self-host).`,
  },
  {
    q: 'What is the founding offer?',
    a: `A founding customer pays $100 per workspace per year, and that price is locked for life. It is limited to 10 workspaces in total; when they are taken, the offer closes for good. We also migrate your Freshdesk data for you, free. It includes up to 10 agents and 20 GB of attachments, imported files included. Above 20 GB nothing is deleted and customer email keeps arriving with its attachments; only your own uploads and new imports wait until you upgrade to Cloud Team, which includes ${TEAM.storage}. It is for teams who want to leave Freshdesk and help shape Colliedesk while it is young.`,
  },
  {
    q: 'Can I get my money back if Founding is not right for us?',
    a: 'Yes. Email support@colliedesk.com within 30 days of your first Founding payment and we refund the full amount, no questions asked, even if we already migrated your Freshdesk data. You can export everything before you go. Details are in the [terms](/terms#refunds).',
  },
  {
    q: 'When can I use Colliedesk Cloud?',
    a: `Now. Colliedesk Cloud is live in alpha, and every workspace starts with a 14-day free trial, no card. [Start the free trial](${TRIAL_HREF}). See the [roadmap](/roadmap) for what comes next.`,
  },
];

const cloudRow = (p: (typeof CLOUD_PLANS)[number]): string => {
  const price = p.annualOnly
    ? `${dollars(p.monthly)} per workspace per month, billed annually (${dollars(p.yearly)} per year). **Coming soon**`
    : `${dollars(p.monthly)} per workspace per month, or ${dollars(p.yearly)} per year`;
  const cta = p.comingSoon ? 'No checkout yet.' : `[Start free trial](${TRIAL_HREF}).`;
  return `| ${p.name} | ${price} | ${agentsLabel(p)}, ${p.storage} of attachments. ${p.who} ${cta} |`;
};

const plansMd = `| Plan | Price | What you get |
|---|---|---|
${CLOUD_PLANS.map(cloudRow).join('\n')}
| Founding | $100 per workspace per year, locked for life; 30-day money-back guarantee | Limited to 10 workspaces. Freshdesk migration done for you, with a reconcile report. Up to 10 agents, no per-agent fees. 20 GB of attachments, imported files included. |
| Self-host | $0, forever | Every feature, no agent limit. AGPL-3.0. AI with your own model key. |

Every plan has every feature, unlimited conversations, no per-agent fees, and AI at LLM cost +30% or your own key. 14-day free trial, no card. No automatic charge: when the trial ends, you pick a plan or export your data. Cancel anytime.

Need more storage? Email us at ${CONTACT_EMAIL}. Customer email is always accepted, even over the cap; only agent uploads and new imports pause. We warn you at 80%.`;

const body = `## What you pay for

Self-hosting is free. We sell two things: **Colliedesk Cloud** (we run it for you) and **migration** (we move your Freshdesk history and prove nothing was lost). That is the whole business. There is no "enterprise edition" with the good features held back.

**Every feature on every plan.** Solo, Small, Team, Team 25, Unlimited and Founding differ only in the number of agents and the attachment storage. Self-hosting has every feature too.

## AI is included, not an add-on

**Coming after beta**. AI features: draft replies and triage from your own past replies and knowledge base, and auto-answer for repetitive tickets with a human in the loop. There is no AI seat licence and no per-resolution fee.

- **Use our key on Cloud:** you pay the model provider's cost for your usage, plus 30%.
- **Bring your own key:** on Cloud or self-hosted, you pay your provider directly.

## How this compares

Most helpdesks charge per agent, then charge again for AI. For five agents, Freshdesk Pro with Freddy AI Copilot lists at $5,040 a year billed annually, or $505 a month billed monthly. Colliedesk Cloud Team is ${PRICE.yearly} a year or ${PRICE.monthly} a month for the workspace, plus AI usage. Prices and sources: [vs Freshdesk](/vs/freshdesk), [vs Zendesk](/vs/zendesk), [vs Help Scout](/vs/help-scout).

## Honest status

Colliedesk is in **alpha** (0.0.x). It is released and runs on Colliedesk Cloud, with the email channel, the Freshdesk importer with its reconcile report, saved replies, Cc on replies, attachments and live updates. Alpha means the interface or database schema may change between releases. Not there yet: starting a new conversation from the inbox and contact history (beta), and AI (after beta). If you must have those this week, Colliedesk is not ready for you yet. If you are planning your exit before your next Freshdesk renewal, [start the free trial](${TRIAL_HREF}) or take [the founding offer](${FOUNDING_HREF}).`;

const page: Page = {
  name: 'Pricing',
  path: '/pricing',
  section: 'Product',
  title: `Colliedesk pricing: ${PRICE.range} a month per workspace, no per-agent fees, 14-day free trial`,
  description:
    `Colliedesk Cloud costs one flat price per workspace: Solo ${dollars(SOLO.monthly)} a month for 1 agent, Small ${dollars(SMALL.monthly)} for 3, Team ${PRICE.monthly} for 10, Team 25 ${PRICE.team25Monthly} for 25. No per-agent fees, 14-day free trial, no card. Self-hosting is free.`,
  summary: `14-day free trial, no card; ${LADDER_LINE}; a year costs ten months; no per-agent fees; founding offer limited to 10 workspaces; AI at LLM cost +30% or your own key; self-host free`,
  eyebrow: 'Pricing',
  h1: 'Clear, fixed prices. No per-agent fees.',
  lede: `Everyone on your team is included. Pick the plan by team size, from Solo at ${dollars(SOLO.monthly)} a month to Team 25 at ${PRICE.team25Monthly}. Try it free for 14 days, no card. Self-host for $0.`,
  pre: 'pricing-plans',
  preMd: plansMd,
  body,
  faq,
  jsonLd: [softwareApplication(), faqPage(faq)],
};
export default page;
