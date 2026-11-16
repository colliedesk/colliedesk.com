import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { factText, num, readOnLabel, sourcesMd, usd } from '../../lib/competitor';
import { collieFacts as c, statusTable } from './collie-status';
import { AI_EXTRA, TEAM } from '../../lib/site';
import { OURS } from '../competitors/colliedesk';
import { aiCredits, chatwoot as cw, freshdeskApiCap, price } from '../competitors/chatwoot';
import { FOUNDING_ACTION, OUR_CELL, OUR_PLAN, OUR_PRICE, withFoundingLead } from '../../lib/cloud-price';

const PRICES_READ = readOnLabel(cw.readOn);
const [FIVE, TEN] = [5, 10];
const perAgentRange = `${usd(price.startups)}–${price.enterprise}`;
const fact = (key: string): string => factText(cw, key);

const faq: Faq[] = [
  {
    q: 'Is Chatwoot a Freshdesk alternative?',
    a: 'It can be, if your support is mostly chat and messaging. Chatwoot is an omnichannel inbox: live chat, WhatsApp, Instagram, Messenger, Telegram, email and more. Colliedesk is a ticket helpdesk for teams whose support is mostly email, priced per workspace instead of per agent.',
  },
  {
    q: 'Does Chatwoot import attachments from Freshdesk?',
    a: `No. Chatwoot's Freshdesk importer, on paid plans only, brings contacts and conversations as resolved history. Its guide says attachments, agents, groups, SLAs and automations are not imported, and the Freshdesk API limit of ${num(freshdeskApiCap)} tickets applies. The Colliedesk importer (available now) downloads and checksums every attachment.`,
  },
  {
    q: `How much is Chatwoot Cloud for ${FIVE} agents?`,
    a: `On the Chatwoot pricing page read on ${PRICES_READ}: Startups is ${usd(price.startups)} per agent per month and Business ${usd(price.business)}. Five agents: ${usd(FIVE * price.startups)} or ${usd(FIVE * price.business)} per month. Extra AI credits are ${usd(aiCredits.extraPrice)} per ${num(aiCredits.extraBlock)}.`,
  },
];

const body = `## The short answer

- **Choose Chatwoot** if most of your conversations come through chat and messaging apps and you want them in one inbox today. It is mature and widely used.
- **Choose Colliedesk** if you run email support, you are leaving Freshdesk with years of tickets and attachments, and you want one flat price. Colliedesk is generally available; read the status table for what is not built yet.

## Price, side by side

Chatwoot Cloud prices are per agent per month, as shown on the Chatwoot pricing page on ${PRICES_READ}.

| Topic | Chatwoot | Colliedesk |
|---|---|---|
| Cloud plans | ${cw.facts.plans.text} | ${c.price} |
| AI | ${cw.facts.ai.text} | ${c.ai} |
| Self-host | ${cw.facts.free.text} | ${c.free} |
| Licence | ${cw.facts.license.text} | ${c.source} |

### What five agents pay

| Team | Chatwoot Business | Colliedesk Cloud |
|---|---|---|
${[FIVE, TEN].map((n) => `| ${n} agents | ${n} × ${usd(price.business)} = **${usd(n * price.business)} per month** | ${OUR_CELL} + ${AI_EXTRA} |`).join('\n')}

Business is the Chatwoot plan with automation rules and teams.

## Moving from Freshdesk

| Import | Chatwoot importer | Colliedesk importer (**Shipped**) |
|---|---|---|
| Availability | ${fact('importAvailability')} | Every install, free; done for you for founding customers |
| Conversations, replies, private notes | ${fact('importConversations')} | Yes |
| Attachments | ${fact('importAttachments')} | Downloaded and checksummed (${OURS.checksum}) |
| Agents | ${fact('importAgents')} | Matched by email to your Colliedesk agents |
| Ticket count | ${fact('importCount')} | Archived tickets included; totals checked against what Freshdesk reports |
| Proof that nothing was lost | ${fact('importProof')} | Reconcile report |

## What Colliedesk does today

${statusTable}

## Sources

Read on ${PRICES_READ}. Prices change; check the vendor page before you decide.

${sourcesMd(cw)}`;

const page: Page = {
  jsonLd: [],
  path: '/vs/chatwoot',
  updated: '2026-10-16',
  section: 'Compare',
  title: 'Colliedesk vs Chatwoot: email helpdesk with flat pricing vs omnichannel inbox',
  description:
    `Chatwoot costs ${perAgentRange} per agent; Colliedesk ${OUR_PLAN} is a flat ${OUR_PRICE} for up to ${TEAM.agents} agents. What each Freshdesk importer brings over, with sources.`,
  summary: `Chatwoot ${perAgentRange} per agent, Freshdesk import without attachments on paid plans vs Colliedesk ${OUR_PLAN} at a flat ${OUR_PRICE}, importer with attachments and reconcile report (available now)`,
  eyebrow: 'Compare · Open source',
  h1: 'Colliedesk vs Chatwoot',
  lede: withFoundingLead('Chatwoot is an open-source inbox built around chat and messaging. Colliedesk is an open-source helpdesk built for teams leaving Freshdesk. Here is the difference, with sources.'),
  cta: true,
  ctaFounding: FOUNDING_ACTION,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
