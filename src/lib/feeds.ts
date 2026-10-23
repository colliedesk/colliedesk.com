// Machine-readable files built from the page list: llms.txt, llms-full.txt, sitemap.xml,
// robots.txt, the changelog RSS feed and the Cloudflare Pages _headers file.
import { foundingFirst } from './cloud-price';
import { escapeHtml, slugify } from './markdown';
import { mdUrlOf, type ChangelogEntry, type Page, type Section } from './page';
import { LADDER_LINE, NAME, ORIGIN, POSITIONING, REPO, UPDATED } from './site';
import { markdownTwin } from './twin';

const SECTIONS: readonly Section[] = ['Product', 'Migrate', 'Compare', 'Docs', 'Blog'];

export function llmsTxt(pages: readonly Page[]): string {
  const groups = SECTIONS.map((s) => {
    const lines = pages.filter((p) => p.section === s).map((p) => `- [${p.name || p.h1}](${ORIGIN}${mdUrlOf(p.path)}): ${p.summary}`);
    return `## ${s}\n\n${lines.join('\n')}`;
  });
  return `# ${NAME}

> ${NAME} is an open-source (AGPL-3.0) helpdesk for small support teams by HC Labs: the open-source alternative to Freshdesk, Zendesk and Help Scout. ${POSITIONING} ${foundingFirst(`Colliedesk Cloud is one flat price per workspace: ${LADDER_LINE}.`)} Self-host free. Status: alpha, live on Colliedesk Cloud.

Every page has a Markdown twin: add \`.md\` to the URL (the home page is ${ORIGIN}/index.md).
All pages in one file: ${ORIGIN}/llms-full.txt
Source code: ${REPO}

${groups.join('\n\n')}
`;
}

export const llmsFullTxt = (pages: readonly Page[]): string =>
  `# ${NAME}: all pages\n\nGenerated ${UPDATED}. Each section starts with its Source URL.\n\n${pages.map(markdownTwin).join('\n---\n\n')}`;

export const sitemapXml = (pages: readonly Page[]): string => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${ORIGIN}${p.path}</loc><lastmod>${p.updated || UPDATED}</lastmod></url>`).join('\n')}
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
    .concat(['/llms.txt\n  Content-Type: text/plain; charset=utf-8', '/llms-full.txt\n  Content-Type: text/plain; charset=utf-8'])
    .join('\n') + '\n';
