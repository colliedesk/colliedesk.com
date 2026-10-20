# Agentic SEO loop

An agent finds keywords, writes and checks articles and improves what is live. A person reads and
approves every page before it is published; the required check `content-approval` enforces it.

Goal: trial sign-ups and founding purchases from search and AI answers, not clicks.
Reader: a support lead or founder of a 3–10 agent team that pays for Freshdesk, is hit by a price
increase, wants hosted and does not need PSA/RMM.

## Connections

| Need | Use | Notes |
|---|---|---|
| Site | this repo, one `Page` module per page in `src/data/pages/` | publish = merge a PR; `site.yml` deploys |
| Search Console | OpenSEO MCP, the colliedesk.com project, `get_search_console_performance` | property `sc-domain:colliedesk.com` |
| SERP and keyword data | OpenSEO MCP (`research_keywords`, `get_keyword_metrics`, `get_serp_results`, `get_search_opportunities`, `run_site_audit`) | DataForSEO credits, within the owner's monthly budget |
| Tickets | GitHub Issues in this repo, labels `seo:new` and `seo:improve`, template `.github/ISSUE_TEMPLATE/seo-task.yml` | Linear is not paid; do not add it |
| Conversions | PostHog, the Colliedesk project: landing page of sessions that reach trial sign-up or founding checkout | `$host = colliedesk.com` |
| Screenshots | `pnpm check:render` (375 px, both themes) | no screenshot API |

## The loop

1. **Research, weekly** ([research-and-audit.md](research-and-audit.md)): open at most 2 `seo:new`
   issues, one keyword each, with a brief.
2. **Write** ([write-and-qa.md](write-and-qa.md)): take the oldest open `seo:new` issue, write the
   page on a branch, open a PR that closes the issue. Do not merge yet.
3. **Agent QA**: a second agent that did not write the page runs the QA checklist and the claim
   check in [write-and-qa.md](write-and-qa.md), then `pnpm build && pnpm check:content`. A failure
   goes back to step 2 on the same branch. Repeat until both pass.
4. **Human review**: the PR waits for a person. They read the rendered page and the claim check,
   then add the label `content:approved` or comment what to change. New commits remove the label.
   Agents never add that label; a hook on the agent host refuses it.
5. **Publish**: merge when every check, including `content-approval`, is green. The merge closes
   the issue and deploys.
6. **Audit, weekly** ([research-and-audit.md](research-and-audit.md)): open `seo:improve` issues for
   live pages that fall, stall on page 2 or do not convert. Treat them like step 2.
7. **Conversions first**: every research and audit run starts from the PostHog query in
   research-and-audit.md and favours page types that brought sign-ups.
8. **Digest**: after the weekly run, post a short comment on the pinned issue #68 `SEO weekly digest`:
   what shipped, what moved (clicks, positions, sign-ups by landing page), what is next.

## Limits

- At most 2 new pages a week. Google penalises scaled, low-value AI content; a new page must carry
  data or steps a reader cannot get from the top 3 results (a price table with sources, a real
  migration step, a measured result).
- Never invent numbers, customers, quotes or results. Unknown stays unknown.
- Prices, positioning and the founding offer are owner decisions: use `src/lib/site.ts`, never change them.
- Brand: **Colliedesk** (one capital). `scripts/brand-name-check.sh` fails other spellings.

## Mechanism

`scripts/content-approval.mjs` (workflow `content-approval.yml`, required by a ruleset on `main`
with no bypass) fails a PR from an `seo/` branch, with an `seo:` label or adding a page module,
until it has the label `content:approved` and a fully verified `## Claim check` table.

`scripts/content-qa.mjs` (`pnpm check:content`, in CI) fails any marketing page that reads above
grade 10, uses an em dash or an AI-slop phrase, has no call to action in the body, or quotes a
competitor price without a source link. `KNOWN_DEBT` lists pages that miss a rule today; each rule
has one `seo:improve` issue (CTA: #67), and the gate fails when a fixed page is still listed.
