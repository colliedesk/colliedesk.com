import { HOME_EYEBROW, HOME_H1_LINES, HOME_LEDE, HOME_PRICE_LEAD, HOME_PRICE_REST, HOME_RISK_LINE } from '../../data/pages/home';
import { FOUNDING_ACTION } from '../../lib/cloud-price';
import { foundingState } from '../../lib/founding';
import { SWITCH_CALL_HREF, TRIAL_HREF } from '../../lib/site';

// Hero copy: the category, the promise and one primary action. The second link leads somewhere else:
// the Founding plan while it is open, the migration guide once it closes; teams of 11 to 100 agents
// get a call. The price line names what each team size pays. Home.astro places the product picture
// under it; the <img> stays out of React, whose renderer would add an image preload.
export function HeroCopy() {
  const open = foundingState().open;
  return (
    <div className="hero-copy">
      <p className="mono-label">{HOME_EYEBROW}</p>
      <h1 id="hero-title">{HOME_H1_LINES.map((line, i) => <span key={line}>{i > 0 && ' '}{line}</span>)}</h1>
      <p className="lede">{HOME_LEDE}</p>
      <div className="hero-actions">
        <a className="btn btn-primary" href={TRIAL_HREF}>Start free trial</a>{' '}
        {open
          ? <a className="text-link" href={FOUNDING_ACTION.href}>{FOUNDING_ACTION.label} <span aria-hidden="true">→</span></a>
          : <a className="text-link" href="/migrate/freshdesk">Read the migration guide <span aria-hidden="true">→</span></a>}{' '}
        <a className="text-link" href={SWITCH_CALL_HREF} rel="noopener">11–100 agents? Book a 30-minute call</a>
      </div>
      <p className="hero-note"><strong>{HOME_PRICE_LEAD}</strong> {HOME_PRICE_REST}<br />{HOME_RISK_LINE}</p>
    </div>
  );
}
