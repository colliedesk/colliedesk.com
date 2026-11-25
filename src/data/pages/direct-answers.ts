// One-sentence yes/no FAQ answers that AI assistants can quote as they are. Each entry is used on at
// most two pages, so no answer turns into boilerplate across the site. Facts come from site.ts, the
// product docs (docs/user, docs/self-host) and our live pages.
import type { Faq } from '../../lib/page';
import { MCP_URL } from './home-sections';

export const EXPORT_FAQ: Faq = {
  q: 'Can I export all my data from Colliedesk?',
  a: 'Yes: an admin downloads the whole workspace as one ZIP file in an open, documented format, even after a Cloud trial ends or on a self-hosted server ([export all your data](/docs/export)).',
};

export const MCP_EVERY_PLAN_FAQ: Faq = {
  q: 'Does Colliedesk have an MCP server on every plan?',
  a: `Yes: every Cloud plan and every self-hosted server includes the MCP server, at \`${MCP_URL}\` on Cloud or \`/mcp\` on your own domain ([connect an AI agent](/docs/mcp)).`,
};

export const AGENT_REPLY_FAQ: Faq = {
  q: 'Can an AI agent reply to customers in Colliedesk?',
  a: 'Yes, through the MCP server when the agent holds the `messages:send` permission; with only `ai_assist:create` it leaves a draft for a person to edit and send ([MCP guide](/docs/mcp)).',
};

export const AI_INCLUDED_FAQ: Faq = {
  q: 'Are AI reply drafts included in the Colliedesk price?',
  a: 'Yes: reply drafts and triage suggestions are included in every Cloud plan up to a monthly allowance (Settings → AI & agents → Usage), and on your own model key, Cloud or self-hosted, Colliedesk adds no fee ([pricing](/pricing)).',
};
