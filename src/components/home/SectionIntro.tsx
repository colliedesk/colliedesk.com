import type { ReactNode } from 'react';

// The opening row of every home section: a mono label, the headline (the section's h2) and one short lede.
export function SectionIntro({ id, eyebrow, title, lede, children }: { id: string; eyebrow: string; title: string; lede?: ReactNode; children?: ReactNode }) {
  return (
    <div className="sheet-row intro">
      <p className="mono-label">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {lede && <p className="intro-lede">{lede}</p>}
      {children}
    </div>
  );
}
