import { TRIAL_HREF } from '../../lib/site';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { CLAUDE_DIRECTORY_URL, MCP_URL } from './home-sections';
import { mcpToolCount } from './repo-docs';

// Vendor facts were read on their own documentation on READ; the links are in the Sources section.
const READ = '25 November 2026';
const TOOLS = mcpToolCount();

const FRESHDESK_MCP = 'https://support.freshdesk.com/support/solutions/articles/50000012670';
const FRESHDESK_FAQ = 'https://support.freshdesk.com/support/solutions/articles/50000014407';
const ZENDESK_MCP =
  'https://support.zendesk.com/hc/en-us/articles/11400026079130-Connecting-external-AI-agents-to-the-Zendesk-MCP-server-or-Zendesk-AI-agents-EAP';
const ZENDESK_BRIDGE =
  'https://support.zendesk.com/hc/en-us/articles/11398710406554-Understanding-Zendesk-Bridge-and-allowing-external-AI-agents-to-perform-actions-in-Zendesk-EAP';
const ZENDESK_MCP_CLIENT = 'https://support.zendesk.com/hc/en-us/articles/11105393853210-Announcing-the-general-availability-of-the-MCP-client';
const HELP_SCOUT_MCP = 'https://docs.helpscout.com/article/1779-help-scout-mcp-server';
const INTERCOM_MCP = 'https://developers.intercom.com/docs/guides/mcp';
const INTERCOM_CONNECTOR = 'https://www.intercom.com/integrations/connectors/intercom-mcp-server';

const faq: Faq[] = [
  {
    q: 'Does Zendesk have an MCP server?',
    a: `Yes, in early access. Zendesk calls it Zendesk Bridge, and you join the External AI early access program to use it. It is free during early access, and Zendesk says packaging and pricing might change at general availability. Source: [Zendesk help](${ZENDESK_MCP}), read ${READ}.`,
  },
  {
    q: 'Is the Help Scout MCP server read-only?',
    a: `Yes, for a connection made today. Help Scout says the agent can find and summarize, but it cannot reply to customers, add notes, change tags or edit Docs articles. Write actions are on its roadmap with no date. Source: [Help Scout docs](${HELP_SCOUT_MCP}), read ${READ}.`,
  },
  {
    q: 'Which helpdesk MCP servers can send a reply to a customer?',
    a: `Two of the five name a tool for it: Colliedesk (\`colliedesk_reply_send\`) and Freshdesk (\`replyTicket\`). Intercom says its note tool cannot send a reply the customer sees. Help Scout is read-only. Zendesk's page names creating and updating tickets, and does not name a reply tool.`,
  },
  {
    q: 'Does an MCP call cost extra?',
    a: `On Freshdesk, yes, after the yearly allowance: 1,200 actions on Growth, 6,000 on Pro and 12,000 on Enterprise, for the whole account, prorated on a shorter billing cycle. Every call counts as one action, a read as much as a write. On Colliedesk the MCP server is on every plan, and [plans](/pricing) differ only in agents, attachment storage and how much of the move we do.`,
  },
  {
    q: 'Can I self-host a helpdesk that has an MCP server?',
    a: 'Yes. Colliedesk is open source under AGPL-3.0, and a self-hosted install serves the same MCP endpoint at `/mcp` on your own domain. Read [the self-hosted helpdesk page](/self-hosted-helpdesk).',
  },
];

