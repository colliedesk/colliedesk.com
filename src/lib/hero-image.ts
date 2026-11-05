// The home hero screenshot in the widths and formats its <picture> offers. The files are written from
// public/product-inbox@2x.jpg (2880 × 1800) by scripts/product-shot/variants.mjs, which `pnpm shot:product`
// runs after a retake. Heights keep the 16:10 frame of the 1440 × 900 capture.
export const HERO_WIDTHS = [720, 1152, 1440, 2304, 2880] as const;
export const HERO_FORMATS = ['avif', 'webp'] as const;
export type HeroFormat = (typeof HERO_FORMATS)[number];

export interface HeroVariant { file: string; width: number; height: number; format: HeroFormat }

export const heroVariants = (): HeroVariant[] =>
  HERO_FORMATS.flatMap((format) => HERO_WIDTHS.map((width) => ({ file: `product-inbox-${width}.${format}`, width, height: (width * 5) / 8, format })));

export const heroSrcset = (format: HeroFormat): string =>
  heroVariants().filter((v) => v.format === format).map((v) => `/${v.file} ${v.width}w`).join(', ');

// JPEG for browsers without AVIF or WebP: the 1x and 2x captures themselves.
export const HERO_JPEG_SRCSET = '/product-inbox.jpg 1440w, /product-inbox@2x.jpg 2880w';

// Rendered width of the hero: at most 1000px; narrower, the window less the page padding (2 × 40px), the
// sheet border (2px) and the stage row's padding (2 × 32px). Phones use HERO_MOBILE_SIZES.
export const HERO_SIZES = '(max-width: 1146px) calc(100vw - 146px), 1000px';

// Phones get their own picture (art direction): the conversation, its owner and the reply draft stacked as
// three crops in public/product-inbox-mobile@2x.jpg (700 × 1036), so 13px interface text stays readable at
// 390px. Written from the design for now, like the 2x screenshot; variants.mjs scales it.
export const HERO_MOBILE_SOURCE = 'product-inbox-mobile@2x.jpg';
export const HERO_MOBILE_WIDTHS = [350, 700] as const;
const MOBILE_RATIO = 1036 / 700;
export const HERO_MOBILE_MEDIA = '(max-width: 640px)';
// The picture sits in the page column less 20px a side.
export const HERO_MOBILE_SIZES = 'calc(100vw - 2.5rem)';

export const heroMobileVariants = (): HeroVariant[] =>
  HERO_FORMATS.flatMap((format) => HERO_MOBILE_WIDTHS.map((width) => ({ file: `product-inbox-mobile-${width}.${format}`, width, height: Math.round(width * MOBILE_RATIO), format })));

export const heroMobileSrcset = (format: HeroFormat): string =>
  heroMobileVariants().filter((v) => v.format === format).map((v) => `/${v.file} ${v.width}w`).join(', ');
