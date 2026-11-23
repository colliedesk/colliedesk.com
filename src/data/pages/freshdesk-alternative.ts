// Every competitor price, limit and import claim below was read on the vendor's own page on this date.
const READ = '23 November 2026';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { SMALL, TEAM, dollars } from '../../lib/site';
import { FOUNDING_ACTION, FOUNDING_OPEN, OUR_CELL, OUR_PLAN, OUR_PRICE, foundingFirst } from '../../lib/cloud-price';

const SRC = {
  freshdesk: 'https://www.freshworks.com/freshdesk/pricing/',
  zammad: 'https://zammad.com/en/pricing',
  zammadImport: 'https://docs.zammad.org/en/latest/migration/freshdesk.html',
  zammadLicence: 'https://github.com/zammad/zammad',
  frappe: 'https://frappe.io/helpdesk/pricing',
  frappeLicence: 'https://github.com/frappe/helpdesk/blob/develop/LICENSE',
  chatwootLicence: 'https://github.com/chatwoot/chatwoot/blob/develop/LICENSE',
  freescout: 'https://github.com/freescout-help-desk/freescout',
  freescoutModules: 'https://freescout.net/modules/',
  freescoutImport: 'https://github.com/freescout-help-desk/freescout/wiki/Migrate-to-FreeScout',
  chatwoot: 'https://www.chatwoot.com/pricing',
  chatwootImport: 'https://www.chatwoot.com/hc/user-guide/articles/1696159781-how-to-migrate-from-freshdesk-to-chatwoot',
  helpScout: 'https://www.helpscout.com/pricing/',
  helpScoutImport: 'https://docs.helpscout.com/article/1495-import-emails-or-tickets-into-help-scout',
  zoho: 'https://www.zoho.com/desk/pricing.html',
  helply: 'https://helply.com/pricing',
  helplyImport: 'https://helply.com/integrations/migrate-freshdesk',
  zendesk: 'https://www.zendesk.com/pricing/',
  zendeskImport:
    'https://support.zendesk.com/hc/en-us/articles/6696005837082-How-can-I-migrate-information-from-another-platform-into-Zendesk',
  front: 'https://front.com/pricing',
  frontImport: 'https://help.front.com/en/articles/2084',
  hubspot: 'https://www.hubspot.com/pricing/service',
  hubspotImport: 'https://knowledge.hubspot.com/knowledge-base/import-knowledge-base-articles',
} as const;

// "Colliedesk Founding ($99 every 3 months for up to 10 agents)", or the Team plan once Founding closes.
const OURS = `Colliedesk ${OUR_PLAN} (${OUR_PRICE} for up to 10 agents)`;
// $690 a year is $57.50 a month; dollars() would print "$57.5".
const TEAM_YEARLY_MONTH = `$${(TEAM.yearly / 12).toFixed(2)}`;
const CLOUD_PRICES = foundingFirst(
  `Small is ${dollars(SMALL.monthly)} a month for up to 3 agents. Team is ${dollars(TEAM.monthly)} a month for up to 10, or ${dollars(TEAM.yearly)} a year (${TEAM_YEARLY_MONTH} a month).`,
);
const OUR_TABLE_CELL = FOUNDING_OPEN
  ? `${OUR_CELL}; after the 10 Founding places, ${TEAM_YEARLY_MONTH} (Team, ${dollars(TEAM.yearly)} a year); free self-hosted`
  : `${TEAM_YEARLY_MONTH} (Team, ${dollars(TEAM.yearly)} a year), or ${dollars(TEAM.monthly)} billed monthly; free self-hosted`;

