// The honesty rule for comparison pages (/vs/*, /freshdesk-alternative, /compare), applied by
// scripts/check.mjs to the built site, HTML and Markdown twins alike:
// - every page says when the competitor facts were read, and that date is at most 90 days old;
// - every page invites the companies it describes to correct it, linking to its own source file in
//   the public repository.
// Returns findings; an empty array passes.

export const FACTS_MAX_AGE_DAYS = 90;
const REPO_EDIT = 'https://github.com/colliedesk/colliedesk.com/edit/main/';
const DAY_MS = 86_400_000;

/** Source file of a comparison page in this repository, from its URL path (.md twins included). */
export const sourceFileOf = (path) => `src/data/pages/${path.replace(/\.(md|html)$/, '').slice(1).replace('/', '-')}.ts`;

/** Edit link the page must carry so a competitor can open a pull request against it. */
export const editUrlOf = (path) => `${REPO_EDIT}${sourceFileOf(path)}`;

function readDate(text) {
  const label = text.match(/Read on (\d{1,2} [A-Z][a-z]+ \d{4})/)?.[1];
  if (label) return { label, at: Date.parse(`${label} 00:00:00 UTC`) };
  const iso = text.match(/data-read-on="(\d{4}-\d{2}-\d{2})"/)?.[1];
  if (iso) return { label: iso, at: Date.parse(`${iso}T00:00:00Z`) };
  return null;
}

export function compareFindings({ path, text, now }) {
  const findings = [];
  const read = readDate(text);
  if (!read || Number.isNaN(read.at)) {
    findings.push(`${path}: no "Read on" date for the competitor facts`);
  } else {
    const days = Math.floor((now - read.at) / DAY_MS);
    if (days > FACTS_MAX_AGE_DAYS) findings.push(`${path}: competitor facts read ${read.label}, ${days} days ago (over ${FACTS_MAX_AGE_DAYS}); read the vendor pages again`);
  }
  if (!text.includes(editUrlOf(path))) findings.push(`${path}: does not invite corrections with a link to edit ${sourceFileOf(path)}`);
  return findings;
}
