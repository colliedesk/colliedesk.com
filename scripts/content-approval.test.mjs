import assert from 'node:assert/strict';
import { test } from 'node:test';
import { contentApproval } from './content-approval.mjs';

const CLAIMS = `## Claim check

| Claim | Source | Verified |
|---|---|---|
| Freshdesk Pro is $55 per agent per month | https://www.freshworks.com/freshdesk/pricing/ (read 20 October 2026) | yes |
`;
const pr = (over = {}) => ({
  branch: 'seo/freshdesk-export-csv',
  labels: [],
  files: [{ filename: 'src/data/pages/freshdesk-export-csv.ts', status: 'added' }],
  body: `Closes #70\n\n${CLAIMS}`,
  ...over,
});

test('a PR that is not content passes without approval', () => {
  const r = contentApproval(pr({ branch: 'fix/footer', files: [{ filename: 'src/components/Footer.tsx', status: 'modified' }], body: '' }));
  assert.equal(r.required, false);
  assert.deepEqual(r.errors, []);
});

test('an seo/ branch, an seo: label or a new page each make approval required', () => {
  assert.equal(contentApproval(pr()).required, true);
  assert.equal(contentApproval(pr({ branch: 'docs/x', files: [], labels: ['seo:improve'] })).required, true);
  assert.equal(contentApproval(pr({ branch: 'docs/x' })).required, true);
  assert.equal(contentApproval(pr({ branch: 'docs/x', files: [{ filename: 'src/data/pages/pricing.ts', status: 'modified' }] })).required, false);
});

test('a content PR with a fully verified claim check passes without any approval label', () => {
  assert.deepEqual(contentApproval(pr()).errors, []);
});

test('a content PR without a claim check table fails', () => {
  for (const body of ['Closes #70', 'Closes #70\n\n## Claim check\n\nAll good.', 'Closes #70\n\n## Claim check\n\n| Claim | Source | Verified |\n|---|---|---|\n']) {
    const r = contentApproval(pr({ body }));
    assert.equal(r.errors.length, 1, body);
    assert.match(r.errors[0], /Claim check/);
  }
});

test('a claim marked anything but yes fails', () => {
  const r = contentApproval(pr({ body: CLAIMS.replace('| yes |', '| no |') }));
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0], /not verified/);
});
