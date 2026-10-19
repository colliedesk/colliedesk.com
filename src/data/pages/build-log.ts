import { techArticle } from '../../lib/schema';
import type { Page } from '../../lib/page';
import { REPO } from '../../lib/site';

// Where the founder's X profile links: who is building Colliedesk, what the emails contain, and
// the signup box above the fold. The signup lands in HC Labs' own Colliedesk workspace with the
// source "site:updates /build-log".
const body = `## What you get

- One email when a release ships, with the changes in plain words.
- The real numbers as they move: founding customers, what we fixed, what we got wrong.

## Follow along elsewhere

- On X: [@hiimchinh](https://x.com/hiimchinh).
- The code: [github.com/colliedesk/colliedesk](${REPO}).
- What is next: [roadmap](/roadmap). What shipped: [changelog](/changelog).

## Want to use it now?

The first ten teams get the [founding plan](/#founding): $100 per year, locked for life, with free Freshdesk migration.`;

const page: Page = {
  path: '/build-log',
  section: 'Product',
  name: 'Build log',
  title: 'Follow the Colliedesk build: notes from the founder',
  description: 'Colliedesk is an open-source helpdesk with one flat price per workspace, built in public. Get one email when a release ships or a number moves.',
  summary: 'Founder build log: sign up for an email when a release ships or the numbers move.',
  eyebrow: 'Build log',
  h1: 'Follow the build',
  lede: "I'm Chinh, the developer behind Colliedesk. I'm building it in public: what shipped, what broke, what I decided and why, and how many founding customers we have so far.",
  pre: 'updates-form',
  preMd: 'Sign up with the form on [colliedesk.com/build-log](https://colliedesk.com/build-log).',
  body,
  jsonLd: [],
};
page.jsonLd = [techArticle(page)];

export default page;
