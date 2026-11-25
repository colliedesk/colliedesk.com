const PRICES_READ = '25 November 2026';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { collieFacts as c, statusTable } from './collie-status';
import { FOUNDING_ACTION, OUR_PLAN, OUR_PRICE } from '../../lib/cloud-price';

const faq: Faq[] = [
  {
    q: 'Is FreeScout really free?',
    a: 'The core is free under AGPL-3.0, with unlimited agents, tickets and mailboxes. Features such as the knowledge base, live chat, tags and workflows are paid modules, sold as lifetime licences per instance. There is no official FreeScout cloud; third-party hosts run it for you.',
  },
  {
    q: 'Can FreeScout import from Freshdesk?',
    a: 'Not with an official importer. FreeScout points to a third-party paid migration service, and its wiki lists a community "Freshdesk Import" module with the warning that community modules are not guaranteed to be reliable and secure.',
  },
  {
    q: 'Can FreeScout import users?',
    a: 'Agents, yes, if you run Active Directory, OpenLDAP or FreeIPA: the paid LDAP Integration module imports and syncs them. It needs the PHP LDAP extension, and each user needs an email attribute and the person or inetOrgPerson class. Without LDAP you create agents by hand, or through the API with the paid API & Webhooks module, which creates regular users only, never admins. Customers come in from a CSV file with the paid Customers Management (CRM) module.',
  },
  {
    q: 'Should I pick FreeScout or Colliedesk?',
    a: 'FreeScout if you want a proven, lightweight PHP helpdesk that runs even on shared hosting, and you are happy to buy modules. Colliedesk if you want every feature in the free code, a hosted option at a flat price, and a Freshdesk importer with a reconcile report (available now).',
  },
];

