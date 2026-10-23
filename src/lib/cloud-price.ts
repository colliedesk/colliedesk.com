// How a page states what Colliedesk Cloud costs today. While Founding is open it is the only Cloud plan
// on sale (src/data/pages/pricing.ts), so a page that names a Cloud price leads with Founding and gives
// the monthly plans as the prices after its places are taken. Once Founding closes the same phrases name
// the monthly plans alone. `pnpm check:content` fails a page that names a plan price before Founding.
import { FOUNDING_SLOTS, foundingState } from './founding';
import { type NavLink, PRICE } from './site';

export const FOUNDING_OPEN = foundingState().open;

/** The plan a team of up to 10 agents buys on Cloud today. */
export const OUR_PLAN = FOUNDING_OPEN ? 'Founding' : 'Team';
/** Its price, short: "$99 a quarter" or "$69 a month". */
export const OUR_PRICE = FOUNDING_OPEN ? '$99 a quarter' : `${PRICE.monthly} a month`;
/** A comparison-table cell for a team of up to 10 agents. */
export const OUR_CELL = FOUNDING_OPEN ? '$99 a quarter (Founding)' : `${PRICE.monthly} per month (Team)`;

/** Lead sentences for a page that states a Cloud price; empty once Founding closes. */
export const FOUNDING_LEAD = FOUNDING_OPEN
  ? `Today Colliedesk Cloud sells one plan, Founding: $99 a quarter ($396 a year) per workspace for up to 10 agents, locked for life. Only the first ${FOUNDING_SLOTS} workspaces get it, with Freshdesk migration done for you.`
  : '';

/** Put before a sentence that names the monthly plans; empty once Founding closes. */
export const AFTER_FOUNDING = FOUNDING_OPEN ? `After the ${FOUNDING_SLOTS} Founding places are taken, ` : '';

/** The Founding action beside the trial in the hero; Hero shows it only while Founding is open. */
export const FOUNDING_ACTION: NavLink = { href: '/pricing', label: 'Founding, $99 a quarter' };

/** A hero lede followed by the Founding lead while Founding is open. */
export const withFoundingLead = (lede: string): string => (FOUNDING_LEAD ? `${lede} ${FOUNDING_LEAD}` : lede);

/** Text that names the monthly plans, preceded by the Founding lead while Founding is open. */
export const foundingFirst = (text: string): string => (FOUNDING_LEAD ? `${FOUNDING_LEAD} ${AFTER_FOUNDING}${text}` : text);
