import { BUSINESS_AGENTS, CONTACT_EMAIL, GA_DOC, LADDER_LINE, MONEY_BACK, POSITIONING, PRICE, PRICES_READ, REPO, STATUS_PAGE, SWITCH_CALL_HREF, TAGLINE, TEAM_25, TRIAL_HREF } from '../../lib/site';
import { billAt, BILL_SIZES } from '../../lib/team-bill';
import { FOUNDING_ACTION } from '../../lib/cloud-price';
import { faqPage, organization, softwareApplication } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { faqMarkdown } from '../../lib/twin';
import { statusTable } from './collie-status';
import {
  AGENT_CALLS, AGENT_HEADING, AGENT_LEDE, AGENT_OUTCOME, AGENT_POINTS, BILL_LEDE, DAILY, DONE_FOR_YOU, FACTS, FOUNDING_OPEN, FRESHDESK_RANGE,
  GUARANTEES, issueHref, MCP_URL, MIGRATE_LEDE, NOT_MOVED, OURS_YEAR, rangeLabel, RELIABILITY_LEDE, REPORT_NOT_IMPORTED, REPORT_ROWS, STEPS, STILL_COMING,
} from './home-sections';

// Headline: why our buyer stays on Freshdesk (leaving is hard) and what we changed. The lede names the
// category (a helpdesk), the proof (the reconcile report) and the AI agent; the fine print under the
// actions gives the price for each team size.
export const HOME_EYEBROW = 'Helpdesk for teams leaving Freshdesk · Generally available since 5 November 2026 · Open source';
export const HOME_H1_LINES = ['Freshdesk raises your price', 'because leaving is hard.', 'We made leaving easy.'] as const;
export const HOME_H1 = HOME_H1_LINES.join(' ');
export const HOME_LEDE =
  'Colliedesk is a helpdesk: one shared inbox and a help center for your support team. We import every Freshdesk ticket and article, with a report that proves nothing was lost. Your AI agent can work in it too, through MCP.';
/** The price line under the hero actions: the team of 3 to 10 first, then where bigger teams go. */
export const HOME_PRICE_LEAD = `3–10 agents: $${OURS_YEAR} a year, flat.`;
export const HOME_PRICE_REST = `11–25: ${TEAM_25.name}, ${PRICE.team25Monthly} a month. 26–100: Business, through a call.`;
export const HOME_RISK_LINE = `14-day free trial, no card · ${MONEY_BACK}`;

export const HOME_FAQ: Faq[] = [
  { q: 'Will we lose any tickets or attachments?', a: 'No. The reconcile report counts every record in Freshdesk and in Colliedesk and checks each attachment with SHA-256. One mismatch means the migration failed, and you keep Freshdesk.' },
  { q: 'Do our old help-center links keep working?', a: 'On your own help-center domain, yes: published articles redirect with a 301, drafts with a 302. On a freshdesk.com address, only Freshdesk Pro and Enterprise can redirect.' },
  { q: 'How long does the move take?', a: "Before you start, the import page gives a time range from your ticket count and your Freshdesk plan's API limit. Example: 10,000 tickets on Growth take about 5 to 9 hours. The newest tickets arrive within the first minute, and your team keeps working meanwhile." },
  { q: 'Can we keep Freshdesk while we test?', a: 'Yes. The import only reads Freshdesk. Run one queue in Colliedesk, catch up with a second import, and move your support address when your team is sure.' },
  { q: 'What happens if Colliedesk goes down?', a: `Live status is on [status.colliedesk.com](${STATUS_PAGE}). Every database change is copied, encrypted, to a second data centre within minutes, and we test a restore every week.` },
  { q: 'Do you train AI on our tickets?', a: 'No. We never use your workspace content to train AI models. AI drafts stay off until an admin turns them on.' },
  { q: 'How do we leave if Colliedesk is not right for us?', a: 'Export the whole workspace as a ZIP at any time. Founding, and Team 25 or Business bought through the switch offer, are refunded in full within 30 days of the first payment.' },
  { q: 'Who is behind Colliedesk?', a: `HC Labs, a small software company in Hanoi, Vietnam. We build Colliedesk in the open under AGPL-3.0 and run our own support on it. Write to ${CONTACT_EMAIL} and the people who build it answer.` },
];

const billMd = BILL_SIZES.map((n) => {
  const rows = billAt(n, FOUNDING_OPEN).map((b) => `- ${b.name}: $${b.usd.toLocaleString('en-US')} a year (${b.math})${b.call ? `, [through a call](${SWITCH_CALL_HREF})` : ''}`);
  return `**${n} agents**\n\n${rows.join('\n')}`;
}).join('\n\n');

