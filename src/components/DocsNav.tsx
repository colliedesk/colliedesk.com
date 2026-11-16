import type { DocsNavGroup, DocsNavItem } from '../lib/page';
import { DocsSearchButton } from './DocsSearch';

type NavProps = { groups: readonly DocsNavGroup[]; current: string };

function Link({ href, label, current }: DocsNavItem & { current: string }) {
  return <li><a href={href} aria-current={href === current ? 'page' : undefined}>{label}</a></li>;
}

// The docs list itself, one vertical list per section with its "## Heading" groups nested.
function NavTree({ groups, current }: NavProps) {
  return (
    <nav className="docs-nav" aria-label="Docs">
      {groups.map(({ title, items }) => (
        <div key={title} className="docs-nav-group">
          <p className="docs-nav-title">{title}</p>
          <ul>
            {items.map((item) =>
              'items' in item ? (
                <li key={item.title} className="docs-nav-subgroup">
                  <p className="docs-nav-subtitle">{item.title}</p>
                  <ul>{item.items.map((i) => <Link key={i.href} {...i} current={current} />)}</ul>
                </li>
              ) : (
                <Link key={item.href} {...item} current={current} />
              ),
            )}
          </ul>
        </div>
      ))}
    </nav>
  );
}

// Wide screens: the list beside the page, under the search button.
export function DocsSidebar(props: NavProps) {
  return (
    <aside className="docs-sidebar">
      <DocsSearchButton />
      <NavTree {...props} />
    </aside>
  );
}

// Phones and tablets (960px and under, where the sidebar is hidden): one closed control above the title
// that names the page you are on, so the title and first paragraph are in the first screen. A <details>
// opens it without JavaScript; open, it is the same vertical list as the sidebar.
export function DocsMenu({ label, ...props }: NavProps & { label: string }) {
  return (
    <div className="wrap docs-menu-bar">
      <details className="docs-menu">
        <summary><span className="docs-menu-label">Docs menu</span><span className="docs-menu-current">{label}</span></summary>
        <NavTree {...props} />
      </details>
      <DocsSearchButton />
    </div>
  );
}
