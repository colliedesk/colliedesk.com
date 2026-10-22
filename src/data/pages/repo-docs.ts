// Pages rendered from Markdown that lives in the product repository (colliedesk/colliedesk):
// docs/user/*.md (user guides, under /docs), docs/self-host/*.md (running your own server, under
// /docs/self-host) and ROADMAP.md. Those files stay the single source; the site only rewrites
// their links. PRODUCT_DIR points at a checkout of that repo (default ./product).
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { plain } from '../../lib/markdown';
import type { DocsNavGroup, Page } from '../../lib/page';
import { techArticle } from '../../lib/schema';
import { REPO } from '../../lib/site';

const repoRoot = resolve(process.env['PRODUCT_DIR'] || 'product');

function readRepo(rel: string): string {
  try {
    return readFileSync(join(repoRoot, rel), 'utf8');
  } catch (err) {
    throw new Error(`cannot read ${rel} from the product checkout at ${repoRoot} (set PRODUCT_DIR): ${String(err)}`);
  }
}

// The two docs directories: user guides for everyone, self-host for the person running a server.
const SECTIONS = [
  { dir: 'docs/user', path: '/docs', title: 'User guides' },
  { dir: 'docs/self-host', path: '/docs/self-host', title: 'Self-host' },
] as const;
type DocsSection = (typeof SECTIONS)[number];

// Order and slugs follow the list links in each directory's README.md, so a new guide only needs a
// line there. A list under a "## Heading" becomes a nested group of that name in the sidebar, the way
// PostHog nests "Configure" under its self-host overview. Links inside prose are not pages of the nav.
interface DocEntry {
  file: string;
  group?: string;
}

function docEntries(section: DocsSection): DocEntry[] {
  const entries: DocEntry[] = [];
  let group: string | undefined;
  for (const line of readRepo(`${section.dir}/README.md`).split('\n')) {
    const heading = line.match(/^## (.+)$/);
    if (heading) group = heading[1];
    const link = line.match(/^- \[[^\]]+\]\(([a-z-]+)\.md\)/);
    if (link?.[1]) entries.push(group ? { file: link[1], group } : { file: link[1] });
  }
  return entries;
}

const docFiles = (section: DocsSection): string[] => docEntries(section).map((e) => e.file);

function sectionNav(section: DocsSection): DocsNavGroup['items'] {
  const items: DocsNavGroup['items'] = [{ href: section.path, label: 'Overview' }];
  for (const { file, group } of docEntries(section)) {
    const item = { href: `${section.path}/${file}`, label: titleOf(section, file) };
    const last = items.at(-1);
    if (!group) items.push(item);
    else if (last && 'items' in last && last.title === group) last.items.push(item);
    else items.push({ title: group, items: [item] });
  }
  return items;
}

function rewriteLink(href: string, fromDir: string): string {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const [path = '', hash = ''] = href.split('#');
  const frag = hash ? `#${hash}` : '';
  const resolved = new URL(path, `https://repo/${fromDir}`).pathname.slice(1); // repo-relative
  if (resolved === 'ROADMAP.md') return `/roadmap${frag}`;
  for (const { dir, path: base } of SECTIONS) {
    if (resolved === `${dir}/README.md`) return `${base}${frag}`;
    const doc = resolved.match(new RegExp(`^${dir}/([a-z-]+)\\.md$`));
    if (doc) return `${base}/${doc[1]}${frag}`;
  }
  return `${REPO}/blob/main/${resolved}${frag}`;
}

const rewriteLinks = (md: string, fromDir: string): string =>
  md.replace(/\]\(([^)\s]+)\)/g, (_, href: string) => `](${rewriteLink(href, fromDir)})`);

