// Seeds the scene through the product's own paths: the CLI for the workspace and the agent token, the
// email inbound endpoint for customer mail, MCP for what the agent does, and REST (what the web app calls)
// for what Tom does. Only the timestamps are written to the database directly; see retime().
import { inbound, mcp, redeem, rest, tokenFromLink } from './api.mjs';
import { demoPng, inboundEmail } from './mail.mjs';
import { SCENE, sceneTimes } from './scene.mjs';
import { collie, sql } from './stack.mjs';

const AUTHSERV_ID = 'mx.shot.invalid'; // EMAIL_TRUSTED_AUTHSERV_ID in compose.yaml
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export async function seed(origin, now = new Date()) {
  const { timeZone, conversations: times } = sceneTimes(now);
  const link = collie('create-workspace', '--name', SCENE.workspace, '--admin-email', SCENE.admin.email);
  const tom = rest(origin, await redeem(origin, tokenFromLink(link), 'bearer'));
  const slug = (await tom('GET', '/auth/me')).workspace.slug;

  // Tom's own setup, as in the web app: his name, the email channel and the workspace tags.
  await tom('PATCH', '/agents/me/display-name', { display_name: SCENE.admin.name });
  await tom('PUT', '/channels/email', { support_address: SCENE.supportAddress });
  const channel = await tom('POST', '/channels/email/secret');
  for (const name of SCENE.tags) await tom('POST', '/tags', { name });

  // Customer mail, oldest first, through the inbound endpoint with a trusted SPF/DKIM pass.
  const ids = new Map();
  for (const [index, conversation] of [...SCENE.conversations.entries()].reverse()) {
    const attachment = conversation.attachment
      ? { filename: conversation.attachment, contentType: 'image/png', data: demoPng(640, 400) } : undefined;
    const raw = inboundEmail({ ...conversation, to: SCENE.supportAddress, date: times[index].times.incoming, authservId: AUTHSERV_ID, attachment });
    const result = await inbound(channel.inbound_url, channel.inbound_secret, raw);
    if (result.status !== 'created') throw new Error(`inbound mail was ${result.status}: ${result.reason}`);
    ids.set(index, { conversation: result.conversation_id, incoming: result.message_id });
  }

  // The agent (an admin token labelled "Claude Code") triages over MCP and drafts the reply.
  const agent = mcp(origin, collie('token', 'create', '--workspace', slug, '--email', SCENE.admin.email, '--scope', 'admin', '--label', SCENE.tokenLabel));
  await agent('colliedesk_workspace_settings_update', { timezone: timeZone });
  let draft;
  for (const [index, conversation] of SCENE.conversations.entries()) {
    const id = ids.get(index);
    const change = { conversation_id: id.conversation, priority: conversation.priority };
    if (conversation.tags.length) change.add_tags = conversation.tags;
    if (conversation.assignee) change.assignee = conversation.assignee;
    await agent('colliedesk_conversation_update', change);
    if (conversation.note) id.note = (await agent('colliedesk_note_add', { conversation_id: id.conversation, body: conversation.note })).message.id;
    if (conversation.reply) draft = { index, request: (await agent('colliedesk_reply_draft', { conversation_id: id.conversation, body: conversation.reply })).agent_request.id };
  }

  // Tom approves the drafted reply; it goes out through SMTP to the Mailpit sink.
  await tom('POST', `/agent-requests/${draft.request}/approve`);
  const replied = ids.get(draft.index);
  replied.request = draft.request;
  replied.reply = await waitForSentReply(tom, replied.conversation);

  retime(SCENE.conversations.map((_, index) => ({ ids: ids.get(index), times: times[index].times })));
  return { slug, timeZone, selected: ids.get(0).conversation };
}

async function waitForSentReply(tom, conversation) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const { items } = await tom('GET', `/conversations/${conversation}/messages`);
    const reply = items.find((message) => message.kind === 'outgoing');
    if (reply?.delivery?.status === 'sent') return reply.id;
    if (reply?.delivery?.status === 'failed') throw new Error(`the reply failed to send: ${reply.delivery.last_error}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('the reply was not sent within 30 seconds');
}

// retime moves each step to its scene time. The product has no API to backdate messages (rightly), so
// this is the one direct database write. Every id comes from an API answer and is checked as a UUID.
function retime(rows) {
  const literal = (value) => {
    if (value instanceof Date) return `'${value.toISOString()}'::timestamptz`;
    if (!UUID.test(value)) throw new Error(`not a UUID: ${value}`);
    return `'${value}'::uuid`;
  };
  const statements = [];
  for (const { ids, times } of rows) {
    const last = new Date(Math.max(...Object.values(times).map(Number)));
    const lastPublic = times.reply ?? times.incoming;
    statements.push(
      `UPDATE messages SET created_at=${literal(times.incoming)} WHERE id=${literal(ids.incoming)};`,
      `UPDATE attachments SET created_at=${literal(times.incoming)} WHERE message_id=${literal(ids.incoming)};`,
      `UPDATE contacts SET created_at=${literal(times.incoming)}, updated_at=${literal(times.incoming)} WHERE id=(SELECT contact_id FROM conversations WHERE id=${literal(ids.conversation)});`,
      `UPDATE conversations SET created_at=${literal(times.incoming)}, updated_at=${literal(last)}, last_public_at=${literal(lastPublic)},
         assigned_at=CASE WHEN assignee_id IS NULL THEN NULL ELSE ${literal(times.note ?? times.incoming)} END WHERE id=${literal(ids.conversation)};`,
    );
    if (ids.note) statements.push(`UPDATE messages SET created_at=${literal(times.note)} WHERE id=${literal(ids.note)};`);
    if (ids.reply) {
      const requested = new Date(times.reply.getTime() - 4 * 60_000);
      const sent = new Date(times.reply.getTime() + 3_000);
      statements.push(
        `UPDATE messages SET created_at=${literal(times.reply)} WHERE id=${literal(ids.reply)};`,
        `UPDATE agent_requests SET created_at=${literal(requested)}, decided_at=${literal(times.reply)},
           expires_at=${literal(new Date(requested.getTime() + 7 * 86_400_000))} WHERE id=${literal(ids.request)};`,
        `UPDATE email_outbox SET created_at=${literal(times.reply)}, updated_at=${literal(sent)}, sent_at=${literal(sent)},
           next_attempt_at=${literal(times.reply)} WHERE message_id=${literal(ids.reply)};`,
      );
    }
  }
  sql(statements.join('\n'));
}