const foundingMd = FOUNDING_OPEN
  ? `## Founding offer: $99 every 3 months, locked for life

For small teams of 3 to 10 agents planning to leave Freshdesk; 10 places. Your price never goes up, we migrate your Freshdesk data for free, and you can export the whole workspace at any time. After the 10 places: Cloud Team at ${PRICE.yearly} a year. Bigger team? 11 to 25 agents: ${TEAM_25.name}, ${PRICE.team25Monthly} a month. ${BUSINESS_AGENTS}: Business, through a call. Up to 10 agents, no per-agent fees; 20 GiB of attachments, imported files included; AI reply drafts and triage included, or your own key; ${MONEY_BACK}.`
  : `## Cloud plans

Founding is closed: all 10 places are taken. One flat price per workspace, never per agent: ${LADDER_LINE}.`;

const md = `${TAGLINE} ${POSITIONING}

${HOME_EYEBROW}.

${HOME_H1} ${HOME_LEDE} [Start the free trial](${TRIAL_HREF})${FOUNDING_OPEN ? `, or take the [${FOUNDING_ACTION.label}](${FOUNDING_ACTION.href})` : ''}. ${HOME_PRICE_LEAD} ${HOME_PRICE_REST} ${HOME_RISK_LINE}.

${FACTS.map(([fact, line, link, href]) => `- **${fact}** ${line} ([${link}](${href}))`).join('\n')}

## Switch at your pace. Prove nothing was lost.

${MIGRATE_LEDE} The Freshdesk importer is shipped; the reconcile report below is an example account.

| Record | Freshdesk | Colliedesk |
|---|---|---|
${REPORT_ROWS.map(([r, c]) => `| ${r} | ${c} | ${c} |`).join('\n')}

${REPORT_NOT_IMPORTED}

${STEPS.map(([t, v], i) => `${i + 1}. **${t}.** ${v}`).join('\n')}

${DONE_FOR_YOU} ${NOT_MOVED} [Migration guide](/migrate/freshdesk).

## ${AGENT_HEADING}

${AGENT_LEDE} MCP endpoint on Colliedesk Cloud: \`${MCP_URL}\`, with the agent token as a bearer token. [Connect an AI agent](/docs/mcp); who can do what: [Roles and permissions](/docs/roles-and-permissions). An example session with a token that may not send:

${AGENT_CALLS.map((c) => `- \`${c}\``).join('\n')}
- ${AGENT_OUTCOME}

${AGENT_POINTS.map(([t, v]) => `- **${t}.** ${v}`).join('\n')}

## Freshdesk charges per agent, then again for AI.

${BILL_LEDE.replace('Pick your team size. ', '')} Totals per year, billed annually.

${billMd}

## What your team uses every day already works.

HC Labs answers its own customers in it. Not built yet: automations and macros. Freshdesk still does more there: read [Colliedesk vs Freshdesk](/vs/freshdesk) before you decide.

${DAILY.map(([t, v]) => `- **${t}.** ${v}`).join('\n')}

## Generally available. Here is what that means.

${RELIABILITY_LEDE} [What general availability guarantees](${GA_DOC}). Live status: [status.colliedesk.com](${STATUS_PAGE}); no uptime number is stated until the written commitment is published.

${GUARANTEES.map(([t, v]) => `- **${t}.** ${v}`).join('\n')}

Still coming: ${STILL_COMING.map((s) => `${s.title} (${s.state}, [#${s.issue}](${issueHref(s.issue)}))`).join('; ')}. [Full roadmap](/roadmap).

${statusTable}

${foundingMd}
${faqMarkdown(HOME_FAQ)}
## Bring your tickets. Keep the difference.

14-day free trial, no card. ${MONEY_BACK}.${FOUNDING_OPEN ? ' Founding price locked for life.' : ''} [Start the free trial](${TRIAL_HREF}), or with 11 to 100 agents [book a 30-minute call](${SWITCH_CALL_HREF}). Self-host free: ${REPO}.`;

// The HTML is the Home view (src/components/home/*); the twin is the Markdown above.
const page: Page = {
  name: 'Colliedesk overview',
  path: '/',
  section: 'Product',
  title: `Colliedesk: $${OURS_YEAR} a year for your whole support team, not per agent`,
  description:
    `Colliedesk is an open-source helpdesk for teams of 3 to 10 agents leaving Freshdesk, $${OURS_YEAR} a year for up to 10 agents, where five agents pay Freshdesk ${rangeLabel(FRESHDESK_RANGE)} a year. Leave Freshdesk with all your data. ${FOUNDING_OPEN ? 'Founding, locked for life, only 10 places' : `One flat price per workspace from ${PRICE.range} a month`}, no per-agent fees.`,
  summary: `What Colliedesk is, the Freshdesk migration and its reconcile report, what AI agents can do through MCP, the bill by team size, reliability and status, founding offer; competitor prices read ${PRICES_READ}`,
  h1: HOME_H1,
  lede: HOME_LEDE,
  view: 'home',
  md,
  faq: [],
  bodyClass: 'home',
  jsonLd: [organization(), softwareApplication(FOUNDING_OPEN ? { plans: [TEAM_25] } : {}), faqPage(HOME_FAQ)],
};
export default page;
