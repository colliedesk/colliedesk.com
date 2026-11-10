// The free help center audit: the lead page the Meta ads link to. A Freshdesk team pastes its public
// help center address and a work email (AuditForm, posted by public/audit.js to our own Colliedesk
// workspace), and a person at Colliedesk emails back the list within 24 hours. Facts for the offer
// (owner decision 09/11/2026) are in this file; nothing here loads from another origin.
import { techArticle } from '../../lib/schema';
import type { Page } from '../../lib/page';
import { AUDIT_NOTE } from '../../components/AuditForm';

const body = `## What we check

We read every public article in your help center. You get a list of:

- Dead links: links that lead to a page that no longer exists.
- Answers dated in the past.
- Prices that disagree with your pricing page.
- Searches that return nothing.

Works with Freshdesk help centers (yourcompany.freshdesk.com or your own domain).

## What a finding looks like

One team's help center had 383 articles. 19 links led to pages that no longer exist.

## Who reads it

The audit comes by email. A person at Colliedesk reads it before it is sent, so every item on the list is one you can act on.

Keep the list and fix it yourself. If you want to see what a switch would look like, read [how a Freshdesk migration works](/migrate/freshdesk) or the [Colliedesk pricing](/pricing).`;

const page: Page = {
  jsonLd: [],
  name: 'Free help center audit',
  path: '/audit',
  section: 'Migrate',
  title: 'Free help center audit for Freshdesk support teams',
  description:
    'Paste your Freshdesk help center address. We email you every dead link, outdated answer and price that disagrees with your pricing page, within 24 hours.',
  summary: 'Free audit of a Freshdesk help center: dead links, answers dated in the past, prices that disagree with the pricing page and searches that return nothing, emailed within 24 hours after a person reads it',
  updated: '2026-11-09',
  eyebrow: 'Free audit',
  h1: 'Free help center audit',
  lede: 'Dead links, outdated answers and wrong prices in your help center, sent to you by email within 24 hours.',
  pre: 'audit-form',
  preMd: `Use the form on this page: your public help center address, a work email and your team size. ${AUDIT_NOTE}`,
  body,
};
page.jsonLd = [techArticle(page)];
export default page;
