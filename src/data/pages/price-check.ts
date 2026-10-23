import type { Faq, Page } from '../../lib/page';
import { faqPage, techArticle } from '../../lib/schema';
import { FOUNDING_QUARTERLY, POPULAR_PER_SEAT, TEAM, TEAM_25 } from '../../lib/site';

const usd = (n: number): string => `$${n.toLocaleString('en-US')}`;
const team5 = 5 * POPULAR_PER_SEAT.perSeat * 12;

const faq: Faq[] = [
  {
    q: 'How is "you pay today" worked out?',
    a: 'Agents × your price per agent per month × 12. If you pick "Not sure", we use a popular per-seat plan with its AI add-on, billed monthly: ' +
      `${usd(POPULAR_PER_SEAT.perSeat)} per agent per month (list price read ${POPULAR_PER_SEAT.read}). Your own invoice may differ.`,
  },
  {
    q: 'Where do my answers go?',
    a: 'Nowhere until you press Send. Then they reach our support inbox as one message, so a person can reply with your numbers and a plan for the move. We do not add you to a mailing list.',
  },
  {
    q: 'What if Colliedesk would not save me much?',
    a: 'The result says so. With one or two agents on a low per-seat plan the difference can be small, and staying where you are may be the right call.',
  },
];

const body = `## How the numbers are worked out

- **You pay today:** agents × price per agent per month × 12.
- **On Colliedesk:** Founding is ${usd(FOUNDING_QUARTERLY)} a quarter (${usd(FOUNDING_QUARTERLY * 4)} a year) for up to ${TEAM.agents} agents while founding places last; larger teams use Team 25 at ${usd(TEAM_25.yearly)} a year for up to ${TEAM_25.agents} agents.
- **Example:** on a popular per-seat plan with its AI add-on, a 5-agent team pays ${usd(team5)} a year.

The maths runs in your browser. Nothing is sent unless you ask for the numbers by email.

## What happens next

- Read the plans side by side on [pricing](/pricing).
- Want us to do the move? See [migration, done for you](/migrate/freshdesk/done-for-you): we import everything and prove it with a reconcile report before you switch.
- Ready now? [Become a founding customer](/#founding).`;

const page: Page = {
  jsonLd: [],
  name: 'Help desk price check',
  path: '/price-check',
  section: 'Product',
  title: 'Help desk price check: what per-seat pricing costs your team',
  description:
    'Answer a few questions about your support team and see what you pay a year today, what each new hire adds, and what you would pay on Colliedesk.',
  summary: 'A short quiz: team size, price per seat, renewal date and needs, then a yearly cost comparison with a flat Colliedesk plan',
  eyebrow: 'Price check · 2 minutes',
  h1: 'What does per-seat pricing cost your team?',
  lede: 'A few taps about your team. You get your yearly number, what each new hire adds, and an honest answer on whether moving is worth it.',
  pre: 'price-check',
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
