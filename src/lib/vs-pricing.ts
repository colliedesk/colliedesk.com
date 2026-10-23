// Price-by-team-size comparison for /vs pages: one competitor's per-agent plans against the flat
// Colliedesk Cloud plan that covers the team. The HTML chart and the Markdown twin both render from this.
import { AI_RESOLUTION, CONTACT_EMAIL, dollars, LADDER_LINE, SMALL, SOLO, TEAM, TEAM_25, type CloudPlan, UNLIMITED } from './site';

export interface VsPlan {
  name: string;
  /** List price per agent per month, USD. */
  perAgent: number;
  /** AI add-on per agent per month, USD, when the plan's total includes one. */
  aiPerAgent?: number;
  /**
   * Per agent per month with any AI add-on, USD, when billed annually, if lower than the listed
   * price. "Colliedesk costs less" is only claimed where it beats this lower price too.
   */
  annualPerAgent?: number;
}

export interface VsPricing {
  competitor: string;
  /** ISO date the competitor's pricing page was read. */
  readOn: string;
  /** How the competitor bills the listed price, e.g. "billed monthly". */
  billing: string;
  plans: readonly VsPlan[];
  /** Who Colliedesk fits and who it does not, beyond the price-derived lines. */
  forYou: readonly string[];
  notForYou: readonly string[];
}

export interface VsRow {
  name: string;
  usd: number;
  seatUsd: number;
  aiUsd: number;
  math: string;
  ours?: boolean;
}

const perAgentTotal = (plan: VsPlan): number => plan.perAgent + (plan.aiPerAgent ?? 0);
const lowestPerAgent = (plan: VsPlan): number => Math.min(perAgentTotal(plan), plan.annualPerAgent ?? Infinity);

export const TEAM_SIZES = [1, 3, 5, 10, 25] as const;
export const DEFAULT_TEAM_SIZE = 5;
/** Cloud plans that can be bought today, smallest first: a team pays for the first one that covers it. */
const LADDER: readonly CloudPlan[] = [SOLO, SMALL, TEAM, TEAM_25];
/** The largest team a Cloud plan covers today for one flat price. */
export const MAX_AGENTS = TEAM_25.agents ?? 25;
export const oursFor = (agents: number): CloudPlan => LADDER.find((p) => p.agents !== null && agents <= p.agents) ?? TEAM_25;

export const usd = (n: number): string =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;

const limitLabel = (plan: CloudPlan): string => (plan.agents === 1 ? '1 agent' : `up to ${plan.agents} agents`);

export function rowsAt(p: VsPricing, agents: number): VsRow[] {
  const theirs = p.plans.map((plan) => {
    const seatUsd = plan.perAgent * agents;
    const aiUsd = (plan.aiPerAgent ?? 0) * agents;
    const math = plan.aiPerAgent
      ? `${agents} × (${usd(plan.perAgent)} + ${usd(plan.aiPerAgent)})`
      : `${agents} × ${usd(plan.perAgent)}`;
    return { name: plan.name, usd: seatUsd + aiUsd, seatUsd, aiUsd, math };
  });
  const plan = oursFor(agents);
  const ours: VsRow = {
    name: `Colliedesk Cloud ${plan.name}`,
    usd: plan.monthly,
    seatUsd: plan.monthly,
    aiUsd: 0,
    math: `one workspace, ${limitLabel(plan)}`,
    ours: true,
  };
  return [...theirs, ours].sort((a, b) => a.usd - b.usd);
}

/**
 * Smallest team size from which Colliedesk costs less than every competitor plan at every larger
 * size, comparing against the competitor's lowest price (annual billing where it is cheaper).
 */
export function cheaperFrom(p: VsPricing): number | undefined {
  const winsAt = (m: number): boolean => p.plans.every((plan) => lowestPerAgent(plan) * m > oursFor(m).monthly);
  for (let n = 1; n <= MAX_AGENTS; n++) {
    if (Array.from({ length: MAX_AGENTS - n + 1 }, (_, i) => n + i).every(winsAt)) return n;
  }
  return undefined;
}

export const teamLabel = (n: number): string => (n === 1 ? '1 agent' : `${n} agents`);
const belowLabel = (from: number): string => (from === 2 ? '1 agent' : `1–${from - 1} agents`);
const cheapestPlan = (p: VsPricing): VsPlan | undefined => [...p.plans].sort((a, b) => lowestPerAgent(a) - lowestPerAgent(b))[0];
const cheapestName = (p: VsPricing): string => {
  const plan = cheapestPlan(p);
  if (!plan) return p.competitor;
  return plan.annualPerAgent !== undefined && plan.annualPerAgent < perAgentTotal(plan) ? `${plan.name} billed annually` : plan.name;
};

/** One line under the chart: where the flat price wins and where it does not. */
export function fitLine(p: VsPricing): string {
  const from = cheaperFrom(p);
  if (from === undefined) return `${p.competitor} costs less than Colliedesk at every team size up to ${MAX_AGENTS} agents.`;
  if (from === 1) return `Colliedesk costs less at every team size from 1 to ${MAX_AGENTS} agents.`;
  return `Colliedesk costs less from ${from} to ${MAX_AGENTS} agents. With ${belowLabel(from)}, ${cheapestName(p)} costs about the same or less.`;
}

/** The monthly saving against the most expensive plan at a team size, or undefined if none. */
export function savingAt(p: VsPricing, agents: number): { name: string; perMonth: number } | undefined {
  const top = rowsAt(p, agents).at(-1);
  if (!top || top.ours) return undefined;
  return { name: top.name, perMonth: top.usd - oursFor(agents).monthly };
}

export const readOnLabel = (iso: string): string =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const chartCaption = (p: VsPricing): string =>
  `${p.competitor} list prices per month, ${p.billing}, read on ${readOnLabel(p.readOn)}. Colliedesk Cloud is one price per workspace, billed monthly: ${LADDER_LINE}. A year costs ten months. AI reply drafts and triage are included with a monthly allowance; auto-answer, once it ships, is ${AI_RESOLUTION} per resolution while alpha.`;

export function notForYouLines(p: VsPricing): string[] {
  const from = cheaperFrom(p);
  const price = from !== undefined && from > 1 ? [`Your team has ${belowLabel(from)}: ${cheapestName(p)} costs about the same or less.`] : [];
  const above = `Your team has more than ${MAX_AGENTS} agents: Unlimited (${dollars(UNLIMITED.monthly)} a month, billed annually) is coming soon; until then email ${CONTACT_EMAIL} for a quote, or self-host with no agent limit.`;
  return [...price, above, ...p.notForYou];
}

export function vsMarkdown(p: VsPricing): string {
  const head = `| Team | ${p.plans.map((plan) => plan.name).join(' | ')} | Colliedesk Cloud |`;
  const sep = `|---|${p.plans.map(() => '---|').join('')}---|`;
  const rows = TEAM_SIZES.map((n) => {
    const cells = p.plans.map((plan) => usd(perAgentTotal(plan) * n));
    const ours = oursFor(n);
    return `| ${teamLabel(n)} | ${cells.join(' | ')} | ${usd(ours.monthly)} (${ours.name}) |`;
  });
  const list = (items: readonly string[]): string => items.map((i) => `- ${i}`).join('\n');
  return `## Price by team size

${chartCaption(p)}

${head}
${sep}
${rows.join('\n')}

${fitLine(p)}

## Who Colliedesk fits

**Colliedesk is for you if**

${list(p.forYou)}

**Not for you yet if**

${list(notForYouLines(p))}`;
}
