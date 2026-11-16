import { SearchIcon } from './Icons';

// Docs search runs in the browser on a static Pagefind index (public/docs-search.js); without scripting
// there is nothing to search with, so CSS shows the button only when scripting is on. The key hint
// reads "Ctrl K" until the script sees a Mac and writes "⌘K".
export function DocsSearchButton() {
  return (
    <button type="button" className="docs-search-open" data-docs-search-open="">
      <SearchIcon />
      <span>Search docs</span>
      <kbd data-docs-search-key="">Ctrl K</kbd>
    </button>
  );
}

// A modal <dialog>: Escape closes it, focus stays inside, the page behind is inert. Results are links to
// the heading the match is under. The status line is in the page from load so screen readers know it.
export function DocsSearchDialog() {
  return (
    <dialog className="docs-search" data-docs-search="" aria-label="Search docs">
      <div className="docs-search-panel">
        <div className="docs-search-row">
          <SearchIcon />
          <label className="visually-hidden" htmlFor="docs-search-q">Search docs</label>
          <input id="docs-search-q" type="search" placeholder="Search docs" autoComplete="off" spellCheck={false} enterKeyHint="go" data-docs-search-input="" />
          <form method="dialog"><button type="submit" className="docs-search-close">Close</button></form>
        </div>
        <p className="docs-search-status" role="status" data-docs-search-status="" />
        <ul className="docs-search-results" data-docs-search-results="" />
      </div>
    </dialog>
  );
}
