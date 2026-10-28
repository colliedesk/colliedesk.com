import type { Page } from '../../lib/page';
import freshdeskToHubspot from './blog-freshdesk-to-hubspot';

const page: Page = {
  jsonLd: [],
  path: '/blog',
  section: 'Blog',
  updated: '2026-10-19',
  title: 'Colliedesk blog: practical guides for support teams',
  description: 'Practical guides for support teams, starting with what to verify before moving ticket history, attachments and workflows out of Freshdesk.',
  summary: 'Practical guides to helpdesk migration and support workflows',
  eyebrow: 'Blog',
  h1: 'Guides for support teams',
  lede: 'Checklists and practical answers to the questions that come up when running or switching a helpdesk.',
  body: `## [${freshdeskToHubspot.h1}](${freshdeskToHubspot.path})

19 October 2026 · Migration

${freshdeskToHubspot.description}`,
};
export default page;
