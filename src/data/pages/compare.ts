// /compare: the hub of every comparison page. The list is built from the /vs page modules, so a
// new comparison appears here once it is added below (pnpm check fails if one is missing).
import { techArticle } from '../../lib/schema';
import type { Page } from '../../lib/page';
import { dollars, UNLIMITED } from '../../lib/site';
import { MAX_AGENTS, oursFor, TEAM_SIZES, teamLabel } from '../../lib/vs-pricing';
import freshdeskAlternative from './freshdesk-alternative';
import freshdeskPricingHistory from './freshdesk-pricing-history';
import vsChatwoot from './vs-chatwoot';
import vsFreescout from './vs-freescout';
import vsFreshdesk from './vs-freshdesk';
import vsFront from './vs-front';
import vsGorgias from './vs-gorgias';
import vsGroove from './vs-groove';
import vsHappyfox from './vs-happyfox';
import vsHelpScout from './vs-help-scout';
import vsHubspotServiceHub from './vs-hubspot-service-hub';
import vsZammad from './vs-zammad';
import vsZendesk from './vs-zendesk';
import vsZohoDesk from './vs-zoho-desk';
import { AFTER_FOUNDING, FOUNDING_ACTION, FOUNDING_OPEN, withFoundingLead } from '../../lib/cloud-price';

// Order: the tools most of our buyers leave first, then the open-source helpdesks, then the rest.
export const COMPARISONS: readonly Page[] = [
  vsFreshdesk, vsZendesk, vsHelpScout, vsZohoDesk, vsFront, vsGorgias, vsHappyfox, vsHubspotServiceHub, vsGroove,
  vsZammad, vsChatwoot, vsFreescout,
];

const competitorOf = (p: Page): string => p.h1.replace(/^Colliedesk vs /, '');
const oursAt = (agents: number): string => `${dollars(oursFor(agents).monthly)} a month (${oursFor(agents).name})`;

const body = `## Colliedesk Cloud by team size${FOUNDING_OPEN ? ', after Founding' : ''}

${AFTER_FOUNDING}Colliedesk Cloud is one price per workspace, billed monthly. Every feature on every plan; the plans differ only in agents and storage.

| Team | Colliedesk Cloud${FOUNDING_OPEN ? ' after Founding' : ''} |
|---|---|
${TEAM_SIZES.map((n) => `| ${teamLabel(n)} | ${oursAt(n)} |`).join('\n')}

Above ${MAX_AGENTS} agents, Unlimited is coming soon at ${dollars(UNLIMITED.monthly)} a month, billed annually. Until then, self-host with no agent limit or email us. Self-hosting is free with every feature.

## Pick the tool you use today

Each page lists published prices with the date we read them, what the other tool does better, and what Colliedesk cannot do yet.

| Compare | In short |
|---|---|
${COMPARISONS.map((p) => `| [Colliedesk vs ${competitorOf(p)}](${p.path}) | ${p.summary} |`).join('\n')}

## Leaving Freshdesk

- [Freshdesk alternatives](${freshdeskAlternative.path}): the options, including other tools, and who each one fits.
- [Freshdesk pricing history](${freshdeskPricingHistory.path}): how the per-agent price and the AI add-ons changed.
- [Migrate from Freshdesk](/migrate/freshdesk): every ticket, reply, note and attachment, with a reconcile report.
- [What a Freshdesk export leaves out](/migrate/freshdesk/export-gaps): what the CSV, XML and API exports hold, and how to check you got everything.`;

const page: Page = {
  jsonLd: [],
  path: '/compare',
  section: 'Compare',
  name: 'Compare Colliedesk',
  title: 'Compare Colliedesk with Freshdesk, Zendesk, Help Scout and other helpdesks',
  description:
    'Every Colliedesk comparison in one place: Freshdesk, Zendesk, Help Scout, Zoho Desk, Front, Zammad and more. Published prices with read dates, and what each tool does better.',
  summary: 'Hub of every comparison page, with the Colliedesk Cloud price at 1 to 25 agents',
  eyebrow: 'Compare',
  h1: 'Compare Colliedesk with the helpdesk you use today',
  lede: withFoundingLead('Most helpdesks charge per agent. Colliedesk charges one price for the workspace. Each comparison shows the published prices, with sources, and says where the other tool is the better choice.'),
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
};
page.jsonLd = [techArticle(page)];
export default page;
