import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { factText, readOnLabel, sourcesMd } from '../../lib/competitor';
import { collieFacts as c, statusTable } from './collie-status';
import { TEAM } from '../../lib/site';
import { OURS } from '../competitors/colliedesk';
import { freescout as fs } from '../competitors/freescout';
import { FOUNDING_ACTION, OUR_PLAN, OUR_PRICE, withFoundingLead } from '../../lib/cloud-price';

const PRICES_READ = readOnLabel(fs.readOn);
const fact = (key: string): string => factText(fs, key);
const licence = fs.facts.license.text;

const faq: Faq[] = [
  {
    q: 'Is FreeScout really free?',
    a: `The core is free under ${licence}, with unlimited agents, tickets and mailboxes. Features such as the knowledge base, live chat, tags and workflows are paid modules, sold as lifetime licences per instance. There is no official FreeScout cloud; third-party hosts run it for you.`,
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
- **Choose Colliedesk** if you want every feature in the open-source code, an official hosted option at one flat price, and a Freshdesk importer that proves nothing was lost. Colliedesk is generally available; read the status table for what is not built yet.

## Side by side

| Topic | FreeScout | Colliedesk |
|---|---|---|
| Licence | ${licence} | ${c.source} |
| Self-host | ${fs.facts.free.text} | ${c.free} |
| Official hosting | ${fact('hosting')} | ${c.price} |
| Stack | ${fact('stack')} | One container plus ${OURS.postgres} |
| Knowledge base, live chat, tags, workflows | ${fact('modules')} | Tags and knowledge base shipped; automations and live chat later, all in the free code |
| AI | ${fs.facts.ai.text} | ${c.ai} |

## Moving from Freshdesk

| Import | FreeScout | Colliedesk (**Shipped**) |
|---|---|---|
| Importer | ${fact('importer')} | Official importer, free on every install |
| Attachments | ${fact('importAttachments')} | Downloaded and checksummed (${OURS.checksum}) |
| Proof that nothing was lost | ${fact('importProof')} | Reconcile report |
| Done for you | ${fact('importDoneForYou')} | [Free for founding customers](/migrate/freshdesk/done-for-you) |

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}.

${sourcesMd(fs)}`;

const page: Page = {
  jsonLd: [],
  path: '/vs/freescout',
  updated: '2026-10-16',
  section: 'Compare',
  title: `Colliedesk vs FreeScout: two AGPL helpdesks, paid modules vs every feature free`,
  description:
    `Colliedesk vs FreeScout, both ${licence}: FreeScout sells modules and has no official cloud; Colliedesk ships every feature free and offers flat-priced hosting (${OUR_PLAN} ${OUR_PRICE} for up to ${TEAM.agents} agents). Freshdesk import compared.`,
  summary: `FreeScout free core plus paid modules, no official cloud or Freshdesk importer vs Colliedesk every feature free, flat-priced Cloud (${OUR_PLAN} ${OUR_PRICE}), importer available now`,
  eyebrow: 'Compare · Open source',
  h1: 'Colliedesk vs FreeScout',
  lede: withFoundingLead(`Both are open source under ${licence}. FreeScout is a lightweight PHP helpdesk with paid modules. Colliedesk keeps every feature in the free code. Here is the difference, with sources.`),
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
