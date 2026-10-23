const PRICES_READ = '16 October 2026';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { collieFacts as c, statusTable } from './collie-status';

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
    q: 'Should I pick FreeScout or Colliedesk?',
    a: 'FreeScout if you want a proven, lightweight PHP helpdesk that runs even on shared hosting, and you are happy to buy modules. Colliedesk if you want every feature in the free code, a hosted option at a flat price, and a Freshdesk importer with a reconcile report (available now).',
  },
];

const body = `## The short answer

- **Choose FreeScout** if you want a mature, self-hosted helpdesk in the style of Help Scout, you already run PHP, and you are fine buying modules for the knowledge base, live chat, tags or workflows.
- **Choose Colliedesk** if you want every feature in the open-source code, an official hosted option at one flat price, and a Freshdesk importer that proves nothing was lost. Colliedesk is alpha; read the status table first.

## Side by side

| | FreeScout | Colliedesk |
|---|---|---|
| Licence | AGPL-3.0 | ${c.source} |
| Self-host | Free core, unlimited agents; paid modules with lifetime licences per instance | ${c.free} |
| Official hosting | None; the FreeScout wiki lists third-party hosts | ${c.price} |
| Stack | PHP 8.2+ (Laravel) with MySQL, MariaDB or PostgreSQL; runs on shared hosting | One container plus PostgreSQL 16+ |
| Knowledge base, live chat, tags, workflows | Paid modules | Tags and knowledge base shipped; automations and live chat later, all in the free code |
| AI | Free AI Integration module | ${c.ai} |

## Moving from Freshdesk

| | FreeScout | Colliedesk (**Shipped**) |
|---|---|---|
| Importer | No official one. Third-party paid service, or a community module "not guaranteed" by the FreeScout team | Official importer, free on every install |
| Attachments | Depends on the tool | Downloaded and checksummed (SHA-256) |
| Proof that nothing was lost | Not described | Reconcile report |
| Done for you | Through the third-party service, priced by them | [Free for founding customers](/migrate/freshdesk/done-for-you) |

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}.

- FreeScout: [freescout.net](https://freescout.net)
- Modules and licence terms: [freescout.net/modules](https://freescout.net/modules/)
- Hosting options: [FreeScout wiki, one-click installs](https://github.com/freescout-help-desk/freescout/wiki/One-Click-Installs)
- Migration: [FreeScout wiki, migrate to FreeScout](https://github.com/freescout-help-desk/freescout/wiki/Migrate-to-FreeScout)
- Community modules: [FreeScout wiki, community modules](https://github.com/freescout-help-desk/freescout/wiki/Community-Modules)
- Requirements: [FreeScout installation guide](https://github.com/freescout-help-desk/freescout/wiki/Installation-Guide)`;

const page: Page = {
  jsonLd: [],
  path: '/vs/freescout',
  updated: '2026-10-16',
  section: 'Compare',
  title: 'Colliedesk vs FreeScout: two AGPL helpdesks, paid modules vs every feature free',
  description:
    'Colliedesk vs FreeScout, both AGPL-3.0: FreeScout sells modules and has no official cloud; Colliedesk ships every feature free and offers flat-priced hosting (Team $69 a month for up to 10 agents). Freshdesk import compared.',
  summary: 'FreeScout free core plus paid modules, no official cloud or Freshdesk importer vs Colliedesk every feature free, flat-priced Cloud (Team $69), importer available now (alpha)',
  eyebrow: 'Compare · Open source',
  h1: 'Colliedesk vs FreeScout',
  lede: 'Both are open source under AGPL-3.0. FreeScout is a lightweight PHP helpdesk with paid modules. Colliedesk keeps every feature in the free code. Here is the difference, with sources.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
