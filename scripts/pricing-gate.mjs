// The plan rule for /pricing and the home page, applied by scripts/check.mjs to the built site (HTML
// and Markdown twins alike). While Founding is open these pages sell Founding only; once it closes
// /pricing lists the whole Cloud ladder. Each function returns findings; an empty array passes.

const FOUNDING_PRICE = '$99 every 3 months';
const LADDER = /\bTeam 25\b|\bSolo\b/;
const HOME_LADDER = /\bSolo\b|\bTeam 25\b|Plans from/;

/** Findings for /pricing or /pricing.md. `open` is whether Founding was open when the site was built. */
export function pricingFindings({ path, text, open }) {
  const findings = [];
  if (open && LADDER.test(text)) findings.push(`${path}: founding is open but the page lists the Cloud ladder; sell Founding only`);
  if (open && !text.includes(FOUNDING_PRICE)) findings.push(`${path}: founding is open but the page does not show the ${FOUNDING_PRICE} price`);
  if (!open && !LADDER.test(text)) findings.push(`${path}: founding is closed but the page does not list the Cloud ladder`);
  return findings;
}

/** Findings for the home page (index.html or index.md). */
export function homeFindings({ path, text, open }) {
  if (open && HOME_LADDER.test(text)) return [`${path}: founding is open but the home page quotes the Cloud ladder`];
  return [];
}
