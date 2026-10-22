import { OURS_YEAR } from '../../data/pages/home-sections';
import { Badge } from '../Badge';
import { INBOX_LIST, INCOMING, ProductCrop } from './ProductCrop';

// Three facts under the hero, each one checkable on this site: the price, the import proof, the licence.
export function Facts() {
  return (
    <section className="facts" aria-label="Colliedesk in three facts">
      <div className="wrap facts-row">
        <a href="/pricing"><b>${OURS_YEAR} a year</b><span>for up to 10 agents, not per agent</span></a>
        <a href="/migrate/freshdesk#5-check-the-reconcile-report"><b>0 lost</b><span>a reconcile report on every import</span></a>
        <a href="/docs/self-host"><b>AGPL-3.0</b><span>self-host free with one command</span></a>
      </div>
    </section>
  );
}

// One idea per section, with the part of the real product that shows it (helpdesk sites measured
// on 19/10/2026 show 5–28 product pictures per home page; this page showed one).
export function InboxFeature() {
  return (
    <section className="section feature" aria-labelledby="inbox">
      <div className="wrap feature-row">
        <div className="feature-copy">
          <p className="eyebrow">Shared inbox</p>
          <h2 id="inbox">Every customer email, one calm inbox</h2>
          <p className="section-lede">Status, priority, owner and tags on every conversation. Search, filters and bulk actions for a team of three to ten.</p>
          <p><Badge kind="shipped">Available now</Badge> <a href="/docs/inbox">How the inbox works</a></p>
        </div>
        <div className="panel">
          <ProductCrop region={INBOX_LIST} maxWidth={430} label="The Colliedesk inbox list: open conversations with their status, priority, tags and time, under Today." />
        </div>
      </div>
    </section>
  );
}

export function MigrationFeature() {
  return (
    <section className="section feature" aria-labelledby="migrate">
      <div className="wrap feature-row">
        <div className="feature-copy">
          <p className="eyebrow">Leave Freshdesk</p>
          <h2 id="migrate">Bring every ticket. Prove nothing was lost.</h2>
          <p className="section-lede">Freshdesk's export leaves the conversations out. Our importer brings tickets, replies, notes, attachments, tags and contacts, then counts both sides.</p>
          <p><Badge kind="shipped">Available now</Badge> <a href="/migrate/freshdesk">Read the migration guide</a></p>
        </div>
        <div className="panel">
          <ProductCrop region={INCOMING} maxWidth={620} label="An imported conversation in Colliedesk: the customer's original email with its attachment, and the conversation's status and priority." />
        </div>
      </div>
    </section>
  );
}
