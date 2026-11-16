import { MCP_URL } from '../lib/agent-instructions';
import { ORIGIN } from '../lib/site';
import { ArrowUpRightIcon, ChatIcon, CheckIcon, CopyIcon, FileTextIcon, PlugIcon } from './Icons';

// Under the h1 of every Docs page, before the lede (so its place does not depend on how long the lede
// is, and the cookie banner never covers it in the first screen): one compact split control, the way
// Mintlify and Vercel docs do it. "Copy for AI" puts the page's Markdown twin on the clipboard
// (public/docs-copy.js fetches mdUrl); CSS shows it from the first paint only when scripting is on, so
// nothing shifts after load, and without a clipboard the script hides it.
// The chevron beside it is a <details> menu (works on a phone and without script): the Markdown twin,
// the page opened in Claude or ChatGPT with a prompt that points at the twin, and the MCP server URL,
// printed so it can be copied by hand. Without the copy button the summary shows its "Use with AI" label.
// The status line is in the page from load, so screen readers know the live region before it speaks.
export function DocsActions({ mdUrl }: { mdUrl: string }) {
  const prompt = encodeURIComponent(`Read ${ORIGIN}${mdUrl} so I can ask questions about it.`);
  const ask = 'Ask questions about this page';
  return (
    <div className="docs-actions">
      <div className="docs-ai-group">
        <button type="button" className="docs-copy" data-docs-copy="" data-md={mdUrl}>
          <CopyIcon className="i i-copy" />
          <CheckIcon className="i i-done" />
          <span data-docs-copy-label="">Copy for AI</span>
        </button>
        <details className="docs-ai">
          <summary><span className="docs-ai-label">Use with AI</span></summary>
          <ul className="docs-ai-menu">
            <li>
              <a className="docs-md-link" href={mdUrl} type="text/markdown">
                <FileTextIcon /><span><strong>View as Markdown</strong><small>This page as plain text</small></span>
              </a>
            </li>
            <li>
              <a href={`https://claude.ai/new?q=${prompt}`} target="_blank" rel="noopener">
                <ChatIcon /><span><strong>Open in Claude</strong><small>{ask}</small></span><ArrowUpRightIcon />
              </a>
            </li>
            <li>
              <a href={`https://chatgpt.com/?hints=search&q=${prompt}`} target="_blank" rel="noopener">
                <ChatIcon /><span><strong>Open in ChatGPT</strong><small>{ask}</small></span><ArrowUpRightIcon />
              </a>
            </li>
            <li className="docs-ai-mcp">
              <button type="button" className="docs-copy-mcp" data-docs-copy-mcp="" data-url={MCP_URL}>
                <PlugIcon /><span><strong data-docs-copy-mcp-label="">Copy MCP URL</strong><small>Let your AI agent work in Colliedesk</small></span>
              </button>
              <code>{MCP_URL}</code>
            </li>
          </ul>
        </details>
      </div>
      <p className="docs-copy-status visually-hidden" role="status" data-docs-copy-status="" />
    </div>
  );
}
