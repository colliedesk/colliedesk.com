// What an agent hears when its token lacks a permission: the refusal names the permission and how to
// get it (docs/user/roles-and-permissions.md, "When a permission is missing"). The text is the server's
// own message for a token that was not given workspace:export.
export function PermissionTile() {
  return (
    <div className="mini agent-request agent-refusal" aria-hidden="true">
      <p className="mini-row">
        <span>Export the workspace</span>
        <span className="flow-status"><span className="refusal-status">Refused</span></span>
      </p>
      <p className="mini-sub">Asked by Claude Code for Tom Okoye</p>
      <p className="refusal-text">This agent token was not given workspace:export. Tom Okoye holds it: create a token that includes it in Settings → External AI agents, then use that token.</p>
    </div>
  );
}
