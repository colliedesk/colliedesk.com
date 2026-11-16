import type { GetStaticPaths } from 'astro';
import { allPages } from './pages';
import { docsGroupList } from './pages/repo-docs';
import type { DocsGroup } from '../lib/page';

// One llms.txt and one llms-full.txt per docs group, at /llms/<group>/. The /llms/ prefix belongs to
// these files: a page there would share a URL space with a group, so the build refuses one.
export const groupPaths = (() => {
  const clash = allPages().find((p) => p.path === '/llms' || p.path.startsWith('/llms/'));
  if (clash) throw new Error(`${clash.path}: /llms/ is reserved for the per-group llms.txt files`);
  return docsGroupList().map((group) => ({ params: { group: group.slug }, props: { group } }));
}) satisfies GetStaticPaths;

export interface GroupProps {
  group: DocsGroup;
}
