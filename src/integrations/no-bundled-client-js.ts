// Fails the build when any JavaScript other than public/theme.js, public/updates.js, public/analytics.js, public/consent.js and public/price-check.js (on /price-check only) would ship:
// a bundle in _astro/ (a client:* directive, a processed <script>) or a script Astro inlined into a
// page. JSON-LD blocks are data, not code, and stay allowed.
import { readFile, readdir } from 'node:fs/promises';
import type { AstroIntegration } from 'astro';

const ALLOWED_SCRIPT = /^\s+(src="\/(theme|updates|analytics|consent|price-check)\.js"( defer)?|type="application\/ld\+json")\s*$/;

async function filesIn(dir: URL): Promise<string[]> {
  try {
    return (await readdir(dir, { recursive: true })).map(String);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
}

export const noBundledClientJs = (): AstroIntegration => ({
  name: 'no-bundled-client-js',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const problems = (await filesIn(new URL('_astro/', dir))).filter((f) => /\.m?js$/.test(f)).map((f) => `_astro/${f}`);
      for (const page of (await filesIn(dir)).filter((f) => f.endsWith('.html'))) {
        const html = await readFile(new URL(page, dir), 'utf8');
        for (const [, attrs = ''] of html.matchAll(/<script\b([^>]*)>/g)) {
          if (!ALLOWED_SCRIPT.test(attrs)) problems.push(`${page}: <script${attrs}>`);
        }
      }
      if (problems.length) {
        throw new Error(
          `client JavaScript would ship (${problems.join(', ')}). React renders at build time only: ` +
            'remove the client:* directive, or load a vanilla script from public/ with <script is:inline>.',
        );
      }
    },
  },
});
