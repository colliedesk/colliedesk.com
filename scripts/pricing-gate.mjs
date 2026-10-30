// The plan rule for /pricing and the home page, applied by scripts/check.mjs to the built site (HTML
// and Markdown twins alike). While Founding is open these pages sell two plans: Founding ($99 every
// 3 months) and Team 25 ($149 a month) for teams of 11 to 25 agents. Solo, Small, Team and Unlimited
// stay hidden until Founding closes, when /pricing lists the whole Cloud ladder. Each function
// returns findings; an empty array passes.

const FOUNDING_PRICE = '$99 every 3 months';
const TEAM_25 = 'Team 25';
const TEAM_25_PRICE = '$149';
const CLOSED_LADDER = /\bTeam 25\b|\bSolo\b/;

// Plans that stay hidden while Founding is open. One is listed when it has a plan card, a row in the
// Markdown plan table or a JSON-LD offer. Prose that names the Team plan, such as "upgrade to Cloud
// Team", is not a listing. "Plans from $19" is the closed home page's hero note.
const HIDDEN = 'Solo|Small|Team|Unlimited';
const HIDDEN_LISTING = new RegExp([
  '\\bSolo\\b',
  `class="plan-name"[^>]*>(?:${HIDDEN})<`,
  `^\\|\\s*(?:${HIDDEN})\\s*\\|`,
  `"name":"Colliedesk Cloud (?:${HIDDEN})"`,
  'Plans from',
].join('|'), 'm');

const showsTeam25 = (text) => text.includes(TEAM_25) && text.includes(TEAM_25_PRICE);

/** Findings for /pricing or /pricing.md. `open` is whether Founding was open when the site was built. */
export function pricingFindings({ path, text, open }) {
  const findings = [];
  if (open && HIDDEN_LISTING.test(text)) findings.push(`${path}: founding is open but the page lists the Cloud ladder; sell Founding and Team 25 only`);
  if (open && !text.includes(FOUNDING_PRICE)) findings.push(`${path}: founding is open but the page does not show the ${FOUNDING_PRICE} price`);
  if (open && !showsTeam25(text)) findings.push(`${path}: founding is open but the page does not show Team 25 at ${TEAM_25_PRICE} a month`);
  if (!open && !CLOSED_LADDER.test(text)) findings.push(`${path}: founding is closed but the page does not list the Cloud ladder`);
  return findings;
}

/** Findings for the home page (index.html or index.md). */
export function homeFindings({ path, text, open }) {
  if (!open) return [];
  const findings = [];
  if (HIDDEN_LISTING.test(text)) findings.push(`${path}: founding is open but the home page quotes the Cloud ladder`);
  if (!showsTeam25(text)) findings.push(`${path}: founding is open but the home page does not show Team 25 at ${TEAM_25_PRICE} a month`);
  return findings;
}
