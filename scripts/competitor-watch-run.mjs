// Runs the competitor watch (scripts/competitor-watch.mjs) once, from the repo root:
//
//   node scripts/competitor-watch-run.mjs [--state FILE] [--out DIR] [--open-prs]
//
// Without --open-prs it is a dry run: it reads every source, prints what changed, writes each
// prepared pull request (body and evidence file) under --out, and leaves --state untouched (the new
// state goes to --out/state.json), so a change it finds is still raised by the next real run. With --open-prs it also opens each pull
// request as a draft through the GitHub API (gh api; GH overrides the gh binary) and saves --state.
// Sources that do not answer are printed as warnings; they do not fail the run. Sources whose HTML
// has no text, and figures our file cites that a page does not show, are listed: the watch is blind
// to those, and a person reads them when the 90-day read date in pnpm check comes due.
// .github/workflows/competitor-watch.yml runs it daily once the owner turns it on.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import { markersFrom, watchCompetitors } from './competitor-watch.mjs';

const { values: opts } = parseArgs({
  options: {
    state: { type: 'string', default: '.competitor-watch/state.json' },
    out: { type: 'string', default: '.competitor-watch/proposals' },
    'open-prs': { type: 'boolean', default: false },
  },
});
const repo = process.env.GITHUB_REPOSITORY ?? 'colliedesk/colliedesk.com';
const base = process.env.COMPETITOR_WATCH_BASE ?? 'main';
const ghBin = process.env.GH ?? 'gh';
const gh = (...args) => execFileSync(ghBin, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });

const { COMPETITORS } = await import(pathToFileURL(join(process.cwd(), 'src/data/competitors/index.ts')).href);
const state = existsSync(opts.state) ? JSON.parse(readFileSync(opts.state, 'utf8')) : { version: 1, sources: {} };
// Closed pull requests count too: a change a person closed as not mattering is not raised again. Only
// the workflow's own pull requests are asked for; markersFrom drops any other that slips through.
const knownMarkers = opts['open-prs']
  ? markersFrom(JSON.parse(gh('pr', 'list', '-R', repo, '--state', 'all', '--author', 'app/github-actions', '--limit', '1000',
    '--json', 'body,author,headRefName,isCrossRepository')))
  : new Set();

const run = await watchCompetitors(COMPETITORS, { fetch: globalThis.fetch, state, today: new Date(), knownMarkers });

const count = (status) => run.results.filter((r) => r.status === status).length;
const lines = [
  `Competitor watch: ${run.results.length} sources, ${count('unchanged')} unchanged, ${count('baseline')} first read, ` +
    `${count('cosmetic')} cosmetic, ${count('changed')} changed, ${count('unreachable')} unreachable, ${count('no-text')} with no text.`,
];
for (const r of run.results) {
  if (r.unseen?.length) lines.push(`- ${r.slug} ${r.source}: cited figures the page text does not show [${r.unseen.join(', ')}] ${r.url}`);
  if (r.status === 'no-text') {
    lines.push(`- ${r.slug} ${r.source}: no text in the HTML (rendered in the browser); read it by hand ${r.url}`);
  } else if (r.status === 'unreachable') {
    lines.push(`- ${r.slug} ${r.source}: unreachable (${r.error}) ${r.url}`);
    if (process.env.GITHUB_ACTIONS) console.log(`::warning::competitor watch: ${r.slug} ${r.source} unreachable (${r.error}) ${r.url}`);
  } else if (r.status === 'changed') {
    lines.push(`- ${r.slug} ${r.source}: changed, figures gone [${r.dropped.join(', ')}], new prices [${r.added.join(', ')}]${r.skipped ? `; ${r.skipped}` : ''} ${r.url}`);
  } else if (r.status === 'cosmetic') {
    lines.push(`- ${r.slug} ${r.source}: text changed, no cited figure or new price ${r.url}`);
  }
}

let failed = false;
for (const p of run.proposals) {
  const dir = join(opts.out, p.branch.replace(/\//g, '_'));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'body.md'), p.body);
  for (const f of p.files) writeFileSync(join(dir, f.path.replace(/\//g, '_')), f.content);
  if (!opts['open-prs']) {
    lines.push(`- prepared, not opened: ${p.title} (${dir})`);
    continue;
  }
  try {
    const sha = gh('api', `repos/${repo}/git/ref/heads/${base}`, '--jq', '.object.sha').trim();
    gh('api', '-X', 'POST', `repos/${repo}/git/refs`, '-f', `ref=refs/heads/${p.branch}`, '-f', `sha=${sha}`);
    for (const f of p.files) {
      gh('api', '-X', 'PUT', `repos/${repo}/contents/${f.path}`, '-f', `message=docs(compare): evidence for ${p.title.replace(/^fix\(compare\): /, '')}`,
        '-f', `branch=${p.branch}`, '-f', `content=${Buffer.from(f.content).toString('base64')}`);
    }
    const url = gh('pr', 'create', '-R', repo, '--draft', '--base', base, '--head', p.branch, '--title', p.title, '--body-file', join(dir, 'body.md')).trim();
    lines.push(`- opened ${url}`);
  } catch (err) {
    // Keep the text read last time for this page, so the next run raises the change again.
    failed = true;
    if (state.sources[p.url]) run.state.sources[p.url] = state.sources[p.url];
    else delete run.state.sources[p.url];
    lines.push(`- could not open ${p.title}: ${err.message.split('\n')[0]}`);
  }
}

const summary = `${lines.join('\n')}\n`;
process.stdout.write(summary);
if (process.env.GITHUB_STEP_SUMMARY) writeFileSync(process.env.GITHUB_STEP_SUMMARY, summary, { flag: 'a' });
// A dry run writes the new state next to the proposals: pass it as --state to try the next day.
const stateOut = opts['open-prs'] ? opts.state : join(opts.out, 'state.json');
mkdirSync(dirname(stateOut), { recursive: true });
writeFileSync(stateOut, JSON.stringify(run.state));
if (failed) process.exitCode = 1;
