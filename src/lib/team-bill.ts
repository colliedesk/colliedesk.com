// "Your bill, by team size" on the home page: a year of Freshdesk for the chosen team against the flat
// Colliedesk plan that covers it. Pure, so scripts/team-bill.test.mjs checks the numbers by hand.
import { BUSINESS, TEAM, TEAM_25 } from './site.ts';

// Freshdesk list prices per agent per month, billed annually, read on PRICES_READ (see /vs/freshdesk).
const GROWTH = 19;
const PRO = 55;
const COPILOT = 29;
const FOUNDING_YEAR = 4 * 99;

export const BILL_SIZES = [5, 10, 25, 50] as const;
export const DEFAULT_BILL_SIZE = 10;

export interface BillBar {
  name: string;
  /** Yearly total, USD. */
  usd: number;
  math: string;
  ours?: boolean;
  /** Sold through a call with the founder, not a checkout. */
  call?: boolean;
}

const AI_LINE = 'AI drafts and triage included, within a monthly allowance';
const yearly = (from: number, to: number): string => `flat for ${from} to ${to} agents, a year costs ten months`;

function oursAt(agents: number, foundingOpen: boolean): BillBar {
  if (agents <= TEAM.agents) {
    return foundingOpen
      ? { name: 'Colliedesk Founding', usd: FOUNDING_YEAR, math: `4 × $99, flat for 3 to 10 agents · locked for life · ${AI_LINE}`, ours: true }
      : { name: 'Colliedesk Cloud Team', usd: TEAM.yearly, math: `${yearly(1, TEAM.agents)} · ${AI_LINE}`, ours: true };
  }
  if (agents <= TEAM_25.agents) return { name: 'Colliedesk Team 25', usd: TEAM_25.yearly, math: yearly(TEAM.agents + 1, TEAM_25.agents), ours: true };
  return { name: 'Colliedesk Business', usd: BUSINESS.yearly, math: yearly(BUSINESS.agentsFrom ?? TEAM_25.agents + 1, BUSINESS.agents), ours: true, call: true };
}

/** Freshdesk Pro + Copilot, Freshdesk Growth and the Colliedesk plan for a team, a year each. */
export function billAt(agents: number, foundingOpen: boolean): BillBar[] {
  if (!Number.isInteger(agents) || agents < 1 || agents > BUSINESS.agents) throw new Error(`No flat Colliedesk plan covers ${agents} agents`);
  return [
    { name: 'Freshdesk Pro + Freddy AI Copilot', usd: agents * (PRO + COPILOT) * 12, math: `${agents} × ($${PRO} + $${COPILOT}) × 12` },
    { name: 'Freshdesk Growth, no AI', usd: agents * GROWTH * 12, math: `${agents} × $${GROWTH} × 12` },
    oursAt(agents, foundingOpen),
  ];
}

/** CSS width of a bar: the dearest takes 86% of the track, leaving room for its total beside it. */
export const barWidth = (usd: number, max: number): string => `${Math.max(1, Math.round((usd / max) * 860) / 10)}%`;
