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

// Rendered width of the hero: the page column less its side padding (5rem, 2.5rem up to 640px), at most 72rem.
export const HERO_SIZES = '(max-width: 640px) calc(100vw - 2.5rem), (max-width: 77rem) calc(100vw - 5rem), 72rem';
