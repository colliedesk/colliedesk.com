const PRICES_READ = '16 October 2026';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { collieFacts as c, statusTable } from './collie-status';

const faq: Faq[] = [
  {
    q: 'Is Chatwoot a Freshdesk alternative?',
    a: 'It can be, if your support is mostly chat and messaging. Chatwoot is an omnichannel inbox: live chat, WhatsApp, Instagram, Messenger, Telegram, email and more. Colliedesk is a ticket helpdesk for teams whose support is mostly email, priced per workspace instead of per agent.',
  },
  {
    q: 'Does Chatwoot import attachments from Freshdesk?',
    a: 'No. Chatwoot\'s Freshdesk importer, on paid plans only, brings contacts and conversations as resolved history. Its guide says attachments, agents, groups, SLAs and automations are not imported, and the Freshdesk API limit of 30,000 tickets applies. The Colliedesk importer (available now) downloads and checksums every attachment.',
  },
  {
    q: 'How much is Chatwoot Cloud for 5 agents?',
    a: `On the Chatwoot pricing page read on ${PRICES_READ}: Startups is $19 per agent per month and Business $39. Five agents: $95 or $195 per month. Extra AI credits are $20 per 1,000.`,
  },
];

const body = `## The short answer

- **Choose Chatwoot** if most of your conversations come through chat and messaging apps and you want them in one inbox today. It is mature and widely used.
- **Choose Colliedesk** if you run email support, you are [leaving Freshdesk](/migrate/freshdesk) with years of tickets and attachments, and you want [one flat price](/pricing). Colliedesk is alpha; read the status table first.

## Price, side by side

Chatwoot Cloud prices are per agent per month, as shown on the Chatwoot pricing page on ${PRICES_READ}.

| | Chatwoot | Colliedesk |
|---|---|---|
| Cloud plans | Hacker $0 (up to 2 agents, live chat only), Startups $19, Business $39, Enterprise $99 per agent per month | ${c.price} |
| AI | Captain AI credits included (300, 500 or 800 by plan; none on Hacker); more at $20 per 1,000 | ${c.ai} |
| Self-host | Community Edition free; Premium $19 and Enterprise $99 per agent per month | ${c.free} |
| Licence | MIT, except the \`enterprise/\` directory under its own licence | ${c.source} |

### What five agents pay

| Team | Chatwoot Business | Colliedesk Cloud |
|---|---|---|
| 5 agents | 5 × $39 = **$195 per month** | $49 per month + AI usage |
| 10 agents | 10 × $39 = **$390 per month** | $49 per month + AI usage |

Business is the Chatwoot plan with automation rules and teams.

## Moving from Freshdesk

| | Chatwoot importer | Colliedesk importer (**Available now**) |
|---|---|---|
| Availability | Paid plans only | Every install, free; done for you for founding customers |
| Conversations, replies, private notes | Yes, as resolved history | Yes |
| Attachments | Not imported | Downloaded and checksummed (SHA-256) |
| Agents | Not imported | Matched by email to your Colliedesk agents |
| Ticket count | Freshdesk API cap of 30,000 tickets | Archived tickets included; totals checked against what Freshdesk reports |
| Proof that nothing was lost | Not described | Reconcile report |

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

- Chatwoot Cloud pricing: [chatwoot.com/pricing](https://www.chatwoot.com/pricing)
- Self-hosted plans: [chatwoot.com/pricing/self-hosted-plans](https://www.chatwoot.com/pricing/self-hosted-plans)
- Freshdesk migration guide: [chatwoot.com help center](https://www.chatwoot.com/hc/user-guide/articles/1696159781-how-to-migrate-from-freshdesk-to-chatwoot)
- Licence: [github.com/chatwoot/chatwoot](https://github.com/chatwoot/chatwoot)

## Related comparisons

- [Colliedesk vs Zammad](/vs/zammad)
- [Colliedesk vs FreeScout](/vs/freescout)
- [Colliedesk vs Help Scout](/vs/help-scout)
- [All helpdesk comparisons](/compare)`;

const page: Page = {
  jsonLd: [],
  path: '/vs/chatwoot',
  updated: '2026-10-20',
  section: 'Compare',
  title: 'Colliedesk vs Chatwoot: flat price vs omnichannel inbox',
  description:
    'Colliedesk vs Chatwoot: Chatwoot $19–99 per agent with AI credits vs Colliedesk flat $49 per workspace. What each Freshdesk importer brings over, with sources.',
  summary: 'Chatwoot $19–99 per agent, Freshdesk import without attachments on paid plans vs Colliedesk flat $49, importer with attachments and reconcile report (available now)',
  eyebrow: 'Compare · Open source',
  h1: 'Colliedesk vs Chatwoot',
  lede: 'Chatwoot is an open-source inbox built around chat and messaging. Colliedesk is an open-source helpdesk built for teams leaving Freshdesk. Here is the difference, with sources.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
