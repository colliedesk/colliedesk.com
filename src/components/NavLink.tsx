import type { NavLink as Link } from '../lib/site';

// A site link: external links get rel="noopener"; the link to the current page (or a parent
// section of it) gets aria-current="page".
export function NavLink({ link, current }: { link: Link; current: string }) {
  const { href, label, badge } = link;
  const isCurrent = current === href || (href !== '/' && current.startsWith(`${href}/`));
  return (
    <a href={href} rel={href.startsWith('http') ? 'noopener' : undefined} aria-current={isCurrent ? 'page' : undefined}>
      {label}
      {badge ? <span className="badge badge-coming">{badge}</span> : null}
    </a>
  );
}
