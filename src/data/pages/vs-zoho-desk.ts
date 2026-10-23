// Zoho Desk, Gorgias, HappyFox, HubSpot and Groove pages were read on the same day.
const PRICES_READ = '16 October 2026';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { collieFacts as c, statusTable } from './collie-status';
import { AI_EXTRA } from '../../lib/site';

const faq: Faq[] = [
  {
    q: 'Is Zoho Desk cheaper than Colliedesk?',
    a: `For very small teams, yes. Zoho Desk has a free plan for 3 users and Express from €7 per user per month (up to 5 users). On Standard (€14 per user, billed annually, read on ${PRICES_READ}), five users pay €70 a month, about the same as Colliedesk Team at $69 for up to 10 agents; from six users (€84) Zoho costs more. Zia needs Professional (€23 per user), so four users with AI already pay €92.`,
  },
  {
    q: 'Which Zoho Desk plan has Zia AI?',
    a: 'Zoho\'s pricing page lists Zia on Professional and Enterprise. Express uses AI agents with your own model key or Zoho\'s LLM.',
  },
  {
    q: 'Can I export everything from Zoho Desk?',
    a: 'Zoho Desk backups are a ZIP of CSV files per module, up to 10 million records, created and downloaded only by the primary contact. Attachments are not in the file: it holds secure download links, so you fetch the files separately. The backup file is available for 7 days.',
  },
];

const body = `## The short answer

- **Choose Zoho Desk** if you already run Zoho CRM or Zoho One, or you have one to three agents and the free plan is enough.
- **Choose Colliedesk** if you have 4 to 10 agents, want AI without moving up a plan tier, and want your data in an open database you can self-host. Colliedesk is alpha; read the status table first.

## Price, side by side

Zoho showed us prices in euros, per user per month, billed annually, on ${PRICES_READ}. Your region may show another currency.

| | Zoho Desk | Colliedesk |
|---|---|---|
| Plans | Free (3 users), Express €7 (max 5 users), Standard €14, Professional €23, Enterprise €40 per user per month | ${c.price} |
| AI | Zia on Professional and Enterprise; Express AI agents with your own key or Zoho's LLM | ${c.ai} |
| Free option | Free plan for 3 users; 15-day trial | ${c.free} |
| Source code | Proprietary | ${c.source} |

### What five agents pay

| Team | Zoho Desk Professional (with Zia) | Colliedesk Cloud |
|---|---|---|
| 5 agents | 5 × €23 = **€115 per month** | $69 per month (Team) + ${AI_EXTRA} |
| 10 agents | 10 × €23 = **€230 per month** | $69 per month (Team) + ${AI_EXTRA} |

## Leaving: what Zoho Desk gives you

- Only the **primary contact** can create and download a backup.
- The backup is a ZIP of **CSV files per module**, up to **10 million records**; a custom backup covers up to **31 days**.
- **Attachments are not in the file.** It holds secure download links; you fetch each file separately.
- The file stays available for **7 days**.

${c.export}

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

- Zoho Desk pricing: [zoho.com/desk/pricing](https://www.zoho.com/desk/pricing.html)
- Express plan: [zoho.com/desk/express](https://www.zoho.com/desk/express/)
- Backups: [help.zoho.com, backing up your help desk data](https://help.zoho.com/portal/en/kb/desk/data-administration/backup-and-data-archive/articles/backing-up-your-help-desk-data)`;

const page: Page = {
  jsonLd: [],
  path: '/vs/zoho-desk',
  updated: '2026-10-16',
  section: 'Compare',
  title: 'Colliedesk vs Zoho Desk: flat $69 for up to 10 agents vs per-user plans',
  description:
    'Colliedesk vs Zoho Desk: Zoho €7–40 per user with Zia on Professional and up vs Colliedesk at one flat price per workspace (Team $69 for up to 10 agents). Backup limits and honest status, with sources.',
  summary: 'Zoho Desk free for 3 users, €7–40 per user, Zia from Professional, backups by primary contact without attachments vs Colliedesk Team at a flat $69',
  eyebrow: 'Compare · Zoho Desk alternative',
  h1: 'Colliedesk vs Zoho Desk',
  lede: 'Zoho Desk is cheap per user and strong inside the Zoho suite. For a team of five with AI, the per-user price adds up. Here are the numbers, with sources.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
