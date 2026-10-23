import type { Page } from '../../lib/page';
import { techArticle } from '../../lib/schema';

const body = `*By HC Labs · Published 19 October 2026 · Product documentation checked on the same date.*

Moving support into the CRM your sales team already uses can make sense. The difficult question is what happens to years of replies, private notes, attachments and community discussions.

Use this checklist before accepting a Freshdesk-to-HubSpot migration. It describes what to verify with your migration provider or internal team; the import method determines what can actually be preserved.

## 1. Agree on the scope and the HubSpot plan

Decide whether all historical tickets move into HubSpot, or whether older closed tickets live in a searchable archive. Record the date range, archived-ticket coverage and exceptions. Give the archive an owner and a retention policy.

Check the destination with the accounts your agents will use. HubSpot lists its help desk workspace under Service Hub Professional and Enterprise. Some advanced features require an assigned Service Seat. A CRM subscription alone does not establish that your intended support workflow is covered. See [HubSpot's help desk setup guide](https://knowledge.hubspot.com/help-desk/overview-of-the-help-desk-workspace).

**Pass when:** the team agrees where each category of history will live and can access the required destination features.

## 2. Take a backup beyond the ticket-list CSV

Freshdesk's [ticket export documentation](https://support.freshdesk.com/support/solutions/articles/225158) says the CSV or Excel export does not contain the entire conversation or archived-ticket history. A spreadsheet of ticket fields is insufficient evidence of a complete backup.

Take a full account export before changing routing or cancelling Freshdesk. Use the [account export instructions](https://support.freshdesk.com/support/solutions/articles/226393-how-do-i-export-the-data-in-my-account-) and inspect the downloaded files. Separately verify that attachment files and inline images are recoverable; a URL in an export does not prove you have a copy of the file.

**Pass when:** a second authorized person can open the backup and find a known old ticket, its replies, notes and files.

## 3. Record the mapping and its limitations

Keep a source-to-destination ID map for tickets, contacts, companies and agents. Include custom fields, tags, statuses, priorities, groups and timestamps. Decide how departed agents and merged contacts will be represented.

Ask for a written list of unsupported fields and transformations. If the destination cannot retain an original author or timestamp in its native field, agree where that information will appear. Keep original values available for audit and lookup.

**Pass when:** a Freshdesk ticket ID leads to the correct destination record, and every changed or omitted field has an agreed treatment.

## 4. Read the history and continue an active conversation

Ask for a demonstration inside the agent's normal help desk view. Check message order, original sender, timestamps, formatting and the distinction between customer replies and internal notes.

HubSpot documents tickets, associated records, the History tab and conversations as distinct parts of the workspace. It also notes that manually creating a ticket does not automatically associate a conversation. See [creating and responding to tickets](https://knowledge.hubspot.com/help-desk/create-respond-to-tickets-in-help-desk). This is a reason to verify your import's result, rather than infer reply behavior from a ticket count.

**Pass when:** an agent can read the agreed history and reply on a migrated active ticket. A test customer must receive the reply, respond, and have that response arrive on the intended ticket. Document any new-thread behavior before accepting it.

## 5. Verify private notes from both sides

Use a test ticket containing an internal note and an internal attachment. Inspect it as an agent, then through every customer-facing surface you plan to use. Send a reply to a controlled test mailbox and inspect its content and attachments.

**Pass when:** authorized agents can read the internal material, while the customer cannot see it in the portal or outbound email.

## 6. Open attachments without Freshdesk access

Test actual file downloads, inline screenshots and images inside older messages. Include large files and repeated filenames. Open them in a clean browser session without a Freshdesk login.

For files in migration scope, request a manifest with source ID, destination ID, filename, size and download result. Where both sides provide file bytes, compare checksums. Record conversions separately so a changed file is not silently treated as identical.

**Pass when:** required files are stored in the destination or your controlled archive and can be retrieved without relying on Freshdesk-hosted links.

## 7. Rebuild saved replies and test automation safely

Inventory the canned responses your team actually uses. Test their variables, signatures, links and formatting in the destination. Map assignment rules, statuses, notifications and SLA behavior separately; copying ticket data does not prove these workflows were recreated.

Before a pilot import, isolate test recipients and check which destination workflows run on imported records. Prevent historical tickets from sending customer notifications or entering live automation unexpectedly.

**Pass when:** a controlled test produces the expected assignment, response and status, with no unintended customer messages.

## 8. Check contact and company associations

Inspect tickets from customers with multiple contacts, changed email addresses or more than one company relationship. Check the associations your team needs with contacts, companies and deals. Do not assume each ticket should be attached to every deal at that company.

**Pass when:** sales and support can find the right customer history without duplicate contacts or unrelated ticket activity.

## 9. Treat the knowledge base and forum separately

If the knowledge base has already moved, test its public URLs, redirects, embedded images, search and access restrictions. A successful article migration does not establish that forum discussions moved too.

For the community forum, choose explicitly: migrate it, retain it, or create an archive. Include authors, dates, replies, attachments, permissions and existing links in that decision. If you plan to keep one Freshdesk seat for the forum, obtain confirmation of the exact plan, cost and continuing forum access before changing the subscription.

**Pass when:** customers can still reach the content they need, and someone owns the forum's ongoing hosting and moderation.

## 10. Reconcile the full import and rehearse cutover

Compare source and destination counts for each entity in scope: tickets, replies, notes, files, contacts and companies. Account for intentional merges and exclusions. Investigate missing and duplicate records by source ID; equal totals can still hide one missing record and one duplicate.

Record the first import's cutoff time and run a catch-up for records that changed afterwards. Verify that repeating the import does not create duplicates.

Rehearse with controlled mailboxes:

1. Send a new email to the support address.
2. Reply to an email thread created before migration.
3. Reply with a CC recipient and an attachment.
4. Confirm routing, recipients, ticket association and agent visibility.
5. Record how to restore routing if the checks fail.

**Pass when:** reconciliation has no unexplained gaps, the email tests pass, and the support owner signs off. Keep Freshdesk access through validation and the agreed rollback window. Cancel only after the required data is independent of it.

## Start with a representative pilot

Choose a small sample, such as 20 tickets, that includes an old archived ticket, a long conversation, private notes, inline images, a departed agent, custom fields, and an active email thread with CCs. Run the relevant checks above on those cases before moving the rest.

The sample tests the migration method. It does not prove the full dataset arrived. Follow it with reconciliation across the complete agreed scope.

Keep a simple acceptance record for each check: source ID, destination ID, expected result, observed result, evidence, owner and pass or fail. Resolve failures or explicitly accept a documented limitation before cutover.

## If you are still choosing a destination

HC Labs publishes this guide and builds Colliedesk, a separate open-source helpdesk. For Freshdesk-to-Colliedesk migration, see our [Freshdesk migration guide](/migrate/freshdesk) and [export checklist](/migrate/freshdesk/export). To compare product fit, see [Colliedesk and HubSpot Service Hub](/vs/hubspot-service-hub).

[More support guides](/blog)`;

const page: Page = {
  jsonLd: [],
  name: 'Freshdesk to HubSpot migration checklist',
  path: '/blog/freshdesk-to-hubspot-migration-checklist',
  updated: '2026-10-19',
  section: 'Blog',
  title: 'Freshdesk to HubSpot migration checklist: history, files and cutover',
  description: 'Ten checks before accepting a Freshdesk-to-HubSpot migration: ticket history, private notes, attachments, CRM links, workflows, forums and email cutover.',
  summary: 'Ten migration acceptance checks, a representative pilot and full reconciliation before leaving Freshdesk',
  eyebrow: 'Blog · Migration',
  h1: 'Freshdesk to HubSpot migration checklist',
  lede: 'Verify that your team can read the history, open the files and keep answering customers before you switch.',
  body,
};
page.jsonLd = [{
  ...techArticle(page),
  '@type': 'BlogPosting',
  datePublished: page.updated,
  about: [
    { '@type': 'SoftwareApplication', name: 'Freshdesk' },
    { '@type': 'SoftwareApplication', name: 'HubSpot Service Hub' },
  ],
}];
export default page;
