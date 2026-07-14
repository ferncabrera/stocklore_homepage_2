# Stocklore Homepage

The marketing site for [stocklore.app](https://stocklore.app) — the entry point to the
Stocklore portal (`portal.stocklore.app`). Static-first Astro 5 on Netlify, on a **standalone
pastel/cream palette** (the periwinkle brand family lifted into summate.io-style pastels —
deliberately divergent from the app's tokens), Rubik + Bricolage Grotesque, **light-only**.
Pastel fills always pair with WCAG-AA-verified ink tokens (see `src/styles/global.css`).

> Design & content decisions, SEO strategy, and the validation gates are documented in
> [`docs/REDESIGN_PLAN.md`](./docs/REDESIGN_PLAN.md).

## Stack

- **Astro 5** — static output; every marketing page is prerendered HTML. The one server
  route (`src/pages/api/email.ts`, email capture → Google Sheets) opts out via
  `prerender = false` and deploys as a Netlify function through `@astrojs/netlify`.
- **Tailwind CSS 4** (`@tailwindcss/vite`) — tokens live in `src/styles/global.css` as CSS
  custom properties (mirrored 1:1 from the app), bridged into utilities via `@theme inline`.
- **Fonts** — `@fontsource-variable/rubik` (body) + `@fontsource-variable/bricolage-grotesque`
  (headings), matching the app.

## Commands

| Command                | Action                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `npm install`          | Install dependencies                                                                      |
| `npm run dev`          | Dev server at `localhost:4321`                                                            |
| `npm run build`        | Production build to `dist/`                                                               |
| `npm run check:site`   | **The merge gate** — device-matrix overflow + axe-core a11y checks against a served build |
| `npm run format:write` | Prettier                                                                                  |

### Running the validation gate

```bash
npm run build
(cd dist && python3 -m http.server 8788 &)   # any static server works
CHROMIUM_PATH=/path/to/chromium npm run check:site   # omit CHROMIUM_PATH to use Playwright's own browser
```

The gate (`scripts/site-check.mjs`) walks every page × light/dark × a 13-device matrix
(iPhone SE → Pro Max, Pixel, Galaxy, tablets, a 320 px reflow floor, landscape) asserting
**zero horizontal overflow**, and runs **axe-core** on a desktop + phone subset asserting
**zero serious/critical violations**. Set `SCREENSHOT_DIR=…` to also capture review
screenshots.

## Content model

| File                   | Drives                                                                                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/data/site.ts`     | Site-wide constants (portal URL, support email, default meta)                                                                                                                                                      |
| `src/data/roadmap.ts`  | The **building-in-the-open** roadmap — landing teaser + `/roadmap`. Shipping a feature = add/flip one entry and push; statuses are `shipped` / `in-progress` / `planned` / `vision` and render with honest badges. |
| `src/data/features.ts` | `/features` page — every item badged `live` / `in-progress` / `planned`                                                                                                                                            |
| `src/data/faq.ts`      | FAQ accordions + `FAQPage` JSON-LD                                                                                                                                                                                 |

**Honesty rule:** `shipped`/`live` means in production today. Everything else keeps its badge —
never present unshipped features (including AI) as live.

## SEO

- URLs are preserved from the previous site; `/blog` 301s to `/roadmap` (`netlify.toml`).
- Per-page titles/descriptions/canonical + OG/Twitter cards via
  `src/components/seo/BaseHead.astro`; JSON-LD (Organization, WebSite, SoftwareApplication,
  FAQPage); `@astrojs/sitemap` + `public/robots.txt`.
- After deploying structural changes: resubmit the sitemap in Search Console and watch
  coverage for 2–4 weeks (rollback = Netlify restore previous deploy).

## Deploying

`netlify.toml` carries the build command, publish dir, **Node version pin (22)**, the `/blog`
redirect, and cache/security headers — it overrides Netlify UI settings. Before the first deploy
of a new site, set the `GOOGLE_SERVICE_ACCOUNT_JSON` env var (email capture) and smoke-test
`POST /api/email`.

The build command is `npm install … && npm run build` (not a bare `astro build`): the extra
`npm install` reconciles Tailwind 4's platform-specific native binary (`@tailwindcss/oxide-*`)
that `npm ci` can silently skip on CI (npm/cli#4828) — the cause of a "Cannot find native
binding" failure on Netlify's old Node 18 default. `.nvmrc` pins Node 22 as well.
