import { AGENT_CALLS, AGENT_HEADING, AGENT_LEDE, AGENT_OUTCOME, AGENT_POINTS, AGENT_PROMPT, CLAUDE_DIRECTORY_URL, MCP_URL } from '../../data/pages/home-sections';
import { SectionIntro } from './SectionIntro';

// "Your AI agent can do this too": one session of an agent whose token may not send, next to the command
// that connects it. It searches, assigns, notes, drafts and edits an article; the reply waits for a person.
// On a phone only the assign and draft lines stay, the two that show draft versus send.
export function AgentSection() {
  return (
    <section aria-labelledby="agents">
      <SectionIntro id="agents" eyebrow="For your AI agent" title={`${AGENT_HEADING}.`} lede={AGENT_LEDE} />
      <div className="sheet-row stage agent-stage">
        <figure className="terminal" aria-label="An example Claude Code session with Colliedesk over MCP">
          <figcaption className="terminal-head">claude · Colliedesk MCP · token without send</figcaption>
          <div className="terminal-body">
            <p className="terminal-prompt">› {AGENT_PROMPT}</p>
            {AGENT_CALLS.map((call) => (
              <p key={call} className={/conversation_update|reply_draft/.test(call) ? 'terminal-call' : 'terminal-call terminal-extra'}>{call}</p>
            ))}
            <p className="terminal-ok">{AGENT_OUTCOME}</p>
          </div>
        </figure>
        <div className="command">
          <p className="command-title">Connect it in one command</p>
          <pre className="command-card"><code>{`export COLLIEDESK_TOKEN=<your token>\nclaude mcp add --transport http colliedesk \\\n  ${MCP_URL} \\\n  --header 'Authorization: Bearer \${COLLIEDESK_TOKEN}'`}</code></pre>
          <p className="command-links">
            <a className="text-link" href="/docs/mcp">See every MCP tool <span aria-hidden="true">→</span></a>{' '}
            <a className="text-link text-small" href="/docs/roles-and-permissions">Roles and permissions</a>
          </p>
          <p className="command-links">
            <a className="text-link text-small" href={CLAUDE_DIRECTORY_URL}>In Claude, connect from the Claude directory</a>
          </p>
        </div>
      </div>
      <ul className="sheet-row cells">
        {AGENT_POINTS.map(([title, text]) => (
          <li key={title} className="cell"><h3>{title}</h3><p>{text}</p></li>
        ))}
      </ul>
    </section>
  );
}
