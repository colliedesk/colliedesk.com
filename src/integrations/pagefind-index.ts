// Writes the docs search index to _site/pagefind/ after the build (Pagefind, static, no server). Only
// docs pages are read, and on them only what carries data-pagefind-body: the lede and the guide text,
// not the menus, "On this page" or the feedback question. Results point at headings by their ids.
// Pagefind also writes ready-made search UIs and a web worker; public/docs-search.js uses neither, so
// they are deleted rather than shipped and counted against the JavaScript budget.
import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { close, createIndex } from 'pagefind';

const UNUSED = /^pagefind-(ui|component-ui|modular-ui|highlight|worker)\.(js|css)$/;

export const pagefindIndex = (): AstroIntegration => ({
  name: 'pagefind-index',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const site = fileURLToPath(dir);
      const out = join(site, 'pagefind');
      try {
        const { index, errors } = await createIndex({ forceLanguage: 'en' });
        if (!index) throw new Error(errors.join('; '));
        const added = await index.addDirectory({ path: site, glob: '{docs.html,docs/**/*.html}' });
        if (added.errors.length || !added.page_count) throw new Error(`indexed ${added.page_count} pages: ${added.errors.join('; ')}`);
        const written = await index.writeFiles({ outputPath: out });
        if (written.errors.length) throw new Error(written.errors.join('; '));
        for (const file of await readdir(out)) if (UNUSED.test(file)) await rm(join(out, file));
        logger.info(`indexed ${added.page_count} docs pages for search`);
      } catch (err) {
        throw new Error(`docs search index: ${String(err instanceof Error ? err.message : err)}`);
      } finally {
        await close();
      }
    },
  },
});
