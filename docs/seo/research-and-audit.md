# Weekly research and audit

Run once a week, research first. Each run opens issues from `.github/ISSUE_TEMPLATE/seo-task.yml`;
it does not write pages. Credits: stay within the owner's DataForSEO budget (OpenSEO shows the cost).

## 1. Conversions (start here)

1. In PostHog (Colliedesk project), list the landing pages (`$entry_pathname`, `$host = colliedesk.com`)
   of sessions in the last 28 days that reached trial sign-up or founding checkout.
2. Note the page types that convert (vs page, migration guide, pricing history, article). Weight
   step 2 and step 3 toward those types. With no conversions yet, weight toward migration and
   price-increase intent: that is where the reader is close to buying.

## 2. Research: new pages (`seo:new`, at most 2 a week)

1. Search Console, last 28 days: `get_search_console_performance` with `dimensions: ['query','page']`.
   Queries with impressions but no page written for them are the first candidates.
2. Seed keywords from the reader's problems: Freshdesk price increase, renewal, export tickets,
   migrate to X, Freshdesk alternative for small teams, per-agent pricing, Freddy AI cost.
   Add questions prospects asked on X, Reddit or email this week.
3. `research_keywords` and `get_keyword_metrics` (US, en): keep keywords with intent from the reader
   above, KD the domain can reach (start under 30), and no page on this site already targeting them.
4. `get_serp_results` for each candidate: write down what the top 3 pages cover and what they miss.
   No gap you can fill with data or real steps → drop the keyword.
5. Open one issue per kept keyword, label `seo:new`, with the brief from the template.

## 3. Audit: live pages (`seo:improve`)

1. Search Console, last 28 days vs the 28 days before, `dimensions: ['page']` and `['query','page']`.
2. Open an issue for each page that:
   - has queries at position 5–20 with ≥ 50 impressions (`minPosition: 5, maxPosition: 20`);
   - lost more than 30% of clicks or impressions;
   - has CTR under 1% at position ≤ 10 (title and description do not match the query);
   - gets search traffic but no sign-ups while similar pages convert.
3. `run_site_audit` monthly: open issues for crawl, speed or markup errors.
4. `KNOWN_DEBT` in `scripts/content-qa.mjs` has one open `seo:improve` issue per rule, listing its pages.
5. A competitor changed a price (read the source on a `/vs` page older than 90 days) → issue to update it.

## 4. Digest

Comment on the pinned issue #68 `SEO weekly digest`: pages shipped, Search Console clicks and
impressions (this 28 days vs last), sign-ups by landing page, issues opened, credits spent.
Five lines or fewer. No numbers without their source.
