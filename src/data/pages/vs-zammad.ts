import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { eur, factText, readOnLabel, sourcesMd } from '../../lib/competitor';
import { collieFacts as c, statusTable } from './collie-status';
import { AI_EXTRA, FOUNDING_AGENTS, TEAM } from '../../lib/site';
import { OURS } from '../competitors/colliedesk';
import { price, range, zammad as z } from '../competitors/zammad';
import { FOUNDING_ACTION, OUR_CELL, OUR_PLAN, OUR_PRICE, withFoundingLead } from '../../lib/cloud-price';

const PRICES_READ = readOnLabel(z.readOn);
const perAgentRange = `${eur(price.starter.low)}–${price.plus.high}`;
const perCall = `${eur(price.aiCall)} per AI call`;
const pro = price.professional;
const fact = (key: string): string => factText(z, key);
const [FIVE, TEN] = [5, 10];

const faq: Faq[] = [
  {
    q: 'Is Colliedesk or Zammad better for leaving Freshdesk today?',
    a: 'Zammad, if you need its mature feature set today: its Freshdesk migrator is released and self-serve. Colliedesk is generally available and its Freshdesk importer is available now. Choose Colliedesk if you want a flat price, AI drafts included and a reconcile report that proves every record arrived, and you do not need what the status table marks as not built yet.',
  },
  {
    q: 'How much does hosted Zammad cost?',
    a: `On the Zammad pricing page read on ${PRICES_READ}: Starter ${range(price.starter)} per agent per month (up to ${price.starter.maxAgents} agents), Professional ${range(pro)} (up to ${pro.maxAgents} agents), Plus ${range(price.plus)} (unlimited agents), depending on annual or monthly billing. AI features cost ${eur(price.aiCall)} per AI call.`,
  },
  {
    q: 'Are Zammad and Colliedesk both open source?',
    a: `Yes. Both are licensed ${z.facts.license.text} and free to self-host. Zammad is ${fact('stack')}. Colliedesk is one server container plus PostgreSQL.`,
  },
];

const body = `## The short answer

- **Choose Zammad** if you need a mature open-source helpdesk now: many channels (email, chat, Telegram, Facebook, WhatsApp, SMS, phone), SLAs, a knowledge base, and a released Freshdesk migrator.
- **Choose Colliedesk** if your team is ${FOUNDING_AGENTS} agents and you want one flat price instead of per-agent fees, AI without a per-call fee on top, and an import that proves nothing was lost. Colliedesk is generally available; read the status table for what is not built yet.

## Price, side by side

Zammad hosted prices are in euros, per agent per month, excluding VAT, as published on ${PRICES_READ}. The lower figure is billed annually.

| Topic | Zammad | Colliedesk |
|---|---|---|
| Hosted plans | ${z.facts.plans.text} | ${c.price} |
| AI | ${z.facts.ai.text} | ${c.ai} |
| Self-host | ${z.facts.free.text} | ${c.free} |
| Licence | ${z.facts.license.text} | ${c.source} |

### What five agents pay

| Team | Zammad Professional (hosted) | Colliedesk Cloud |
|---|---|---|
${[FIVE, TEN].map((n) => `| ${n} agents | ${n} × ${range(pro)} = **${eur(n * pro.low)}–${n * pro.high} per month** + ${perCall} | ${OUR_CELL} + ${AI_EXTRA} |`).join('\n')}

## Moving from Freshdesk

Zammad is ahead here, and we say so.

| Import | Zammad migrator | Colliedesk importer (**Shipped**) |
|---|---|---|
| Status | ${fact('migrationStatus')} | Shipped, generally available |
| Imports | ${fact('migrationImports')} | Tickets (archived ones included), replies, notes, attachments, tags, contacts, companies, time entries |
| Into an existing instance | ${fact('migrationExisting')} | Into one workspace |
| Catch-up after the first run | ${fact('migrationCatchUp')} | Yes, \`--since\` |
| Proof that nothing was lost | ${fact('migrationProof')} | Reconcile report: counts per record type and a ${OURS.checksum} checksum per attachment |
| Done for you | ${fact('migrationDoneForYou')} | [Free for founding customers](/migrate/freshdesk/done-for-you) |

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

${sourcesMd(z)}`;

const page: Page = {
  jsonLd: [],
  path: '/vs/zammad',
  updated: '2026-10-16',
  section: 'Compare',
  title: 'Colliedesk vs Zammad: two open-source helpdesks, flat price vs per agent',
  description:
    `Colliedesk vs Zammad, both ${z.facts.license.text}: Zammad hosted ${perAgentRange} per agent plus ${perCall} vs Colliedesk at one flat price per workspace (${OUR_PLAN} ${OUR_PRICE} for up to ${TEAM.agents} agents). Freshdesk migration compared honestly.`,
  summary: `Zammad ${perAgentRange} per agent hosted, ${perCall}, released Freshdesk migrator vs Colliedesk ${OUR_PLAN} at a flat ${OUR_PRICE}, importer available now with reconcile report`,
  eyebrow: 'Compare · Open source',
  h1: 'Colliedesk vs Zammad',
  lede: withFoundingLead(`Both are open source under ${z.facts.license.text}. Zammad is mature and charges per agent; Colliedesk is young and charges per workspace. Here is where each one wins, with sources.`),
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
