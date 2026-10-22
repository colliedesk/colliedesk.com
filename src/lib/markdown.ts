import { Marked } from 'marked';
import { ORIGIN } from './site';

export const slugify = (text: string): string =>
  text.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Markdown -> HTML with heading ids (deep links), scrollable tables and external links marked.
export function renderMarkdown(md: string): string {
  const marked = new Marked({ gfm: true, async: false });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        return `<h${depth} id="${slugify(text)}">${text}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href) && !href.startsWith(ORIGIN);
        const attrs = external ? ' rel="noopener"' : '';
        const t = title ? ` title="${escapeHtml(title)}"` : '';
        return `<a href="${escapeHtml(href)}"${t}${attrs}>${text}</a>`;
      },
    },
  });
  const html = marked.parse(md);
  if (typeof html !== 'string') throw new Error('marked returned a promise; async rendering is not supported');
  return (
    html
      // "**Coming after beta**" / "**Beta 0.1.0**" / "**Available now**" in Markdown become status badges in HTML.
      .replace(/<strong>(Beta(?: [\d.]+)?|Coming (?:after beta|later))<\/strong>/g, '<span class="badge badge-coming">$1</span>')
      .replace(/<strong>(Available now)<\/strong>/g, '<span class="badge badge-shipped">$1</span>')
      .replace(/<table>/g, '<div class="table-wrap" role="region" aria-label="Table" tabindex="0"><table>')
      .replace(/<\/table>/g, '</table></div>')
  );
}

// Inline Markdown (a lede) without the wrapping paragraph.
export const renderInline = (md: string): string => renderMarkdown(md).replace(/^<p>|<\/p>\n?$/g, '');

// Markdown twin links must work outside the site, so root-relative links become absolute.
export const absolutizeMarkdownLinks = (md: string): string => md.replace(/\]\(\/(?!\/)/g, `](${ORIGIN}/`);

// Markdown -> plain text for meta descriptions and JSON-LD.
export const plain = (md: string): string => md.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '');
