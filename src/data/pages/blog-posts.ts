// Blog posts are Markdown files in src/content/blog/, edited in the browser at /admin (Sveltia CMS,
// public/admin/config.yml) or by hand. Every file becomes a page under /blog; the file name is the slug.
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parsePost, type BlogPost } from '../../lib/blog-post';
import type { Page } from '../../lib/page';
import { techArticle } from '../../lib/schema';

const dir = resolve('src/content/blog');

/** Every post, newest first. */
export function blogPosts(): BlogPost[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parsePost(f, readFileSync(resolve(dir, f), 'utf8')))
    .sort((a, b) => b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug));
}

export function postPage(post: BlogPost): Page {
  const page: Page = {
    jsonLd: [],
    name: post.h1,
    path: post.path,
    updated: post.updated,
    section: 'Blog',
    title: post.title,
    description: post.description,
    summary: post.summary,
    eyebrow: `Blog · ${post.category}`,
    h1: post.h1,
    body: post.body,
  };
  if (post.lede) page.lede = post.lede;
  page.jsonLd = [{
    ...techArticle(page),
    '@type': 'BlogPosting',
    datePublished: post.published,
    about: post.about.map((name) => ({ '@type': 'SoftwareApplication', name })),
  }];
  return page;
}
