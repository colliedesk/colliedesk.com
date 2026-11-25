// Every competitor price, limit and import claim below was read on the vendor's own page on this date,
// from a US connection. Zammad lists euros; the others list US dollars.
const READ = '25 November 2026';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { TEAM, TRIAL_HREF, dollars } from '../../lib/site';
import { FOUNDING_ACTION, FOUNDING_OPEN, foundingFirst } from '../../lib/cloud-price';

const SRC = {
  zendesk: 'https://www.zendesk.com/pricing/',
  zendeskTokens:
    'https://support.zendesk.com/hc/en-us/articles/10840968198042-Announcing-the-removal-of-API-tokens-as-an-authentication-method-for-API-requests',
  zendeskExport:
    'https://support.zendesk.com/hc/en-us/articles/4408886165402-Exporting-ticket-user-or-organization-data-from-your-account',
  freescout: 'https://github.com/freescout-help-desk/freescout',
  freescoutImport: 'https://github.com/freescout-help-desk/freescout/wiki/Migrate-to-FreeScout',
  zammad: 'https://zammad.com/en/pricing',
  zammadImport: 'https://docs.zammad.org/en/latest/migration/zendesk.html',
  zammadLicence: 'https://github.com/zammad/zammad',
  chatwoot: 'https://www.chatwoot.com/pricing',
  chatwootImport: 'https://www.chatwoot.com/hc/user-guide/articles/1696162432-how-to-migrate-from-zendesk-to-chatwoot',
  chatwootSelf: 'https://www.chatwoot.com/pricing/self-hosted-plans/',
  chatwootLicence: 'https://github.com/chatwoot/chatwoot/blob/develop/LICENSE',
  zoho: 'https://www.zoho.com/desk/pricing.html',
  zohoExpress: 'https://www.zoho.com/desk/express/',
  freshdesk: 'https://www.freshworks.com/freshdesk/pricing/',
  freshdeskImport: 'https://www.freshworks.com/helpdesk/migration/',
  helpScout: 'https://www.helpscout.com/pricing/',
  helpScoutImport: 'https://docs.helpscout.com/article/1495-import-emails-or-tickets-into-help-scout',
  helpScoutZendesk: 'https://docs.helpscout.com/article/279-move-from-zendesk-to-help-scout',
  front: 'https://front.com/pricing',
  frontImport: 'https://help.front.com/en/articles/2203',
  gorgias: 'https://www.gorgias.com/pricing',
  gorgiasImport: 'https://docs.gorgias.com/en-US/import-zendesk-data-into-gorgias-214412',
  gorgiasImported: 'https://docs.gorgias.com/en-US/zendesk-migration-101-214413',
} as const;

// What 5 agents pay on Colliedesk Cloud today: Founding while its places last, then Team.
const OURS_5 = FOUNDING_OPEN
  ? '$33 a month on Colliedesk Founding ($99 every 3 months, for up to 10 agents, 10 places only)'
  : `${dollars(TEAM.monthly)} a month on Colliedesk Team (up to 10 agents)`;
const OUR_CELL = FOUNDING_OPEN
  ? `$33 (Founding, $99 every 3 months for up to 10 agents); after the 10 places, ${dollars(TEAM.monthly)} (Team); free self-hosted`
  : `${dollars(TEAM.monthly)} (Team, up to 10 agents); free self-hosted`;
const HOSTED_LINE = FOUNDING_OPEN
  ? `${OURS_5}, $35 on Zoho Desk Express and €35 on Zammad Starter, both billed yearly`
  : `$35 on Zoho Desk Express and €35 on Zammad Starter, both billed yearly, or ${OURS_5}`;

// The short form for the lede; the conditions are in the table.
const LEDE_HOSTED = FOUNDING_OPEN
  ? '$33 a month on Colliedesk Founding ($99 a quarter, 10 places), $35 on Zoho Desk Express or €35 plus VAT on Zammad, both billed yearly'
  : `${dollars(TEAM.monthly)} a month on Colliedesk Team, $35 on Zoho Desk Express or €35 plus VAT on Zammad, the last two billed yearly`;
// The lowest paid hosted price for 5 agents, for the title-like H1.
const LOWEST_HOSTED = FOUNDING_OPEN ? '$33' : '$35';

