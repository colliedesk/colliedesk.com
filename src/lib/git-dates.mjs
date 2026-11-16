// Dates a page's own source file last changed, read from the product checkout's git history. Plain
// JavaScript so scripts/git-dates.test.mjs can run it on a fixture repository without a build.
import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';

const git = (/** @type {string} */ dir, /** @type {string[]} */ args) =>
  execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });

/**
 * Repo-relative file path -> committer date (YYYY-MM-DD) of the last commit that changed it, for every
 * file under `paths`. Empty when `dir` is not a git checkout or is a shallow clone: there the oldest
 * commit present would look like the change of every file in it.
 * @param {string} dir
 * @param {string[]} paths
 * @returns {Map<string, string>}
 */
export function lastChangedDates(dir, paths) {
  /** @type {Map<string, string>} */
  const dates = new Map();
  let log;
  try {
    const [top, shallow] = git(dir, ['rev-parse', '--show-toplevel', '--is-shallow-repository']).trim().split('\n');
    // A copy without .git inside another repository (./product in this one) is not its own history.
    if (shallow !== 'false' || !top || realpathSync(top) !== realpathSync(dir)) return dates;
    // --no-renames: rename detection reads file contents, which a blobless CI clone fetches one by one.
    log = git(dir, ['log', '--no-renames', '--format=%x00%cs', '--name-only', '--', ...paths]);
  } catch {
    return dates;
  }
  let date = '';
  for (const line of log.split('\n')) {
    if (line.startsWith('\0')) date = line.slice(1);
    else if (line && !dates.has(line)) dates.set(line, date);
  }
  return dates;
}
