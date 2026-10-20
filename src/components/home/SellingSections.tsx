import type { ReactElement } from 'react';
import { BAR_MAX as MAX, BARS, BORING } from '../../data/pages/home-sections';
import { PRICES_READ } from '../../lib/site';
import { FlowPause, FlowTile } from './FlowTile';

function Bill() {
  return (
    <section className="section" aria-labelledby="bill">
      <div className="wrap split">
        <div>
          <p className="eyebrow">The bill for five agents</p>
          <h2 id="bill">Per-agent pricing, then per-agent AI</h2>
          <p className="section-lede">
            {`Freshdesk list prices per year, billed annually, read on ${PRICES_READ}. `}
            <a href="/vs/freshdesk">Details</a>.
          </p>
        </div>
        <ul className="bars" aria-label="Yearly cost for five agents">
          {BARS.map((b) => (
            <li key={b.href} className={b.ours ? 'bar bar-ours' : 'bar'}>
              <div className="bar-label"><a href={b.href}>{b.name}</a><span className="bar-math">{b.math}</span></div>
              <div className="bar-track">
                <span className="bar-fill" style={{ width: `${Math.max((b.usd / MAX) * 100, 1.5).toFixed(1)}%` }}></span>
                <strong>{`$${b.usd.toLocaleString('en-US')}`}<small>/yr</small></strong>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// Small pictures of shipped behaviour for three of the boring parts (Threading plays FlowTile). Their chips stamp in as
// the card scrolls into view, where the browser supports it. Decorative: the card text says the same thing, so screen
// readers skip them.
const MINI: Readonly<Record<string, ReactElement>> = {
  'Mail that lands': (
    <div className="mini mini-chips">
      {['DKIM', 'SPF', 'DMARC'].map((k) => <span key={k} className="mini-pass">{`${k} pass`}</span>)}
    </div>
  ),
  'Mail you can trust': (
    <div className="mini">
      <p className="mini-row"><span>billing@yourbank.example</span><span className="mini-stop">Stopped</span></p>
      <p className="mini-sub">Sender failed DMARC. No ticket created.</p>
    </div>
  ),
  'Your data out, any time': (
    <div className="mini">
      <p className="mini-row"><span className="mini-file">workspace-export.zip</span><span className="mini-pass">Ready</span></p>
    </div>
  ),
};

function Boring() {
  return (
    <section className="section" aria-labelledby="boring">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">The boring parts</p>
          <h2 id="boring">A helpdesk is more than an inbox. These parts already work.</h2>
          <p className="section-lede">What a team of three to ten uses every day. HC Labs runs its own support on it.</p>
        </div>
        <ul className="bento">
          {BORING.map(([k, , short]) => (
            <li key={k} className={k === 'Threading' ? 'bento-card bento-wide loop' : MINI[k] ? 'bento-card bento-wide' : 'bento-card'}>
              {MINI[k] && <div aria-hidden="true">{MINI[k]}</div>}
              {k === 'Threading' && <><FlowTile /><FlowPause /></>}
              <h3>{k}</h3>
              <p>{short}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// The five-agent bill and the boring parts, after the product sections.
export function SellingSections() {
  return (
    <>
      <Bill />
      <Boring />
    </>
  );
}
