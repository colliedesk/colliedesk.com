import { FOOTER, STATUS_PAGE } from '../lib/site';
import { MoonIcon } from './Icons';
import { NavLink } from './NavLink';
import { BrandLink } from './Wordmark';

// About text and link columns of the footer grid (Footer.astro adds the updates form after them).
export function FooterColumns() {
  return (
    <>
      <div className="footer-about">
        <BrandLink />
        <p>Open-source helpdesk by HC Labs. AGPL-3.0. Every page on this site has a plain Markdown version: add <code>.md</code> to the URL.</p>
      </div>
      {FOOTER.map((c) => (
        <div key={c.title}>
          <h2 className="footer-title">{c.title}</h2>
          <ul>
            {c.links.map((l) => (
              <li key={l.href}><NavLink link={l} current="" /></li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

// The theme toggle is unhidden and wired by public/theme.js.
export function FooterLegal() {
  return (
    <div className="wrap footer-legal">
      <p>© 2026 HC Labs. <a href={STATUS_PAGE} rel="noopener">Service status</a> · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <button type="button" className="link-button" data-consent-open="">Your privacy choices</button></p>
      <button type="button" className="theme-toggle" data-theme-toggle="" aria-pressed="false" hidden><MoonIcon />Dark theme</button>
    </div>
  );
}