const faq: Faq[] = [
  {
    q: 'Is there a free Freshdesk alternative?',
    a: `Yes. FreeScout, Zammad, Frappe Helpdesk, Chatwoot and Colliedesk are open source: you can run them on your own server with no licence fee and pay only for the server. Some cloud helpdesks also have a free plan with limits: [Zoho Desk](${SRC.zoho}) (3 users), [Help Scout](${SRC.helpScout}) (up to 5 users and 1 inbox, no AI), [HubSpot Service Hub](${SRC.hubspot}) (up to 2 users) and [Chatwoot](${SRC.chatwoot}) Hacker (2 agents, 500 conversations a month, live chat only). [Freshdesk's pricing page](${SRC.freshdesk}) shows no free plan (read ${READ}). Colliedesk Cloud has no free plan either; it has a 14-day free trial.`,
  },
  {
    q: 'What is the best open-source Freshdesk alternative?',
    a: `It depends on your channels. For email support, Zammad has its own [Freshdesk migrator](${SRC.zammadImport}) and runs on your server or on [Zammad's cloud](${SRC.zammad}). Chatwoot fits teams whose support is mostly chat and messaging apps. [FreeScout](${SRC.freescout}) runs on shared PHP hosting, with [paid modules](${SRC.freescoutModules}). Colliedesk is built for small email teams leaving Freshdesk, and its importer keeps replies, notes and attachments.`,
  },
  {
    q: 'Why are teams leaving Freshdesk?',
    a: `Mostly price. Between December 2025 and January 2026 Freshdesk raised Growth from $15 to $19 and Pro from $49 to $55 per agent per month, billed annually ([Freshdesk price history](/freshdesk-pricing-history)). Freddy AI Copilot adds $29 per agent per month ([Freshdesk pricing](${SRC.freshdesk}), read ${READ}).`,
  },
  {
    q: 'Which Freshdesk import keeps attachments and old tickets?',
    a: `Read each import guide before you choose. [Chatwoot's import](${SRC.chatwootImport}) leaves attachments behind. [Front's own importer](${SRC.frontImport}) takes only the 9,000 most recent tickets. [HubSpot imports](${SRC.hubspotImport}) knowledge base articles from Freshdesk, not tickets (read ${READ}). The Colliedesk importer copies archived tickets, replies, notes and attachments, then shows a reconcile report with the counts on both sides.`,
  },
];

