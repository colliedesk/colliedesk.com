import { FOUNDING_SLOTS, foundingState, type FoundingState } from '../lib/founding';
import { renderInline } from '../lib/markdown';
import type { Page } from '../lib/page';
import {
  agentsLabel, BUSINESS, CLOUD_PLANS, CONTACT_EMAIL, dollars, FOUNDING_CHECKOUT, INVOICE_OFFER_MD, MONEY_BACK, OFFER_SMALL_PRINT, REPO,
  SWITCH_CALL_HREF, SWITCH_CALL_LABEL, SWITCH_HREF, SWITCH_OFFER_MD, TEAM_25, TEAM_25_IMPORT, TEAM_25_TRIAL_HREF, TEAM_25_WHO, TRIAL_HREF,
  type CloudPlan,
} from '../lib/site';
import { FoundingMeter } from './FoundingMeter';
import { Hero } from './Hero';

// One card per Cloud plan: the price, one headline for agents and storage, and who it is for.
// Every plan has every feature, so the cards carry no feature lists.
function CloudCard({ plan }: { plan: CloudPlan }) {
  if (plan.salesOnly) return <BusinessCard />;
  return (
    <article className="plan">
      <h2 className="plan-name">{plan.name}</h2>
      <p className="plan-price"><strong>{dollars(plan.monthly)}</strong> <span>/ month</span></p>
      <p className="plan-alt">or {dollars(plan.yearly)} per year</p>
      <p className="plan-size"><strong>{agentsLabel(plan)}</strong> <span>{plan.storage} of attachments</span></p>
      <p className="plan-who">{plan.who}</p>
      <a className="btn btn-primary" href={TRIAL_HREF}>Start free trial</a>
    </article>
  );
}

// Business, for 26 to 100 agents: sold through a call with the founder, so the card books the call
// instead of opening a checkout or a trial. The uptime number waits for general availability.
export function BusinessCard() {
  return (
    <article className="plan">
      <h2 className="plan-name">{BUSINESS.name}</h2>
      <p className="plan-price"><strong>{dollars(BUSINESS.monthly)}</strong> <span>a month</span></p>
      <p className="plan-alt">or {dollars(BUSINESS.yearly)} a year</p>
      <p className="plan-size"><strong>{agentsLabel(BUSINESS)}</strong> <span>{BUSINESS.storage} of attachments</span></p>
      <p className="plan-who">{BUSINESS.who}</p>
      <ul>
        <li>We migrate everything for you: tickets, contacts, and your help center with 301 redirects</li>
        <li>Custom domain for your help center</li>
        <li>MCP server for your AI agents</li>
        <li>Priority support</li>
        <li>Uptime commitment at general availability</li>
      </ul>
      <div className="plan-cta">
        <a className="btn btn-primary" href={SWITCH_CALL_HREF} rel="noopener">Talk to us</a>
        <p className="plan-guarantee">A 30-minute call with the founder. More than {BUSINESS.agents} agents? Ask us for a quote.</p>
      </div>
    </article>
  );
}

// The switch and invoice offers for Team 25 and Business, under the plans and on the switch page. On
// the switch page the hero already has both buttons, so the block only states the offers.
export function SwitchOffer({ actions = true }: { actions?: boolean }) {
  return (
    <section className="switch-offer" aria-labelledby="switch-offer">
      <h2 id="switch-offer">Switching from Freshdesk with 11 to 100 agents?</h2>
      <div className="switch-offer-grid">
        <p dangerouslySetInnerHTML={{ __html: renderInline(SWITCH_OFFER_MD) }} />
        <p dangerouslySetInnerHTML={{ __html: renderInline(INVOICE_OFFER_MD) }} />
      </div>
      <ul className="switch-offer-print">
        {OFFER_SMALL_PRINT.map((line) => <li key={line}>{line}</li>)}
      </ul>
      {actions ? (
        <div className="cta-row">
          <a className="btn btn-primary" href={SWITCH_CALL_HREF} rel="noopener">{SWITCH_CALL_LABEL}</a>{' '}
          <a className="btn btn-ghost" href={SWITCH_HREF}>How the switch works</a>
        </div>
      ) : <p className="switch-offer-print">Questions first? <a href={SWITCH_CALL_HREF} rel="noopener">Talk to us</a> on a 30-minute call with the founder.</p>}
    </section>
  );
}

