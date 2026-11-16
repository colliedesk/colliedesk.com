// What the docs navigation of one section implies for a page: its breadcrumb, the pages before and after
// it, and the groups that get their own llms.txt. Pure functions over the nav items repo-docs.ts builds
// from a README, so the README order stays the one source of order.
import { slugify } from './markdown';
import type { DocsCrumb, DocsGroup, DocsNavGroup, DocsNavItem, DocsPlace } from './page';

type Items = DocsNavGroup['items'];

const links = (items: Items): DocsNavItem[] => items.filter((i): i is DocsNavItem => !('items' in i));

/**
 * base: the crumbs down to the section overview, e.g. Docs › Self-host. A page in a "## Heading" group
 * adds the group name. Previous and next stay inside the list the page is in: the group, or the
 * section's ungrouped pages.
 */
export function docsPlace(items: Items, path: string, base: readonly Required<DocsCrumb>[]): DocsPlace {
  const lists: { title?: string; pages: DocsNavItem[] }[] = [
    { pages: links(items) },
    ...items.flatMap((i) => ('items' in i ? [{ title: i.title, pages: i.items }] : [])),
  ];
  for (const { title, pages } of lists) {
    const at = pages.findIndex((p) => p.href === path);
    const item = pages[at];
    if (!item) continue;
    const group = title ? [{ label: title }] : [];
    const overview = base.at(-1)?.href === path;
    const place: DocsPlace = { crumbs: overview ? [...base] : [...base, ...group, { label: item.label }], label: item.label };
    const prev = pages[at - 1];
    const next = pages[at + 1];
    if (prev) place.prev = prev;
    if (next) place.next = next;
    return place;
  }
  throw new Error(`${path} is not in its section's docs navigation`);
}

/**
 * One group per "## Heading" list, titled with prefix (the self-host groups say "Self-host: …"), plus
 * one for the section's ungrouped guides; the overview is the section index and belongs to none.
 */
export function docsGroups(items: Items, sectionTitle: string, overview: string, prefix = ''): DocsGroup[] {
  const groups: DocsGroup[] = [];
  const loose = links(items).map((i) => i.href).filter((href) => href !== overview);
  if (loose.length) groups.push({ slug: slugify(sectionTitle), title: sectionTitle, paths: loose });
  for (const item of items) {
    if ('items' in item) {
      const title = `${prefix}${item.title}`;
      groups.push({ slug: slugify(title), title, paths: item.items.map((i) => i.href) });
    }
  }
  return groups;
}
