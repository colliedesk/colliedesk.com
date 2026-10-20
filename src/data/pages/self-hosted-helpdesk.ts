import { REPO } from '../../lib/site';
import { faqPage, techArticle } from '../../lib/schema';
import type { Faq, Page } from '../../lib/page';
import { statusTable } from './collie-status';

const faq: Faq[] = [
  {
    q: 'What do I need to self-host Colliedesk?',
    a: 'A Linux server with Docker and Compose v2. Colliedesk runs as one server container plus PostgreSQL 16 or newer. One install command starts both and creates your first workspace.',
  },
  {
    q: 'Is the self-hosted version limited?',
    a: `No. Self-hosting is free with every feature. There is no enterprise edition and no feature held back for Cloud. The code is AGPL-3.0 on [GitHub](${REPO}).`,
  },
  {
    q: 'What must I back up?',
    a: 'Two things: the PostgreSQL database and the attachments volume. The [backups guide](/docs/self-host/database#data-to-back-up) has the exact `pg_dump` steps.',
  },
  {
    q: 'Can I move from self-hosted to Cloud, or back?',
    a: 'Yes. Your data is in PostgreSQL with an open model, and an admin can download everything as one ZIP file. See [export all your data](/docs/export).',
  },
];

const body = `## When self-hosting is the right call

- Your customers' messages must stay on servers you control: a regulated industry, a data residency rule, or a contract.
- You already run Docker services and have someone who keeps them patched and backed up.
- You want to read the code that handles your customer data, or change it.

If none of these apply, [Colliedesk Cloud](/pricing) runs the same code for $49 per workspace per month, and you can still export everything.

## What you run

| Part | Detail |
|---|---|
| Server | One container image: \`ghcr.io/colliedesk/colliedesk\` |
| Database | PostgreSQL 16 or newer, in the same Compose stack or external |
| Requirements | Docker with Compose v2 |
| Workspace isolation | PostgreSQL row-level security; requests run as a database user that can only read the signed-in workspace |
| Sign-in | One-time links, no passwords to store |
| Licence | AGPL-3.0, every feature |

## Install in one command

\`\`\`sh
curl -fsSL https://raw.githubusercontent.com/colliedesk/colliedesk/main/install.sh | sh -s -- \\
  --name "My Support Desk" --email "admin@example.com"
\`\`\`

The command starts the stack, creates the workspace and prints a one-time sign-in link. Re-running it keeps your existing \`.env\`. Step-by-step from a clone, image tags and database hardening: [install guide](/docs/self-host).

## What you take on

Self-hosting is free in money, not in time. You are responsible for:

1. **Backups** of PostgreSQL and the attachments volume, and a tested restore.
2. **Updates**: pull a new image tag and restart. Pin a release tag if you do not want the \`edge\` build.
3. **Email delivery**: your support address and its DNS records (see [Connect email](/docs/email-channel)).
4. **Uptime and TLS** for the address your agents open.

## What Colliedesk does today

Colliedesk is alpha: the interface or database schema may change between releases. Self-host it to try it; read the [roadmap](/roadmap) before a production move.

${statusTable}`;

const page: Page = {
  jsonLd: [],
  name: 'Self-hosted helpdesk',
  path: '/self-hosted-helpdesk',
  section: 'Product',
  title: 'Self-hosted helpdesk: open-source, every feature free, one install command',
  description:
    'Run Colliedesk, an open-source (AGPL-3.0) helpdesk, on your own server: Docker and PostgreSQL, one install command, every feature free. What you run, what you take on, and honest status.',
  summary: 'Self-host Colliedesk free: one container plus PostgreSQL 16, one install command, every feature, AGPL-3.0; what you must run yourself',
  eyebrow: 'Self-host',
  h1: 'A self-hosted helpdesk with nothing held back',
  lede: 'Colliedesk is open source. Run it on your own server with Docker and PostgreSQL, free, with every feature. Here is what that takes.',
  cta: true,
  body,
  faq,
};
page.jsonLd = [techArticle(page), faqPage(faq)];
export default page;
