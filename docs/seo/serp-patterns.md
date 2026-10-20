# SERP patterns

What the pages that rank top 3 for our main keywords do, by page type. Read it before you write or
improve a page. Copy the shape, never the words: a page still has to add data or steps the top 3
do not have ([README.md](README.md), Limits).

Measured 20 October 2026: Google US, English, OpenSEO `get_serp_results` (depth 10). Each page was
fetched and its main content counted (words, `h2`, tables, links). Refresh every quarter
([research-and-audit.md](research-and-audit.md), section 4). Next refresh: January 2027.

## Rules every page type shares

`pnpm check:content` enforces the first three.

| Rule | Top 3 pages | Colliedesk on 20 October 2026 |
|---|---|---|
| Title ≤ 60 characters | 47–60 on 9 of 12 pages; the other 3 are 75–85 | 57–85; 22 of 24 pages are over 60 |
| Meta description 120–160 characters | 132–156 on 9 of 12 pages; 2 are longer, 1 has none | 155–228; 22 of 24 pages are outside 120–160 |
| Links to ≥ 2 other pages on the site | 8–145 internal links on 10 of 12 pages | 0–15; 11 pages link fewer than 2 |
| FAQ section near the end | 5 of 12 pages | every page (FAQPage JSON-LD) |
| Words in the main content | median about 2,200 | 479–935 |

Word count is not a target: a longer page only wins when the extra sections answer real questions.
Use the section lists below to find what is missing, then write those sections.

## Internal links: the cal.com pattern

cal.com ranks its own comparison posts (`/blog/setmore-vs-cal.com`, read 20 October 2026) with
links in two places. Every page here follows it:

1. **In the sentence.** The anchor is the exact phrase the reader would click: "round-robin
   scheduling", not "click here". Link 2–3 phrases of the short answer or the first sections to the page
   that explains them, where the text already has such a phrase: price phrases to `/pricing`, "leaving Freshdesk" or "importer" to `/migrate/freshdesk`,
   "self-host" to `/self-hosted-helpdesk`, "Freshdesk prices" to `/freshdesk-pricing-history`, "ticket export" to `/migrate/freshdesk/export`, "open database" or "code you can fork" to `/open-source`,
   team size to `/helpdesk-for-small-teams`. Never add a sentence only to carry a link.
2. **Related comparisons, at the end.** cal.com ends each post with 3 "Recommended reads". Our
   `/vs` pages end with `## Related comparisons`: 3 `/vs` pages for tools the same reader also
   considers, then `/compare`. Pick by reader (open source, email-first, per-agent suites), not
   at random, and keep each set different.

## Comparison page (`/vs/<tool>`)

Keyword measured: `freshdesk vs help scout`. Top 3: kayako.com (2,234 words, 9 `h2`, FAQ),
freshworks.com (1,324 words, 13 `h2`, FAQPage), helpscout.com (2,845 words, 9 `h2`).
Colliedesk `/vs/help-scout`: 775 words, 7 `h2`.

Sections that recur in the top 3, in this order:

1. A short answer first: who should pick each tool (kayako: "The 30-second answer").
2. One side-by-side table of features and plans.
3. Pricing, including the free tier and the AI add-on price per seat or per resolution.
4. Ease of setup, integrations, scale: one short section each.
5. What users say, with the review site named (G2, Capterra, Reddit).
6. Migration: what moves and what does not.
7. "How to choose, by scenario": team size and channel mix.
8. FAQ.

Titles: `<A> vs <B>: <what the reader gets> 2026`, 48–49 characters for the two shortest.

## Alternatives list (`/freshdesk-alternative`)

Keyword measured: `freshdesk alternative`. Top 3 readable: fluentsupport.com (1,752 words, 5 `h2`),
octabyte.io (719 words, 4 `h2`, 1 table), activepieces.com (2,883 words, 9 `h2`, FAQ).
devrev.ai (rank 3) blocked the fetch and was skipped. Colliedesk: 663 words, 4 `h2`, 1 table.

Sections that recur in the top 3:

1. What makes a good alternative: the criteria, before the list.
2. The list grouped by use case (enterprise, lean team, open source), not one flat ranking.
3. One comparison table: price, hosting, import.
4. A migration checklist.
5. FAQ about switching.

Two of the three titles carry a count or a year: `13 Freshdesk Alternatives and Competitors by Use Case (2026)`.

## Migration guide (`/migrate/<tool>`, `/migrate/<tool>/export`)

Keyword measured: `migrate from freshdesk`. Top 3: freshworks.com (2,224 words, 12 `h2`),
help-desk-migration.com (5,407 words, 17 `h2`, FAQ), docs.zammad.org (885 words, 5 `h2`). The
help.zoho.com article (rank 5) renders in JavaScript and was skipped.
Colliedesk `/migrate/freshdesk`: 689 words, 8 `h2`.

Sections that recur in the top 3:

1. The steps as a numbered list, 5 steps or fewer at the top level.
2. What data moves and what does not (a table).
3. Limitations and prerequisites (API key, plan, rate limits).
4. A test run on a sample before the full run.
5. After the migration: what to check, how to start over.
6. FAQ.

## Pricing explainer (`/freshdesk-pricing-history`, future `/blog` pricing posts)

Keyword measured: `freshdesk pricing`. The vendor page ranks first; the third-party top 3:
desk365.io (2,558 words, 17 `h2`, 9 tables), helpdesk.com (5,209 words, 20 `h2`, 11 tables, FAQ),
happyfox.com (728 words, 11 `h2`). Colliedesk `/freshdesk-pricing-history`: 479 words, 5 `h2`, 2 tables.

Sections that recur in the top 3:

1. One sentence with the price range per agent per month, billed annually.
2. Each plan in its own section or table row.
3. Add-ons: AI (Freddy) per seat or per session, Omni, chat, phone.
4. Hidden costs: minimum seats, annual lock-in, add-ons needed for common features.
5. What a team of N agents pays (desk365: "What a 12-agent support team pays").
6. Monthly vs annual billing.
7. Comparison with the publisher's own product.

Titles: `Freshdesk Pricing 2026: <angle>`, 47–60 characters.

## Refresh

Every quarter, for each page type above:

1. `get_serp_results` for the keyword in its section (depth 10, about 5 credits each).
2. Fetch the top 3 organic pages that are articles. Skip forums, the vendor's own pricing page and
   pages that block the fetch; take the next one and say so.
3. Count words, `h2`, tables, internal links, FAQ, title and description length.
4. Update the numbers, the section lists and the date above in one PR labelled `seo:improve`.
   If a length limit changes, change `scripts/content-qa.mjs` and its test in the same PR.
