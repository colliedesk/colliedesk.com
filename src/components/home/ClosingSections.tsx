import { FOUNDING_SLOTS, foundingState } from '../../lib/founding';
import { HOME_FAQ } from '../../data/pages/home';
import { renderInline } from '../../lib/markdown';
import { BUSINESS_AGENTS, FOUNDING_CHECKOUT, MONEY_BACK, PRICE, SWITCH_CALL_HREF, TEAM_25, TEAM_25_AGENTS, TRIAL_HREF } from '../../lib/site';
import { FoundingMeter } from '../FoundingMeter';
import { CheckIcon } from '../Icons';
import { SectionIntro } from './SectionIntro';

const INCLUDED = [
  'Up to 10 agents, no per-agent fees',
  'Free Freshdesk migration with a reconcile report',
  '20 GiB of attachments, imported files included',
  'AI reply drafts and triage included, or your own key',
  MONEY_BACK,
  'Runs on Colliedesk Cloud today',
] as const;

// The whole Founding offer in one place: price, lock, what is included, refund and export, and where
// bigger teams go. The meter says how many places are left once the first is taken.
function Founding() {
  const state = foundingState();
  return (
    <section className="sheet-row cells founding-offer" id="founding" aria-labelledby="founding-title">
      <div className="cell">
        <p className="mono-label">Founding offer · 3 to 10 agents · {FOUNDING_SLOTS} places</p>
        {state.open ? (
          <>
            <h2 id="founding-title"><span>$99 every 3 months.</span> <span>Locked for life.</span></h2>
            <p>For small teams planning to leave Freshdesk. Your price never goes up, we migrate your Freshdesk data for free, and you can export the whole workspace at any time. After the {FOUNDING_SLOTS} places: Cloud Team at {PRICE.yearly} a year. Bigger team? {TEAM_25_AGENTS} agents: {TEAM_25.name}. {BUSINESS_AGENTS}: Business, through a call.</p>
            <div className="founding-buy">
              <FoundingMeter state={state} />
              <a className="btn btn-primary" href={FOUNDING_CHECKOUT} rel="noopener">Become a founding customer</a>
              <p className="text-small">Secure checkout by Polar. Full refund within 30 days, <a href="/terms#refunds">no questions asked</a>.</p>
            </div>
          </>
        ) : (
          <>
            <h2 id="founding-title">Founding is closed. All {FOUNDING_SLOTS} places are taken.</h2>
            <p>Thank you to the first {FOUNDING_SLOTS} teams. Their price stays $99 every 3 months for life. Everyone else can start on Cloud Team, or self-host for free.</p>
            <div className="founding-buy"><a className="btn btn-primary" href="/pricing">See Cloud Team pricing</a></div>
          </>
        )}
      </div>
      <ul className="cell included" aria-label="Included in Founding">
        {INCLUDED.map((item) => <li key={item}><CheckIcon />{item}</li>)}
      </ul>
    </section>
  );
}

// Objections real buyers raised, answered in two lines each, in their words.
function Questions() {
  return (
    <section aria-labelledby="questions">
      <SectionIntro id="questions" eyebrow="Questions" title="What buyers asked us before switching." />
      <dl className="sheet-row faq-rows">
        {HOME_FAQ.map((f) => (
          <div key={f.q}><dt>{f.q}</dt><dd dangerouslySetInnerHTML={{ __html: renderInline(f.a) }} /></div>
        ))}
      </dl>
    </section>
  );
}

// The founding offer and the questions, after the reliability section.
export function ClosingSections() {
  return (
    <>
      <Founding />
      <Questions />
    </>
  );
}

// The last row: the hero's promise again, one primary action with its risk reversal, and the call for
// teams of 11 to 100 agents.
export function ClosingCta() {
  const open = foundingState().open;
  return (
    <section className="sheet-row final-cta" aria-labelledby="closing">
      <div>
        <h2 id="closing">Bring your tickets. Keep the difference.</h2>
        <p>14-day free trial, no card. {MONEY_BACK}.{open && ' Founding price locked for life.'}</p>
      </div>
      <div className="final-actions">
        <a className="text-link" href={SWITCH_CALL_HREF} rel="noopener">11 to 100 agents? Book a 30-minute call</a>{' '}
        <a className="btn btn-primary" href={TRIAL_HREF}>Start free trial</a>
      </div>
    </section>
  );
}
