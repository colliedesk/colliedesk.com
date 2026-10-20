import { CONTACT_EMAIL, FOUNDING_HREF, REPO, TRIAL_HREF } from '../../lib/site';
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
    a: 'No. Colliedesk Cloud Team is $49 per workspace per month or $490 per year, for up to 10 agents. Team 25 is $99 per workspace per month or $990 per year, for up to 25 agents. A workspace is one support team. Adding an agent does not change the price; you move to Team 25 only when you reach 11 agents.',
  },
  {
    q: 'How much storage is included?',
    a: `Team includes 100 GB of attachments and Team 25 includes 250 GB. Imported files count. We warn you at 80%. Customer email is always accepted, even over the cap, with its attachments; only your own uploads and new imports pause until you free space or move up. Need more storage? Email us at ${CONTACT_EMAIL}. We do not sell extra storage self-serve yet.`,
  },
  {
    q: 'What happens above 25 agents?',
    a: `Cloud Team 25 covers up to 25 agents. With more than 25, email us at ${CONTACT_EMAIL}. Self-hosting has no agent limit.`,
  },
  {
    q: 'What does "AI at LLM cost +30%" mean?',
    a: 'On Colliedesk Cloud you can use our AI key. You pay what the model provider charges for the tokens your tickets used, plus 30%. Example: if the provider charges $1.00, you pay $1.30. Or bring your own key and pay your provider directly.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. Every Cloud workspace starts with a 14-day free trial of the Team plan, every feature, no card. If you import from Freshdesk during the trial, it extends to 30 days so you can run both side by side. When the trial ends without a plan, the workspace is locked: you can still sign in to export all your data, and choosing a plan unlocks it at once with nothing lost. Self-hosting stays free forever.',
  },
  {
    q: 'Is self-hosting really free?',
    a: `Yes. Self-hosting is free, forever, with every feature. The code is AGPL-3.0 on [GitHub](${REPO}). Read the [install guide](/docs/self-host).`,
  },
  {
    q: 'What is the founding offer?',
    a: 'A founding customer pays $100 per workspace per year, and that price is locked for life. We also migrate your Freshdesk data for free. It includes up to 10 agents and 20 GB of attachments, imported files included. Above 20 GB nothing is deleted and customer email keeps arriving with its attachments; only your own uploads and new imports wait until you upgrade to Cloud Team, which includes 100 GB. It is for teams who want to leave Freshdesk and help shape Colliedesk while it is young.',
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

const plansMd = `| Plan | Price | What you get |
|---|---|---|
| Self-host | $0, forever | Every feature. AGPL-3.0. AI with your own model key. |
| Founding | $100 per workspace per year, locked for life; 30-day money-back guarantee | Free Freshdesk migration with a reconcile report. Up to 10 agents, no per-agent fees. 20 GB of attachments, imported files included. AI at LLM cost +30% or bring your own key. |
| Cloud Team | $49 per workspace per month, or $490 per year | Hosted by HC Labs. Up to 10 agents, unlimited conversations, no per-agent fees. 100 GB of attachments, imported files included. AI at LLM cost +30% or bring your own key. [Start free trial](${TRIAL_HREF}). |
| Cloud Team 25 | $99 per workspace per month, or $990 per year | Everything in Team. Up to 25 agents, unlimited conversations, flat price, no per-agent fees. 250 GB of attachments, imported files included. [Start free trial](${TRIAL_HREF}). |

Need more storage? Email us at ${CONTACT_EMAIL}. Customer email is always accepted, even over the cap; only agent uploads and new imports pause. We warn you at 80%.`;

const body = `## What you pay for

Self-hosting is free. We sell two things: **Colliedesk Cloud** (we run it for you) and **migration** (we move your Freshdesk history and prove nothing was lost). That is the whole business. There is no "enterprise edition" with the good features held back.

**Every feature on every plan.** Cloud Team, Team 25 and Founding differ only in the number of agents and the attachment storage. Self-hosting has every feature too.

## AI is included, not an add-on

**Coming after beta**. AI features: draft replies and triage from your own past replies and knowledge base, and auto-answer for repetitive tickets with a human in the loop. There is no AI seat licence and no per-resolution fee.

- **Use our key on Cloud:** you pay the model provider's cost for your usage, plus 30%.
- **Bring your own key:** on Cloud or self-hosted, you pay your provider directly.

## How this compares

Most helpdesks charge per agent, then charge again for AI. For five agents, Freshdesk Pro with Freddy AI Copilot lists at $5,040 a year billed annually, or $505 a month billed monthly. Colliedesk Cloud Team is $490 a year or $49 a month for the workspace, plus AI usage. Prices and sources: [vs Freshdesk](/vs/freshdesk), [vs Zendesk](/vs/zendesk), [vs Help Scout](/vs/help-scout).

## Honest status

Colliedesk is in **alpha** (0.0.x). It is released and runs on Colliedesk Cloud, with the email channel, the Freshdesk importer with its reconcile report, saved replies, Cc on replies, attachments and live updates. Alpha means the interface or database schema may change between releases. Not there yet: starting a new conversation from the inbox and contact history (beta), and AI (after beta). If you must have those this week, Colliedesk is not ready for you yet. If you are planning your exit before your next Freshdesk renewal, [start the free trial](${TRIAL_HREF}) or take [the founding offer](${FOUNDING_HREF}).`;

const page: Page = {
  name: 'Pricing',
  path: '/pricing',
  section: 'Product',
  title: 'Colliedesk pricing: $49 or $99 per workspace, no per-agent fees, 14-day free trial',
  description:
    'Colliedesk Cloud starts with a 14-day free trial, no card. Team costs $49 per workspace per month ($490 per year) for up to 10 agents, Team 25 costs $99 ($990 per year) for up to 25. No per-agent fees. Self-hosting is free.',
  summary: '14-day free trial, no card; Team $49 per workspace per month or $490 per year, up to 10 agents, 100 GB; Team 25 $99 or $990 per year, up to 25 agents, 250 GB; no per-agent fees; founding offer; AI at LLM cost +30% or your own key; self-host free',
  eyebrow: 'Pricing',
  h1: 'One flat price per workspace. No per-agent fees.',
  lede: 'Try it free for 14 days. Add your whole team, up to 10 agents, for the same $49 a month, or up to 25 agents for $99. Self-host for $0. Pay for AI at cost plus 30%, or bring your own key.',
  pre: 'pricing-plans',
  preMd: plansMd,
  body,
  faq,
  jsonLd: [softwareApplication(), faqPage(faq)],
};
export default page;
