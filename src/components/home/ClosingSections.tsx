import { FOUNDING_SLOTS, foundingState } from '../../lib/founding';
import { FoundingMeter } from '../FoundingMeter';
import { FRESHDESK_MONTH, FRESHDESK_YEAR, OURS_NAME, OURS_YEAR } from '../../data/pages/home-sections';
import { FOUNDING_CHECKOUT, MONEY_BACK, PRICE, TRIAL_HREF } from '../../lib/site';
import { usd } from '../../lib/vs-pricing';

function Founding() {
  const state = foundingState();
  return (
    <section className="section" id="founding" aria-labelledby="founding-title">
      <div className="wrap">
        <div className="founding">
          <div>
            <p className="eyebrow">Founding offer</p>
            {state.open ? (
              <>
                <h2 id="founding-title">$99 a quarter. Locked for life.</h2>
                <p className="section-lede">For small teams planning to leave Freshdesk. Only {FOUNDING_SLOTS} workspaces get it. Cloud Team lists at {PRICE.yearly} a year. Your price never goes up, and we migrate your Freshdesk data for free.</p>
              </>
            ) : (
              <>
                <h2 id="founding-title">Founding is closed. All {FOUNDING_SLOTS} places are taken.</h2>
                <p className="section-lede">Thank you to the first {FOUNDING_SLOTS} teams. Their price stays $99 a quarter for life. Everyone else can start on Cloud Team, or self-host for free.</p>
              </>
            )}
          </div>
          <ul className="check-list">
            <li>$99 a quarter per workspace, locked for life</li>
            <li>{MONEY_BACK}: full refund within 30 days, no questions asked</li>
            <li>Free Freshdesk migration with a reconcile report</li>
            <li>Up to 10 agents, no per-agent fees</li>
            <li>20 GiB of attachments, imported files included</li>
            <li>AI reply drafts and triage included with a monthly allowance, or your own key</li>
            <li>Founding workspaces run on Colliedesk Cloud today</li>
          </ul>
          {state.open ? (
            <div className="founding-cta">
              <FoundingMeter state={state} />
              <a className="btn btn-primary btn-lg" href={FOUNDING_CHECKOUT} rel="noopener">Become a founding customer, $99/quarter</a>
              <p>Secure checkout by Polar. Not right for you? Email us within 30 days and we refund the full $99, <a href="/terms#refunds">no questions asked</a>. After payment we email you within one business day to set up your workspace and plan your Freshdesk migration.</p>
            </div>
          ) : (
            <div className="founding-cta">
              <a className="btn btn-primary btn-lg" href="/pricing">See Cloud Team pricing</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// The founding offer, between the status table and the FAQ.
export function ClosingSections() {
  return (
    <>
      <Founding />
    </>
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

// The last block on the home page, after the FAQ: a year of Freshdesk bills for five agents, laid
// out as twelve static invoices, against one year of what we sell (Founding while open, then Cloud Team). No JavaScript.
export function ClosingCta() {
  return (
    <section className="section closing-band" aria-labelledby="closing">
      <div className="wrap closing">
        <div>
          <p className="eyebrow">A year of Freshdesk for five agents</p>
          <h2 id="closing">Bring your tickets. Keep the difference.</h2>
          <p className="section-lede">{`Freshdesk Pro with Freddy AI Copilot, billed annually: 12 × ${usd(FRESHDESK_MONTH)} = ${usd(FRESHDESK_YEAR)} a year. ${OURS_NAME} is ${usd(OURS_YEAR)} a year for the same team. You keep ${usd(FRESHDESK_YEAR - OURS_YEAR)}.`}</p>
          <div className="cta-row">
            <a className="btn btn-primary btn-lg" href={TRIAL_HREF}>Start free trial <span aria-hidden="true">→</span></a>{' '}
            <a className="btn btn-lg" href="/migrate/freshdesk">Move from Freshdesk</a>
          </div>
        </div>
        <div className="invoices">
          <ol aria-label={`Twelve months of Freshdesk at ${usd(FRESHDESK_MONTH)}`}>
            {MONTHS.map((m) => (
              <li key={m} className="invoice"><span>{m}</span><strong>{usd(FRESHDESK_MONTH)}</strong></li>
            ))}
          </ol>
          <p className="invoice-total"><span>Freshdesk, one year</span><strong>{usd(FRESHDESK_YEAR)}</strong></p>
          <p className="invoice-total invoice-ours"><span>{OURS_NAME}, one year</span><strong>{usd(OURS_YEAR)}</strong></p>
        </div>
      </div>
    </section>
  );
}
