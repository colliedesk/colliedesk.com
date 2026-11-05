import { techArticle } from '../../lib/schema';
import type { ChangelogEntry, Page } from '../../lib/page';

// Newest first. Each entry also feeds /changelog.xml.
export const ENTRIES: readonly ChangelogEntry[] = [
  {
    version: 'v1.0.0',
    date: '2026-11-05',
    title: 'v1.0.0: generally available',
    md: `Colliedesk is generally available. From this release on, versions follow Semantic Versioning: a breaking change to the API, the CLI or the export format comes only in a new major version. [What general availability guarantees](https://github.com/colliedesk/colliedesk/blob/main/docs/general-availability.md) is written down: upgrades keep your data, full export at any time, and how Colliedesk Cloud is backed up and restored.

- **Live status.** [status.colliedesk.com](https://status.colliedesk.com) shows the app and API, help centers, incoming email and outgoing email, checked from several regions outside our servers.
- **Backups.** Every change to a Cloud database is copied continuously, encrypted, to a second data centre in the EU; we test a restore every week.
- **Terms.** The Availability section describes the status page and the backups. A written uptime commitment for paid plans will be added there and noted here.

Release notes for each version: [GitHub releases](https://github.com/colliedesk/colliedesk/releases).`,
  },
  {
    version: 'v0.0.1',
    date: '2026-10-14',
    title: 'v0.0.1: first alpha release',
    md: `First public alpha, released and running on Colliedesk Cloud. The interface and database schema may change between releases.

- **Email channel.** Inbound and outbound mail with threading, and protection against spoofing and mail loops. See [Connect email](/docs/email-channel).
- **Freshdesk importer.** Tickets, replies, notes, checksummed attachments, tags, contacts and companies, with a reconcile report. See [Import from Freshdesk](/docs/import-freshdesk).
- **Shared inbox.** Replies, private notes, status, priority, assignee, tags, search, saved replies, attachments and live updates. See [Work the inbox](/docs/inbox).
- **Passwordless sign-in.** One-time pairing and invite links, role ceilings on invites, revocable sessions. See [Sign in without passwords](/docs/sign-in).
- **Colliedesk Cloud.** A 14-day free trial, then Team or Founding. A workspace whose trial ended is locked and can still export everything.
- **Workspaces.** Every workspace is isolated from every other. Per-workspace timezone with a per-agent override.

Not in this release: Cc, starting a new conversation from the inbox and contact history, and AI. See the [roadmap](/roadmap).`,
  },
];

const body = ENTRIES.map((e) => `## ${e.title}\n\n*Released ${e.date}*\n\n${e.md}`).join('\n\n');

const page: Page = {
  jsonLd: [],
  path: '/changelog',
  section: 'Product',
  title: 'Colliedesk changelog: what shipped, release by release',
  description:
    'Every Colliedesk release with its date and what changed. v0.0.1 (14 October 2026): email channel, Freshdesk importer, shared inbox, Colliedesk Cloud. RSS feed available.',
  summary: 'Dated release notes, first release v0.0.1 on 2026-10-14; RSS at /changelog.xml',
  eyebrow: 'Changelog',
  h1: 'Changelog',
  lede: 'What shipped, when. Newest first. Subscribe with the [RSS feed](/changelog.xml).',
  body,
};
page.jsonLd = [techArticle(page)];
export default page;
