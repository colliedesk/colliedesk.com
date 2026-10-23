#!/usr/bin/env node
// Writes the AVIF and WebP copies of the product screenshot that the home hero serves by width
// (src/lib/hero-image.ts), each scaled from public/product-inbox@2x.jpg. The pixels are the capture's;
// only the size and the encoding change. Needs ffmpeg with libaom-av1 and libwebp.
//
//   node scripts/product-shot/variants.mjs     (pnpm shot:product runs it after a retake)
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { heroVariants } from '../../src/lib/hero-image.ts';

const PUBLIC = fileURLToPath(new URL('../../public/', import.meta.url));

// AVIF CRF 28 and WebP quality 80 keep 13px interface text as sharp as the JPEG at under half its size.
const CODEC = {
  avif: ['-c:v', 'libaom-av1', '-still-picture', '1', '-crf', '28', '-cpu-used', '4', '-pix_fmt', 'yuv420p'],
  webp: ['-c:v', 'libwebp', '-quality', '80', '-compression_level', '6'],
};

/** ffmpeg arguments that write one variant from the 2x screenshot. */
export function ffmpegArgs(variant, source, out) {
  return ['-v', 'error', '-y', '-i', source, '-vf', `scale=${variant.width}:${variant.height}:flags=lanczos`, ...CODEC[variant.format], out];
}

export function writeVariants({ dir = PUBLIC, ffmpeg = process.env.FFMPEG_BIN || 'ffmpeg' } = {}) {
  const source = join(dir, 'product-inbox@2x.jpg');
  for (const variant of heroVariants()) {
    const result = spawnSync(ffmpeg, ffmpegArgs(variant, source, join(dir, variant.file)), { stdio: 'inherit' });
    if (result.status !== 0) throw new Error(`ffmpeg failed on ${variant.file} (exit ${result.status ?? result.error?.message})`);
  }
  return heroVariants().map((v) => v.file);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`Wrote public/${writeVariants().join(', public/')}`);
}
