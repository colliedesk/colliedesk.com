// The shape of a competitor data file (src/data/competitors/<slug>.ts) and the helpers the /vs pages
// render it with. Every fact names the source it was read from; scripts/vs-facts-gate.mjs fails a
// fact without one, a missing feature key and a read date older than 90 days.
import { FEATURES, type FeatureKey } from '../data/competitors/features.ts';

export interface Source {
  /** "Freshdesk pricing" in the Sources list. */
  label: string;
  /** Link text, usually the URL without the scheme. */
  link: string;
  url: string;
  /** Text after the link, e.g. "(third-party account)". */
  suffix?: string;
  /** ISO date this source was read, when it differs from the file's readOn. */
  readOn?: string;
}

export interface Fact {
  /** Markdown, as the page shows it. */
  text: string;
  /** Key of the file's sources. */
  source: string;
}

export type Has = 'yes' | 'no' | 'partial';
/** A feature value with its source, or 'unread' when nobody has read it from a source yet. */
export type FeatureValue = { has: Has; text: string; source: string } | 'unread';

export interface Competitor {
  slug: string;
  name: string;
  currency: 'USD' | 'EUR';
  /** ISO date the sources were read; the page shows it as "Read on". */
  readOn: string;
  sources: Readonly<Record<string, Source>>;
  facts: Readonly<Record<'plans' | 'ai' | 'free' | 'license', Fact>> & Readonly<Record<string, Fact>>;
  /** What leaving gives you, one Markdown line each; empty when not read yet. */
  export: readonly Fact[];
  features: Readonly<Record<FeatureKey, FeatureValue>>;
}

/** The Colliedesk side, in the same shape where it applies. */
export interface Own {
  slug: string;
  name: string;
  sources: Readonly<Record<string, Source>>;
  facts: Readonly<Record<string, Fact>>;
  features: Readonly<Record<FeatureKey, FeatureValue>>;
}

const amount = (n: number, cents = false): string =>
  n.toLocaleString('en-US', { minimumFractionDigits: cents || !Number.isInteger(n) ? 2 : 0, maximumFractionDigits: 2 });
export const usd = (n: number): string => `$${amount(n)}`;
export const eur = (n: number): string => `€${amount(n)}`;
/** Always two decimals: €2.00. */
export const eurCents = (n: number): string => `€${amount(n, true)}`;
const joinLast = (word: string) => (values: readonly string[]): string =>
  values.length < 2 ? values.join('') : `${values.slice(0, -1).join(', ')} ${word} ${values.at(-1)}`;
/** "a, b and c". */
export const andList = joinLast('and');
/** "a, b or c". */
export const orList = joinLast('or');
/** A count with thousands separators: 30,000. */
export const num = (n: number): string => n.toLocaleString('en-US');

export const readOnLabel = (iso: string): string =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** The "## Sources" list of a /vs page, one line per source, in the file's order. */
export const sourcesMd = (c: Pick<Competitor, 'sources'>): string =>
  Object.values(c.sources).map((s) => `- ${s.label}: [${s.link}](${s.url})${s.suffix ? ` ${s.suffix}` : ''}`).join('\n');

/** The leaving bullets, in the file's order. */
export const exportMd = (c: Pick<Competitor, 'export'>): string => c.export.map((e) => `- ${e.text}`).join('\n');

const capital = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

function cell(name: string, value: FeatureValue, lead: boolean): string {
  if (value === 'unread') throw new Error(`${name}: a page renders a feature nobody has read from a source yet`);
  return lead ? `**${name}**: ${value.text}` : capital(value.text);
}

/** Which side a feature row names in bold as the one that does more. */
export interface FeatureRow {
  key: FeatureKey;
  lead?: 'them' | 'us';
}

/** "Where they do more" table: one row per feature key, values from both data files. */
export function featureTable(them: Competitor, us: Own, rows: readonly FeatureRow[]): string {
  const lines = rows.map(({ key, lead }) =>
    `| ${FEATURES[key].label} | ${cell(them.name, them.features[key], lead === 'them')} | ${cell(us.name, us.features[key], lead === 'us')} |`);
  return [`| Feature | ${them.name} | ${us.name} |`, '|---|---|---|', ...lines].join('\n');
}
