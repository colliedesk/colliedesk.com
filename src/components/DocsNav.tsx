import type { DocsNavGroup, DocsNavItem } from '../lib/page';

function Links({ items, current }: { items: readonly DocsNavItem[]; current: string }) {
  return (
    <ul>
      {items.map(({ href, label }) => (
        <li key={href}><a href={href} aria-current={href === current ? 'page' : undefined}>{label}</a></li>
      ))}
    </ul>
  );
}

export function DocsNav({ groups, current }: { groups: readonly DocsNavGroup[]; current: string }) {
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
                  <Links items={item.items} current={current} />
                </li>
              ) : (
                <li key={item.href}><a href={item.href} aria-current={item.href === current ? 'page' : undefined}>{item.label}</a></li>
              ),
            )}
          </ul>
        </div>
      ))}
    </nav>
  );
}
