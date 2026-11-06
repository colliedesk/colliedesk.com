// Shared facts used on every page. Change a fact here, not in page copy.
export interface NavLink {
  href: string;
  label: string;
  /** Short status shown after the label, e.g. "Soon" for an importer not built yet. */
  badge?: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export const ORIGIN = 'https://colliedesk.com';
export const REPO = 'https://github.com/colliedesk/colliedesk';
export const NAME = 'Colliedesk';
export const UPDATED = '2026-10-20';
export const PRICES_READ = '14 October 2026';

export const TAGLINE = 'The open-source alternative to Freshdesk, Zendesk and Help Scout.';
export const POSITIONING =
  'Leave Freshdesk with all your data. AI that actually answers tickets is included, not an add-on. Flat price, no per-agent fees.';

// Shown at the end of every page in the Compare section, HTML and Markdown twin.
export const TRADEMARK_NOTE =
  'Product names on this page are trademarks of their owners. Colliedesk and HC Labs are not affiliated with or endorsed by them.';

export const FOUNDING_HREF = '/#founding';
// The Founding refund promise, stated next to every Founding checkout button and in the terms.
export const MONEY_BACK = '30-day money-back guarantee';
// Founding is bought inside the app: the buyer signs up first, then the app opens the Polar
// checkout for that workspace, so the payment always lands on a workspace.
export const FOUNDING_CHECKOUT = 'https://app.colliedesk.com/settings/billing?buy=founding';
// Colliedesk Cloud sign-in (email code through Clerk) for agents who already have a workspace.
export const APP_SIGN_IN = 'https://app.colliedesk.com/sign-in';
// The same page starts the 14-day free trial: a new email gets "Create your workspace" there.
// intent=trial lets the app title the page for a new workspace instead of "Sign in".
export const TRIAL_HREF = `${APP_SIGN_IN}?intent=trial`;
// The Team 25 card's trial link names the plan: after sign-up the app puts Team 25 first on its billing page.
export const TEAM_25_TRIAL_HREF = `${TRIAL_HREF}&plan=team25`;
// The updates box posts to the web form channel of HC Labs' own Colliedesk workspace: every
// signup lands there as a conversation tagged web-form.
export const UPDATES_FORM_URL = 'https://app.colliedesk.com/api/v1/public/forms/hclabs';
export const CONTACT_EMAIL = 'support@colliedesk.com';
// Colliedesk is generally available since release 1.0.0. What that promises is written in the product
// repository; the public status page is the only source for uptime. The written commitment (99.9% a
// month, service credits, support response times) is in /terms#availability.
export const GA_DOC = `${REPO}/blob/main/docs/general-availability.md`;
export const STATUS_PAGE = 'https://status.colliedesk.com';
// Where the GA guarantees describe Cloud backups: copies within minutes, nightly backups, a weekly restore test.
export const GA_BACKUPS = `${GA_DOC}#colliedesk-cloud-backups`;
// One line on /pricing; `pnpm check` fails if it drops the status page link.
export const STATUS_LINE = `**Live uptime** for Colliedesk Cloud, checked from several regions, is on [status.colliedesk.com](${STATUS_PAGE}). Every paid plan has [99.9% uptime a month with service credits](/terms#availability), and a first reply within 2 hours, any hour, when your workspace is down.`;
// The Colliedesk Cloud ladder: one flat price per workspace, never per agent; a year costs ten
// months. Plans differ only in agents and attachment storage. Business, for 26 to 100 agents, is sold
// through a call with the founder (salesOnly), never a self-serve checkout or trial; above 100 agents
// we quote. There is no free Cloud plan.
export interface CloudPlan {
  name: 'Solo' | 'Small' | 'Team' | 'Team 25' | 'Business';
  /** USD per workspace per month. */
  monthly: number;
  /** USD per workspace per year. */
  yearly: number;
  /** Agent limit. */
  agents: number;
  /** Smallest team the plan is sold to, when it starts above the plan below it. */
  agentsFrom?: number;
  storage: string;
  who: string;
  salesOnly?: boolean;
}
export const CLOUD_PLANS: readonly CloudPlan[] = [
  { name: 'Solo', monthly: 19, yearly: 190, agents: 1, storage: '10 GiB', who: 'For one person answering customers.' },
  { name: 'Small', monthly: 39, yearly: 390, agents: 3, storage: '30 GiB', who: 'For a small team sharing one inbox.' },
  { name: 'Team', monthly: 69, yearly: 690, agents: 10, storage: '100 GiB', who: 'For support teams leaving Freshdesk.' },
  { name: 'Team 25', monthly: 149, yearly: 1490, agents: 25, storage: '250 GiB', who: 'For a mid-size support department.' },
  { name: 'Business', monthly: 499, yearly: 4990, agents: 100, agentsFrom: 26, storage: '1 TB', who: 'For support departments of 26 to 100 agents.', salesOnly: true },
];
const planNamed = (name: CloudPlan['name']): CloudPlan => {
  const plan = CLOUD_PLANS.find((p) => p.name === name);
  if (!plan) throw new Error(`CLOUD_PLANS has no ${name} plan`);
  return plan;
};
export const SOLO = planNamed('Solo');
export const SMALL = planNamed('Small');
export const TEAM = planNamed('Team');
export const TEAM_25 = planNamed('Team 25');
export const BUSINESS = planNamed('Business');
export const dollars = (n: number): string => `$${n.toLocaleString('en-US')}`;
export const agentsLabel = (plan: CloudPlan): string =>
  plan.agentsFrom ? `${plan.agentsFrom} to ${plan.agents} agents` : plan.agents === 1 ? '1 agent' : `Up to ${plan.agents} agents`;

// While Founding is open, Team 25 is also on sale, for the teams Founding does not fit: 11 to 25 agents.
// The /pricing card, its Markdown twin and the home page share these lines.
export const FOUNDING_AGENTS = '3 to 10';
export const TEAM_25_AGENTS = '11 to 25';
export const TEAM_25_WHO = `For support teams of ${TEAM_25_AGENTS} agents.`;
export const TEAM_25_IMPORT = 'We run the Freshdesk import with you.';
export const TEAM_25_BELOW = `Teams of ${TEAM_25_AGENTS} agents can buy Team 25 below.`;
export const BUSINESS_AGENTS = `${BUSINESS.agentsFrom} to ${BUSINESS.agents}`;

// AI on Colliedesk Cloud: reply drafts and triage are included in every plan with a monthly allowance;
// auto-answer (not built yet) is charged per resolution, only when the customer needs no person
// afterwards, at this price; your own key adds no Colliedesk fee.
export const AI_RESOLUTION = '$0.50';

export const PRICE = {
  monthly: dollars(TEAM.monthly),
  yearly: dollars(TEAM.yearly),
  team25Monthly: dollars(TEAM_25.monthly),
  team25Yearly: dollars(TEAM_25.yearly),
  // "$19 to $149": the plans that can be bought today, cheapest to dearest.
  range: `${dollars(SOLO.monthly)} to ${dollars(TEAM_25.monthly)}`,
  founding: '$99 every 3 months ($396 a year), locked for life, with free Freshdesk migration',
  ai: `reply drafts and triage included with a monthly allowance; auto-answer ${AI_RESOLUTION} per resolution once it ships; your own key adds no fee`,
} as const;
// "+ AI ..." after a Colliedesk price in comparisons. Drafts and triage are included, so the only AI
// that can add to the bill is auto-answer, which is not built yet.
export const AI_EXTRA = `${AI_RESOLUTION} per AI resolution once auto-answer ships`;
// One line naming every plan, for page copy and the Markdown twins.
export const LADDER_LINE = `Solo ${dollars(SOLO.monthly)} a month for 1 agent, Small ${dollars(SMALL.monthly)} for up to 3, Team ${dollars(TEAM.monthly)} for up to 10, Team 25 ${dollars(TEAM_25.monthly)} for up to 25; Business ${dollars(BUSINESS.monthly)} a month for ${BUSINESS_AGENTS} agents, through a call with the founder`;

// The switch offer, for teams of 11 to 100 agents on Freshdesk who buy Team 25 or Business (owner
// decision 03/11/2026): we migrate them, and they pay once their team answers its first real ticket
// in Colliedesk; the last invoice of their old helpdesk buys their first month, capped at that
// invoice. The 14-day trial is unchanged. /pricing, /vs/freshdesk and the switch page share these lines.
export const SWITCH_HREF = '/migrate/freshdesk/switch';
// A 30-minute call with the founder on Cal.com; the Business card and the switch offer book it.
export const SWITCH_CALL_HREF = 'https://cal.com/chinh/colliedesk-switch';
export const SWITCH_CALL_LABEL = 'Book a 30-min switch call';
export const SWITCH_OFFER_MD = '**We move your team for you.** We migrate you from Freshdesk, and you pay when your team answers its first real ticket in Colliedesk, not before. After your first payment you still have 30 days to ask for your money back.';
export const INVOICE_OFFER_MD = "**Don't pay twice while you switch.** Send us your latest Zendesk, Freshdesk, Help Scout or Intercom invoice from the last 3 months. Your first paid month of Colliedesk is on us, up to the amount on that invoice. Paying yearly? You get 13 months for the price of one year.";
export const OFFER_SMALL_PRINT: readonly string[] = [
  'Team 25 and Business only. The 14-day free trial is unchanged and comes first.',
  'We use the invoice only to check the amount and the team size.',
  'Keep your current helpdesk running while you test. There is nothing to cancel until you are ready.',
];
/** The two offers and their small print as Markdown, for the twins. */
export const SWITCH_OFFER_BLOCK_MD = `${SWITCH_OFFER_MD}

${INVOICE_OFFER_MD}

${OFFER_SMALL_PRINT.map((line) => `- ${line}`).join('\n')}

[${SWITCH_CALL_LABEL}](${SWITCH_CALL_HREF}) with the founder, or read [how the switch works](${SWITCH_HREF}).`;

// Primary navigation; order is the order shown.
export const NAV: readonly NavLink[] = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/migrate/freshdesk', label: 'Migrate' },
  { href: '/compare', label: 'Compare' },
  { href: '/docs', label: 'Docs' },
  { href: '/roadmap', label: 'Roadmap' },
];