const body = `Colliedesk, Freshdesk, Zendesk, Help Scout and Intercom each run an MCP server that your AI agent can connect to. Two of them name a tool that sends a reply to a customer: Colliedesk (\`colliedesk_reply_send\`, one of ${TOOLS} tools) and Freshdesk (\`replyTicket\`, one of 37).

Three publish a tool count: Intercom 16, Freshdesk 37 and Colliedesk ${TOOLS}. Zendesk and Help Scout do not.

Every row below comes from the vendor's own documentation, read on ${READ}. Where the documentation does not say, the cell says "not stated".

## The five servers side by side

| Helpdesk | Status | Server URL | Tools | Can it reply to a customer? |
|---|---|---|---|---|
| Colliedesk | Shipped | \`${MCP_URL}\` on Cloud, \`/mcp\` on your own domain when self-hosted | ${TOOLS} | Yes, when the token holds \`messages:send\`. With \`ai_assist:create\` instead, it leaves a draft for a person. |
| [Freshdesk](${FRESHDESK_MCP}) | Generally available since 10 September 2026 | \`https://<subdomain>.freshdesk.com/mcp\` | 37 in the tool table | Yes: \`replyTicket\` |
| [Zendesk](${ZENDESK_MCP}) | Early access program | \`https://<subdomain>.zendesk.com/mcp\` | Not stated; up to 150 tools and AI agents on one pre-built connection | Not stated. It creates and updates tickets after a person confirms. |
| [Help Scout](${HELP_SCOUT_MCP}) | Generally available | \`https://mcp.helpscout.net/mcp\` | Not stated | No. New connections are read-only; a few early accounts kept write tools. |
| [Intercom](${INTERCOM_MCP}) | Live | \`https://mcp.intercom.com/mcp\` (US), \`https://mcp.eu.intercom.com/mcp\` (EU) | 16, plus 5 Fin Operator tools on an OAuth connection when the workspace has Fin Operator | No. It adds an internal note and writes help articles. |

## Sign-in, plans and limits

| Helpdesk | Sign-in | Plans and limits |
|---|---|---|
| Colliedesk | OAuth for an AI app, or an agent token for a script | Every plan, and self-hosted |
| Freshdesk | An API key for each user | Growth, Pro and Enterprise, on Freshdesk Standalone 2021 or Freshdesk Unified Omni 2026 only. 1,200, 6,000 and 12,000 actions a year for the account, prorated on a shorter billing cycle. Rate limit of 25, 50 and 100 actions a minute. |
| Zendesk | OAuth | Suite Team and up, Support Team and up. Free during early access. |
| Help Scout | OAuth, each person as themselves | Standard, Plus and Pro. Report tools need Plus or Pro. |
| Intercom | OAuth, or a bearer token | US and EU workspaces. AU workspaces are not supported yet. Plans are not stated. |

## Zendesk MCP server: what it can do

Zendesk's MCP server is in an early access program. Zendesk calls it Zendesk Bridge, and it is free during early access. Packaging and pricing might change at general availability. Source: [Zendesk help](${ZENDESK_MCP}), read ${READ}.

- **Get it:** join the External AI early access program. Then in Admin Center, open **AI** → **External AI** → **Add connection**.
- **Server URL:** \`https://<subdomain>.zendesk.com/mcp\`, on the connection's **Setup** tab.
- **Plans:** Suite Team, Growth, Professional, Enterprise and Enterprise Plus. Support Team, Professional and Enterprise.
- **Sign-in:** OAuth. With a pre-built provider, each user authorizes the app for their own Zendesk account.
- **Tools that write:** you pick them per connection, up to 150 tools and AI agents on a pre-built provider such as Claude, ChatGPT or Codex. Zendesk names creating and updating tickets and applying macros. During early access, destructive actions, bulk exports and third-party integrations are not supported, and Admin Center actions are read-only ([Understanding Zendesk Bridge](${ZENDESK_BRIDGE}), read ${READ}).
- **Can it send a reply?** Not stated. The agent proposes each change, and a person confirms it before Zendesk makes it.
- **Limit during early access:** one connection for each pre-built provider. For a second Claude agent, Zendesk suggests a custom connection.

Many results for "Zendesk MCP" describe the Zendesk MCP client instead. That is the other direction: Zendesk calls another vendor's MCP server from its action flows. The client is generally available since 10 August 2026, on Suite Growth and up and Support Team and up. Source: [Zendesk announcement](${ZENDESK_MCP_CLIENT}), read ${READ}.

## Intercom MCP server: what it can do

Intercom's MCP server reads conversations, contacts and companies, and writes help articles and internal notes. Source: [Intercom developer guide](${INTERCOM_MCP}), read ${READ}.

- **Server URL:** \`https://mcp.intercom.com/mcp\` for a US workspace (\`app.intercom.com\`), \`https://mcp.eu.intercom.com/mcp\` for an EU workspace (\`app.eu.intercom.com\`). AU workspaces are not supported yet. Intercom's [connector page](${INTERCOM_CONNECTOR}) still says US-hosted workspaces only; the developer guide lists both.
- **Sign-in:** OAuth in the browser, or a bearer token from an Intercom app.
- **Tools:** 16. The ones that write are \`create_article\`, \`update_article\` and \`add_internal_note\`. Each write is attributed to the teammate the connection acts as.
- **Can it send a reply?** No. \`add_internal_note\` is visible to teammates only. A note on a snoozed conversation assigned to someone else reopens it.
- **Fin Operator:** an OAuth connection also lists 5 Fin Operator tools. They run only when the workspace has Fin Operator and you may use it in Intercom. \`send_operator_message\` uses Operator credits.
- **Plans:** not stated.

## Freshdesk MCP server: what it can do

Freshdesk's MCP server is generally available since 10 September 2026 and can reply to a customer with \`replyTicket\`. It is on by default for Growth, Pro and Enterprise, on Freshdesk Standalone 2021 or Freshdesk Unified Omni 2026. Sources: [Freshdesk MCP article](${FRESHDESK_MCP}) and [MCP FAQ](${FRESHDESK_FAQ}), read ${READ}.

- **Get it:** in Freshdesk, open **Admin Settings** → **Apps & Integrations** → **MCP**. Copy the server URL and generate an API key there. An admin can turn MCP off on the same page.
- **Server URL:** \`https://<subdomain>.freshdesk.com/mcp\`. Custom domains are not supported.
- **Sign-in:** an API key only. Each user adds the URL and their own key to the AI app by hand. Freshdesk is not a listed connector in Claude or Gemini yet.
- **Tools that write:** the tool table lists 37 tools, among them \`replyTicket\`, \`createTicketNote\`, \`updateTicket\`, \`createTicketBulkUpdate\` and \`createAgent\`.
- **Can you limit the tools?** No. Every tool is available to anyone with a valid API key, within that user's Freshdesk role.
- **Cost:** each successful tool call is one action, a read as much as a write. Growth includes 1,200 actions a year for the account, Pro 6,000 and Enterprise 12,000, prorated on a shorter billing cycle. Unused actions do not roll over, and an MCP Action Pack add-on buys more.

## Can you limit what the agent does?

A read-only server is fine for "summarize this week's refund tickets". It cannot clear a queue. Check who can narrow what the agent does:

- **Help Scout:** you turn off single tools in your AI app.
- **Colliedesk:** an agent token follows a role, or holds a fixed list of your permissions. It never does more than the person who made it. Give it \`messages:send\` only when you want it to write to customers.

Zendesk lets an admin pick the tools per connection, and Freshdesk has no per-tool limit; both are in their sections above.

## What the Colliedesk server does

Colliedesk lists ${TOOLS} tools in [its MCP guide](/docs/mcp), each with the permission it needs. They cover the inbox, private notes, replies, saved replies, customers, the help center and workspace settings.

To connect an AI app:

1. On Colliedesk Cloud, in Claude, open [Colliedesk in the Claude directory](${CLAUDE_DIRECTORY_URL}) and choose **Connect**. In Codex, Cursor, VS Code or ChatGPT, add a remote MCP server with the URL \`${MCP_URL}\`. A self-hosted Colliedesk is added the same way with \`https://<your-domain>/mcp\`.
2. A Colliedesk page opens in your browser. Check the app name and the workspace, then choose **Allow**.
3. Ask the agent: "Triage the open conversations nobody owns. Tag billing questions with \`billing\` and leave a note with a summary."

Three limits are written in the guide:

- A token never does more than the person who made it can do right now.
- Only a person creates a token. No tool makes one.
- An app you do not use for 30 days is disconnected.

Paste \`${MCP_URL}\` into Claude, Codex or Cursor after you [start the 14-day trial, no card](${TRIAL_HREF}).

## When another helpdesk fits better

- You already run Freshdesk on Growth or higher, and 1,200 actions a year is enough. The server is on by default. Check your version first: the FAQ lists Freshdesk variants from before 2021 as not supported.
- You want a person to confirm every change. Zendesk does that by design.
- You only need the agent to read and report. Help Scout and Intercom both do that.

If you want an agent that works the whole queue, check the reply column first. Then read how [Colliedesk compares with Freshdesk](/vs/freshdesk) and [what a small team pays](/pricing).

## Sources

All read ${READ}.

- Freshdesk: [Model Context Protocol (MCP) integration in Freshdesk](${FRESHDESK_MCP}) and [the MCP FAQ](${FRESHDESK_FAQ}).
- Zendesk: [Connecting external AI agents to the Zendesk MCP server or Zendesk AI agents (EAP)](${ZENDESK_MCP}) and [Understanding Zendesk Bridge (EAP)](${ZENDESK_BRIDGE}) and [the MCP client announcement](${ZENDESK_MCP_CLIENT}).
- Help Scout: [Connect your AI Agent to Help Scout via MCP](${HELP_SCOUT_MCP}).
- Intercom: [the MCP guide for developers](${INTERCOM_MCP}) and [the MCP server connector page](${INTERCOM_CONNECTOR}).
- Colliedesk: [Connect an AI agent (MCP)](/docs/mcp) and [Roles and permissions](/docs/roles-and-permissions).`;

const page: Page = {
  jsonLd: [],
  name: 'Helpdesk MCP servers compared',
  path: '/helpdesk-mcp-server',
  updated: '2026-11-25',
  section: 'Compare',
  title: `Helpdesk MCP servers compared: 16 tools to ${TOOLS}`,
  description:
    'Colliedesk, Freshdesk, Zendesk, Help Scout and Intercom each have an MCP server. See the URL, sign-in, tool count, limits and which two name a reply tool.',
  summary: 'Five helpdesk MCP servers compared from vendor docs: URL, sign-in, tool count, plans, limits and which can reply to a customer.',
  eyebrow: `Compared from vendor docs, ${READ}`,
  h1: `Which helpdesk has an MCP server? 5 compared, from 16 tools to ${TOOLS}`,
  lede: 'Two of the five name a tool that sends a reply to a customer. One is read-only. One counts every call against a yearly allowance.',
  cta: true,
  ctaCall: { href: '/docs/mcp', label: 'Read the MCP guide' },
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];

export default page;
