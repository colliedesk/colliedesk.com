// Required check `content-approval`: a pull request that publishes SEO content merges only after a
// person approves it. Content means an `seo/` branch, a `cms/` branch (a draft saved in the editor at
// /admin), an `seo:` label, a new page module in src/data/pages/, or any change to a Markdown post in
// src/content/. Such a PR needs the label content:approved, which only the owner adds (an agent
// hook refuses it, and the workflow removes it when new commits arrive), and a "## Claim check"
// table in its body with every claim's source marked verified. Other PRs pass untouched.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const APPROVED = 'content:approved';

function claimRows(body) {
  const section = body.split(/^## Claim check[ \t]*$/m)[1]?.split(/^## /m)[0] ?? '';
  return section
    .split('\n')
    .filter((line) => /^\s*\|/.test(line))
    .slice(2) // header and separator
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()))
    .filter((cells) => cells.some(Boolean));
}

/** { required, errors } for one pull request: branch, label names, files {filename,status}, body. */
export function contentApproval({ branch, labels, files, body }) {
  const required =
    branch.startsWith('seo/') ||
    branch.startsWith('cms/') ||
    labels.some((l) => l.startsWith('seo:')) ||
    files.some((f) => f.status === 'added' && f.filename.startsWith('src/data/pages/')) ||
    files.some((f) => f.filename.startsWith('src/content/'));
  if (!required) return { required, errors: [] };

  const errors = [];
  if (!labels.includes(APPROVED)) {
    errors.push(`waiting for a person: read the page and the claim check, then add the label ${APPROVED} (agents cannot; new commits remove it)`);
  }
  const rows = claimRows(body ?? '');
  if (!rows.length) {
    errors.push('the PR body has no "## Claim check" table (| Claim | Source | Verified |) with at least one claim');
  } else {
    const open = rows.filter((cells) => (cells.at(-1) ?? '').toLowerCase() !== 'yes');
    if (open.length) errors.push(`${open.length} claim(s) not verified in the Claim check: ${open.map((c) => `"${c[0]}"`).join(', ')}`);
  }
  return { required, errors };
}

// CLI for the workflow: node scripts/content-approval.mjs <pr.json> <files.json>
// pr.json is `gh pr view --json headRefName,labels,body`; files.json is the REST list of PR files.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pr = JSON.parse(readFileSync(process.argv[2], 'utf8'));
  const files = JSON.parse(readFileSync(process.argv[3], 'utf8')).flat();
  const { required, errors } = contentApproval({
    branch: pr.headRefName,
    labels: pr.labels.map((l) => l.name),
    files,
    body: pr.body,
  });
  if (!required) console.log('ok not a content PR; no approval needed');
  for (const e of errors) console.error(`FAIL ${e}`);
  if (errors.length) process.exit(1);
  if (required) console.log('ok content approved by a person, every claim verified');
}
