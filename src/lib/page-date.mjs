// The date a page last changed, for its "Updated" line, JSON-LD, sitemap and llms files. Plain
// JavaScript so scripts/page-date.test.mjs runs it without a build.

/**
 * A page rendered from the product repo (it has a sourceUrl) is dated only by its own file's git
 * history: without that history it has no date, because the site-wide date would claim a change that
 * never happened. A page written in this repo falls back to the site-wide date.
 * @param {{ updated?: string, sourceUrl?: string }} page
 * @param {string} siteUpdated
 * @returns {string | undefined}
 */
export function pageDate(page, siteUpdated) {
  if (page.updated) return page.updated;
  return page.sourceUrl ? undefined : siteUpdated;
}
