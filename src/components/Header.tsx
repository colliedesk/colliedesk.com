import { APP_SIGN_IN, TRIAL_HREF, NAV, REPO, STATUS_PAGE } from '../lib/site';
import { NavLink } from './NavLink';
import { BrandLink } from './Wordmark';

function NavItems({ path }: { path: string }) {
  return (
    <ul>
      {NAV.map((n) => (
        <li key={n.href}><NavLink link={n} current={path} /></li>
      ))}
      <li><NavLink link={{ href: STATUS_PAGE, label: 'Status' }} current={path} /></li>
      <li><NavLink link={{ href: REPO, label: 'GitHub' }} current={path} /></li>
      <li><a href={APP_SIGN_IN}>Log in</a></li>
    </ul>
  );
}

export function Header({ path }: { path: string }) {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <BrandLink />
        <nav aria-label="Main" className="nav-desktop"><NavItems path={path} /></nav>
        <a className="btn btn-primary btn-sm header-cta" href={TRIAL_HREF}>Start free trial</a>
        <details className="nav-mobile">
          <summary>Menu</summary>
          <nav aria-label="Main (mobile)"><NavItems path={path} /></nav>
        </details>
      </div>
    </header>
  );
}
