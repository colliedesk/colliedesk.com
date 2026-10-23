import { HOME_H1, HOME_LEDE } from '../../data/pages/home';
import { foundingState } from '../../lib/founding';
import { dollars, FOUNDING_CHECKOUT, MONEY_BACK, SOLO, TRIAL_HREF } from '../../lib/site';

// Hero copy: centred promise and two actions. While Founding is open the second action buys it, with
// the refund promise beside it, and the migration guide moves into the note under the buttons.
// Home.astro places the product screenshot and the reconcile proof under it; the <img> stays out of
// React, whose renderer would add an image preload.
export function HeroCopy() {
  const open = foundingState().open;
  return (
    <div className="hero-copy">
      <p className="eyebrow hero-eyebrow">Open source · AGPL-3.0 · Alpha, live on Cloud</p>
      <h1>{HOME_H1}</h1>
      <p className="lede">{HOME_LEDE}</p>
      <div className="cta-row">
        <a className="btn btn-primary btn-lg" href={TRIAL_HREF}>Start free trial <span aria-hidden="true">→</span></a>{' '}
        {open
          ? <a className="btn btn-lg" href={FOUNDING_CHECKOUT} rel="noopener">Join Founding, $99 a quarter</a>
          : <a className="btn btn-lg" href="/migrate/freshdesk">Read the migration guide</a>}
      </div>
      {open ? (
        <p className="hero-note">14-day free trial, no card · Founding price locked for life, <a href="/terms#refunds">{MONEY_BACK}</a> · <a href="/migrate/freshdesk">Read the migration guide</a></p>
      ) : (
        <p className="hero-note">14-day free trial, no card · Plans from <b>{dollars(SOLO.monthly)}</b> a month · Founding price locked for life · <a href="#bill">See the five-agent bill</a></p>
      )}
    </div>
  );
}
