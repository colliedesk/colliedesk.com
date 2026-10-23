import type { ReactNode } from 'react';
import { foundingState } from '../lib/founding';
import { renderInline } from '../lib/markdown';
import type { Page } from '../lib/page';
import { CtaButtons } from './CtaButtons';

type HeroPage = Pick<Page, 'h1'> & Partial<Pick<Page, 'eyebrow' | 'lede' | 'cta' | 'ctaFounding'>>;

// The page hero. An aside (the Founding card on /pricing) sits beside the copy on wide screens, so the
// offer is in the first view instead of an empty right half.
export function Hero({ page, aside }: { page: HeroPage; aside?: ReactNode }) {
  const founding = page.ctaFounding && foundingState().open ? page.ctaFounding : undefined;
  const copy = (
    <>
      {page.eyebrow && <p className="eyebrow">{page.eyebrow}</p>}
      <h1>{page.h1}</h1>
      {page.lede && <p className="lede" dangerouslySetInnerHTML={{ __html: renderInline(page.lede) }} />}
      {page.cta && <CtaButtons founding={founding} />}
    </>
  );
  return (
    <section className={aside ? 'page-hero page-hero-split' : 'page-hero'}>
      {aside ? (
        <div className="wrap page-hero-grid"><div className="page-hero-copy">{copy}</div>{aside}</div>
      ) : <div className="wrap">{copy}</div>}
    </section>
  );
}
