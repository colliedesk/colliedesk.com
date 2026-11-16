// Machine-readable files built from the page list: llms.txt, llms-full.txt, sitemap.xml,
// robots.txt, the changelog RSS feed and the Cloudflare Pages _headers file.
import { AGENT_INSTRUCTIONS } from './agent-instructions';
import { foundingFirst } from './cloud-price';
import { escapeHtml, slugify } from './markdown';
import { mdUrlOf, type ChangelogEntry, type DocsGroup, type Page, type Section } from './page';
import { pageDate } from './page-date.mjs';
import { LADDER_LINE, NAME, ORIGIN, POSITIONING, REPO, UPDATED } from './site';
import { markdownTwin } from './twin';

const SECTIONS: readonly Section[] = ['Product', 'Migrate', 'Compare', 'Docs'];

const entry = (p: Page): string => `- [${p.name || p.h1}](${ORIGIN}${mdUrlOf(p.path)}): ${p.summary}`;

// Per-group files live under /llms/<group>/: no page path starts with /llms/, so a group named like a
// page can never take its URL (src/pages/llms/[group] fails the build if one ever does).
export const groupUrl = (group: DocsGroup, file: 'llms.txt' | 'llms-full.txt'): string => `${ORIGIN}/llms/${group.slug}/${file}`;

const pagesOf = (group: DocsGroup, pages: readonly Page[]): Page[] =>
  group.paths.map((path) => {
    const page = pages.find((p) => p.path === path);
    if (!page) throw new Error(`docs group "${group.title}" lists ${path}, which is not a page`);
    return page;
  });

export function llmsTxt(pages: readonly Page[], docsGroups: readonly DocsGroup[]): string {
  const byGroup = docsGroups.map((g) => `- [${g.title}](${groupUrl(g, 'llms.txt')}): ${pagesOf(g, pages).map((p) => p.h1).join(', ')}. Full text: ${groupUrl(g, 'llms-full.txt')}`);
  const groups = [`## Docs by group\n\n${byGroup.join('\n')}`, ...SECTIONS.map((s) => `## ${s}\n\n${pages.filter((p) => p.section === s).map(entry).join('\n')}`)];
  return `# ${NAME}

> ${NAME} is an open-source (AGPL-3.0) helpdesk for small support teams by HC Labs: the open-source alternative to Freshdesk, Zendesk and Help Scout. ${POSITIONING} ${foundingFirst(`Colliedesk Cloud is one flat price per workspace: ${LADDER_LINE}.`)} Self-host free. Status: generally available, live on Colliedesk Cloud.

Every page has a Markdown twin: add \`.md\` to the URL (the home page is ${ORIGIN}/index.md).
All pages in one file: ${ORIGIN}/llms-full.txt
Docs one group at a time, in smaller files: ${ORIGIN}/llms/<group>/llms.txt lists a group's pages and ${ORIGIN}/llms/<group>/llms-full.txt holds their full text; the groups are under "Docs by group" below.
Source code: ${REPO}

${AGENT_INSTRUCTIONS}
${groups.join('\n\n')}
`;
}

const twins = (pages: readonly Page[]): string => pages.map((p) => markdownTwin(p, { agentBlock: false })).join('\n---\n\n');

export const llmsFullTxt = (pages: readonly Page[]): string =>
  `# ${NAME}: all pages\n\nGenerated ${UPDATED}. Each section starts with its Source URL.\n\n${AGENT_INSTRUCTIONS}\n${twins(pages)}`;

export function llmsGroupTxt(group: DocsGroup, pages: readonly Page[]): string {
  return `# ${NAME} docs: ${group.title}

> The ${NAME} guides in the group "${group.title}". Their full text in one file: ${groupUrl(group, 'llms-full.txt')}. Every page of the site: ${ORIGIN}/llms.txt

${AGENT_INSTRUCTIONS}
## ${group.title}

${pagesOf(group, pages).map(entry).join('\n')}
`;
}

export function llmsGroupFullTxt(group: DocsGroup, pages: readonly Page[]): string {
  const own = pagesOf(group, pages);
  const updated = own.map((p) => pageDate(p, UPDATED)).filter(Boolean).sort().at(-1);
  return `# ${NAME} docs: ${group.title}, full text\n\n${updated ? `Updated ${updated}. ` : ''}Each section starts with its Source URL. Index of this group: ${groupUrl(group, 'llms.txt')}\n\n${AGENT_INSTRUCTIONS}\n${twins(own)}`;
}

export const sitemapXml = (pages: readonly Page[]): string => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${ORIGIN}${p.path}</loc>${pageDate(p, UPDATED) ? `<lastmod>${pageDate(p, UPDATED)}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`;

// Explicitly welcome search and AI crawlers; nothing on this site is private.
const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bingbot', 'DuckAssistBot', 'Meta-ExternalAgent', 'MistralAI-User'];

export const robotsTxt = (): string =>
  `${AI_BOTS.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n')}\n\nUser-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`;

export const changelogRss = (entries: readonly ChangelogEntry[]): string => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${NAME} changelog</title><link>${ORIGIN}/changelog</link><description>What shipped in ${NAME}, release by release.</description>
${entries.map((e) => `<item><title>${escapeHtml(e.title)}</title><link>${ORIGIN}/changelog#${slugify(e.title)}</link><guid isPermaLink="false">colliedesk-${e.version}</guid><pubDate>${new Date(`${e.date}T00:00:00Z`).toUTCString()}</pubDate><description>${escapeHtml(e.md)}</description></item>`).join('\n')}
</channel></rss>
`;

// Cloudflare Pages: serve twins as Markdown and point each twin's canonical at its HTML page.
export const headersFile = (pages: readonly Page[]): string =>
  pages
    .map((p) => `${mdUrlOf(p.path)}\n  Content-Type: text/markdown; charset=utf-8\n  Link: <${ORIGIN}${p.path}>; rel="canonical"`)
    .concat(['/llms.txt', '/llms-full.txt', '/llms/*'].map((path) => `${path}\n  Content-Type: text/plain; charset=utf-8`))
    .join('\n') + '\n';
