// A space between the buttons keeps their labels apart in text-only readers; flex layout hides it.
import { type NavLink, REPO, TRIAL_HREF } from '../lib/site';

export function CtaButtons({ founding }: { founding?: NavLink | undefined }) {
  return (
    <div className="cta-row">
      <a className="btn btn-primary" href={TRIAL_HREF}>Start free trial</a>{' '}
      {founding && <><a className="btn" href={founding.href}>{founding.label}</a>{' '}</>}
      <a className="btn btn-ghost" href={REPO} rel="noopener">Self-host free <span aria-hidden="true">↗</span></a>
    </div>
  );
}
