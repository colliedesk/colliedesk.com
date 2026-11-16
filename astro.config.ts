import { defineConfig } from 'astro/config';
import { cloudflareHeaders } from './src/integrations/cloudflare-headers';
import { noBundledClientJs } from './src/integrations/no-bundled-client-js';
import { pagefindIndex } from './src/integrations/pagefind-index';

// Static output with the URL shapes Cloudflare Pages and GitHub Pages serve:
// /pricing -> pricing.html, /docs/install -> docs/install.html, no trailing slashes.
// React components render to static HTML through react-dom/server (src/lib/render-react.ts);
// there is no React renderer integration, and no-bundled-client-js.ts fails the build if any
// client JavaScript gets bundled. pagefind-index.ts writes the docs search index after the build.
export default defineConfig({
  site: 'https://colliedesk.com',
  outDir: './_site',
  trailingSlash: 'never',
  build: { format: 'file' },
  devToolbar: { enabled: false },
  integrations: [noBundledClientJs(), cloudflareHeaders(), pagefindIndex()],
});