const faq: Faq[] = [
  {
    q: 'What is the cheapest Zendesk alternative for a 5-person team?',
    a: `With no licence fee, an open-source helpdesk on your own server: Colliedesk, FreeScout, Zammad or the Chatwoot Community Edition. You pay for the server and the time to run it. Help Scout Free is $0 for 5 users with 1 inbox and 25 contacts a month ([pricing](${SRC.helpScout})). On a paid hosted plan, 5 agents pay ${HOSTED_LINE} (Zammad before VAT). Zendesk Suite Team is $55 per agent paid yearly, $275 for 5 ([Zendesk pricing](${SRC.zendesk}), read ${READ}).`,
  },
  {
    q: 'Is there a free open-source Zendesk alternative?',
    a: `Yes. FreeScout and Zammad are AGPL-3.0, and so is Colliedesk, which you can self-host with every feature. Chatwoot is MIT outside its enterprise folder ([licence](${SRC.chatwootLicence})), and its self-hosted Community Edition is $0 ([self-hosted plans](${SRC.chatwootSelf})). Three hosted plans are free with limits: [Help Scout Free](${SRC.helpScout}) (5 users, 1 inbox, 25 contacts a month), [Zoho Desk](${SRC.zoho}) Free (3 users) and [Chatwoot](${SRC.chatwoot}) Hacker (2 agents, 500 conversations a month, live chat only).`,
  },
  {
    q: 'Can I keep my Zendesk ticket history when I switch?',
    a: `Yes, if you export it before you cancel. The Zendesk CSV export has no comments. The JSON and XML exports have them (JSON drops comments on a ticket over 1 MB), but they are off until Zendesk Support turns them on, and they are not on Team plans ([Zendesk export](${SRC.zendeskExport})). The API works on every plan. [Export Zendesk tickets with comments](/migrate/zendesk/export) has the steps and a script.`,
  },
  {
    q: 'Does Colliedesk import from Zendesk?',
    a: 'Not yet. Colliedesk imports from Freshdesk and Help Scout today, and a Zendesk importer is on the [roadmap](/roadmap) for later. Until then, export your Zendesk data as a backup and start fresh on Colliedesk.',
  },
];

