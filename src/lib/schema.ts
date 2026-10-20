// JSON-LD builders. Only facts from site.ts; no ratings, reviews or counts we do not have.
import { plain } from './markdown';
import type { Faq, JsonLd, Page } from './page';
import { agentsLabel, CLOUD_PLANS, dollars, NAME, ORIGIN, POSITIONING, REPO, UPDATED } from './site';

export const organization = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'HC Labs',
  url: ORIGIN,
  sameAs: [REPO],
});

export const softwareApplication = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: NAME,
  url: ORIGIN,
  description: `Open-source helpdesk for small support teams. ${POSITIONING}`,
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'Help desk software',
  operatingSystem: 'Linux, Docker; web browser',
  softwareVersion: '0.0.1 (alpha)',
  license: 'https://www.gnu.org/licenses/agpl-3.0.html',
  codeRepository: REPO,
  isAccessibleForFree: true,
  author: { '@type': 'Organization', name: 'HC Labs', url: ORIGIN },
  dateModified: UPDATED,
  offers: [
    { '@type': 'Offer', name: 'Self-hosted', price: '0', priceCurrency: 'USD', description: 'Free forever, every feature, AGPL-3.0.' },
    // Only plans that can be bought today; Unlimited is coming soon.
    ...CLOUD_PLANS.filter((p) => !p.comingSoon).map((p) => ({
      '@type': 'Offer', name: `Colliedesk Cloud ${p.name}`, price: String(p.monthly), priceCurrency: 'USD',
      description: `${p.name} plan, per workspace per month (${dollars(p.yearly)} per year). ${agentsLabel(p)} and ${p.storage} of attachments, no per-agent fees.`,
      priceSpecification: { '@type': 'UnitPriceSpecification', price: String(p.monthly), priceCurrency: 'USD', unitText: 'workspace per month' },
    })),
    {
      '@type': 'Offer', name: 'Founding customer', price: '100', priceCurrency: 'USD',
      description: 'Per workspace per year, locked for life, with free Freshdesk migration. Up to 10 agents and 20 GB of attachments.',
      priceSpecification: { '@type': 'UnitPriceSpecification', price: '100', priceCurrency: 'USD', unitText: 'workspace per year' },
    },
  ],
});

export const faqPage = (faq: readonly Faq[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: plain(f.a) },
  })),
});

type ArticleFields = Pick<Page, 'h1' | 'description' | 'path'> & Partial<Pick<Page, 'updated'>>;

export const techArticle = (page: ArticleFields): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: page.h1,
  description: page.description,
  url: `${ORIGIN}${page.path}`,
  dateModified: page.updated || UPDATED,
  author: { '@type': 'Organization', name: 'HC Labs' },
  about: { '@type': 'SoftwareApplication', name: NAME },
});
