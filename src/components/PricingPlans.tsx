import { FOUNDING_SLOTS, foundingState, type FoundingState } from '../lib/founding';
import type { Page } from '../lib/page';
import {
  agentsLabel, CLOUD_PLANS, CONTACT_EMAIL, dollars, FOUNDING_CHECKOUT, MONEY_BACK, REPO, TRIAL_HREF, type CloudPlan,
} from '../lib/site';
import { FoundingMeter } from './FoundingMeter';
import { Hero } from './Hero';

// One card per Cloud plan: the price, one headline for agents and storage, and who it is for.
// Every plan has every feature, so the cards carry no feature lists.
function CloudCard({ plan }: { plan: CloudPlan }) {
  return (
    <article className={plan.comingSoon ? 'plan plan-soon' : 'plan'}>
      <h2 className="plan-name">{plan.name}</h2>
      <p className="plan-price"><strong>{dollars(plan.monthly)}</strong> <span>/ month</span></p>
      <p className="plan-alt">{plan.annualOnly ? `billed annually, ${dollars(plan.yearly)} per year` : `or ${dollars(plan.yearly)} per year`}</p>
      <p className="plan-size"><strong>{agentsLabel(plan)}</strong> <span>{plan.storage} of attachments</span></p>
      <p className="plan-who">{plan.who}</p>
      {plan.comingSoon ? <p className="plan-soon-note">Coming soon</p> : <a className="btn btn-primary" href={TRIAL_HREF}>Start free trial</a>}
    </article>
  );
}

// The Founding offer. While it is open the card sits in the /pricing hero (PricingHero) so its buy
// button is in the first view; once closed it returns to the plans, after the Cloud ladder.
function FoundingCard({ state }: { state: FoundingState }) {
  return (
    <article className="plan plan-featured" aria-labelledby="plan-founding">
      <p className="plan-flag">{state.open ? `Only ${FOUNDING_SLOTS} workspaces` : 'Closed: all places taken'}</p>
      <h2 className="plan-name" id="plan-founding">Founding</h2>
      <p className="plan-price"><strong>$99</strong> <span>per workspace / quarter</span></p>
      {state.open && <p className="plan-alt">$396 a year, about $7.60 a week for the whole team</p>}
      <div className="plan-detail">
        {state.open && <p className="plan-who">For support teams of 3 to 10 agents who pay for Freshdesk and just got a price rise. <a href="#who-founding-is-for">Is that you?</a></p>}
        <ul>
          <li>Limited to {FOUNDING_SLOTS} workspaces, then closed for good</li>
          <li>Price locked for life</li>
          <li>Freshdesk migration done for you, with a reconcile report</li>
          <li>Up to 10 agents, no per-agent fees</li>
          <li>20 GB of attachments, imported files included</li>
          {state.open && <li>A direct line to the founder</li>}
          {state.open && <li>A say in what we build next</li>}
        </ul>
      </div>
      {state.open ? (
        <div className="plan-cta">
          <FoundingMeter state={state} />
          <a className="btn btn-primary" href={FOUNDING_CHECKOUT} rel="noopener">Join for $99/quarter</a>
          <p className="plan-guarantee"><a href="/terms#refunds">{MONEY_BACK}</a>. Full refund, no questions asked.</p>
          <p className="plan-guarantee">Want to look first? <a href={TRIAL_HREF}>Start a 14-day free trial</a>, no card.</p>
        </div>
      ) : <p>Founding is closed. Existing founding customers keep this price for life.</p>}
    </article>
  );
}

// The /pricing hero: the Founding card beside the copy while Founding is open.
export function PricingHero({ page }: { page: Page }) {
  const state = foundingState();
  return <Hero page={page} aside={state.open ? <FoundingCard state={state} /> : undefined} />;
}

// The plans above the pricing prose; the Markdown twin carries the same facts as a table.
// While Founding is open it is the only plan on sale (its card is in the hero) and only Self-host shows
// here; the Cloud ladder and the closed Founding card show once it closes.
export function PricingPlans() {
  const state = foundingState();
  return (
    <section className="wrap plans-section" aria-label="Plans">
      {!state.open && (
        <>
          <div className="plans plans-ladder">
            {CLOUD_PLANS.map((plan) => <CloudCard key={plan.name} plan={plan} />)}
          </div>
          <div className="plans-reassure">
            <p><strong>Every plan, every feature.</strong> Unlimited conversations, no per-agent fees, AI at LLM cost +30% or your own key once it is built. We run, update and back it up.</p>
            <ul>
              <li>14-day free trial, no card</li>
              <li>No automatic charge: when the trial ends, you pick a plan or export your data</li>
              <li>Cancel anytime</li>
            </ul>
          </div>
        </>
      )}
      <div className={state.open ? 'plans plans-after-hero' : 'plans'}>
        {!state.open && <FoundingCard state={state} />}
        <article className="plan">
          <h2 className="plan-name">Self-host</h2>
          <p className="plan-price"><strong>$0</strong> <span>forever</span></p>
          <ul>
            <li>Every feature, no paywalled edition</li>
            <li>AGPL-3.0, your server, your PostgreSQL</li>
            <li>No agent limit</li>
            <li>AI with your own model key, once it is built</li>
          </ul>
          <a className="btn btn-ghost" href={REPO} rel="noopener">Self-host free <span aria-hidden="true">↗</span></a>
        </article>
      </div>
      <p className="plans-note">
        Need more storage? Email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Customer email always arrives, even over the
        cap; only agent uploads and new imports pause, and we warn you at 80%.
      </p>
    </section>
  );
}
