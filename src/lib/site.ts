// Shared facts used on every page. Change a fact here, not in page copy.
export interface NavLink {
  href: string;
  label: string;
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
// The updates box posts to the web form channel of HC Labs' own Colliedesk workspace: every
// signup lands there as a conversation tagged web-form.
export const UPDATES_FORM_URL = 'https://app.colliedesk.com/api/v1/public/forms/hclabs';
export const CONTACT_EMAIL = 'support@colliedesk.com';
// The Colliedesk Cloud ladder: one flat price per workspace, never per agent; a year costs ten
// months. Plans differ only in agents and attachment storage. Unlimited is shown as coming soon,
// with no checkout, until attachments run on object storage. There is no free Cloud plan.
export interface CloudPlan {
  name: 'Solo' | 'Small' | 'Team' | 'Team 25' | 'Unlimited';
  /** USD per workspace per month. Unlimited is billed annually only. */
  monthly: number;
  /** USD per workspace per year. */
  yearly: number;
  /** Agent limit; null means unlimited. */
  agents: number | null;
  storage: string;
  who: string;
  annualOnly?: boolean;
  comingSoon?: boolean;
}
export const CLOUD_PLANS: readonly CloudPlan[] = [
  { name: 'Solo', monthly: 19, yearly: 190, agents: 1, storage: '10 GB', who: 'For one person answering customers.' },
  { name: 'Small', monthly: 39, yearly: 390, agents: 3, storage: '30 GB', who: 'For a small team sharing one inbox.' },
  { name: 'Team', monthly: 69, yearly: 690, agents: 10, storage: '100 GB', who: 'For support teams leaving Freshdesk.' },
  { name: 'Team 25', monthly: 149, yearly: 1490, agents: 25, storage: '250 GB', who: 'For a mid-size support department.' },
  { name: 'Unlimited', monthly: 349, yearly: 3490, agents: null, storage: '1 TB', who: 'For larger companies.', annualOnly: true, comingSoon: true },
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
export const UNLIMITED = planNamed('Unlimited');
export const dollars = (n: number): string => `$${n.toLocaleString('en-US')}`;
export const agentsLabel = (plan: CloudPlan): string =>
  plan.agents === null ? 'Unlimited agents' : plan.agents === 1 ? '1 agent' : `Up to ${plan.agents} agents`;

export const PRICE = {
  monthly: dollars(TEAM.monthly),
  yearly: dollars(TEAM.yearly),
  team25Monthly: dollars(TEAM_25.monthly),
  team25Yearly: dollars(TEAM_25.yearly),
  // "$19 to $149": the plans that can be bought today, cheapest to dearest.
  range: `${dollars(SOLO.monthly)} to ${dollars(TEAM_25.monthly)}`,
  founding: '$99 per quarter ($396 a year), locked for life, with free Freshdesk migration',
  ai: 'LLM cost +30%, or bring your own key',
} as const;
// One line naming every plan, for page copy and the Markdown twins.
export const LADDER_LINE = `Solo ${dollars(SOLO.monthly)} a month for 1 agent, Small ${dollars(SMALL.monthly)} for up to 3, Team ${dollars(TEAM.monthly)} for up to 10, Team 25 ${dollars(TEAM_25.monthly)} for up to 25; Unlimited ${dollars(UNLIMITED.monthly)} a month billed annually is coming soon`;

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
  {
    title: 'Switch',
    links: [
      { href: '/migrate/freshdesk', label: 'Migrate from Freshdesk' },
      { href: '/migrate/freshdesk/done-for-you', label: 'Freshdesk migration, done for you' },
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
