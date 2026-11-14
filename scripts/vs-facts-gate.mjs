// Competitor facts on the /vs pages come from src/data/competitors/<slug>.ts, one file per
// competitor, with a source for every fact and a read date (issue #136). This gate fails when
//   - a competitor file lacks a required fact or a feature key, or cites a source it does not list;
//   - a competitor file, or one of its sources, was read more than READ_MAX_DAYS ago;
//   - a /vs page module writes a figure (any digit) into its own text, or passes a price made of
//     numbers to a money formatter, instead of taking it from the data file.
// The figure rule is the part a machine can check: prices, limits and dates all carry digits. A
// claim without a number ("no free plan") is checked by review; the tables render it from data.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

export const READ_MAX_DAYS = 90;
const REQUIRED_FACTS = ['plans', 'ai', 'free', 'license'];
const MONEY_FORMATTERS = new Set(['usd', 'eur', 'dollars', 'money']);
// Page metadata that is not a competitor fact.
const META_PROPS = new Set(['path', 'updated']);
const DAY_MS = 86_400_000;

const daysSince = (iso, today) => Math.round((today.getTime() - Date.parse(`${iso}T00:00:00Z`)) / DAY_MS);

// Facts a page states today that no source we hold confirms. Each is listed in the pull request for
// the owner to source or delete; the list can only shrink. Entries are "<slug>.facts.<key>".
export const KNOWN_UNSOURCED = ['zendesk.facts.usThirdParty'];

/** Findings for one competitor file (or, with own: true, the Colliedesk side); [] means it passes. */
export function competitorFindings(c, { today, featureKeys, own = false, unsourced = KNOWN_UNSOURCED }) {
  const findings = [];
  const id = c.slug;
  const sources = c.sources ?? {};
  for (const [key, s] of Object.entries(sources)) {
    if (!/^https:\/\//.test(s.url ?? '')) findings.push(`${id}: source ${key} has no https URL`);
    if (!own && s.readOn) {
      const days = daysSince(s.readOn, today);
      if (days > READ_MAX_DAYS) findings.push(`${id}: source ${key} read on ${s.readOn}, ${days} days ago; read it again (limit ${READ_MAX_DAYS} days)`);
    }
  }
  if (!own) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(c.readOn ?? '')) findings.push(`${id}: no read date (readOn, YYYY-MM-DD)`);
    else {
      const days = daysSince(c.readOn, today);
      if (days > READ_MAX_DAYS) findings.push(`${id}: read on ${c.readOn}, ${days} days ago; read the sources again (limit ${READ_MAX_DAYS} days)`);
    }
  }
  const cite = (what, entry) => {
    if (!entry?.source) findings.push(`${id}: ${what} has no source`);
    else if (!(entry.source in sources)) findings.push(`${id}: ${what} cites source "${entry.source}", which is not in sources`);
  };
  if (!own) for (const key of REQUIRED_FACTS) if (!c.facts?.[key]) findings.push(`${id}: fact ${key} is missing`);
  for (const [key, fact] of Object.entries(c.facts ?? {})) {
    if (!fact?.source && unsourced.includes(`${id}.facts.${key}`)) continue;
    cite(`fact ${key}`, fact);
  }
  (c.export ?? []).forEach((limit, i) => cite(`export limit ${i + 1}`, limit));
  const features = c.features ?? {};
  for (const key of featureKeys) {
    if (!(key in features)) findings.push(`${id}: feature ${key} has no value; give it one or mark it 'unread'`);
  }
  for (const [key, value] of Object.entries(features)) {
    if (!featureKeys.includes(key)) findings.push(`${id}: feature ${key} is not in src/data/competitors/features.ts`);
    else if (value !== 'unread') cite(`feature ${key}`, value);
  }
  return findings;
}

