import { MCP_URL } from '../lib/agent-instructions';
import { ORIGIN } from '../lib/site';
import { CheckIcon, CopyIcon } from './Icons';

// Under the h1 of every Docs page, before the lede (so its place does not depend on how long the
// lede is, and the cookie banner never covers it in the first screen): "Copy for AI" puts the page's Markdown twin on the clipboard
// (public/docs-copy.js fetches mdUrl). CSS shows the button from the first paint only when scripting
// is on, so it never pushes the link aside after load; without a clipboard the script hides it and "View as Markdown" opens the same file. The status line is in the page
// from load, so screen readers know the live region before it speaks.
// "Use with AI" is a <details> menu (works on a phone, no script): open the page in Claude or ChatGPT
// with a prompt that points at the twin, or take the MCP server URL. The URL stays readable for
// copying by hand; the copy button needs scripting.
export function DocsActions({ mdUrl }: { mdUrl: string }) {
  const prompt = encodeURIComponent(`Read ${ORIGIN}${mdUrl} so I can ask questions about it.`);
  return (
    <div className="docs-actions">
      <button type="button" className="btn btn-sm docs-copy" data-docs-copy="" data-md={mdUrl}>
        <CopyIcon className="i i-copy" />
        <CheckIcon className="i i-done" />
        <span data-docs-copy-label="">Copy for AI</span>
      </button>
      <a className="docs-md-link" href={mdUrl} type="text/markdown">View as Markdown</a>
      <details className="docs-ai">
        <summary>Use with AI</summary>
        <ul className="docs-ai-menu">
          <li><a href={`https://claude.ai/new?q=${prompt}`} target="_blank" rel="noopener">Open in Claude</a></li>
          <li><a href={`https://chatgpt.com/?hints=search&q=${prompt}`} target="_blank" rel="noopener">Open in ChatGPT</a></li>
          <li className="docs-ai-mcp">
            <button type="button" className="docs-copy-mcp" data-docs-copy-mcp="" data-url={MCP_URL}>Copy MCP URL</button>
            <code>{MCP_URL}</code>
          </li>
        </ul>
      </details>
      <p className="docs-copy-status visually-hidden" role="status" data-docs-copy-status="" />
    </div>
  );
}
