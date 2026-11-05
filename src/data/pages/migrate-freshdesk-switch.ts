// The switch offer for Freshdesk teams of 11 to 100 agents: the page ads and outreach emails link to.
// It leads with the offer, says what the migration moves, shows Team 25 and Business with both offers
// (SwitchPlans), and books a call or starts the trial. Facts come from src/lib/site.ts and the
// done-for-you page; nothing here loads from another origin.
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { BUSINESS, BUSINESS_AGENTS, CONTACT_EMAIL, SWITCH_CALL_HREF, SWITCH_CALL_LABEL, TRIAL_HREF } from '../../lib/site';
import { businessRow, switchSection, team25Row } from './pricing';

const faq: Faq[] = [
  {
    q: 'What counts as the first real ticket?',
    a: 'A ticket from one of your customers that your team answers from Colliedesk. Test messages do not count. Until then you pay nothing.',
  },
  {
    q: 'Can we keep Freshdesk while we test?',
    a: 'Yes. The import only reads Freshdesk. Run one queue in Colliedesk and keep the rest in Freshdesk. We run the import again to catch up, and it never copies a ticket twice. You switch your support address only when your team is sure.',
  },
  {
    q: 'What does the invoice offer cover?',
    a: 'Your first paid month of Team 25 or Business, up to the amount on your latest Zendesk, Freshdesk, Help Scout or Intercom invoice from the last 3 months. Paying yearly? You get 13 months for the price of one year. We use the invoice only to check the amount and the team size.',
  },
  {
    q: 'We use Zendesk, not Freshdesk. Does this apply?',
    a: 'The invoice offer does. The migration we run for you covers Freshdesk today: a Zendesk importer is not built yet. Until it is, see [how to export your Zendesk tickets](/migrate/zendesk/export).',
  },
  {
    q: 'What if Colliedesk is not right for us?',
    a: `Email ${CONTACT_EMAIL} within 30 days of your first payment and we refund it in full ([terms](/terms#refunds)). You can export the whole workspace at any time.`,
  },
];

const body = `## What we move

Tickets (archived ones included), replies, private notes, attachments, tags, contacts, companies and time entries, into one Colliedesk workspace. We also move your help center. Old links on your own help center domain redirect with a 301. The data model and the command are public: [import guide](/docs/import-freshdesk).

You get a **reconcile report**: the Freshdesk count and the Colliedesk count for each kind of record, and a SHA-256 checksum for every attachment. One mismatch means the migration failed, and you keep using Freshdesk.

## How the switch works

1. Book a 30-minute call with the founder. We look at the size of your Freshdesk account, your renewal date and the first queue to move.
2. You create a Freshdesk API key and send it to us. We run the import into your Colliedesk Cloud workspace.
3. You check the reconcile report and a sample of your own tickets.
4. Your team answers one queue in Colliedesk. Freshdesk keeps running for the rest.
5. When your team answers its first real ticket in Colliedesk, you pick Team 25 or Business and pay. Not before.
6. Before your Freshdesk renewal, we run a last catch-up import and you point your support address at Colliedesk.

The full process, step by step: [Freshdesk migration, done for you](/migrate/freshdesk/done-for-you).

## Why you can trust an alpha with your support

Colliedesk is alpha, and we say so: a release may change the interface. So the switch is built to be safe. You run one queue next to Freshdesk, not your whole support desk on day one. We run the import, and the reconcile report shows what arrived. You pay nothing until your team answers real tickets in Colliedesk. Colliedesk Cloud keeps nightly encrypted backups in Germany, and we have a tested restore. Colliedesk is open source under AGPL-3.0: the code and the data model are public, and you can [self-host it](/docs/self-host) if you ever leave our cloud.

Freshdesk still does more in some areas, such as automations and reports. Read [Colliedesk vs Freshdesk](/vs/freshdesk) before you decide.

[Start the free trial](${TRIAL_HREF}) or [${SWITCH_CALL_LABEL.toLowerCase()}](${SWITCH_CALL_HREF}).`;

const preMd = `## Team 25 and Business

| Plan | Price | What you get |
|---|---|---|
${team25Row}
${businessRow}

${switchSection}`;

const page: Page = {
  jsonLd: [],
  name: `Switch offer for Freshdesk teams of 11 to ${BUSINESS.agents} agents`,
  path: '/migrate/freshdesk/switch',
  section: 'Migrate',
  title: 'Switch from Freshdesk: we migrate you, you pay later',
  description:
    `For Freshdesk teams of 11 to ${BUSINESS.agents} agents: we migrate your tickets and help center, and you pay when your team answers its first real ticket in Colliedesk.`,
  summary: `Switch offer for Freshdesk teams of 11 to ${BUSINESS.agents} agents on Team 25 or Business (${BUSINESS_AGENTS} agents): we migrate you and you pay when your team answers its first real ticket; your last helpdesk invoice buys the first month, up to its amount; 14-day trial unchanged`,
  eyebrow: 'Migrate · Switch offer',
  h1: 'We move your team off Freshdesk. You pay after its first real ticket.',
  lede: `For support teams of 11 to ${BUSINESS.agents} agents. We import your Freshdesk history, your team runs one queue in Colliedesk next to Freshdesk, and you pay when it answers its first real ticket here. Smaller team? [Founding](/pricing) includes the migration too.`,
  cta: true,
  ctaCall: { href: SWITCH_CALL_HREF, label: SWITCH_CALL_LABEL },
  pre: 'switch-plans',
  preMd,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
