const PRICES_READ = '17 November 2026';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { collieFacts as c, statusTable } from './collie-status';
import { FOUNDING_ACTION, FOUNDING_OPEN, OUR_PLAN, OUR_PRICE } from '../../lib/cloud-price';
import { PRICE, SMALL, SOLO, dollars } from '../../lib/site';

// Helply prices with the Monthly toggle on helply.com/pricing. The page opens on yearly billing,
// 15% less (Starter $99 a month); pages compare our monthly plans with Helply's monthly prices.
export const HELPLY = {
  read: PRICES_READ,
  starter: { monthly: '$116', yearly: '$99', agents: 2 },
  plus: { monthly: '$234', yearly: '$199', agents: 5 },
  team: { monthly: '$587', yearly: '$499', agents: 10 },
} as const;
const H = HELPLY;

const faq: Faq[] = [
  {
    q: 'What happened to Groove?',
    a: `Groove is now Helply. On ${PRICES_READ}, groovehq.com redirected to helply.com, whose about page says "Groove is now Helply, rebuilt around AI agents."`,
  },
  {
    q: 'How does Helply charge?',
    a: `By plan, sized by the number of agents, with AI credits included. Billed monthly, Starter is ${H.starter.monthly} a month for up to 2 agents, Plus ${H.plus.monthly} for up to 5 and the 10-agent plan ${H.team.monthly}. Yearly billing is 15% less: Starter is then ${H.starter.yearly} a month. AI work uses credits pooled across the team: 1 for a triage or summary, 2 for a reply draft, at most 15 for one conversation, and $40 per 1,000 extra.`,
  },
  {
    q: 'How do I export my Groove conversations?',
    a: 'The account owner or an admin downloads them from Settings > Company > More > Exports. Groove\'s help says the export is JSON only, with no CSV, one export at a time, and large exports can take up to 72 hours.',
  },
];

const body = `## The short answer

- **Choose Helply** (formerly Groove) if you want AI agents to answer most tickets and you are happy to pay for that AI work in credits.
- **Choose Colliedesk** if you want a classic shared inbox and helpdesk with a flat price, where AI drafts (off until an admin turns them on) and a human decides, and your data in an open database. Colliedesk is generally available; read the status table for what is not built yet.

## Price, side by side

Read on ${PRICES_READ}. Helply's prices here are for monthly billing, like the Colliedesk monthly plans. Its pricing page opens on yearly billing, which is 15% less: Starter shows ${H.starter.yearly} there and ${H.starter.monthly} when you pick Monthly.

| Topic | Helply (formerly Groove) | Colliedesk |
|---|---|---|
| Plans, billed monthly | ${H.starter.monthly} a month for Starter (up to 2 agents), ${H.plus.monthly} for Plus (up to 5), ${H.team.monthly} for 10 agents; Starter and Plus cannot add agents | ${c.price} |
| AI | Credits pooled across the team: 2,500 a month on Starter, 15,000 on the 10-agent plan. A triage or summary uses 1, a reply draft 2, one conversation at most 15; more cost $40 per 1,000 | ${c.ai} |
| Free option | 14-day free trial, no card | ${c.free} |
| Source code | Proprietary | ${c.source} |

For 10 agents, billed monthly, Helply costs ${H.team.monthly} a month. ${FOUNDING_OPEN ? `Colliedesk Founding is $99 every 3 months for up to 10 agents, locked for life; after the 10 places are taken, Colliedesk is ${PRICE.monthly} a month for up to 10 agents.` : `Colliedesk is ${PRICE.monthly} a month for up to 10 agents.`} For 2 agents, Helply is ${H.starter.monthly} a month${FOUNDING_OPEN ? '; Founding covers them at the same $99 every 3 months.' : `; Colliedesk is ${dollars(SMALL.monthly)} for up to ${SMALL.agents}, or ${dollars(SOLO.monthly)} for one.`} Colliedesk includes AI reply drafts and triage (monthly allowance) or runs them on your own key.

## Leaving: what Groove gives you

- The account owner and admins can download **all conversation data**.
- The export is **JSON only**; Groove says a CSV export is not available.
- **One export at a time**; large exports can take **up to 72 hours**.

${c.export}

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

- Helply about (formerly Groove): [helply.com/about](https://helply.com/about)
- Helply pricing: [helply.com/pricing](https://helply.com/pricing)
- Groove export: [help.groovehq.com](https://help.groovehq.com/help/970-export-your-groove-conversations)`;

const page: Page = {
  jsonLd: [],
  path: '/vs/groove',
  updated: '2026-11-17',
  section: 'Compare',
  title: 'Colliedesk vs Groove (now Helply): price for 10 agents',
  description:
    `Groove is now Helply: ${H.team.monthly} a month for 10 agents, billed monthly. Colliedesk ${OUR_PLAN} is a flat ${OUR_PRICE} for up to 10 agents, AI drafts included.`,
  summary: `Groove is now Helply: ${HELPLY.team.monthly} a month for 10 agents billed monthly, JSON-only export, vs Colliedesk ${OUR_PLAN}, a flat ${OUR_PRICE} per workspace helpdesk`,
  eyebrow: 'Compare · Groove alternative',
  h1: 'Colliedesk vs Groove (now Helply)',
  lede: 'Groove became Helply and rebuilt itself around AI agents, with AI work paid in credits. If you chose Groove for a simple shared inbox, here is the difference, with sources.',
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
