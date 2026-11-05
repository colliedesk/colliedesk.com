import { GUARANTEES, issueHref, RELIABILITY_LEDE, STATUS_NOTE, STILL_COMING } from '../../data/pages/home-sections';
import { GA_DOC, STATUS_PAGE } from '../../lib/site';
import { SectionIntro } from './SectionIntro';

// Reliability: what general availability guarantees in writing, the live status, and what is still
// coming with its roadmap state and issue. The status is the status page's own badge in an iframe, so it
// is live without a script of ours and never shows a state we typed; one badge per theme, the other hidden. No uptime number until the written
// commitment is published (`pnpm check` refuses one).
export function StatusSection() {
  return (
    <section aria-labelledby="reliability">
      <SectionIntro id="reliability" eyebrow="Reliability" title="Generally available. Here is what that means." lede={RELIABILITY_LEDE} />
      <div className="sheet-row cells trust">
        <div className="cell">
          <dl className="guarantees">
            {GUARANTEES.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}
          </dl>
          <a className="text-link" href={GA_DOC} rel="noopener">What general availability guarantees <span aria-hidden="true">→</span></a>
        </div>
        <div className="cell status-card">
          <p className="status-head"><b>Colliedesk Cloud</b>{(['light', 'dark'] as const).map((theme) => (
            <iframe key={theme} className={`status-badge status-badge-${theme}`} src={`${STATUS_PAGE}/badge?theme=${theme}`} title="Colliedesk Cloud status, live from the status page" width="250" height="30" loading="lazy" />
          ))}</p>
          <p className="status-note">{STATUS_NOTE}</p>
          <a className="text-link" href={STATUS_PAGE} rel="noopener">Open the status page <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <ul className="sheet-row cells roadmap-teaser" aria-label="Still coming">
        {STILL_COMING.map((item) => (
          <li key={item.issue} className="cell">
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <p className="roadmap-state">
              <span className={item.soon ? 'state state-soon' : 'state'}>{item.state}</span>
              <a className="mono-label" href={issueHref(item.issue)} rel="noopener">#{item.issue}</a>
            </p>
          </li>
        ))}
      </ul>
      <p className="sheet-row link-row"><a className="text-link" href="/roadmap">See the full roadmap <span aria-hidden="true">→</span></a></p>
    </section>
  );
}
