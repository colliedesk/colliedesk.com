import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

// .github/workflows/competitor-watch.yml read as text, one block per job. actionlint checks the syntax;
// these tests check who gets a write token and when.
const workflow = readFileSync(new URL('../.github/workflows/competitor-watch.yml', import.meta.url), 'utf8');
const jobsText = workflow.slice(workflow.indexOf('\njobs:\n') + '\njobs:\n'.length)
  .split('\n').filter((line) => !/^\s*#/.test(line) && line.trim() !== '').join('\n');
const jobs = jobsText.split(/\n(?= {2}[a-z][a-z0-9-]*:\n)/).map((block) => ({ name: block.match(/^ {2}([a-z][a-z0-9-]*):/)[1], block }));
// The job's if:, folded (>-) or on one line, as one string.
const ifOf = (block) => {
  const m = block.match(/\n {4}if: (?:>-\n((?: {6}[^\n]*\n?)+)|([^\n]+))/);
  return (m?.[1] ?? m?.[2] ?? '').replace(/\s+/g, ' ').trim();
};
const writes = (block) => /\n {6}[a-z-]+: write\b/.test(block);

test('only a job that requires the COMPETITOR_WATCH switch holds a write token, a manual run included', () => {
  const writers = jobs.filter((j) => writes(j.block));
  assert.ok(writers.length > 0, 'no job can open pull requests');
  for (const { name, block } of writers) {
    // Every way into the job is AND-ed with the switch.
    assert.match(ifOf(block), /^vars\.COMPETITOR_WATCH == 'on' && \(/, `${name}: if: ${ifOf(block)}`);
    assert.match(block, /--open-prs/, `${name} writes but does not open pull requests`);
  }
});

test('a dry run gets a read-only token', () => {
  const dry = jobs.filter((j) => !/--open-prs/.test(j.block));
  assert.ok(dry.length > 0, 'no dry-run job');
  for (const { name, block } of dry) {
    assert.ok(!writes(block), `${name} holds a write token`);
    assert.match(ifOf(block), /workflow_dispatch/, `${name} is not the manual dry run`);
  }
});

test('no checkout leaves the token in .git/config', () => {
  const checkouts = workflow.match(/uses: actions\/checkout@[^\n]+\n(?: {8}[^\n]*\n)*/g) ?? [];
  assert.ok(checkouts.length > 0);
  for (const step of checkouts) assert.match(step, /persist-credentials: false/, step);
});
