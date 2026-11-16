// The "Updated" date of a docs page is the date of the last commit that changed its own Markdown file in
// the product repository. A checkout without that history (a shallow clone, a copy without .git) gives
// no dates rather than a wrong one: in a depth-1 clone every file would look changed by the last commit.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { lastChangedDates } from '../src/lib/git-dates.mjs';

function fixtureRepo() {
  const dir = mkdtempSync(join(tmpdir(), 'git-dates-'));
  const git = (args, date) => execFileSync('git', ['-C', dir, ...args], {
    env: { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.com', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.com' },
    stdio: 'pipe',
  });
  git(['init', '-q', '-b', 'main']);
  mkdirSync(join(dir, 'docs/user'), { recursive: true });
  const commit = (file, text, date) => {
    writeFileSync(join(dir, file), text);
    git(['add', file]);
    git(['commit', '-q', '-m', `edit ${file}`], date);
  };
  commit('docs/user/inbox.md', '# Inbox\n', '2026-03-04T10:00:00+00:00');
  commit('docs/user/tags.md', '# Tags\n', '2026-05-06T10:00:00+00:00');
  commit('docs/user/inbox.md', '# Inbox\n\nMore.\n', '2026-07-08T10:00:00+00:00');
  commit('README.md', 'not docs\n', '2026-09-10T10:00:00+00:00');
  return dir;
}

test('each file gets the date of the last commit that changed it', () => {
  const dir = fixtureRepo();
  try {
    const dates = lastChangedDates(dir, ['docs/user']);
    assert.equal(dates.get('docs/user/inbox.md'), '2026-07-08');
    assert.equal(dates.get('docs/user/tags.md'), '2026-05-06');
    assert.equal(dates.has('README.md'), false, 'only the paths asked for');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('a shallow clone gives no dates', () => {
  const dir = fixtureRepo();
  const shallow = mkdtempSync(join(tmpdir(), 'git-dates-shallow-'));
  try {
    execFileSync('git', ['clone', '-q', '--depth', '1', `file://${dir}`, shallow], { stdio: 'pipe' });
    assert.equal(lastChangedDates(shallow, ['docs/user']).size, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
    rmSync(shallow, { recursive: true, force: true });
  }
});

test('a directory that is not a git checkout gives no dates', () => {
  const dir = mkdtempSync(join(tmpdir(), 'git-dates-plain-'));
  try {
    assert.equal(lastChangedDates(dir, ['docs/user']).size, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