const body = `## The short answer

- **Choose FreeScout** if you want a mature, self-hosted helpdesk in the style of Help Scout, you already run PHP, and you are fine buying modules for the knowledge base, live chat, tags or workflows.
- **Choose Colliedesk** if you want every feature in the open-source code, an official hosted option at one flat price, and a Freshdesk importer that proves nothing was lost. Colliedesk is generally available; read the status table for what is not built yet.

## Side by side

| Topic | FreeScout | Colliedesk |
|---|---|---|
| Licence | AGPL-3.0 | ${c.source} |
| Self-host | Free core, unlimited agents; paid modules with lifetime licences per instance | ${c.free} |
| Official hosting | None; the FreeScout wiki lists third-party hosts | ${c.price} |
| Stack | PHP 7.4 to 8.x, not 8.1 (Laravel) with MySQL, MariaDB or PostgreSQL; runs on shared hosting | One container plus PostgreSQL 19+ |
| Knowledge base, live chat, tags, workflows | Paid modules | Tags and knowledge base shipped; automations and live chat later, all in the free code |
| AI | Free AI Integration module | ${c.ai} |

## Importing into FreeScout: users, mailboxes and old tickets

FreeScout has no importer of its own for another helpdesk: for old tickets, its wiki sends you to Help Desk Migration, a paid third-party service. Agents, customers and old email each take a different route, and most routes need a paid module.

| What you bring in | How FreeScout does it | What it needs |
|---|---|---|
| Agents (users) | Create them by hand, or import and sync them from Active Directory, OpenLDAP or FreeIPA | LDAP Integration module (paid) and the PHP LDAP extension on the server. Agents only, each with an email attribute and the person or inetOrgPerson class |
| Agents through the API | \`POST /api/users\` creates regular users, never admins. No invite email goes out, and the new user can open no mailbox until you grant it | API & Webhooks module (paid) |
| Mailboxes | Set up each one by hand. The API lists mailboxes, their folders and their custom fields; it has no call that creates one | Nothing extra |
| Customers | Import a CSV file, custom fields included | Customers Management (CRM) module (paid) |
| Old email in the support mailbox | Manage » System » Tools fetches all unread email; FreeScout's FAQ says a large fetch from there hits a 504 Gateway Time-out and sends you to the console command. The console command \`php artisan freescout:fetch-emails --days=3 --unseen=0\` fetches all email of the last 3 days, read or not. To keep the original dates, set \`APP_USE_MAIL_DATE_ON_FETCHING=true\` in \`.env\` and clear the cache, fetch, then remove it and clear the cache again | Nothing extra. Background fetching takes unread email only |
| Tickets from another helpdesk | Help Desk Migration: a free demo, then a paid full run | The latest API & Webhooks module (paid); the Custom Fields and Tags modules (paid) to bring those along |
| Tickets through your own script | \`POST /api/conversations\` with \`"imported": true\` sends no email, notification or auto reply, and takes the old \`createdAt\` and \`closedAt\` | API & Webhooks module (paid) |

### The migration order in FreeScout's wiki

1. Install the latest API & Webhooks module. FreeScout warns that an older version may break the migration.
2. Add the Custom Fields and Tags modules if you want those along, and create the custom fields by hand.
3. Create your agents by hand. Pick a default agent for tickets of inactive or deleted agents.
4. In the Help Desk Migration wizard, pick your old helpdesk as the source and FreeScout as the target, with its URL and API key.
5. Map type Chat to Email, and status Open to Active.
6. Run the free demo on a small set, check it in FreeScout, and fix the mapping.
7. Pay, then run the full migration. Change nothing in FreeScout while it runs.

Two things do not come across: the old ticket numbers, and the link to chat customers, so a reply to an imported chat never reaches them. Coming from Help Scout, FreeScout's Community Modules wiki also lists a "Help Scout to FreeScout Migration" module; FreeScout says it cannot guarantee community modules are 100% reliable and secure.

## Moving from Freshdesk

| Import | FreeScout | Colliedesk (**Shipped**) |
|---|---|---|
| Importer | No official one. Third-party paid service, or a community module "not guaranteed" by the FreeScout team | Official importer, free on every install |
| Attachments | Not described in FreeScout's migration wiki | Downloaded and checksummed (SHA-256) |
| Proof that nothing was lost | Not described | Reconcile report |
| Done for you | Through the third-party service, priced by them | [Free for founding customers](/migrate/freshdesk/done-for-you) |

A Freshdesk import into Colliedesk takes 6 steps, from counting your tickets to closing Freshdesk once the reconcile report matches. [Read the 6 steps](/migrate/freshdesk).

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}.

- FreeScout: [freescout.net](https://freescout.net)
- Modules and licence terms: [freescout.net/modules](https://freescout.net/modules/)
- Hosting options: [FreeScout wiki, one-click installs](https://github.com/freescout-help-desk/freescout/wiki/One-Click-Installs)
- Migration: [FreeScout wiki, migrate to FreeScout](https://github.com/freescout-help-desk/freescout/wiki/Migrate-to-FreeScout)
- Importing users: [LDAP Integration module](https://freescout.net/module/ldap/)
- Importing customers: [Customers Management (CRM) module](https://freescout.net/module/crm/)
- API, users, mailboxes and imported conversations: [API & Webhooks module](https://freescout.net/module/api-webhooks/) and [FreeScout API docs](https://api-docs.freescout.net/)
- Fetching old email with its dates: [FreeScout wiki, FAQ](https://github.com/freescout-help-desk/freescout/wiki/FAQ), [fetching emails](https://github.com/freescout-help-desk/freescout/wiki/Fetching-Emails) and [console commands](https://github.com/freescout-help-desk/freescout/wiki/Console-Commands)
- Community modules: [FreeScout wiki, community modules](https://github.com/freescout-help-desk/freescout/wiki/Community-Modules)
- Requirements: [FreeScout README](https://github.com/freescout-help-desk/freescout#requirements) and [installation guide](https://github.com/freescout-help-desk/freescout/wiki/Installation-Guide)`;

const page: Page = {
  jsonLd: [],
  path: '/vs/freescout',
  updated: '2026-11-25',
  section: 'Compare',
  title: 'FreeScout vs Colliedesk: imports, paid Tags, free code',
  description:
    `Both AGPL-3.0: FreeScout sells modules, no official cloud; Colliedesk has every feature free and ${OUR_PLAN} hosting at ${OUR_PRICE}, up to 10 agents.`,
  summary: `FreeScout free core plus paid modules, no official cloud or Freshdesk importer vs Colliedesk every feature free, flat-priced Cloud (${OUR_PLAN} ${OUR_PRICE}), importer available now`,
  eyebrow: 'Compare · Open source',
  h1: 'Colliedesk vs FreeScout: tags and a knowledge base as paid modules, or in the free code',
  lede: 'Both are open source under AGPL-3.0. FreeScout runs even on shared hosting, sells modules such as Tags or Live Chat, and its wiki sends old tickets from most helpdesks through a paid third-party service. Colliedesk keeps every feature in the free code, its Freshdesk importer included.',
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
