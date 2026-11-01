import { CheckIcon, CopyIcon } from './Icons';

// Under the h1 of every Docs page, before the lede (so its place does not depend on how long the
// lede is, and the cookie banner never covers it in the first screen): "Copy for AI" puts the page's Markdown twin on the clipboard
// (public/docs-copy.js fetches mdUrl). CSS shows the button from the first paint only when scripting
// is on, so it never pushes the link aside after load; without a clipboard the script hides it and "View as Markdown" opens the same file. The status line is in the page
// from load, so screen readers know the live region before it speaks.
export function DocsActions({ mdUrl }: { mdUrl: string }) {
  return (
    <div className="docs-actions">
      <button type="button" className="btn btn-sm docs-copy" data-docs-copy="" data-md={mdUrl}>
        <CopyIcon className="i i-copy" />
        <CheckIcon className="i i-done" />
        <span data-docs-copy-label="">Copy for AI</span>
      </button>
      <a className="docs-md-link" href={mdUrl} type="text/markdown">View as Markdown</a>
      <p className="docs-copy-status visually-hidden" role="status" data-docs-copy-status="" />
    </div>
  );
}
