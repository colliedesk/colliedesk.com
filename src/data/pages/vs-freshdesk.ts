import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { FOUNDING_ACTION, FOUNDING_LEAD, OUR_PLAN, OUR_PRICE } from '../../lib/cloud-price';
import { AI_RESOLUTION, BUSINESS, BUSINESS_AGENTS, dollars, PRICE, SMALL, SWITCH_OFFER_BLOCK_MD, TEAM, TEAM_25 } from '../../lib/site';
import { exportMd, featureTable, sourcesMd, type FeatureRow } from '../../lib/competitor';
import { readOnLabel, rowsAt, usd, vsMarkdown, type VsPricing } from '../../lib/vs-pricing';
import { colliedesk, OURS } from '../competitors/colliedesk';
import { chartPlans, copilotRange, freshdesk as fd, perAgentRange, price } from '../competitors/freshdesk';
import { collieFacts as c, statusTable } from './collie-status';

const pricing: VsPricing = {
  competitor: fd.name,
  readOn: fd.readOn,
  // Monthly-billing prices, so they compare like for like with Colliedesk billed monthly. The
  // annual-billing prices only limit where we claim to cost less.
  billing: 'per agent, billed monthly',
  plans: chartPlans,
  forYou: [
    'You pay Freshdesk per agent, then again per agent for AI, and the bill grows with every hire.',
    'Most of your support is email. The email channel (inbound and outbound, threading) is available now.',
    'You want your tickets in a PostgreSQL database you control, or to self-host for free.',
    'Your Freshdesk renewal is months away, so you can plan the move around our [roadmap](/roadmap).',
  ],
  notForYou: [
    'You need live chat, phone, WhatsApp or a marketplace of apps today.',
    'You need AI that answers tickets on its own today: auto-answer is not built yet (reply drafts and triage are shipped).',
    `You want the founding price and have more than ${OURS.foundingGiB} GiB of Freshdesk attachments: founding includes ${OURS.foundingGiB} GiB, imported files included.`,
  ],
};
const FIVE = 5;
const fiveAgents = rowsAt(pricing, FIVE).at(-1);
// One read date for the chart, the body, the FAQ and the meta description.
const PRICES_READ = readOnLabel(pricing.readOn);

const MONTHS = 12;
// The "where Freshdesk does more" rows, and which side does more on each.
const FEATURE_ROWS: readonly FeatureRow[] = [
  { key: 'automations', lead: 'them' }, { key: 'reports', lead: 'them' }, { key: 'sla' }, { key: 'channels', lead: 'them' },
  { key: 'app_marketplace', lead: 'them' }, { key: 'shared_inbox' }, { key: 'kb_help_center' }, { key: 'price_model', lead: 'us' },
  { key: 'full_export', lead: 'us' }, { key: 'self_host', lead: 'us' },
];

