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
export const UPDATED = '2026-10-16';
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
export const TRIAL_HREF = APP_SIGN_IN;
// The updates box posts to the web form channel of HC Labs' own Colliedesk workspace: every
// signup lands there as a conversation tagged web-form.
export const UPDATES_FORM_URL = 'https://app.colliedesk.com/api/v1/public/forms/hclabs';
export const CONTACT_EMAIL = 'support@colliedesk.com';
export const PRICE = {
  monthly: '$49',
  yearly: '$490',
  team25Monthly: '$99',
  team25Yearly: '$990',
  founding: '$100 per year, locked for life, with free Freshdesk migration',
  ai: 'LLM cost +30%, or bring your own key',
} as const;

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
