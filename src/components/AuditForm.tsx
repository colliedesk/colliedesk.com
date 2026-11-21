import { UPDATES_FORM_URL } from '../lib/site';

// The free help center audit request, beside the /audit hero. Plain HTML posted by public/audit.js
// (sent as JSON to the web form channel; the result shows in the status line). The empty "website"
// field is the honeypot the endpoint expects. Team size values are what the request message carries.
export const AUDIT_TEAM_SIZES: readonly { value: string; label: string }[] = [
  { value: '1-10', label: '1 to 10 agents' },
  { value: '11-25', label: '11 to 25 agents' },
  { value: '26-100', label: '26 to 100 agents' },
  { value: 'more than 100', label: 'More than 100 agents' },
];

// The only consent to more email. Unticked and optional: the audit never depends on it. public/audit.js
// sends this wording, as shown, with the request; scripts/check.mjs fails a pre-ticked or required box.
export const AUDIT_RECHECK_CONSENT = "Also re-check my help center every month and email me only what's new. Unsubscribe anytime.";

export const AUDIT_NOTE = 'Built by Colliedesk, an open-source helpdesk. You get the list whether or not you ever switch.';

export function AuditForm() {
  return (
    <form className="audit-form" data-audit-form action={UPDATES_FORM_URL} method="post">
      <label htmlFor="audit-url">Help center address</label>
      <input id="audit-url" name="helpcenter" type="url" inputMode="url" autoComplete="url" required placeholder="https://help.yourcompany.com" />
      <label htmlFor="audit-email">Work email</label>
      <input id="audit-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
      <label htmlFor="audit-team">Team size</label>
      <select id="audit-team" name="team" required defaultValue="">
        <option value="" disabled>Choose a size</option>
        {AUDIT_TEAM_SIZES.map((size) => <option key={size.value} value={size.value}>{size.label}</option>)}
      </select>
      <div className="audit-consent">
        <input id="audit-recheck" name="recheck" type="checkbox" value="yes" />
        <label htmlFor="audit-recheck">{AUDIT_RECHECK_CONSENT}</label>
      </div>
      <input className="updates-trap" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button type="submit" className="btn btn-primary btn-lg">Send me the audit</button>
      <p className="audit-status" role="status" aria-live="polite"></p>
      <p className="audit-note">{AUDIT_NOTE}</p>
    </form>
  );
}