const faq: Faq[] = [
  {
    q: 'What is the best open-source alternative to Freshdesk?',
    a: `Colliedesk is an open-source (${OURS.license}) helpdesk built for small teams leaving Freshdesk: one flat price per workspace (${OUR_PLAN} is ${OUR_PRICE} for up to ${TEAM.agents} agents), AI reply drafts included, and a Freshdesk importer (available now). It is generally available; check the status table for what is not built yet before you switch.`,
  },
  {
    q: `How much does Freshdesk cost for ${FIVE} agents with AI?`,
    a: `At list prices read on ${PRICES_READ}, billed monthly: Freshdesk Pro is ${usd(price.pro.monthly)} per agent per month and Freddy AI Copilot is ${usd(price.copilot.monthly)}, so five agents pay ${FIVE} × (${usd(price.pro.monthly)} + ${usd(price.copilot.monthly)}) = ${usd(FIVE * (price.pro.monthly + price.copilot.monthly))} a month. Billed annually it is ${FIVE} × (${usd(price.pro.annual)} + ${usd(price.copilot.annual)}) × ${MONTHS} = ${usd(FIVE * (price.pro.annual + price.copilot.annual) * MONTHS)} a year. ${FOUNDING_LEAD ? `Colliedesk Founding is ${OURS.foundingPrice}, ${OURS.foundingYear}, locked for life. After the ${OURS.foundingPlaces} Founding places are taken, ` : ''}Colliedesk Cloud Team is ${PRICE.monthly} a month or ${PRICE.yearly} a year.`,
  },
  {
    q: 'Is Colliedesk ready to replace Freshdesk today?',
    a: `For a small team that mostly answers email, yes. Colliedesk is generally available on Colliedesk Cloud, with the email channel, Cc on replies, saved replies, attachments, a new conversation from the inbox, contact history, AI reply drafts and the Freshdesk importer. Response targets in business hours and a Results page that compares your last ${OURS.resultsWindow} with Freshdesk are shipped too. Not built yet: AI auto-answer, automations, macros, CSAT, live chat (coming ${OURS.liveChat}) and phone. If you rely on those, stay on Freshdesk for now. If your renewal is months away, the founding offer locks ${OURS.foundingPrice} for life and includes the migration.`,
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
| Plans | ${fd.facts.plans.text} | ${c.price} |
| AI drafting | ${fd.facts.ai.text} | ${c.ai} |
| AI agent | ${fd.facts.aiAgent?.text} | Auto-answer with a human in the loop, same AI pricing (not built yet) |
| Free option | ${fd.facts.free.text} | ${c.free} |
| Source code | ${fd.facts.license.text} | ${c.source} |

List prices before tax. On Colliedesk, AI reply drafts and triage are included with a monthly allowance; with your own key your provider bills you. Auto-answer, once it ships, is ${AI_RESOLUTION} per resolution.

## Leaving: what Freshdesk gives you

${exportMd(fd)}

Colliedesk keeps your data in PostgreSQL with an open, documented model. ${c.export} The step-by-step guide: [migrate from Freshdesk](/migrate/freshdesk).

## Where Freshdesk does more, and where Colliedesk does

Freshdesk has had more than a decade to grow. If you need a row marked "Freshdesk" today, stay on Freshdesk for now.

${featureTable(fd, colliedesk, FEATURE_ROWS)}

## Switching with ${TEAM.agents + 1} to ${BUSINESS.agents} agents

${TEAM_25.name} (${dollars(TEAM_25.monthly)} a month for up to ${TEAM_25.agents} agents) and ${BUSINESS.name} (${dollars(BUSINESS.monthly)} a month for ${BUSINESS_AGENTS} agents) come with two offers for teams leaving Freshdesk.

${SWITCH_OFFER_BLOCK_MD}

## What Colliedesk does today


${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

${sourcesMd(fd)}`;

const page: Page = {
  jsonLd: [],
  path: '/vs/freshdesk',
  section: 'Compare',
  title: `Colliedesk vs Freshdesk: ${OUR_PRICE} for up to ${TEAM.agents} agents, not ${perAgentRange} per agent`,
  description:
    `An honest comparison of Colliedesk and Freshdesk: published prices, AI add-on costs, export limits and what Colliedesk can and cannot do yet. Prices read ${PRICES_READ}.`,
  summary: `Freshdesk ${perAgentRange} per agent plus ${copilotRange} Copilot vs Colliedesk ${OUR_PLAN} at a flat ${OUR_PRICE} per workspace for up to ${TEAM.agents} agents; export limits; honest status`,
  eyebrow: 'Compare · Freshdesk alternative',
  h1: 'Colliedesk vs Freshdesk',
  lede: `Five agents on ${fiveAgents?.name ?? 'Freshdesk'} pay ${usd(fiveAgents?.usd ?? 0)} a month. ${FOUNDING_LEAD ? `${FOUNDING_LEAD} The chart shows the Cloud plans after that.` : `Colliedesk Cloud Team is ${PRICE.monthly} for the whole workspace, up to ${TEAM.agents} agents (Small ${dollars(SMALL.monthly)} for up to ${SMALL.agents}, ${TEAM_25.name} ${PRICE.team25Monthly} for up to ${TEAM_25.agents}).`} Pick your team size to see where Colliedesk fits, and where it does not.`,
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  vs: pricing,
  preMd: vsMarkdown(pricing),
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
