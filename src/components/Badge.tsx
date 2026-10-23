import type { ReactNode } from 'react';

// Status badge; the Markdown renderer emits the same markup for **Not built yet** and **Shipped**.
export function Badge({ kind, children }: { kind: 'coming' | 'shipped'; children: ReactNode }) {
  return <span className={`badge badge-${kind}`}>{children}</span>;
}
