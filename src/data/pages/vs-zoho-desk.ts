// Zoho Desk, Gorgias, HappyFox, HubSpot and Groove pages were read on the same day.
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { eur, exportMd, readOnLabel, sourcesMd } from '../../lib/competitor';
import { collieFacts as c, statusTable } from './collie-status';
import { AI_EXTRA, dollars, TEAM } from '../../lib/site';
import { backup, limits, price, zohoDesk as z } from '../competitors/zoho-desk';
import { FOUNDING_ACTION, OUR_CELL, OUR_PLAN, OUR_PRICE, foundingFirst, withFoundingLead } from '../../lib/cloud-price';

const PRICES_READ = readOnLabel(z.readOn);
const [FOUR, FIVE, SIX, TEN] = [4, 5, 6, 10];
const MILLION = 1_000_000;
const perUserRange = `${eur(price.express)}–${price.enterprise}`;

const faq: Faq[] = [
  {
    q: 'Is Zoho Desk cheaper than Colliedesk?',
    a: `For very small teams, yes. Zoho Desk has a free plan for ${limits.freeUsers} users and Express from ${eur(price.express)} per user per month (up to ${limits.expressMaxUsers} users). On Standard (${eur(price.standard)} per user, billed annually, read on ${PRICES_READ}), five users pay ${eur(FIVE * price.standard)} a month. ${foundingFirst(`Colliedesk Team at ${dollars(TEAM.monthly)} for up to ${TEAM.agents} agents costs about the same; from six users (${eur(SIX * price.standard)}) Zoho costs more.`)} Zia needs Professional (${eur(price.professional)} per user), so four users with AI already pay ${eur(FOUR * price.professional)}.`,
  },
  {
    q: 'Which Zoho Desk plan has Zia AI?',
    a: 'Zoho\'s pricing page lists Zia on Professional and Enterprise. Express uses AI agents with your own model key or Zoho\'s LLM.',
  },
  {
    q: 'Can I export everything from Zoho Desk?',
    a: `Zoho Desk backups are a ZIP of CSV files per module, up to ${backup.records / MILLION} million records, created and downloaded only by the primary contact. Attachments are not in the file: it holds secure download links, so you fetch the files separately. The backup file is available for ${backup.availableDays} days.`,
  },
];

const body = `## The short answer

- **Choose Zoho Desk** if you already run Zoho CRM or Zoho One, or you have one to three agents and the free plan is enough.
- **Choose Colliedesk** if you have ${limits.freeUsers + 1} to ${TEAM.agents} agents, want AI without moving up a plan tier, and want your data in an open database you can self-host. Colliedesk is generally available; read the status table for what is not built yet.

## Price, side by side

Zoho showed us prices in euros, per user per month, billed annually, on ${PRICES_READ}. Your region may show another currency.

| Topic | Zoho Desk | Colliedesk |
|---|---|---|
| Plans | ${z.facts.plans.text} | ${c.price} |
| AI | ${z.facts.ai.text} | ${c.ai} |
| Free option | ${z.facts.free.text} | ${c.free} |
| Source code | ${z.facts.license.text} | ${c.source} |

### What five agents pay

| Team | Zoho Desk Professional (with Zia) | Colliedesk Cloud |
|---|---|---|
| ${FIVE} agents | ${FIVE} × ${eur(price.professional)} = **${eur(FIVE * price.professional)} per month** | ${OUR_CELL} + ${AI_EXTRA} |
| ${TEN} agents | ${TEN} × ${eur(price.professional)} = **${eur(TEN * price.professional)} per month** | ${OUR_CELL} + ${AI_EXTRA} |

## Leaving: what Zoho Desk gives you

${exportMd(z)}

${c.export}

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

${sourcesMd(z)}`;

const page: Page = {
  jsonLd: [],
  path: '/vs/zoho-desk',
  updated: '2026-10-16',
  section: 'Compare',
  title: `Colliedesk vs Zoho Desk: flat ${OUR_PRICE} for up to ${TEAM.agents} agents vs per-user plans`,
  description:
    `Colliedesk vs Zoho Desk: Zoho ${perUserRange} per user with Zia on Professional and up vs Colliedesk at one flat price per workspace (${OUR_PLAN} ${OUR_PRICE} for up to ${TEAM.agents} agents). Backup limits and honest status, with sources.`,
  summary: `Zoho Desk free for ${limits.freeUsers} users, ${perUserRange} per user, Zia from Professional, backups by primary contact without attachments vs Colliedesk ${OUR_PLAN} at a flat ${OUR_PRICE}`,
  eyebrow: 'Compare · Zoho Desk alternative',
  h1: 'Colliedesk vs Zoho Desk',
  lede: withFoundingLead('Zoho Desk is cheap per user and strong inside the Zoho suite. For a team of five with AI, the per-user price adds up. Here are the numbers, with sources.'),
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
