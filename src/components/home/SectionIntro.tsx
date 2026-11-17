import type { ReactNode } from 'react';

// The opening row of every home section: the headline (the section's h2) and one short lede. No label
// above it: each headline already names its section, and a label that repeats it is noise.
export function SectionIntro({ id, title, lede, children }: { id: string; title: string; lede?: ReactNode; children?: ReactNode }) {
  return (
    <div className="sheet-row intro">
      <h2 id={id}>{title}</h2>
      {lede && <p className="intro-lede">{lede}</p>}
      {children}
    </div>
  );
}
