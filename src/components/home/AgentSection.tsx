import { AGENT_ACCESS, AGENT_HEADING, AGENT_LEDE_SHORT, AGENT_POINTS, MCP_URL } from '../../data/pages/home-sections';
import { Badge } from '../Badge';
import { ProductCrop, THREAD } from './ProductCrop';
import { PermissionTile } from './PermissionTile';

// "Your AI agent can do this too": the shipped MCP server, roles and permissions, then what stays with
// a person. The picture is a real conversation with a private note written through Claude Code; the
// card over it is the refusal a token gets for a permission it was not given. The text says the same.
export function AgentSection() {
  return (
    <section className="section" aria-labelledby="agents">
      <div className="wrap">
        <div className="feature-row feature-rev">
          <div className="feature-copy">
            <p className="eyebrow">For your AI agent</p>
            <h2 id="agents">{AGENT_HEADING}</h2>
            <p className="section-lede">{AGENT_LEDE_SHORT}</p>
            <p><Badge kind="shipped">Shipped</Badge> <a href="/docs/mcp">Connect an AI agent</a> · <a href="/docs/roles-and-permissions">Roles and permissions</a></p>
            <pre className="code-card"><code><span className="t-prompt">$</span>{` claude mcp add --transport http colliedesk \\\n    ${MCP_URL} \\\n    --header 'Authorization: Bearer \${COLLIEDESK_TOKEN}'`}</code></pre>
          </div>
          <div className="panel agent-panel">
            <ProductCrop region={THREAD} maxWidth={600} label="A Colliedesk conversation: the customer's email, a private note by Tom Okoye via Claude Code, and the reply Claude Code drafted and Tom sent, marked Sent." />
            <PermissionTile />
          </div>
        </div>
        <ul className="agent-tiers" aria-label="Roles, permissions and agent tokens">
          {AGENT_ACCESS.map(([title, , text]) => (
            <li key={title}><h3>{title}</h3><p>{text}</p></li>
          ))}
        </ul>
        <ul className="bento agent-points">
          {AGENT_POINTS.map(([k, , v]) => (
            <li key={k} className="bento-card"><h3>{k}</h3><p>{v}</p></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
