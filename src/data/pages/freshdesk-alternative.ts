const PRICES_READ = '16 October 2026';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';

const faq: Faq[] = [
  {
    q: 'What is the best open-source Freshdesk alternative?',
    a: 'It depends on your channels and timing. Zammad is the most mature open-source helpdesk and its Freshdesk migrator is released today. Chatwoot fits teams whose support is mostly chat and messaging. FreeScout is a light PHP helpdesk with paid modules. Colliedesk is built for small email-support teams leaving Freshdesk, at one flat price per workspace (Team $69 a month for up to 10 agents), with an importer and reconcile report available now, in alpha.',
  },
  {
    q: 'Why are teams leaving Freshdesk?',
    a: `Mostly price. Between December 2025 and January 2026 Freshdesk raised Growth from $15 to $19 and Pro from $49 to $55 per agent per month (billed annually), and Freddy AI Copilot is another $29 per agent. See [Freshdesk price history](/freshdesk-pricing-history).`,
  },
  {
    q: 'Which Freshdesk alternative is cheapest for 5 agents?',
    a: `Among the paid plans we compared on ${PRICES_READ}, Colliedesk Cloud Team at $690 a year per workspace ($57.50 a month, or $69 billed monthly) is the lowest helpdesk price for 5 agents. Helply (formerly Groove) starts at $49 a month, but that buys AI credits. Zoho Desk Express (€7 per user, max 5) and the free plans of Zoho Desk and HubSpot are cheaper if you can live with their limits.`,
  },
];

const body = `## The alternatives, side by side

Prices for 5 agents per month, billed annually, from each vendor's page on ${PRICES_READ}. Every row links to a full comparison with sources.

| Helpdesk | 5 agents | Pricing model | Open source | Freshdesk import | Comparison |
|---|---|---|---|---|---|
| **Colliedesk** | **$57.50** (Team, $690 a year) + AI usage | Flat per workspace, up to 10 agents | AGPL-3.0 | Available now (alpha), with reconcile report | — |
| Zammad | €80–90 (Professional) | Per agent (hosted, in euros) | AGPL-3.0 | Released, self-serve | [vs Zammad](/vs/zammad) |
| Chatwoot | $195 (Business) | Per agent | MIT (core) | Paid plans; no attachments | [vs Chatwoot](/vs/chatwoot) |
| FreeScout | Hosting + modules | Free core, paid modules, no official cloud | AGPL-3.0 | Third-party or community module | [vs FreeScout](/vs/freescout) |
| Zendesk | €825 (with Copilot) | Per agent (in euros) | No | — | [vs Zendesk](/vs/zendesk) |
| Help Scout | $125 (Standard) | Per user, plus $0.75 per AI resolution | No | — | [vs Help Scout](/vs/help-scout) |
| Front | $425 (Professional + Copilot) | Per seat | No | — | [vs Front](/vs/front) |
| Zoho Desk | €115 (Professional, with Zia) | Per user (in euros) | No | Free migration offered by Zoho | [vs Zoho Desk](/vs/zoho-desk) |
| HappyFox | $120 (Basic, max 5) | Per agent | No | — | [vs HappyFox](/vs/happyfox) |
| Gorgias | $77–1,227 by tickets, with AI Agent | By ticket volume | No | — | [vs Gorgias](/vs/gorgias) |
| HubSpot Service Hub | $500 (Professional) | Per seat | No | — | [vs HubSpot](/vs/hubspot-service-hub) |
| Groove (now Helply) | From $49 in credits | AI credits | No | — | [vs Groove](/vs/groove) |
| Freshdesk, for reference | $420 (Pro + Copilot) | Per agent | No | — | [vs Freshdesk](/vs/freshdesk) |

## How to choose

1. **Count your agents.** One or two agents: the cheapest per-agent plans cost about the same as a small flat plan. Three to ten: a flat price wins.
2. **Name your channels.** Mostly email: a ticket helpdesk. Mostly chat and messaging apps: an omnichannel inbox such as Chatwoot.
3. **Decide where the data lives.** If it must stay on your servers, pick an open-source helpdesk you can self-host: Colliedesk, Zammad, FreeScout or Chatwoot.
4. **Price the AI.** Per-seat AI add-ons and per-resolution fees can cost more than the helpdesk. Ask for the price at your ticket volume.
5. **Plan the move before your renewal.** The Freshdesk CSV export has ticket fields only, not the conversation. Read [how to export tickets from Freshdesk](/migrate/freshdesk/export), and insist on proof that every ticket and attachment arrived.

## Where Colliedesk fits

Colliedesk is for **small support teams (3 to 10 agents) leaving Freshdesk**, mostly on email, who want a flat price, AI at model cost and their data in an open database. It is alpha: released and running on Colliedesk Cloud, with the email channel, Cc on replies and the Freshdesk importer. Starting a new conversation from the inbox, contact history and AI are not there yet, and the interface may change. If you need those this week, pick a mature option above. If your renewal is months away, [we migrate you for free](/migrate/freshdesk/done-for-you) on the founding plan.`;

const page: Page = {
  jsonLd: [],
  name: 'Freshdesk alternatives',
  path: '/freshdesk-alternative',
  updated: '2026-10-16',
  section: 'Compare',
  title: 'Freshdesk alternatives in 2026: 12 helpdesks compared by price and import',
  description:
    'Freshdesk alternatives compared: open-source (Colliedesk, Zammad, Chatwoot, FreeScout) and SaaS (Zendesk, Help Scout, Front, Zoho Desk, HappyFox, Gorgias, HubSpot, Groove). Prices for 5 agents and Freshdesk import, with sources.',
  summary: 'Freshdesk alternatives compared: 4 open-source and 8 SaaS helpdesks, 5-agent price, pricing model and Freshdesk import; how to choose',
  eyebrow: 'Compare · Freshdesk alternatives',
  h1: 'Freshdesk alternatives, compared honestly',
  lede: 'Twelve helpdesks, open source and SaaS, with what five agents pay and how each one gets your Freshdesk history in. Colliedesk is one of them; we say where the others win.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
