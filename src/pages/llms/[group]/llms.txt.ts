import type { APIRoute } from 'astro';
import { allPages } from '../../../data/pages';
import { llmsGroupTxt } from '../../../lib/feeds';
import { groupPaths, type GroupProps } from '../../../data/llms-group-paths';

export const getStaticPaths = groupPaths;

export const GET: APIRoute<GroupProps> = ({ props }) =>
  new Response(llmsGroupTxt(props.group, allPages()), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
