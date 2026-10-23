import type { VsPricing } from './vs-pricing';

// The typed model every page module exports. One Page = one HTML file + one Markdown twin.
export type Section = 'Product' | 'Migrate' | 'Compare' | 'Docs';

export interface Faq {
  q: string;
  a: string;
}

export type JsonLd = Readonly<Record<string, unknown>>;

export interface DocsNavItem {
  href: string;
  label: string;
}

export interface DocsNavSubgroup {
  title: string;
  items: DocsNavItem[];
}

export interface DocsNavGroup {
  title: string;
  items: (DocsNavItem | DocsNavSubgroup)[];
}

export interface Page {
  /** URL path without trailing slash: "/" or "/pricing". */
  path: string;
  section: Section;
  /** Label in llms.txt; defaults to h1. */
  name?: string;
  title: string;
  description: string;
  /** One-line summary in llms.txt. */
  summary: string;
  /** ISO date; defaults to the site-wide UPDATED. */
  updated?: string;
  eyebrow?: string;
  h1: string;
  /** Inline Markdown under the h1. */
  lede?: string;
  /** Show the two call-to-action buttons in the hero. */
  cta?: boolean;
  /** Markdown body. */
  body?: string;
  /** Markdown placed before the body in the twin (mirrors the HTML block before the body). */
  preMd?: string;
  /** Full Markdown twin content, when the page does not follow the hero + body shape. */
  md?: string;
  faq?: Faq[];
  bodyClass?: string;
  jsonLd: JsonLd[];
  /** Custom main content instead of hero + prose. */
  view?: 'home';
  /** Block rendered between the hero and the prose. */
  pre?: 'pricing-plans' | 'price-check';
  /** Price-by-team-size chart and fit columns between the hero and the prose (/vs pages). */
  vs?: VsPricing;
  /** Side navigation for docs pages, one group per docs directory. */
  docsNav?: DocsNavGroup[];
  /** Repository file the page is rendered from. */
  sourceUrl?: string;
}

export interface ChangelogEntry {
  version: string;
  /** ISO date of the release. */
  date: string;
  title: string;
  /** Release notes in Markdown. */
  md: string;
}

/** The fields the HTML document head needs. */
export type PageHead = Pick<Page, 'path' | 'title' | 'description' | 'jsonLd'> & Partial<Pick<Page, 'updated' | 'bodyClass'>>;

export const mdUrlOf = (path: string): string => (path === '/' ? '/index.md' : `${path}.md`);