export const FOOTER: readonly FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { href: '/pricing', label: 'Pricing' },
      { href: '/roadmap', label: 'Roadmap' },
      { href: '/changelog', label: 'Changelog' },
      { href: '/open-source', label: 'Open source' },
      { href: '/self-hosted-helpdesk', label: 'Self-hosted helpdesk' },
      { href: '/helpdesk-for-small-teams', label: 'For small teams' },
    ],
  },
  // Names the helpdesks people leave, like Attio's footer does for CRMs. Freshdesk and Help Scout
  // have importers today; the others are on the roadmap.
  {
    title: 'Import from',
    links: [
      { href: '/migrate/freshdesk', label: 'Freshdesk' },
      { href: '/migrate/zendesk/export', label: 'Zendesk', badge: 'Soon' },
      { href: '/docs/import-helpscout', label: 'Help Scout' },
    ],
  },
  {
    title: 'Switch',
    links: [
      { href: '/migrate/freshdesk/done-for-you', label: 'Freshdesk migration, done for you' },
      { href: SWITCH_HREF, label: 'Switch offer for 11 to 100 agents' },
      { href: '/migrate/freshdesk/export', label: 'Export Freshdesk tickets' },
      { href: '/migrate/zendesk/export', label: 'Export Zendesk tickets' },
      { href: '/compare', label: 'All comparisons' },
      { href: '/freshdesk-alternative', label: 'Freshdesk alternatives' },
      { href: '/freshdesk-pricing-history', label: 'Freshdesk pricing history' },
      { href: '/vs/freshdesk', label: 'Colliedesk vs Freshdesk' },
      { href: '/vs/zendesk', label: 'Colliedesk vs Zendesk' },
      { href: '/vs/help-scout', label: 'Colliedesk vs Help Scout' },
      { href: '/vs/front', label: 'Colliedesk vs Front' },
      { href: '/vs/zammad', label: 'Colliedesk vs Zammad' },
      { href: '/vs/chatwoot', label: 'Colliedesk vs Chatwoot' },
      { href: '/vs/freescout', label: 'Colliedesk vs FreeScout' },
    ],
  },
  {
    title: 'Build',
    links: [
      { href: '/docs', label: 'Docs' },
      { href: '/docs/self-host', label: 'Self-host' },
      { href: REPO, label: 'GitHub' },
      { href: '/llms.txt', label: 'llms.txt' },
    ],
  },
];
