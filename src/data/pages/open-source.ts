import { REPO } from '../../lib/site';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';

const faq: Faq[] = [
  {
    q: 'Can I use AGPL-licensed Colliedesk commercially?',
    a: 'Yes. You can run Colliedesk for your own support team, including in a business, at no cost. The AGPL adds one main duty: if you modify Colliedesk and let other people use your modified version over a network, you must offer them the source code of your version. This is a summary, not legal advice; the [LICENSE](https://github.com/colliedesk/colliedesk/blob/main/LICENSE) file is what counts.',
  },
  {
    q: 'Is the self-hosted version limited?',
    a: 'No. Self-hosting is free, forever, with every feature. We never add a feature that works only on the hosted cloud when it could work self-hosted.',
  },
  {
    q: 'Do contributions need a CLA?',
    a: 'HC Labs holds the copyright of Colliedesk, and every contributor signs the HC Labs Contributor License Agreement. The CLA text and signing process will follow; until then, external contributions cannot be merged.',
  },
];

const body = `## Wait, what are you selling me?

Self-hosting Colliedesk is free, forever, with every feature. We sell two things:

1. **Colliedesk Cloud**: we run it for you. One flat price per workspace, not per agent.
2. **Migration**: we move your Freshdesk history (tickets, replies, attachments, tags) and give you a reconcile report that proves nothing was lost.

AI features work with your own model key on self-hosted installs. On the cloud you can bring your key or use ours at cost plus 30%.

## If you don't like something, fork it

You were held hostage at renewal once. That should not happen again. The code, your data and the export format are yours. If we ever go in the wrong direction, you have everything you need to run Colliedesk yourself or fork it.

\`\`\`sh
gh repo fork colliedesk/colliedesk --clone
\`\`\`

## License

- **License:** GNU Affero General Public License v3.0 only (\`AGPL-3.0-only\`).
- **Copyright:** © 2026 HC Labs.
- **Contributions:** require the HC Labs Contributor License Agreement (text and signing process to follow).
- **Source:** [github.com/colliedesk/colliedesk](${REPO}).

## What we never compromise on

These five rules are in the repository's \`AGENTS.md\`, for every person and coding agent who changes the code.

1. **No data loss.** A migration or an edit never drops a ticket, reply, attachment, tag or timestamp silently. Every import ends with a reconcile report.
2. **Workspace isolation.** No query, filter, search, id or file can cross from one workspace to another. Every new endpoint ships with a cross-workspace test.
3. **Fast.** A person waits at most 200 ms from action to usable screen.
4. **No lock-in.** The data model and the export format stay open and documented.
5. **Open at the core.** Roadmap, decisions and code are public.

## Self-host in one command

Requirements: Docker with Compose v2.

\`\`\`sh
curl -fsSL https://raw.githubusercontent.com/colliedesk/colliedesk/main/install.sh | sh -s -- \\
  --name "Example Support" --email "admin@example.com"
\`\`\`

The installer starts Colliedesk and PostgreSQL with the published container image, keeps secrets in a local \`.env\`, and prints a one-time sign-in URL. Colliedesk has no passwords. Full guide: [Self-host Colliedesk](/docs/self-host).

## Clean room

Colliedesk is written from its own public specification. Nobody working on it may open, copy, translate or paraphrase the source code of another helpdesk. Product ideas come from public descriptions only.

## Built with

A Go server with PostgreSQL serves a JSON API under \`/api/v1\` (described by one OpenAPI contract) and an embedded React + TypeScript web app.`;

const page: Page = {
  jsonLd: [],
  name: 'Open source, license and self-hosting',
  path: '/open-source',
  section: 'Product',
  title: 'Colliedesk: open source helpdesk and ticketing system (AGPL-3.0), self-host or fork',
  description:
    'Colliedesk is an AGPL-3.0 open source helpdesk and ticketing system by HC Labs. Self-hosting is free with every feature. What we sell, the license and CLA, and how to self-host.',
  summary: 'AGPL-3.0-only license, CLA, what HC Labs sells, self-host in two commands, fork it, clean-room rule',
  eyebrow: 'Open source',
  h1: 'Open source, and honest about the business',
  lede: 'Colliedesk is an open source helpdesk and ticketing system, licensed AGPL-3.0. Self-hosting is free with every feature. Here is exactly what we sell and how you keep control.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