/** A known-unsourced entry that has a source now, or no longer exists, must be deleted. */
export function unsourcedDebtFindings(competitors, unsourced = KNOWN_UNSOURCED) {
  return unsourced.flatMap((entry) => {
    const [slug, , key] = entry.split('.');
    const fact = competitors.find((c) => c.slug === slug)?.facts?.[key];
    if (!fact) return [`KNOWN_UNSOURCED: ${entry} does not exist; delete the entry`];
    return fact.source ? [`KNOWN_UNSOURCED: ${entry} has a source now; delete the entry`] : [];
  });
}

const isTextLiteral = (node) =>
  ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node)
  || ts.isTemplateMiddle(node) || ts.isTemplateTail(node);

// True for an expression built from number literals only, such as 66 or 5 * 66.
const numbersOnly = (node) => {
  if (ts.isNumericLiteral(node)) return true;
  if (ts.isParenthesizedExpression(node)) return numbersOnly(node.expression);
  if (ts.isPrefixUnaryExpression(node)) return numbersOnly(node.operand);
  if (ts.isBinaryExpression(node)) return numbersOnly(node.left) && numbersOnly(node.right);
  return false;
};

/** Findings for the source of one /vs page module; [] means every figure comes from data. */
export function pageTextFindings(file, source) {
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const findings = [];
  const lineOf = (pos) => sf.getLineAndCharacterOfPosition(pos).line + 1;
  const visit = (node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;
    if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name) && META_PROPS.has(node.name.text) && isTextLiteral(node.initializer)) return;
    if (isTextLiteral(node)) {
      // The raw text keeps escapes, so the offset maps to the right line of the file.
      const raw = node.rawText ?? node.getText(sf).slice(1, -1);
      let offset = 0;
      for (const line of raw.split('\n')) {
        if (/\d/.test(line)) {
          const shown = line.trim().length > 100 ? `${line.trim().slice(0, 100)}…` : line.trim();
          findings.push(`${file}:${lineOf(node.getStart(sf) + 1 + offset)}: figure "${shown}" in page text; state it in the competitor data file`);
        }
        offset += line.length + 1;
      }
      return;
    }
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && MONEY_FORMATTERS.has(node.expression.text)) {
      for (const arg of node.arguments) {
        if (numbersOnly(arg)) {
          findings.push(`${file}:${lineOf(arg.getStart(sf))}: price "${arg.getText(sf)}" passed to ${node.expression.text}() in page code; take it from the competitor data file`);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return findings;
}

/** Every finding for the site: each competitor file, the Colliedesk side and each /vs page module. */
export async function vsFactsFindings({ root = fileURLToPath(new URL('..', import.meta.url)), today = new Date() } = {}) {
  const load = (rel) => import(pathToFileURL(join(root, rel)).href);
  const { FEATURE_KEYS } = await load('src/data/competitors/features.ts');
  const { COMPETITORS } = await load('src/data/competitors/index.ts');
  const { colliedesk } = await load('src/data/competitors/colliedesk.ts');
  const findings = [];
  const unread = [];
  for (const c of COMPETITORS) {
    findings.push(...competitorFindings(c, { today, featureKeys: FEATURE_KEYS }));
    unread.push(...Object.entries(c.features).filter(([, v]) => v === 'unread').map(([k]) => `${c.slug}.${k}`));
  }
  findings.push(...unsourcedDebtFindings(COMPETITORS));
  findings.push(...competitorFindings(colliedesk, { today, featureKeys: FEATURE_KEYS, own: true }));
  const pagesDir = join(root, 'src/data/pages');
  const slugs = new Set(COMPETITORS.map((c) => c.slug));
  for (const name of readdirSync(pagesDir).filter((n) => /^vs-.+\.ts$/.test(n))) {
    const file = relative(root, join(pagesDir, name));
    const slug = name.replace(/^vs-|\.ts$/g, '');
    if (!slugs.has(slug)) findings.push(`${file}: no competitor file src/data/competitors/${slug}.ts in COMPETITORS`);
    findings.push(...pageTextFindings(file, readFileSync(join(pagesDir, name), 'utf8')));
  }
  return { findings, unread };
}
