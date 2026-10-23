import { Badge } from '../Badge';
import { CheckIcon, ShieldIcon } from '../Icons';

// Illustrative numbers only, so the figure is labelled Example.
const RECONCILE: readonly { item: string; count: string; note?: string }[] = [
  { item: 'Tickets', count: '48,211' },
  { item: 'Replies and notes', count: '312,904' },
  { item: 'Attachments', count: '21,377', note: 'SHA-256' },
  { item: 'Tags', count: '186' },
  { item: 'Contacts', count: '9,402' },
];

export function ReconcileProof() {
  return (
    <figure className="proof" aria-labelledby="proof-title">
      <div className="proof-head">
        <figcaption id="proof-title"><ShieldIcon />Reconcile report <span className="ex">Example</span></figcaption>
        <span className="src">northwind.freshdesk.com → <b>Colliedesk</b></span>
      </div>
      <table>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Freshdesk</th>
            <th scope="col">Colliedesk</th>
            <th scope="col"><span className="visually-hidden">Result</span></th>
          </tr>
        </thead>
        <tbody>
          {RECONCILE.map(({ item, count, note }) => (
            <tr key={item}>
              <td>{item}{note && <small>{note}</small>}</td>
              <td>{count}</td>
              <td>{count}</td>
              <td className="okc"><CheckIcon /><span className="visually-hidden">Match</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="proof-foot"><CheckIcon /><b>0 lost.</b><span>Every count matches.</span><a href="/migrate/freshdesk#5-check-the-reconcile-report">How the check works</a></div>
      <p className="proof-note">Sample numbers. The Freshdesk importer is <Badge kind="shipped">Shipped</Badge></p>
    </figure>
  );
}
