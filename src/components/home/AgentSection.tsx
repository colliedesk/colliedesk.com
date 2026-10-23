import { AGENT_HEADING, AGENT_LEDE_SHORT, AGENT_POINTS, AGENT_TIERS, MCP_URL } from '../../data/pages/home-sections';
import { Badge } from '../Badge';
import { ProductCrop, THREAD } from './ProductCrop';
import { RequestTile } from './RequestTile';

// "Your AI agent can do this too": the shipped MCP server and agent token tiers, then what waits for
// a person. The picture is a real conversation with a private note written through Claude Code; the
// request card over it plays one request on the Requests screen. The text says the same.
export function AgentSection() {
  return (
    <section className="section" aria-labelledby="agents">
      <div className="wrap">
        <div className="feature-row feature-rev">
          <div className="feature-copy">
            <p className="eyebrow">For your AI agent</p>
            <h2 id="agents">{AGENT_HEADING}</h2>
            <p className="section-lede">{AGENT_LEDE_SHORT}</p>
            <p><Badge kind="shipped">Shipped</Badge> <a href="/docs/mcp">Connect an AI agent</a> · <a href="/docs/agent-requests">How approval works</a></p>
            <pre className="code-card"><code><span className="t-prompt">$</span>{` claude mcp add --transport http colliedesk \\\n    ${MCP_URL} \\\n    --header "Authorization: Bearer $COLLIEDESK_TOKEN"`}</code></pre>
          </div>
          <div className="panel agent-panel">
            <ProductCrop region={THREAD} maxWidth={600} label="A Colliedesk conversation: the customer's email, a private note by Tom Okoye via Claude Code, and the reply Claude Code drafted and Tom approved, marked Sent." />
            <RequestTile />
          </div>
        </div>
        <ol className="agent-tiers" aria-label="Agent token tiers, each with everything of the one before">
          {AGENT_TIERS.map(([tier, , text]) => (
            <li key={tier}><h3><code>{tier}</code></h3><p>{text}</p></li>
          ))}
        </ol>
        <ul className="bento agent-points">
          {AGENT_POINTS.map(([k, , v]) => (
            <li key={k} className="bento-card"><h3>{k}</h3><p>{v}</p></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
