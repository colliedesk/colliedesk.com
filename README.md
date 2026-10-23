# colliedesk.com

Static marketing and docs site, built with [Astro](https://astro.build), React and TypeScript.
React renders at build time only: the browser gets HTML, CSS and two small vanilla scripts
(`public/theme.js`, `public/updates.js`) plus PostHog web analytics (`public/analytics.js`:
cookieless until the visitor accepts cookies in the banner of `public/consent.js`, then cookie
and masked session replay; JavaScript errors always; no person profiles, IP discarded; `pnpm check` fails if that changes), no framework runtime.

```sh
git clone --depth 1 https://github.com/colliedesk/colliedesk product   # docs source, gitignored
corepack pnpm install
corepack pnpm dev         # astro dev on http://localhost:4321, reloads on save
corepack pnpm build       # astro build, writes _site/
corepack pnpm typecheck   # astro check: TypeScript (strictest) for .ts, .tsx and .astro
corepack pnpm check       # links, .md twins, llms.txt, sitemap, JSON-LD, JS budget (100 KB)
corepack pnpm serve       # serves _site/ on http://localhost:4321 with Cloudflare Pages URL rules
```

`dev`, `build` and `typecheck` read the docs from `./product`; set `PRODUCT_DIR=/path/to/checkout`
to use another checkout. `typecheck` works without it.

## Layout

- `src/data/pages/*.ts`: one typed `Page` (`src/lib/page.ts`) per page: title, description, hero,
  Markdown body, FAQ, JSON-LD. `src/data/pages/index.ts` lists them in llms.txt and sitemap order.
- `src/components/*.tsx`: React components for the header, footer parts, hero, pricing plans and the
  home page sections. `.astro` files render them to static HTML with `html(Component, props)` from
  `src/lib/render-react.ts` (`react-dom/server`), inside `<Fragment set:html={...} />`; there is no
  React integration. Markdown (bodies, FAQ answers) is rendered with `marked` in
  `src/lib/markdown.ts` and placed by the Astro components (`Prose.astro`, `Faq.astro`). The
  release-notes form is plain HTML in `UpdatesForm.astro`, posted by `public/updates.js`.
- `src/layouts/Base.astro`: the HTML document (head, canonical, Markdown alternate, JSON-LD, fonts).
- `src/pages/`: Astro routes. `[...slug].astro` builds every HTML page; `[...slug].md.ts` builds its
  Markdown twin (`/pricing` and `/pricing.md`); `llms.txt`, `llms-full.txt`, `sitemap.xml`,
  `robots.txt` and `changelog.xml` are static endpoints; `404.astro` is the not-found page.
  `_headers` is written after the build by `src/integrations/cloudflare-headers.ts`.
- `public/`: files served as they are (fonts, icons, images, CSS, the two scripts).
- `src/integrations/no-bundled-client-js.ts` fails the build if any script other than
  `theme.js`, `updates.js`, `analytics.js` and JSON-LD would ship (a bundled or inlined `<script>`). A `client:*`
  directive on a React component fails earlier: without a React renderer Astro cannot hydrate it.

## Content

- `/docs` and `/roadmap` render `docs/user/*.md` and `ROADMAP.md` from [colliedesk/colliedesk](https://github.com/colliedesk/colliedesk). Edit those files there, not here. Every 15 minutes CI compares those docs on `main` with `/product-docs-version.txt` on the live site (`scripts/product-docs-version.sh`) and rebuilds when they differ. To preview unmerged docs, run the Site workflow with `product_ref` set to a branch of colliedesk/colliedesk: it builds, checks and uploads the site as an artifact without deploying. Pull requests there that touch the docs build this site too, so a broken link fails before merge.
- SEO: an agent researches, writes and audits pages as described in [docs/seo](docs/seo/README.md); `pnpm check:content` checks the copy and a person approves every SEO page (required check `content-approval`).
- Shared facts (prices, positioning, repo URL) are in `src/lib/site.ts`. Competitor prices carry their source and read date on each `/vs` page.
- Colliedesk as a whole is alpha. Mark a feature `**Shipped**` or `**Not built yet**` in Markdown; the build turns
  it into a badge. Never call anything beta: `pnpm check:content` fails on the word until HC Labs announces beta.
- Deploy: GitHub Pages from `.github/workflows/site.yml`, custom domain `colliedesk.com`, output directory `_site` (`_headers` keeps the Cloudflare Pages rules for `pnpm serve`).
- Refactors that should not change the output: build `main` and the branch into two directories and
  run `node scripts/compare-site.mjs <main-build> <branch-build>`. Non-HTML files must be
  byte-identical; HTML is compared after the normalisation described at the top of the script.

## Design

References: t3.codes (honest "what are you selling me", fork-it, terminal snippets), plausible.io
("X alternative" positioning, transparent pricing, vs pages), cal.com (pricing answered in the FAQ,
footer comparison links).

Brand: **ink and paper**, shared with the app; the brand guideline is in the app repo,
`docs/internals/design.md` (owner decision 19/10/2026; research on https://design.hclabs.co, owner only).
`public/tokens.css` is a copy of the app's `web/src/styles/tokens.css` (change it there first; the app
repo checks contrast for every pair and fails when a grey, a text token or the primary action has a hue).

- Colour: neutral grey surfaces (`--surface-0` `#fafafa`, cards `#ffffff`), ink text and ink buttons and
  links (`#171717`; dark theme `#0a0a0a` page, `#fafafa` ink). The price has its own colour (`--price`,
  `#c2410c`, dark `#fb8a4a`); status colours appear only inside product pictures. `pnpm check` fails
  when `styles.css` uses the accent token more than its budget.
- Layout (from a full-page teardown of nine helpdesk sites): one page background, no tinted bands; one
  idea per section with a crop of the real product on a soft panel (`--panel`); three checkable facts
  under the hero; a dark closing band. Text sits in plain columns under a hairline; code and tables sit
  on a 1px shadow ring (`--ring`).
- Type: self-hosted IBM Plex Sans and Mono; IBM Plex Serif 500 for h1 and h2. Sentence case everywhere,
  mono only for code.
- Product pictures: `public/product-inbox.jpg` (and `@2x`) is a screenshot of the app with demo data
  (Northwind Help). Retake it when the app's look changes (see below); `src/components/home/ProductCrop.tsx`
  holds the crop regions.
- Light is the default; the footer **Dark theme** button sets `data-theme="dark"` and saves it in
  `localStorage` for this site only (`public/theme.js`). Spacing is a 4 px grid (`--space-*`); buttons
  are at least 44 px tall on touch (`--touch`).

## Retaking the product screenshot

One command, with Docker and Google Chrome on the machine:

```sh
corepack pnpm shot:product            # fresh stack, seed, capture public/product-inbox.jpg and @2x
corepack pnpm shot:product --link     # a new sign-in link for the running stack
corepack pnpm shot:product --down     # remove the stack and its volumes
```

`scripts/product-shot/run.mjs` starts `scripts/product-shot/compose.yaml` (project `colliedesk-shot`:
the app image, Postgres and a Mailpit sink; only the app is published, on `127.0.0.1:55480`). It deletes
the previous stack and its volumes first, so every run starts from an empty database. The database
password is generated for each run. Nothing talks to production, staging or real mail.

What it seeds, through the product's own paths:

- `collie create-workspace`: workspace "Northwind Help", admin `tom.okoye@northwind.support`. Through the
  API as Tom: the display name "Tom Okoye", the email channel, and the tags billing, booking, export,
  sso and timezone.
- Five customer emails through the email inbound endpoint, each with a trusted SPF/DKIM pass. Ana
  Ribeiro's email has the attachment `booking-widget.png`.
- An admin agent token labelled "Claude Code" (`collie token create`). Over MCP, the agent sets the
  workspace timezone and each conversation's priority, tags and assignee. It adds the private note and
  drafts the reply. Tom approves the draft through the API, and the reply is sent to Mailpit.
- The database is written directly once, to move the timestamps to this morning. The product has no
  API to backdate messages. The script picks the workspace timezone in which it is just after 09:45, so
  the times (07:02 to 09:12) are today and in the past (`scripts/product-shot/scene.mjs`).

Then headless Chrome captures `/conversations/<booking>` at 1440 × 900, at 1x and 2x, as JPEG quality 80.
The stack keeps running; the command prints the URL and a one-time sign-in link (15 minutes) to keep
working in the same data. Re-running resets the data and captures again.

- `COLLIEDESK_IMAGE` picks the app image (default `ghcr.io/colliedesk/colliedesk:edge`; pin a
  `sha-…@sha256:…` image to match production).
- `SHOT_PORT` changes the port; `CHROME_BIN` changes the browser.

After a retake, look at the image and check the crop regions in `ProductCrop.tsx` and the hero `alt`
text in `src/components/home/Home.astro`.
