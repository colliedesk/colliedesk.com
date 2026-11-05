import { REPORT_ROWS } from '../../data/pages/home-sections';

// The migration proof over the corner of the hero picture: three counts of the sample reconcile report
// (the full example is in the Leave Freshdesk section). Illustrative numbers, so it says "example".
const HERO_ROWS: readonly (readonly [label: string, record: string])[] = [
  ['Tickets', 'Tickets, archived ones included'],
  ['Attachments, checked', 'Attachments, each SHA-256 checked'],
  ['Help-center articles', 'Help-center articles'],
];

export function ReconcileProof() {
  return (
    <figure className="proof-card" aria-labelledby="proof-title">
      <div className="proof-row proof-title">
        <figcaption id="proof-title">Reconcile report · example</figcaption>
        <span className="ok-text">0 missing</span>
      </div>
      <table>
        <thead>
          <tr><th scope="col">record</th><th scope="col">Freshdesk · Colliedesk</th></tr>
        </thead>
        <tbody>
          {HERO_ROWS.map(([label, record]) => {
            const count = REPORT_ROWS.find(([r]) => r === record)?.[1] ?? '';
            return <tr key={label}><td>{label}</td><td>{count} · {count}</td></tr>;
          })}
        </tbody>
      </table>
    </figure>
  );
}
