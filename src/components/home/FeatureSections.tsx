import {
  DONE_FOR_YOU, FACTS, MIGRATE_LEDE, MIGRATE_REPORT_HREF, NOT_MOVED, REPORT_NOT_IMPORTED, REPORT_ROWS, STEPS, SWITCH_STEPS_HREF,
} from '../../data/pages/home-sections';
import { SectionIntro } from './SectionIntro';

// Three facts under the hero, each a number with its unit and a link to its proof: cost, data safety
// and reliability, the three things a lead repeats to the person who approves the switch.
export function Facts() {
  return (
    <section className="sheet-row cells facts" aria-label="Colliedesk in three facts">
      {FACTS.map(([fact, line, link, href]) => (
        <p key={fact} className="cell">
          <b className="fact">{fact}</b>
          <span>{line} · <a href={href}>{link} <span aria-hidden="true">→</span></a></span>
        </p>
      ))}
    </section>
  );
}

// The sample reconcile report: every record type counted on both sides, then what was left out.
function ReconcileReport() {
  return (
    <figure className="report" aria-labelledby="report-title">
      <div className="report-head">
        <figcaption><b id="report-title">Import done · reconcile report</b><span>Example account, acme.freshdesk.com</span></figcaption>
        <span className="ok-text">0 missing</span>
      </div>
      <table>
        <thead><tr><th scope="col">record</th><th scope="col">Freshdesk</th><th scope="col">Colliedesk</th></tr></thead>
        <tbody>
          {REPORT_ROWS.map(([record, count]) => <tr key={record}><td>{record}</td><td>{count}</td><td>{count}</td></tr>)}
        </tbody>
      </table>
      <p className="report-foot">{REPORT_NOT_IMPORTED}</p>
    </figure>
  );
}

// "Leave Freshdesk": what moves, a sample report, the four steps, then who does it and what stays behind.
export function MigrationSection() {
  return (
    <section aria-labelledby="migrate">
      <SectionIntro id="migrate" eyebrow="Leave Freshdesk" title="Switch at your pace. Prove nothing was lost." lede={MIGRATE_LEDE} />
      <div className="sheet-row stage stage-center"><ReconcileReport /></div>
      <ol className="sheet-row cells steps">
        {STEPS.map(([title, text], i) => (
          <li key={title} className="cell">
            <span className="mono-label">{String(i + 1).padStart(2, '0')}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
      <div className="sheet-row band">
        <div className="band-copy">
          <p className="band-title">{DONE_FOR_YOU}</p>
          <p>{NOT_MOVED}</p>
        </div>
        <div className="band-actions">
          <a className="btn btn-sm" href={MIGRATE_REPORT_HREF}>What the report checks</a>
          <a className="text-link text-small" href={SWITCH_STEPS_HREF}>How the switch works, step by step <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  );
}
