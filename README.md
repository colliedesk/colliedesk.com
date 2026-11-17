# colliedesk.com

Static marketing and docs site, built with [Astro](https://astro.build), React and TypeScript.
React renders at build time only: the browser gets HTML, CSS and small vanilla scripts
(`public/theme.js`, `public/updates.js`, `public/audit.js` on /audit only, `public/attribution.js` that carries an ad link's `utm_*`, `ttclid` and `fbclid` to the app's sign-up links; on Docs pages `public/docs-copy.js`, the "Copy for AI" button that
copies the page's Markdown twin and "Copy MCP URL", `public/docs-search.js`, search with Cmd/Ctrl+K, and `public/docs-feedback.js`, the
"Was this page helpful?" question that sends the PostHog event `docs_feedback`) plus PostHog web analytics (`public/analytics.js`:
cookieless until the visitor accepts cookies in the banner of `public/consent.js`, then cookie
and masked session replay; JavaScript errors always; no person profiles, IP discarded; `pnpm check` fails if that changes), no framework runtime.

```sh
git clone --filter=blob:none https://github.com/colliedesk/colliedesk product   # docs source, gitignored
corepack pnpm install
corepack pnpm dev         # astro dev on http://localhost:4321, reloads on save
corepack pnpm build       # astro build, writes _site/
corepack pnpm typecheck   # astro check: TypeScript (strictest) for .ts, .tsx and .astro
corepack pnpm check       # links, .md twins, llms.txt, sitemap, JSON-LD, JS budget (100 KB)
corepack pnpm serve       # serves _site/ on http://localhost:4321 with Cloudflare Pages URL rules
```

`dev`, `build` and `typecheck` read the docs from `./product`; set `PRODUCT_DIR=/path/to/checkout`
to use another checkout. `typecheck` works without it. Each docs page shows "Updated <date>", the last commit
that changed its own file (`src/lib/git-dates.mjs`), so the checkout needs its history: a `--depth 1` clone
builds, with no dates. `pnpm build` also writes the docs search index (`_site/pagefind/`, Pagefind, docs pages
only; `src/integrations/pagefind-index.ts`).

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
- `public/`: files served as they are (fonts, icons, images, CSS, the scripts).
- `src/integrations/no-bundled-client-js.ts` fails the build if any script other than
  `theme.js`, `updates.js`, `audit.js`, `analytics.js`, `consent.js`, `attribution.js`, `docs-copy.js`, `docs-search.js`, `docs-feedback.js` and JSON-LD would ship (a bundled or inlined `<script>`). A `client:*`
  directive on a React component fails earlier: without a React renderer Astro cannot hydrate it.

## Content

- Docs pages (`public/docs.css`): at 960px and under the sidebar folds into one "Docs menu" control above the
  title; a breadcrumb, "On this page" for guides with three or more `##` sections, previous/next inside the
  guide's `## Heading` group, and the "Use with AI" menu (Open in Claude, Open in ChatGPT, Copy MCP URL). Every
  docs `.md` twin and `/llms.txt` start with the same agent instructions (`src/lib/agent-instructions.ts`); each
  docs group also has `/llms/<group>/llms.txt` and `/llms/<group>/llms-full.txt` (no page may live under `/llms/`).
- `/docs` and `/roadmap` render `docs/user/*.md` and `ROADMAP.md` from [colliedesk/colliedesk](https://github.com/colliedesk/colliedesk). Edit those files there, not here. Every 15 minutes CI compares those docs on `main` with `/product-docs-version.txt` on the live site (`scripts/product-docs-version.sh`) and rebuilds when they differ. GitHub runs scheduled workflows late and sometimes skips them, so a docs change can take hours to appear; to publish one at once, run `gh workflow run Site -R colliedesk/colliedesk.com` (no `product_ref`), which builds from `main` and deploys. Any merge to this repo's `main` also rebuilds the docs from the app's `main`. To preview unmerged docs, run the Site workflow with `product_ref` set to a branch of colliedesk/colliedesk: it builds, checks and uploads the site as an artifact without deploying. Pull requests there that touch the docs build this site too, so a broken link fails before merge.
- `/audit` is the lead page for ads: a free help center audit. `AuditForm.tsx` (hero aside) is posted by `public/audit.js` as JSON to `UPDATES_FORM_URL` with `source: 'site:audit'`, so each request lands as a conversation in our own workspace. Only after a 202 it calls `fbq('track', 'Lead')` and `posthog.capture('audit_requested')`, when `public/consent.js` has loaded them (`scripts/audit-form.test.mjs`).
- SEO: an agent researches, writes and audits pages as described in [docs/seo](docs/seo/README.md); `pnpm check:content` checks the copy and a person approves every SEO page (required check `content-approval`).
- Shared facts (prices, positioning, repo URL) are in `src/lib/site.ts`. Competitor prices carry their source and read date on each `/vs` page.
- While Founding is open it leads, and Team 25 is on sale beside it, on /pricing and the home page, for teams of 11 to 25
  agents (`TEAM_25_*` in `src/lib/site.ts`). Business (26 to 100 agents, $499 a month) is sold through a call with the founder in
  both states, never a checkout, with the switch and invoice offers for Team 25 and Business (`SWITCH_*` in `src/lib/site.ts`);
  `/migrate/freshdesk/switch` is the page ads and emails link to, and `scripts/switch-offer-gate.mjs` holds its rules. Solo, Small and Team stay hidden until Founding closes;
  `scripts/pricing-gate.mjs` enforces this, and fails any page that says Cloud sells one plan, when `pnpm check` runs it. A page that states a Cloud price leads with Founding and gives
  the monthly plans as the prices after the 10 places, through `src/lib/cloud-price.ts` (`FOUNDING_LEAD`,
  `foundingFirst`, `OUR_PLAN`/`OUR_PRICE`, the hero action `FOUNDING_ACTION`). `pnpm check:content` fails a page,
  Markdown twin or llms file that names a monthly plan price before Founding. Build and check with
  `FOUNDING_STATE_FILE=<file>` to see the closed state.
- AI prices are in `src/lib/site.ts` too (`AI_RESOLUTION`, `AI_EXTRA`, `PRICE.ai`). `pnpm check:content` fails on the retired "model cost +30%" wording anywhere on the site, llms.txt and JSON-LD included.
- Colliedesk is generally available (release 1.0.0); what that promises is in the app repo's
  [docs/general-availability.md](https://github.com/colliedesk/colliedesk/blob/main/docs/general-availability.md)
  (`GA_DOC` in `src/lib/site.ts`). Mark a feature `**Shipped**` or `**Not built yet**` in Markdown; the build turns
  it into a badge. Never call the product, a release or a feature alpha or beta: `pnpm check:content` fails on either
  word. The changelog is history, so its dated entries may still name the alpha releases.
- Uptime: measured on https://status.colliedesk.com, linked from the footer and /pricing (`STATUS_PAGE`, `STATUS_LINE` in
  `src/lib/site.ts`). No uptime number appears on the site until the terms publish the commitment; `pnpm check` refuses "99.9%".
  `pnpm check` fails if the footer or /pricing stops linking the status page, or /pricing or /vs/freshdesk stops
  carrying the uptime line with its link to the terms.
- Deploy: GitHub Pages from `.github/workflows/site.yml`, custom domain `colliedesk.com`, output directory `_site` (`_headers` keeps the Cloudflare Pages rules for `pnpm serve`).
- Refactors that should not change the output: build `main` and the branch into two directories and
  run `node scripts/compare-site.mjs <main-build> <branch-build>`. Non-HTML files must be
  byte-identical; HTML is compared after the normalisation described at the top of the script.

## Design

References: t3.codes (honest "what are you selling me", fork-it, terminal snippets), plausible.io
("X alternative" positioning, transparent pricing, vs pages), cal.com (pricing answered in the FAQ,
footer comparison links).

Brand: **paper, ink and the Collie orange**, shared with the app; the brand guideline is in the app repo,
`docs/internals/design.md` (ink and paper: owner decision 19/10/2026; the orange as the primary action:
15/11/2026; research on https://design.hclabs.co, owner only).
`public/tokens.css` is a copy of the app's `web/src/styles/tokens.css` (change it there first; the app
repo checks contrast for every pair and fails when a grey or a text token has a hue, or when the primary
action is not the orange).

- Colour: neutral grey surfaces (`--surface-0` `#fafafa`, cards `#ffffff`), ink text and links
  (`#171717`; dark theme `#0a0a0a` page, `#fafafa` ink). The primary button is the Collie orange (`--accent`,
  `#c2410c`, dark `#fb8a4a`) with `--on-accent` text; the price has the same orange through its own token
  (`--price`), and the logo tile (`--logo-tile`) is the same orange in both themes; status colours appear only inside product pictures. `pnpm check` fails
  when `styles.css` uses the accent token more than its budget.
- Layout (from a full-page teardown of nine helpdesk sites): one page background, no tinted bands; one
  idea per section with a crop of the real product on a soft panel (`--panel`); three checkable facts
  under the hero. Text sits in plain columns under a hairline; code and tables sit on a 1px shadow ring
  (`--ring`). The home page follows the Paper design "L1-b Landing" (page 50 Landing of the app design
  file): one 1200px sheet, rows split by hairlines, product pictures on grey stage rows, headlines in Plex
  Sans 600 with no label above them (a small sans label only where it adds a fact the headline lacks), the bill by team size as CSS-only radios (`src/lib/team-bill.ts`).
- Scrollbars are styled site-wide (thin, palette grey: `--line-control`, `--line-strong` on hover); never the OS
  default. `pnpm check` fails if `scrollbar-width`/`scrollbar-color` appear outside the Firefox `@supports` block.
- Type: self-hosted IBM Plex Sans and Mono; IBM Plex Serif 500 for h1 and h2. Sentence case everywhere,
  mono only for code.
- Product pictures: `public/product-inbox.jpg` (and `@2x`) is a picture of the inbox with demo data
  (Northwind Help). Until the app ships the screens it shows, it is exported at 2x from the app design (Paper,
  page 15 Inbox, "I8-a"; owner decision 06/11/2026), and so are the phone picture
  `public/product-inbox-mobile@2x.jpg` (three crops of "M-I2", 700 × 1036) and the six `public/daily-*.webp`
  crops of the "Every day" section. The hero serves both pictures as AVIF and WebP by width
  (`product-inbox-<width>.avif|webp`, `product-inbox-mobile-<width>.avif|webp`, `src/lib/hero-image.ts`), scaled by
  `node scripts/product-shot/variants.mjs` (ffmpeg); `pnpm check` fails if a size the hero names is missing. Retake the
  screenshot with `pnpm shot:product` once those screens ship (see below).
- Light is the default; the footer **Dark theme** button sets `data-theme="dark"` and saves it in
  `localStorage` for this site only (`public/theme.js`). Spacing is a 4 px grid (`--space-*`).
- Sizes follow PostHog (owner decision 16/11/2026, measured on posthog.com that day); this replaces the old
  "at least 44 px on touch" rule for buttons. Buttons are keys: a face 4 px above a darker base it casts
  with two box-shadows, 6 px on hover, 2 px while pressed (a 100 ms transition on the press only, none with
  reduced motion). `.btn` is 15/26 px bold, padding 8/20, radius 8; `.btn-sm` (header, docs controls,
  cookie sheet) 13/20, padding 4/10, radius 6, depths 2/3/1; `.btn-lg` 18/28. Borders are 1.5 px; the
  colours are custom properties (`--key-*`) in `styles.css`: secondary a white face on a grey base, primary
  the orange face (`--accent`) on a darker orange base (`--accent-hover`; in the dark theme `--logo-tile`).
- Tactile site (owner decision 17/11/2026, after PostHog's mechanism, not its look): an element answers the
  pointer in one of three ways, and everything else is paper (flat, hairlines and rings, no motion, no base).
  - **Key**: an action or a choice (start, buy, copy, send, pick an option, switch the theme, go to the
    previous or next guide): buttons, "Copy page", the bill and /vs team-size options, the theme toggle,
    the docs pager tiles, the feedback Yes/No and the header's phone "Menu". A face on a solid base: it
    lifts on hover and sinks on press. A base means "you can press this"; never on a static card, a badge
    or a picture. Keys keep their 1.5 px rim; static cards keep their ring. When everything is raised
    nothing stands out: `pnpm check:render` allows at most 4 raised elements in the first 390 x 844 screen
    of a guide.
  - **Held key**: a key whose state is on (a menu open, an option chosen, the dark theme on) stays at the
    press depth on a grey face (`--surface-3`) with a darker rim (`--line-strong`); hover does not lift it.
    This replaces fills, outlines and orange for "selected". A disabled key is sunk with no base.
  - **Row**: a repeated item in a list or menu (nav links, the docs sidebar and "On this page" column, menu
    rows, search results), and a disclosure that only opens more of the page ("Docs menu", "On this page"
    on a phone or tablet, in a quiet box: 1 px `--line` on `--surface-1`): a grey fill on hover,
    `--surface-3` when current or open, 1 px down while pressed.
  - **Inline link**: ink, underlined; the underline darkens on hover; it never moves.
  - **Fields are slots**, the opposite of keys: 45 px (the key face beside them), a 1 px `--line-control`
    line and a 2 px `--surface-2` lip inside the top edge; the line darkens on hover. The docs sidebar's
    search opener is a slot too (a button that opens the dialog); on a phone it is an icon in the same
    quiet box as "Docs menu". Focus everywhere is
    the 2 px amber outline (`--focus`) with a 2 px gap (3 px on primary keys and pager tiles).
  - Depth is solid offsets; blur only on floating layers (menus, the search dialog, the featured plan, the
    hero proof card). The press is the only animation (`--press`, 100 ms; none with reduced motion).
  - The orange appears only on the primary key face (one per view), the price (`--price`), the logo tile
    and the docs sidebar's current-page mark. It is never focus, a note bar, a selected state or a
    highlight; a docs note is a neutral sheet. The accent budget in `scripts/check.mjs` holds this count.
  - Touch: options keep 44 px faces on a coarse pointer and rows keep their touch heights; other keys keep
    the key sizes. `pnpm check:render` measures the keys, held keys, rows, fields and the note
    (`scripts/render-sizes.mjs`, `scripts/render-states.mjs`).
- Type sizes: marketing pages (home, pricing, compare, migrate) use hero h1 60/60 (30/31.5 on phones, 44/46
  in between), section h2 28/35 (36/42 on the home sheet from 961 px, where 28 px sat too close to the 16 px card titles), h3 16/24, body 16/24, small text 14/20. Docs and other prose pages
  (`body.page-prose`: no CTA, plans or price chart) use h1 36/45, h2 21.4/30, h3 20/28, h4 18/28,
  body 15/22.5, code 13. `pnpm check:render` measures buttons, their states and these sizes in Chrome.

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
It then writes the AVIF and WebP sizes of the hero from the 2x capture (`scripts/product-shot/variants.mjs`).
The stack keeps running; the command prints the URL and a one-time sign-in link (15 minutes) to keep
working in the same data. Re-running resets the data and captures again.

- `COLLIEDESK_IMAGE` picks the app image (default `ghcr.io/colliedesk/colliedesk:edge`; pin a
  `sha-…@sha256:…` image to match production).
- `SHOT_PORT` changes the port; `CHROME_BIN` changes the browser.

After a retake, look at the image and check the hero `alt` text and caption in `src/components/home/Home.astro`.
