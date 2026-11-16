import type { DocsCrumb, DocsPlace } from '../lib/page';

// The small parts around a docs guide: where it sits (breadcrumb), its sections ("On this page"),
// where to go next (previous/next in its group), and how fresh and useful it is (date, feedback).

export function DocsBreadcrumb({ crumbs }: { crumbs: readonly DocsCrumb[] }) {
  return (
    <nav className="docs-breadcrumb" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((c, i) =>
          i === crumbs.length - 1 ? <li key={c.label} aria-current="page">{c.label}</li>
            : <li key={c.label}>{c.href ? <a href={c.href}>{c.label}</a> : c.label}</li>,
        )}
      </ol>
    </nav>
  );
}

type Section = { id: string; text: string };

const SectionLinks = ({ sections }: { sections: readonly Section[] }) => (
  <ul>{sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.text}</a></li>)}</ul>
);

// Two copies of one list: a column beside the guide on wide screens, a closed <details> at the top of
// the guide on narrower ones (CSS shows one). A <details> cannot be forced open by CSS everywhere yet.
export function DocsToc({ sections }: { sections: readonly Section[] }) {
  return (
    <nav className="docs-toc" aria-label="On this page">
      <p className="docs-toc-title">On this page</p>
      <SectionLinks sections={sections} />
    </nav>
  );
}

export function DocsTocMobile({ sections }: { sections: readonly Section[] }) {
  return (
    <details className="docs-toc-mobile"><summary>On this page</summary><SectionLinks sections={sections} /></details>
  );
}

export function DocsPager({ place }: { place: DocsPlace }) {
  const { prev, next } = place;
  if (!prev && !next) return null;
  return (
    <nav className="docs-pager" aria-label="Previous and next page">
      {prev && <a className="docs-pager-prev" href={prev.href} rel="prev"><span>Previous</span>{prev.label}</a>}
      {next && <a className="docs-pager-next" href={next.href} rel="next"><span>Next</span>{next.label}</a>}
    </nav>
  );
}

export const longDate = (iso: string): string =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' });

// The question needs public/docs-feedback.js to report the answer, so CSS shows it only with scripting.
export function DocsFeedback({ path }: { path: string }) {
  return (
    <div className="docs-feedback" data-docs-feedback="" data-path={path}>
      <p id="docs-feedback-q">Was this page helpful?</p>
      <button type="button" className="btn btn-sm" data-helpful="yes" aria-describedby="docs-feedback-q">Yes</button>
      <button type="button" className="btn btn-sm" data-helpful="no" aria-describedby="docs-feedback-q">No</button>
      <p className="docs-feedback-status" role="status" data-docs-feedback-status="" />
    </div>
  );
}
