import { longDate } from '../../lib/blog-post';
import type { Page } from '../../lib/page';
import { blogPosts } from './blog-posts';

// The /blog index lists every post in src/content/blog/, newest first.
export function blogIndex(): Page {
  const posts = blogPosts();
  return {
    jsonLd: [],
    path: '/blog',
    section: 'Blog',
    updated: posts[0]?.updated ?? '2026-10-19',
    title: 'Colliedesk blog: practical guides for support teams',
    description: 'Practical guides for support teams, starting with what to verify before moving ticket history, attachments and workflows out of Freshdesk.',
    summary: 'Practical guides to helpdesk migration and support workflows',
    eyebrow: 'Blog',
    h1: 'Guides for support teams',
    lede: 'Checklists and practical answers to the questions that come up when running or switching a helpdesk.',
    body: [
      ...posts.map((p) => `## [${p.h1}](${p.path})\n\n${longDate(p.published)} · ${p.category}\n\n${p.description}`),
      'Leaving Freshdesk for Colliedesk? Start with the [Freshdesk migration guide](/migrate/freshdesk), or see [pricing](/pricing).',
    ].join('\n\n'),
  };
}
