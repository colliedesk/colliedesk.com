import { CONTACT_EMAIL, LADDER_LINE, POSITIONING, PRICE, PRICES_READ, REPO, TAGLINE, TRIAL_HREF } from '../../lib/site';
import { PER_WORKSPACE_FAQ } from './pricing';
import { faqPage, organization, softwareApplication } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { faqMarkdown } from '../../lib/twin';
import { statusTable } from './collie-status';
import { FOUNDING_OPEN, FRESHDESK_MONTH, FRESHDESK_RANGE, FRESHDESK_YEAR, HERO_RANGES, homeSectionsMd, OURS_NAME, OURS_YEAR, rangeLabel } from './home-sections';

// Headline: our yearly price, then what five agents pay each incumbent in a year (cheapest to dearest
// plan, from home-sections.ts). The hero shows one competitor at a time; this sentence is what
// screen readers, the twin and the title get.
export const HOME_H1_LEAD = `$${OURS_YEAR} a year for your whole team. Five agents pay`;
export const HOME_H1 = `${HOME_H1_LEAD} ${HERO_RANGES.map((r, i) => `${i === HERO_RANGES.length - 1 ? 'and ' : ''}${rangeLabel(r)} on ${r.name}`).join(', ')}.`;
export const HOME_LEDE =
  'Pay for the workspace, not for every agent, and bring your Freshdesk tickets with a report that proves nothing was lost.';

export const HOME_FAQ: Faq[] = [
  {
    q: 'What is Colliedesk?',
    a: 'Colliedesk is an open-source (AGPL-3.0) helpdesk for small support teams, made by HC Labs. It is the open-source alternative to Freshdesk, Zendesk and Help Scout: a shared inbox for your team, AI included at cost, one flat price per workspace.',
  },
  {
    q: 'Is Colliedesk free?',
    a: FOUNDING_OPEN
      ? 'Self-hosting is free, forever, with every feature. Colliedesk Cloud is sold as one plan while it is young: Founding, $100 per workspace per year for up to 10 agents, locked for life, for 10 teams. There is no free Cloud plan; every workspace starts with a 14-day free trial, no card. See [pricing](/pricing).'
      : `Self-hosting is free, forever, with every feature. Colliedesk Cloud is one flat price per workspace, with no per-agent fees: ${LADDER_LINE}. There is no free Cloud plan; every workspace starts with a 14-day free trial, no card. See [pricing](/pricing).`,
  },
  {
    q: 'Is Colliedesk ready to use?',
    a: 'It is alpha (0.0.x): released and running on Colliedesk Cloud, with a 14-day free trial. The email channel (inbound and outbound, threading), the Freshdesk importer with its reconcile report, saved replies, Cc on replies, attachments and live updates work today. Alpha means the interface or database schema may change between releases. Starting a new conversation from the inbox and contact history are not there yet (beta), and neither is AI. See the [roadmap](/roadmap).',
  },
  PER_WORKSPACE_FAQ,
  {
    q: 'What happens over the limit?',
    a: FOUNDING_OPEN
      ? `Founding covers up to 10 agents and 20 GB of attachments, imported files included. With 11 or more agents, Founding is not the right fit: self-host with no agent limit, or write to ${CONTACT_EMAIL}. Storage: we warn you at 80%. Over the cap, customer email keeps arriving with its attachments; only your own uploads and new imports pause. Nothing is deleted. See [pricing](/pricing).`
      : `Agents: each plan has a limit: Solo 1 agent, Small 3, Team 10, Team 25 up to 25. Pass it and you move up one plan; at 11 agents that is Team 25, ${PRICE.team25Monthly} a month. Above 25, Unlimited is coming soon; until then email us at ${CONTACT_EMAIL}, or self-host with no agent limit. Storage: we warn you at 80%. Over the cap, customer email keeps arriving with its attachments; only your own uploads and new imports pause until you free space or move up. Nothing is deleted. See [pricing](/pricing).`,
  },
  {
    q: 'Who is behind Colliedesk?',
    a: `HC Labs Co., Ltd., a small software company in Hanoi, Vietnam. We build Colliedesk in the open under AGPL-3.0, and we run our own customer support on Colliedesk Cloud. Write to ${CONTACT_EMAIL} and the people who build it answer.`,
  },
  {
    q: 'How does AI pricing work?',
    a: 'AI is included, not an add-on. On Colliedesk Cloud you pay the model cost plus 30%, or bring your own key. Self-hosted installs use your own key.',
  },
  {
    q: 'Can I move my Freshdesk tickets to Colliedesk?',
    a: 'Yes, with the Freshdesk importer, available now: tickets, replies, notes, attachments, tags and contacts, with a reconcile report. Founding customers get the migration done for free. Read [the migration guide](/migrate/freshdesk).',
  },
];

const md = `${TAGLINE} ${POSITIONING}

${HOME_H1} ${HOME_LEDE} The Freshdesk importer is available now; reconcile report numbers shown on the site are an example.

Status: alpha (0.0.x), live on Colliedesk Cloud with a 14-day free trial. Self-host free: ${REPO}. Cloud: ${FOUNDING_OPEN ? 'Founding, $100 per workspace per year, locked for life, 10 places' : LADDER_LINE}.

${homeSectionsMd}

## What works today, and what is coming

${statusTable}
${faqMarkdown(HOME_FAQ)}
## Bring your tickets. Keep the difference.

A year of Freshdesk Pro with Freddy AI Copilot for five agents, billed annually: 12 × $${FRESHDESK_MONTH} = $${FRESHDESK_YEAR.toLocaleString('en-US')}. ${OURS_NAME} for the same team: $${OURS_YEAR} a year. You keep $${(FRESHDESK_YEAR - OURS_YEAR).toLocaleString('en-US')}. [Start the free trial](${TRIAL_HREF}) or [move from Freshdesk](/migrate/freshdesk).`;

// The HTML is the Home view (src/components/home/*); the twin is the Markdown above.
const page: Page = {
  name: 'Colliedesk overview',
  path: '/',
  section: 'Product',
  title: `Colliedesk: $${OURS_YEAR} a year for your whole support team, not per agent`,
  description:
    `Colliedesk is an open-source helpdesk for small support teams, $${OURS_YEAR} a year for up to 10 agents, where five agents pay Freshdesk ${rangeLabel(FRESHDESK_RANGE)} a year. Leave Freshdesk with all your data. ${FOUNDING_OPEN ? 'One plan, locked for life, only 10 places' : `One flat price per workspace from ${PRICE.range} a month`}, no per-agent fees.`,
  summary: `What Colliedesk is, what we sell, what AI agents can do through MCP, status, founding offer; competitor prices read ${PRICES_READ}`,
  h1: HOME_H1,
  lede: HOME_LEDE,
  view: 'home',
  md,
  faq: [],
  bodyClass: 'home',
  jsonLd: [organization(), softwareApplication({ ladder: !FOUNDING_OPEN }), faqPage(HOME_FAQ)],
};
export default page;
