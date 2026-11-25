// plain() turns FAQ Markdown into the FAQPage JSON-LD text that AI answer engines quote, so a
// permission or tool name in a code span must come out exactly as the reader sees it on the page.
import { test } from 'node:test';
import assert from 'node:assert/strict';

const { plain } = await import('../src/lib/markdown.ts');

test('a code span keeps its underscores', () => {
  assert.equal(
    plain('With only `ai_assist:create` it leaves a draft; `colliedesk_reply_send` sends it.'),
    'With only ai_assist:create it leaves a draft; colliedesk_reply_send sends it.',
  );
});

test('links, bold and emphasis outside code are still stripped', () => {
  assert.equal(plain('**Yes.** Read the [guide](/docs/mcp), _today_.'), 'Yes. Read the guide, today.');
});
