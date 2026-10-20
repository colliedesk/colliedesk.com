# Write and QA a page

Input: one open issue labelled `seo:new` or `seo:improve`. Output: a green PR that closes it.

## Write

1. Read the issue brief: target keyword, search intent, the top 3 results and what they miss.
2. Read the pages it links to (`src/data/pages/*.ts`) and `src/lib/site.ts` for prices and facts.
3. Create a branch `seo/<slug>` from `origin/main`.
4. Add or edit one `Page` module. New page: register it in `src/data/pages/index.ts`. Articles go
   under `/blog/<slug>` when `/blog` exists (colliedesk.com#64); until then, a top-level path.
5. Shape the page for the reader in the brief:
   - Answer the search question in the first two sentences.
   - One idea per section. Tables for numbers, numbered steps for procedures.
   - Every competitor price: a source link and the date you read it ("read 20 October 2026").
   - At least one call to action in the body, matched to intent: `/migrate/freshdesk` for "export"
     and "migrate", `/pricing` for "price" and "alternative", `/#founding` near a renewal story.
   - 3–5 FAQ items with the questions people ask (People Also Ask in the SERP data).
   - Links to 2–3 related pages on this site, and from 1–2 of them back to this page.
6. Run `pnpm build && pnpm check && pnpm check:content && pnpm check:render`.

## QA checklist

Run it as a separate pass, after writing. Read the page as the reader in the brief, not as its writer.
A "no" on any line fails the page; fix it and run the whole checklist again.

1. Does the first screen answer the question in the title?
2. Is every number, date and feature claim true? Open each source link; check Colliedesk features
   against `ROADMAP.md` and `docs/user` in colliedesk/colliedesk. Unshipped features carry `**Coming v0.N**`.
3. Is there a claim about a customer, a quote or a result that has no source? Remove it.
4. Does the page add something the top 3 results do not have? Name it in the PR description.
5. Would a support lead with no SEO knowledge read it to the end? No filler intro, no repeated point.
6. Are title (≤ 60 characters) and meta description (120–160 characters) specific to this page?
7. Is the call to action the next step for this intent, not a generic "sign up"?
8. Does `pnpm check:content` pass without a new `KNOWN_DEBT` entry?

## PR

- Title: `content: <what the reader gets>`. Body: `Closes #N`, the keyword, what the page adds over
  the top 3 results, and the QA checklist with each answer.
- Merge when CI is green. After merge, request indexing is not needed; the sitemap carries the page.