const body = `Prices below are list prices for 5 agents a month, read on each vendor's own pricing page on ${READ}. Sources are linked in each row and listed at the end.

## What to check before you pick

1. **The bill at 5 agents.** A per-agent price is multiplied by 5. A flat price stays the same up to the plan's agent limit. [Helpdesks with flat pricing](/helpdesk-flat-pricing) compares seven of them.
2. **Hosted or your own server.** Open-source helpdesks cost no licence fee on your own server. Read [self-hosted helpdesks](/self-hosted-helpdesk) for the work that takes.
3. **The AI bill.** Some vendors charge AI per agent, others per answer or per conversation. Read the AI line, not only the plan price.
4. **How your tickets get out of Zendesk.** It decides what you keep. Read [the export checklist](#before-you-switch-the-zendesk-export) below first.
5. **Your Zendesk API token.** The Zammad, Front and Gorgias importers ask for one, and Zendesk no longer issues new ones.

## The bill for 5 agents, side by side

| Helpdesk | 5 agents a month | Hosting | Import from Zendesk |
|---|---|---|---|
| **Colliedesk** | ${OUR_CELL} | Cloud or your server | **No Zendesk importer yet.** [Export your data](/migrate/zendesk/export) and start fresh |
| [FreeScout](${SRC.freescout}) | $0, plus your server | Your server | Through a paid migration service; [ticket numbers not kept](${SRC.freescoutImport}) |
| [Zammad](${SRC.zammad}) | €35 (Starter, €7 per agent billed yearly, max 5 agents, before VAT); free self-hosted | Cloud or your server | [Built-in migrator](${SRC.zammadImport}), one run, asks for a Zendesk API key |
| [Chatwoot](${SRC.chatwoot}) | $95 (Startups, $19 per agent); [free self-hosted](${SRC.chatwootSelf}) (Community Edition) | Cloud or your server | [Contacts by CSV, conversations through its API](${SRC.chatwootImport}) |
| [Zoho Desk](${SRC.zohoExpress}) | $35 (Express, $7 per user billed yearly, max 5 users) | Cloud | [Free migration guided by Zoho](${SRC.zoho}) |
| [Freshdesk](${SRC.freshdesk}) | $95 (Growth, $19 per agent billed yearly) | Cloud | [Through a migration service](${SRC.freshdeskImport}) such as Help Desk Migration |
| [Gorgias](${SRC.gorgias}) | $90 (Basic, billed monthly, 300 tickets a month) | Cloud | [Built in](${SRC.gorgiasImport}), up to 2 years of tickets; needs an active Zendesk API token |
| [Help Scout](${SRC.helpScout}) | $125 (Standard, $25 per user billed yearly) | Cloud | [Import2](${SRC.helpScoutImport}): tickets, customers, tags |
| [Front](${SRC.front}) | $125 (Starter, $25 per seat billed yearly) | Cloud | [Free importer, not actively maintained](${SRC.frontImport}), asks for a Zendesk API token; no tags |
| Zendesk, for reference | $95 (Support Team, $19 per agent) or $275 (Suite Team, $55 per agent), both paid yearly | Cloud | Not needed |

Not in the table: Help Scout Free costs $0 for 5 users, with 1 inbox and 25 contacts a month. See what one Colliedesk price covers for your team on [Colliedesk pricing](/pricing).

## Free and open source

These cost no licence fee on your own server. See [Colliedesk open source](/open-source) for its licence.

- **Colliedesk, self-hosted.** Free, with every feature, under AGPL-3.0. It runs as one container plus PostgreSQL ([self-hosted helpdesk](/self-hosted-helpdesk)).
- **FreeScout.** AGPL-3.0, PHP and MySQL, and it runs on shared hosting, with unlimited agents, tickets and mailboxes ([GitHub](${SRC.freescout})). To move from Zendesk, its wiki points to Help Desk Migration: the demo is free, the full run is paid. Ticket numbers are not kept, and you create agents by hand ([migration guide](${SRC.freescoutImport})).
- **Zammad.** AGPL-3.0 ([GitHub](${SRC.zammadLicence})). Hosted Starter is €7 per agent a month billed yearly or €9 monthly, for up to 5 agents, before VAT ([pricing](${SRC.zammad})). Its Zendesk migrator runs once, with no catch-up run, and needs a Zendesk plan with API support ([migrator](${SRC.zammadImport})).
- **Chatwoot.** MIT outside its enterprise folder ([licence](${SRC.chatwootLicence})). The self-hosted Community Edition is $0, without Captain AI or roles and permissions ([self-hosted plans](${SRC.chatwootSelf})). The free Hacker cloud plan has up to 2 agents, 500 conversations a month, live chat only and 30 days of data. Startups is $19 per agent a month, with 300 Captain AI credits ([pricing](${SRC.chatwoot})). From Zendesk you upload contacts as a CSV and bring conversations through its API yourself ([Zendesk guide](${SRC.chatwootImport})).

## Hosted, on a budget

- **Colliedesk Cloud.** ${foundingFirst(`Team is ${dollars(TEAM.monthly)} a month for up to 10 agents.`)} AI reply drafts are in every plan, with a monthly allowance. It has the email channel today. Live chat, automations, macros and CSAT are not built yet.
- **Zoho Desk.** Express is $7 per user a month billed yearly, or $9 monthly, for up to 5 users ([Express](${SRC.zohoExpress})). The Free edition has 3 users. Zoho offers to guide your move from another helpdesk for free ([pricing](${SRC.zoho})).
- **Freshdesk.** Growth is $19 per agent a month billed yearly, with 500 free AI agent sessions once per account, then $49 per 100 ([pricing](${SRC.freshdesk})). Its migration guide points to automated services such as Help Desk Migration ([migration guide](${SRC.freshdeskImport})). Leaving Freshdesk instead? Read [Freshdesk alternatives](/freshdesk-alternative).

## Email-first teams

- **Help Scout.** Free for 5 users, 1 inbox and 25 contacts a month. Standard is $25 per user a month billed yearly, or $30 monthly. AI answers cost $0.75 per resolution ([pricing](${SRC.helpScout})). Import2 runs on Standard, Plus and Pro. It brings tickets with customer profiles and tags, but not users, saved replies or rules. Started from inside Help Scout, an import of up to 500,000 records is free. A larger one is billed at $500 per 500,000 records, the first 500,000 included ([import guide](${SRC.helpScoutImport})). Help center articles from Zendesk need an older tool; ask Help Scout before you start ([Zendesk guide](${SRC.helpScoutZendesk})).
- **Front.** Starter is $25 per seat a month billed yearly, for up to 10 seats. Copilot is a $20 per seat add-on ([pricing](${SRC.front})). Front's own Zendesk importer costs nothing but is not actively maintained; Front recommends Help Desk Migration or ClonePartner. It brings inboxes, contacts, conversations, attachments and comments, but not tags or rules. Its steps start by creating a Zendesk API token ([import guide](${SRC.frontImport})).

## E-commerce

- **Gorgias.** One price per ticket volume, not per agent. Starter is $40 a month for 50 tickets and 3 user seats, so a team of 5 starts on Basic: $90 a month for 300 tickets, billed monthly ([pricing](${SRC.gorgias})). Its Zendesk import works on every plan. It brings up to 2 years of tickets, with macros, customers, users and tags, and syncs new tickets every 5 minutes until you pause it. Attachments stay as links to files in Zendesk ([what it imports](${SRC.gorgiasImported})). You need a Zendesk API token that is still active ([import guide](${SRC.gorgiasImport})).

## Before you switch: the Zendesk export

1. **Count your tickets** in Zendesk, closed ones included.
2. **Check your plan.** The JSON, CSV and XML exports are not on Team plans. On other plans the account owner asks Zendesk Support to turn them on ([Zendesk export](${SRC.zendeskExport})).
3. **Skip the CSV.** It has no ticket comments, so it cannot carry a conversation.
4. **Check your API token** if your next helpdesk asks for one. Since 27 October 2026 no account can create a new token. An existing token keeps working until 30 April 2027, if it is used at least once every 30 days ([Zendesk announcement](${SRC.zendeskTokens})).
5. **Export through the API** on any plan. [Export Zendesk tickets with comments](/migrate/zendesk/export) has a script that uses an OAuth token instead.
6. **Compare the counts** in your export and in Zendesk before you cancel.

## Where Colliedesk fits

Colliedesk is for **support teams of 3 to 10 agents, mostly on email**, who want one price for the team and their data in an open database. It does not import from Zendesk yet. If you need your Zendesk history inside the new helpdesk on day one, pick one with a Zendesk import above. If a fresh start works for you, first [export every Zendesk comment with the 41-line script](/migrate/zendesk/export), then [open a Colliedesk workspace for 14 days, no card](${TRIAL_HREF}) and forward your support address to it. Prices for your team size are on [Colliedesk pricing](/pricing). Comparing the two products feature by feature? Read [Colliedesk vs Zendesk](/vs/zendesk).

## Sources

Read on ${READ}:

- Zendesk: [pricing](${SRC.zendesk}), [data export](${SRC.zendeskExport}), [API token removal](${SRC.zendeskTokens}).
- FreeScout: [GitHub](${SRC.freescout}), [migration guide](${SRC.freescoutImport}).
- Zammad: [pricing](${SRC.zammad}), [Zendesk migrator](${SRC.zammadImport}), [licence](${SRC.zammadLicence}).
- Chatwoot: [pricing](${SRC.chatwoot}), [self-hosted plans](${SRC.chatwootSelf}), [Zendesk guide](${SRC.chatwootImport}), [licence](${SRC.chatwootLicence}).
- Zoho Desk: [pricing](${SRC.zoho}), [Express](${SRC.zohoExpress}).
- Freshdesk: [pricing](${SRC.freshdesk}), [migration guide](${SRC.freshdeskImport}).
- Help Scout: [pricing](${SRC.helpScout}), [import guide](${SRC.helpScoutImport}), [moving from Zendesk](${SRC.helpScoutZendesk}).
- Front: [pricing](${SRC.front}), [Zendesk import](${SRC.frontImport}).
- Gorgias: [pricing](${SRC.gorgias}), [Zendesk import](${SRC.gorgiasImport}), [what it imports](${SRC.gorgiasImported}).`;

const page: Page = {
  jsonLd: [],
  name: 'Zendesk alternatives',
  path: '/zendesk-alternative',
  updated: '2026-11-25',
  section: 'Compare',
  title: 'Cheapest Zendesk alternatives for small teams: 5 are free',
  description:
    'What 5 agents pay a month on 9 Zendesk alternatives, free and open source first, each price sourced, and what each Zendesk import brings over.',
  summary:
    '9 Zendesk alternatives for small teams: what 5 agents pay a month with a source per price, a free and open-source group, what each Zendesk import brings, and the export checklist',
  eyebrow: `Compare · Prices read ${READ}`,
  h1: `9 Zendesk alternatives for 5 agents: $0 self-hosted, ${LOWEST_HOSTED} hosted, and their imports`,
  lede: `Five Zendesk alternatives are free for 5 agents: Help Scout Free (25 contacts a month), and Colliedesk, FreeScout, Zammad or Chatwoot self-hosted. Paid and hosted: ${LEDE_HOSTED}. Colliedesk has no Zendesk importer yet.`,
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