// Team 25 beside Founding, while Founding is open: the plan for teams of 11 to 25 agents, whom Founding
// does not fit. Once Founding closes the same plan shows in the ladder (CloudCard).
export function Team25Card() {
  return (
    <article className="plan">
      <h2 className="plan-name">{TEAM_25.name}</h2>
      <p className="plan-price"><strong>{dollars(TEAM_25.monthly)}</strong> <span>a month</span></p>
      <p className="plan-alt">or {dollars(TEAM_25.yearly)} a year</p>
      <p className="plan-size"><strong>{agentsLabel(TEAM_25)}</strong> <span>{TEAM_25.storage} of attachments</span></p>
      <p className="plan-who">{TEAM_25_WHO}</p>
      <ul>
        <li>{TEAM_25_IMPORT}</li>
      </ul>
      <a className="btn btn-primary" href={TEAM_25_TRIAL_HREF}>Start free trial</a>
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
      <p className="plan-price"><strong>$99</strong> <span>per workspace, billed quarterly</span></p>
      {state.open && <p className="plan-alt">$396 a year, about $7.60 a week for the whole team</p>}
      <div className="plan-detail">
        {state.open && <p className="plan-who">For support teams of 3 to 10 agents who pay for Freshdesk and just got a price rise. <a href="#who-founding-is-for">Is that you?</a></p>}
        <ul>
          <li>Limited to {FOUNDING_SLOTS} workspaces, then closed for good</li>
          <li>Price locked for life</li>
          <li>Freshdesk migration done for you, with a reconcile report</li>
          <li>Up to 10 agents, no per-agent fees</li>
          <li>20 GiB of attachments, imported files included</li>
          {state.open && <li>A direct line to the founder</li>}
          {state.open && <li>A say in what we build next</li>}
        </ul>
      </div>
      {state.open ? (
        <div className="plan-cta">
          <FoundingMeter state={state} />
          <a className="btn btn-primary" href={FOUNDING_CHECKOUT} rel="noopener">Join for $99 every 3 months</a>
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
// While Founding is open its card is in the hero and Team 25, Business and Self-host show here; the rest
// of the Cloud ladder and the closed Founding card show once it closes. The switch offer follows both.
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
            <p><strong>Every plan, every feature.</strong> Unlimited conversations, no per-agent fees, AI reply drafts and triage included with a monthly allowance or your own key. We run, update and back it up.</p>
            <ul>
              <li>14-day free trial, no card</li>
              <li>No automatic charge: when the trial ends, you pick a plan or export your data</li>
              <li>Cancel anytime</li>
            </ul>
          </div>
        </>
      )}
      <div className={state.open ? 'plans plans-after-hero' : 'plans'}>
        {state.open ? <><Team25Card /><BusinessCard /></> : <FoundingCard state={state} />}
        <article className="plan">
          <h2 className="plan-name">Self-host</h2>
          <p className="plan-price"><strong>$0</strong> <span>forever</span></p>
          <ul>
            <li>Every feature, no paywalled edition</li>
            <li>AGPL-3.0, your server, your PostgreSQL</li>
            <li>No agent limit</li>
            <li>AI with your own model key</li>
          </ul>
          <a className="btn btn-ghost" href={REPO} rel="noopener">Self-host free <span aria-hidden="true">↗</span></a>
        </article>
      </div>
      <SwitchOffer />
      <p className="plans-note">
        Need more storage? Email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Customer email always arrives, even over the
        cap; only agent uploads and new imports pause, and we warn you at 80%.
      </p>
    </section>
  );
}

// The plans on the switch page: Team 25 and Business, the two plans the switch offer applies to.
export function SwitchPlans() {
  return (
    <section className="wrap plans-section" aria-label="Plans">
      <div className="plans plans-switch">
        <Team25Card />
        <BusinessCard />
      </div>
      <SwitchOffer actions={false} />
    </section>
  );
}
