// A space between the buttons keeps their labels apart in text-only readers; flex layout hides it.
import { type NavLink, REPO, TRIAL_HREF } from '../lib/site';

// A page that sells through a call (the switch page) books it where the Self-host button would be.
export function CtaButtons({ founding, call }: { founding?: NavLink | undefined; call?: NavLink | undefined }) {
  return (
    <div className="cta-row">
      <a className="btn btn-primary" href={TRIAL_HREF}>Start free trial</a>{' '}
      {founding && <><a className="btn" href={founding.href}>{founding.label}</a>{' '}</>}
      {call
        ? <a className="btn" href={call.href} rel="noopener">{call.label}</a>
        : <a className="btn btn-ghost" href={REPO} rel="noopener">Self-host free <span aria-hidden="true">↗</span></a>}
    </div>
  );
}
