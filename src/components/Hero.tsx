import type { ReactNode } from 'react';
import { foundingState } from '../lib/founding';
import { renderInline } from '../lib/markdown';
import { mdUrlOf, type Page } from '../lib/page';
import { CtaButtons } from './CtaButtons';
import { DocsActions } from './DocsActions';
import { DocsBreadcrumb } from './DocsPageParts';

type HeroPage = Pick<Page, 'h1'> & Partial<Pick<Page, 'path' | 'section' | 'eyebrow' | 'lede' | 'cta' | 'ctaFounding' | 'ctaCall' | 'docsPlace'>>;

// The page hero. An aside (the Founding card on /pricing) sits beside the copy on wide screens, so the
// offer is in the first view instead of an empty right half. A docs page shows its breadcrumb in place of
// the eyebrow, and its lede is part of what docs search indexes.
export function Hero({ page, aside }: { page: HeroPage; aside?: ReactNode }) {
  const docs = page.section === 'Docs';
  const founding = page.ctaFounding && foundingState().open ? page.ctaFounding : undefined;
  const copy = (
    <>
      {page.docsPlace ? <DocsBreadcrumb crumbs={page.docsPlace.crumbs} /> : page.eyebrow && <p className="eyebrow">{page.eyebrow}</p>}
      <h1>{page.h1}</h1>
      {docs && page.path && <DocsActions mdUrl={mdUrlOf(page.path)} />}
      {page.lede && <p className="lede" data-pagefind-body={docs ? '' : undefined} dangerouslySetInnerHTML={{ __html: renderInline(page.lede) }} />}
      {page.cta && <CtaButtons founding={founding} call={page.ctaCall} />}
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