// Splits "# Title\n\nFirst paragraph\n\nrest" into parts. The first paragraph becomes the lede
// unless it is a list, table or code block.
function split(md: string, file: string): { title: string; lede: string; body: string } {
  const m = md.match(/^# (.+)\n+([\s\S]*)$/);
  if (!m?.[1] || m[2] === undefined) throw new Error(`${file}: expected a "# Title" first line`);
  const [, title, rest] = m;
  const [first, ...others] = rest.split(/\n\s*\n/);
  const isProse = first && !/^(\s*[-|*]\s|\s*\d+\.\s|```)/.test(first) && !/\n\s*[-*]\s/.test(first);
  return isProse ? { title, lede: first.replace(/\n/g, ' '), body: others.join('\n\n') } : { title, lede: '', body: rest };
}

function titleOf(section: DocsSection, file: string): string {
  const title = readRepo(`${section.dir}/${file}.md`).match(/^# (.+)$/m)?.[1];
  if (!title) throw new Error(`${section.dir}/${file}.md has no "# Title" line`);
  return title;
}

// Like PostHog's docs, a page lists every guide of its own section first; the other section is
// one link to its overview, so a self-hoster is not scrolling past the user guides and back.
const docsNav = (current: DocsSection): DocsNavGroup[] =>
  [current, ...SECTIONS.filter((section) => section !== current)].map((section) => ({
    title: section.title,
    items:
      section === current
        ? sectionNav(section)
        : [{ href: section.path, label: section === SECTIONS[0] ? 'All user guides' : 'Run Colliedesk on your own server' }],
  }));

function docPage(path: string, file: string, summaryFallback: string, withNav = true): Page {
  const fromDir = file.slice(0, file.lastIndexOf('/') + 1);
  const { title, lede, body } = split(rewriteLinks(readRepo(file), fromDir), file);
  const page: Page = {
    path,
    section: 'Docs',
    title: `${title} · Colliedesk docs`,
    description: `${plain(lede || summaryFallback)} Colliedesk ${path.startsWith('/docs/self-host') ? 'self-host' : 'user'} guide (alpha).`,
    summary: plain(lede || summaryFallback),
    eyebrow: 'Docs',
    h1: title,
    lede,
    body,
    sourceUrl: `${REPO}/blob/main/${file}`,
    jsonLd: [],
  };
  if (withNav) page.docsNav = docsNav(path.startsWith(SECTIONS[1].path) ? SECTIONS[1] : SECTIONS[0]);
  page.jsonLd = [techArticle(page)];
  return page;
}

export function docsPages(): Page[] {
  const [user, selfHost] = SECTIONS;
  const index = docPage(user.path, `${user.dir}/README.md`, 'One page per Colliedesk feature: what it does, how to use it, and its limits.');
  index.h1 = 'Colliedesk docs';
  index.title = 'Colliedesk docs: sign in, invite your team, work the inbox';
  const selfHostIndex = docPage(selfHost.path, `${selfHost.dir}/README.md`, 'Install, configure and back up Colliedesk on your own server.');
  selfHostIndex.title = 'Self-host Colliedesk: install, upgrade, configure, troubleshoot';
  const guides = SECTIONS.flatMap((section) =>
    docFiles(section).map((f) =>
      docPage(`${section.path}/${f}`, `${section.dir}/${f}.md`, `How ${titleOf(section, f).toLowerCase()} works in Colliedesk.`),
    ),
  );
  return [index, selfHostIndex, ...guides];
}

export function roadmapPage(): Page {
  const page = docPage('/roadmap', 'ROADMAP.md', '', false);
  Object.assign(page, {
    section: 'Product',
    eyebrow: 'Roadmap',
    h1: 'Colliedesk roadmap',
    title: 'Colliedesk roadmap: alpha is live, beta next, AI after beta',
    description:
      'What Colliedesk has shipped and what comes next: alpha with email and the Freshdesk importer on Colliedesk Cloud, then beta (new conversation, contact history), then AI. Dates are targets.',
    summary: 'Now alpha (email, Freshdesk and Help Scout importers, knowledge base, Cloud trial); next beta; then AI; later automations, SLA, reports',
  } satisfies Partial<Page>);
  page.jsonLd = [techArticle(page)];
  return page;
}
