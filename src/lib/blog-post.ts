// A blog post is one Markdown file in src/content/blog/: YAML front matter, then the body. The editor
// at /admin (public/admin/config.yml) writes these fields; a typo or a missing field fails the build
// instead of shipping a page with an empty title. Kept free of site imports so node:test can load it.
import { parse } from 'yaml';

export interface BlogPost {
  slug: string;
  /** URL path: /blog/<slug>. */
  path: string;
  /** SEO title, the <title> tag. */
  title: string;
  description: string;
  /** One-line summary in llms.txt. */
  summary: string;
  h1: string;
  lede?: string;
  /** ISO dates, YYYY-MM-DD. */
  published: string;
  updated: string;
  category: string;
  /** Products the post is about, for the BlogPosting JSON-LD. */
  about: string[];
  body: string;
}

const REQUIRED = ['title', 'description', 'summary', 'h1', 'published', 'category'] as const;
const OPTIONAL = ['lede', 'updated', 'about'] as const;
const KNOWN = new Set<string>([...REQUIRED, ...OPTIONAL]);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export function parsePost(file: string, raw: string): BlogPost {
  const fail = (why: string): never => {
    throw new Error(`src/content/blog/${file}: ${why}`);
  };
  const m = FRONT_MATTER.exec(raw);
  if (!m) return fail('no front matter between --- lines');
  const data: unknown = parse(m[1] ?? '');
  if (!data || typeof data !== 'object' || Array.isArray(data)) return fail('front matter is not a set of fields');
  const fields = data as Record<string, unknown>;

  for (const key of Object.keys(fields)) if (!KNOWN.has(key)) fail(`unknown field ${key}`);
  const text = (key: string): string => {
    const v = fields[key];
    if (typeof v !== 'string' || !v.trim()) return fail(`${key} is missing or empty`);
    return v.trim();
  };
  const date = (key: string): string => {
    const v = fields[key];
    const iso = v instanceof Date ? v.toISOString().slice(0, 10) : v;
    if (typeof iso !== 'string' || !ISO_DATE.test(iso)) return fail(`${key} must be a date written YYYY-MM-DD`);
    return iso;
  };

  const about = fields['about'] ?? [];
  if (!Array.isArray(about) || about.some((a) => typeof a !== 'string')) fail('about must be a list of names');
  const slug = file.replace(/\.md$/, '');
  const published = date('published');
  const post: BlogPost = {
    slug,
    path: `/blog/${slug}`,
    title: text('title'),
    description: text('description'),
    summary: text('summary'),
    h1: text('h1'),
    published,
    updated: fields['updated'] === undefined ? published : date('updated'),
    category: text('category'),
    about: about as string[],
    body: (m[2] ?? '').trim(),
  };
  if (fields['lede'] !== undefined) post.lede = text('lede');
  return post;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** 2026-10-19 -> 19 October 2026, the date style of the site. */
export function longDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[(m ?? 1) - 1]} ${y}`;
}
