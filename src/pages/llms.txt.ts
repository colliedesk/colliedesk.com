import type { APIRoute } from 'astro';
import { allPages } from '../data/pages';
import { docsGroupList } from '../data/pages/repo-docs';
import { llmsTxt } from '../lib/feeds';

export const GET: APIRoute = () => new Response(llmsTxt(allPages(), docsGroupList()), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