const body = `## What to check before you switch

1. **The price at your team size.** A per-agent price grows with every hire. A flat price stays the same from 3 to 10 agents. [Helpdesks with flat pricing](/helpdesk-flat-pricing) compares seven of them.
2. **Where the data lives.** Open-source helpdesks run on your own server. Read [self-hosted helpdesks](/self-hosted-helpdesk) for what that takes.
3. **What the import keeps.** Freshdesk's CSV export has ticket fields only, without replies or notes ([how to export from Freshdesk](/migrate/freshdesk/export)). So the importer of your next helpdesk decides what you keep.
4. **Your channels.** Mostly email: a ticket helpdesk. Mostly chat and messaging apps: an inbox such as Chatwoot.
5. **The AI bill.** Freddy AI Copilot is $29 per agent per month on top of Freshdesk ([pricing](${SRC.freshdesk}), read ${READ}). Some alternatives charge per seat for AI, others per answer.

## Free and open source

These cost no licence fee on your own server. See [Colliedesk open source](/open-source) for the licence.

- **Colliedesk, self-hosted.** Free, with every feature and no agent limit, under AGPL-3.0. It runs with Docker and PostgreSQL. The [Freshdesk importer](/migrate/freshdesk) copies tickets (archived ones too), replies, notes, attachments, tags, contacts and time entries, then writes a reconcile report.
- **FreeScout.** Free under AGPL-3.0, with no limit on agents or tickets, and it runs on shared PHP hosting ([GitHub](${SRC.freescout})). Extra features are paid modules, a lifetime licence per install ([modules](${SRC.freescoutModules})). To move from Freshdesk, its wiki points to a paid migration service. Ticket numbers are not kept and you add agents by hand ([migration guide](${SRC.freescoutImport})). [Colliedesk vs FreeScout](/vs/freescout).
- **Zammad.** Free to self-host under AGPL-3.0 ([GitHub](${SRC.zammadLicence})). Hosted plans start at €7 per agent a month billed yearly, for up to 5 agents, before VAT ([pricing](${SRC.zammad})). Its migrator brings groups, organizations, users and tickets. It runs once, with no catch-up run for tickets that change later, and it needs a Freshdesk plan with API access ([migrator](${SRC.zammadImport})). [Colliedesk vs Zammad](/vs/zammad).
- **Frappe Helpdesk.** Open source under AGPL-3.0 ([licence](${SRC.frappeLicence})). On Frappe Cloud every plan has every feature and unlimited agents; you pay for the site size, from $20 a month ([pricing](${SRC.frappe})). Its pricing page does not mention a Freshdesk import.
- **Chatwoot.** Open source, MIT outside its enterprise folder ([licence](${SRC.chatwootLicence})). It handles live chat, email and messaging apps in one inbox. The free Hacker cloud plan has 2 agents, 500 conversations a month and live chat only; Business is $39 per agent per month ([pricing](${SRC.chatwoot})). Its Freshdesk import works on every plan. It brings contacts and tickets with replies and private notes, but not attachments, up to 30,000 tickets, once ([import guide](${SRC.chatwootImport})). [Colliedesk vs Chatwoot](/vs/chatwoot).

## Lean teams of 3 to 10 agents

- **Colliedesk Cloud.** ${CLOUD_PRICES} AI reply drafts are in every plan, with a monthly allowance. Auto-answer, automations and live chat are not built yet. The first import during the trial extends the trial to 30 days.
- **Zoho Desk.** A free edition for 3 users. Express is $7 per user a month billed annually, or $9 monthly; Standard is $14, or $20 monthly ([pricing](${SRC.zoho})). Zoho offers to move you from another helpdesk for free, with its experts guiding the data migration. [Colliedesk vs Zoho Desk](/vs/zoho-desk).
- **Help Scout.** A free plan for up to 5 users and 1 inbox, without AI. Standard is $25 per user a month billed annually, or $30 monthly. AI answers cost $0.75 per resolution ([pricing](${SRC.helpScout})). Import runs through Import2 on paid plans. It brings tickets with customer profiles and tags, but not users, knowledge base articles, saved replies or custom fields ([import guide](${SRC.helpScoutImport})). [Colliedesk vs Help Scout](/vs/help-scout).
- **Helply (formerly Groove).** One price per plan, by agent count, billed annually: $99 a month for up to 2 agents, $199 for up to 5, $499 for 10. Monthly billing costs more; paying yearly saves 15% ([pricing](${SRC.helply})). It has a self-serve Freshdesk migration for tickets, knowledge and customer data ([migration](${SRC.helplyImport})).

## Larger teams

- **Zendesk.** Suite Team is $55 per agent a month paid yearly, Suite Professional $115 ([pricing](${SRC.zendesk})). There is no import button. You use the Ticket Import API or a Marketplace app or partner, and ticket metrics are not imported ([Zendesk help](${SRC.zendeskImport})). [Colliedesk vs Zendesk](/vs/zendesk).
- **Front.** Starter is $25 per seat a month billed annually for up to 10 seats; Professional is $65 for up to 50 ([pricing](${SRC.front})). Front's own importer costs nothing but is not actively maintained. It brings conversations, contacts, attachments and comments, but not tags or teammates, and only the 9,000 most recent tickets ([import guide](${SRC.frontImport})). [Colliedesk vs Front](/vs/front).
- **HubSpot Service Hub.** Free for up to 2 users. Professional starts at $90 per seat a month, plus a one-time $1,500 onboarding fee ([pricing](${SRC.hubspot})). From Freshdesk it imports knowledge base articles, 400 per import, on Professional and Enterprise ([import guide](${SRC.hubspotImport})). That guide covers no tickets. [Colliedesk vs HubSpot](/vs/hubspot-service-hub).

## Side by side

What 5 agents pay a month, read on each vendor's pricing page on ${READ}. Sources are linked above and listed at the end.

| Helpdesk | 5 agents a month | Hosting | What a Freshdesk import keeps |
|---|---|---|---|
| **Colliedesk** | ${OUR_TABLE_CELL} | Cloud or your server | Tickets with archived ones, replies, notes, attachments, tags, contacts, time entries; reconcile report |
| FreeScout | Free, plus server and paid modules | Your server | Through a paid migration service; ticket numbers not kept |
| Zammad | €35 (Starter, max 5 agents; €7 per agent billed yearly); free self-hosted | Cloud or your server | Groups, organizations, users, tickets; one run |
| Frappe Helpdesk | From $20 for any number of agents; free self-hosted | Cloud or your server | No Freshdesk import on its pricing page |
| Chatwoot | $195 (Business; per agent per month, no annual price listed; read ${READ}) | Cloud or your server | Contacts, tickets, replies, private notes; no attachments; up to 30,000 tickets |
| Zoho Desk | $35 (Express, $7 per user billed annually) | Cloud | Free migration guided by Zoho |
| Help Scout | $125 (Standard, $25 per user billed annually) | Cloud | Tickets, customer profiles, tags; no users, articles, saved replies |
| Helply | $199 (up to 5 agents, billed annually) | Cloud | Tickets, knowledge, customer data |
| Zendesk | $275 (Suite Team, $55 per agent paid yearly) | Cloud | Through the Ticket Import API or a partner; no ticket metrics |
| Front | $125 (Starter, $25 per seat billed annually) | Cloud | Conversations, contacts, attachments, comments; no tags; latest 9,000 tickets |
| HubSpot Service Hub | From $450 (Professional, from $90 per seat), plus $1,500 once | Cloud | Knowledge base articles only |
| Freshdesk, for reference | $275 (Pro, $55 per agent billed annually), plus $29 per agent for Copilot | Cloud | Not needed |

## Migration checklist

1. **Note your renewal date.** Start at least a month before it, so the old and new helpdesk can run side by side.
2. **Count what you have:** tickets, archived tickets, contacts and attachments. Compare the count with the limits above, such as 30,000 tickets for Chatwoot or 9,000 for Front.
3. **Skip the CSV export.** It has no replies or notes, and archived tickets are left out ([export guide](/migrate/freshdesk/export)). Use an importer that reads the Freshdesk API with an admin API key.
4. **Run a test import** in a trial. Open ten old tickets and check replies, notes and attachments.
5. **Compare the counts** in Freshdesk and in the new helpdesk. If one number is off, keep using Freshdesk.
6. **Catch up the tickets that changed** during the move, then forward your support address and close Freshdesk.

The full steps for Colliedesk are in [migrate from Freshdesk](/migrate/freshdesk).

## Where Colliedesk fits

Colliedesk is for **support teams of 3 to 10 agents leaving Freshdesk**, mostly on email, who want one price for the team and their data in an open database. Today it has the email channel, Cc on replies, AI reply drafts and the Freshdesk importer. If you need live chat or automations this week, pick another helpdesk above. If your renewal is months away, [we migrate you for free](/migrate/freshdesk/done-for-you) on the Founding plan.

## Sources

Read on ${READ}:

- Freshdesk: [pricing](${SRC.freshdesk}); past prices on [Freshdesk price history](/freshdesk-pricing-history).
- Zammad: [pricing](${SRC.zammad}), [Freshdesk migrator](${SRC.zammadImport}), [licence](${SRC.zammadLicence}).
- Frappe Helpdesk: [pricing](${SRC.frappe}), [licence](${SRC.frappeLicence}).
- FreeScout: [GitHub](${SRC.freescout}), [modules](${SRC.freescoutModules}), [migration guide](${SRC.freescoutImport}).
- Chatwoot: [pricing](${SRC.chatwoot}), [Freshdesk import](${SRC.chatwootImport}), [licence](${SRC.chatwootLicence}).
- Zoho Desk: [pricing](${SRC.zoho}).
- Help Scout: [pricing](${SRC.helpScout}), [import](${SRC.helpScoutImport}).
- Helply: [pricing](${SRC.helply}), [Freshdesk migration](${SRC.helplyImport}).
- Zendesk: [pricing](${SRC.zendesk}), [migration help](${SRC.zendeskImport}).
- Front: [pricing](${SRC.front}), [import](${SRC.frontImport}).
- HubSpot Service Hub: [pricing](${SRC.hubspot}), [knowledge base import](${SRC.hubspotImport}).`;

const page: Page = {
  jsonLd: [],
  name: 'Freshdesk alternatives',
  path: '/freshdesk-alternative',
  updated: '2026-11-23',
  section: 'Compare',
  title: '11 Freshdesk alternatives (2026) and what each import keeps',
  description:
    '11 Freshdesk alternatives by team size: free and open source, 3 to 10 agents, larger teams. What 5 agents pay, and what each Freshdesk import keeps.',
  summary:
    '11 Freshdesk alternatives in three groups (free and open source, 3 to 10 agents, larger teams): what 5 agents pay, hosting, what each import keeps, a migration checklist',
  eyebrow: `Compare · Prices read ${READ}`,
  h1: '11 Freshdesk alternatives by team size, and which tickets each import keeps',
  lede: `To pay no licence fee, run FreeScout, Zammad or Colliedesk on your own server. For 3 to 10 agents, pick one price for the whole team, such as ${OURS}; larger teams look at Zendesk, Front and HubSpot.`,
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
