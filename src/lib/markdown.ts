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
    wrapTables(html)
      // "**Shipped**" / "**Not built yet**" in Markdown become status badges in HTML. Colliedesk as a
      // whole is alpha, so a feature is either shipped or not built yet; there is no other label.
      .replace(/<strong>(Not built yet)<\/strong>/g, '<span class="badge badge-coming">$1</span>')
      .replace(/<strong>(Shipped)<\/strong>/g, '<span class="badge badge-shipped">$1</span>')
      .replace(/<\/table>/g, '</table></div>')
  );
}

// Each table scrolls in its own region. The region is named after the section it sits in, so screen
// readers can tell the regions apart; a second table in the same section gets a number. Heading text
// is already escaped by marked, so it goes into the attribute as it is.
function wrapTables(html: string): string {
  let section = 'Table';
  const seen = new Map<string, number>();
  return html.replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>|<table>/g, (match, heading: string | undefined) => {
    if (heading !== undefined) {
      section = heading.replace(/<[^>]+>/g, '').trim() || 'Table';
      return match;
    }
    const n = (seen.get(section) ?? 0) + 1;
    seen.set(section, n);
    const name = n === 1 ? section : `${section} (${n})`;
    return `<div class="table-wrap" role="region" aria-label="${name}" tabindex="0"><table>`;
  });
}

// Inline Markdown (a lede) without the wrapping paragraph.
export const renderInline = (md: string): string => renderMarkdown(md).replace(/^<p>|<\/p>\n?$/g, '');

// Applies fn to the Markdown outside code: fenced blocks and inline code spans pass through unchanged,
// so a link written as an example inside code is never rewritten.
const CODE = /^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[^\n]*$|(`+)(?!`)[\s\S]*?[^`]\2(?!`)/gm;
export function outsideCode(md: string, fn: (prose: string) => string): string {
  let out = '';
  let last = 0;
  for (const m of md.matchAll(CODE)) {
    out += fn(md.slice(last, m.index)) + m[0];
    last = m.index + m[0].length;
  }
  return out + fn(md.slice(last));
}

// Markdown twin links must work outside the site (a twin is pasted into an AI chat, an issue, an
// email), so root-relative links become absolute. With the page path, in-page anchors do too:
// "](#x)" on /docs/inbox becomes "](https://colliedesk.com/docs/inbox#x)".
export const absolutizeMarkdownLinks = (md: string, pagePath?: string): string =>
  outsideCode(md, (prose) => {
    const rooted = prose.replace(/\]\(\/(?!\/)/g, `](${ORIGIN}/`);
    return pagePath === undefined ? rooted : rooted.replace(/\]\(#/g, `](${ORIGIN}${pagePath}#`);
  });

// Markdown -> plain text for meta descriptions and JSON-LD.
export const plain = (md: string): string => md.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '');
