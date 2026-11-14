import assert from 'node:assert/strict';
import { test } from 'node:test';

const { factText } = await import('../src/lib/competitor.ts');

const acme = {
  slug: 'acme',
  facts: { plans: { text: 'Basic $10 per agent per month', source: 'pricing' } },
};

test('factText gives the text of a fact the competitor file has', () => {
  assert.equal(factText(acme, 'plans'), 'Basic $10 per agent per month');
});

test('factText fails the build when a page uses a fact the file no longer has', () => {
  // Deleting an unsourced fact must not publish "undefined" or an empty cell on the live page:
  // the build stops and says which sentence to delete with it.
  assert.throws(() => factText(acme, 'usThirdParty'), {
    message: 'acme: a page uses fact usThirdParty, which src/data/competitors/acme.ts does not have; delete the sentence or row that shows it, or add the fact with a source',
  });
});
