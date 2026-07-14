# Stocklore Homepage Redesign — Implementation Plan

> **Status:** Proposal for approval (2026-07-14). No production code in this commit — per the
> "plan before coding" rule, implementation starts on sign-off, on this branch
> (`claude/stocklore-homepage-redesign-had54j`).
>
> **Sources of truth used:** this repo (verified against the live `https://stocklore.app` —
> content matches); `open_ims` → `docs/roadmap/MASTER_PLAN.md`, `docs/competitive-research/*`
> (27-competitor study, inFlow head-to-head, "what to ship next" ranking), the app's design
> tokens (`microservices/ims/client/src/styles/index.css`), and the agentic-platform plan
> (`claude/agentic-platform-plan-rffe80` → `docs/roadmap/agentic/01-agentic-plan.md`).
> Design references: `inflowinventory.com` (hero/progressive-disclosure), `orm.drizzle.team`
> (building-in-the-open timeline) — both re-crawled 2026-07-14.

---

## 0. Executive summary

Rebuild the marketing site as a **static-first Astro 5 site** on the **app's own warm-paper
design language** (light + dark, Rubik/Bricolage Grotesque, `#6268FF` primary), with an
inFlow-style landing page (big simple hero → one CTA to `portal.stocklore.app` → tabbed product
tour → manufacturing-wedge spotlight → why-us → Drizzle-style "building in the open" → FAQ →
CTA), plus new `/features`, `/roadmap`, and `/about` pages and refreshed `/contact` + `/email`.
Every existing URL keeps working (one 301: `/blog → /roadmap`, flagged below). All feature
claims are sourced from the competitive research and marked **live** vs **in progress** vs
**planned** — the AI/agentic story ships as clearly-labeled vision inside the
building-in-the-open narrative, never as a live feature.

**SEO reality check (verified 2026-07-14):** the live site ships **no sitemap** (404), no meta
description, a bare `<title>Stocklore</title>`, and does not rank for category terms in US
results — and the brand SERP is contested by **stocklore.ai** (an unrelated stock-trading app).
So the redesign's SEO posture is: *preserve every indexed URL and content theme* (zero-loss),
while finally adding the fundamentals the site never had (titles, descriptions, sitemap,
structured data, canonical) — which is nearly pure upside. Caveat: search checks ran US-only;
a Search Console export would confirm Canadian-query equity (open question Q1).

---

## 1. Decisions (per the brief) — resolved

| # | Decision | Choice | Needs user sign-off? |
| --- | --- | --- | --- |
| D1 | Theme | **Warm light + dark, theme-aware, matching the app's tokens.** Light is the default (marketing convention, and the inFlow look the user cited); auto-follows `prefers-color-scheme`, manual toggle persisted in `localStorage` (FOUC-guarded inline script). Today's dark site effectively becomes the dark variant. | No — recommended in brief; proceeding |
| D2 | Scope | **Landing + core pages:** rebuild `/`; new `/features`, `/roadmap`, `/about`; refresh `/contact`, `/email`; new shell (nav/footer), `404`. Full-site extras (Solutions-by-industry, Resources) deferred. | No — recommended in brief; proceeding |
| D3 | Roadmap data | **Curated, typed data file in this repo** (`src/data/roadmap.ts`), derived from the master-plan + agentic-plan phases, rendered at build time. No GitHub-issue ingestion in v1 (the 42 open issues are internal/bug-flavored; curation controls messaging and leaks nothing). Refresh = edit file → push → Netlify auto-build. §7. | No — recommended in brief; proceeding |
| D4 | Claims & pricing | **Honest split:** advertise only what's live; planned items carry a visible `Planned`/`In progress` badge and feed the roadmap story. Keep **free-open-beta** messaging. Add a small landing **pricing section** (not a page): "Free while in open beta — transparent, Canadian-friendly pricing when we launch. Early users keep preferential rates." | **Yes — Q3:** confirm the early-adopter-pricing sentence (or drop it) |
| D5 | AI prominence | **Not the hero** (nothing is shipped — honesty constraint). A dedicated **"Where this is going"** vision panel inside the building-in-the-open section (landing) + a full **AI/agent lane** on `/roadmap`: mock chat exchange of the Andrea's-Flowers flow, badged `In development`, with the human-in-the-loop / your-permissions / provider-agnostic principles. | No — honest-by-construction; proceeding |
| D6 | Assets | **Hand-built, token-native product mockups** (HTML/CSS "browser-frame" compositions + SVG diagrams — crisp at any DPI, theme-aware, ~zero bytes of image weight), swapped for real app screenshots whenever supplied. The 4 legacy PNGs retire. | **Yes — Q2:** real screenshots / brand kit if available |
| — | Blog URL | `/blog` (empty page, "no articles yet") **301 → `/roadmap`** — same intent (updates), removes a thin page, keeps any equity. Reversible in one line of `netlify.toml`. | **Yes — Q4:** confirm the 301 (else `/blog` stays, restyled) |
| — | CSS stack | **Tailwind 3 → 4** (`@tailwindcss/vite`), CSS-first `@theme` mirroring the app's token names; retire SCSS + the deprecated `@astrojs/tailwind` integration. §6.2. | No — small site, cheap migration, token parity with the app |

---

## 2. Verified current state

**Repo = live site** (crawled 2026-07-14; H1, sections, FAQ text all match). Facts that shape
the plan:

- `astro.config.mjs` → `output: "server"` + Netlify adapter: **every page render is a
  serverless function invocation** — slower TTFB, no CDN HTML, worse crawl behavior than
  static. Only `/api/email` actually needs the server (it already declares
  `export const prerender = false`).
- **No `public/` dir at all** — no robots.txt (Cloudflare serves a managed stub), no
  sitemap.xml (**live 404**), favicon served from a hashed `src/assets` SVG.
- Head: `<title>Stocklore</title>` only. No meta description, canonical, OG/Twitter, or JSON-LD
  anywhere.
- Copy debt: "free open beta" (keep, per D4), "**we do not support mobile screens**" (retire —
  see §12), "Stocklore 2025 ©" (stale), commented-out About/Docs nav links, empty `/blog`.
- Dead weight: `@google-cloud/local-auth` (never imported), `sass` (only for `$`-color vars),
  Roboto (app uses Rubik/Bricolage).
- Email capture works: `POST /api/email` → Google Sheets via `GOOGLE_SERVICE_ACCOUNT_JSON`
  env var — **keep as-is**; the env var must be configured on the new Netlify site (§13).

---

## 3. Information architecture — URLs & redirects

| URL | Status | Disposition |
| --- | --- | --- |
| `/` | live, indexed | **Rebuild** (§4.1). Same URL. |
| `/contact` | live | **Refresh** in the new shell; same URL, same content themes (support email, careers/investors) expanded with the about-page cross-link. |
| `/email` | live | **Refresh**; same URL, same form + `/api/email` endpoint. Reframed "Get product updates" (building-in-open tie-in). |
| `/blog` | live, thin/empty | **301 → `/roadmap`** (Q4). Fallback: keep + restyle as an updates feed alias. |
| `/api/email` | live (POST) | **Unchanged.** |
| `/features` | new | Product depth by area, shipped/planned badged (§4.2). |
| `/roadmap` | new | Building-in-the-open timeline + AI vision lane (§4.3). |
| `/about` | new | The `_about.astro` stub finally becomes real (§4.4). |
| `/404` | new | Branded 404 (Astro `404.astro` → Netlify picks it up automatically). |

Redirects live in `netlify.toml` (checked into this repo — note: it overrides Netlify UI
settings; coordinated at repoint time, §13). No other slug changes — zero-loss posture.

## 4. Page & section map

### 4.1 `/` — Landing (the centerpiece)

| # | Section | Pattern source | Purpose & copy direction |
| --- | --- | --- | --- |
| 1 | **Hero** | inFlow: big confident type, one primary CTA, product image right/below | H1 (candidates, Q5): **(a)** "Inventory & manufacturing software that punches above its price" · (b) "Track it. Make it. Sell it. One simple tool." · (c) "Serious inventory management for Canadian small business". Subhead carries the wedge + keywords: *"Stocklore gives Canadian small businesses real inventory control, multi-level manufacturing, invoicing, and CRA-ready tax — without enterprise pricing or a six-week implementation."* Primary CTA **"Get started — it's free"** → `https://portal.stocklore.app`; secondary ghost "See what it does" (anchor to tour). Trust line: *Free during open beta · No credit card · Canadian-owned 🇨🇦*. Visual: token-native app mockup (D6). |
| 2 | **Benefit strip** | inFlow's 3 simple cards | "Set up in an afternoon" (self-serve, demo data seeding, CSV import) · "Built for Canadian business" (CRA GST/HST/PST native, Canadian-owned) · "More than inventory" (make, buy, sell, invoice in one place). |
| 3 | **Tabbed product tour** | user's explicit tabs ask; inFlow solutions cards | 5 tabs — **Track** (ledger-backed stock, movement history, multi-location + transfers, low-stock alerts) · **Make** (BOMs, nested MOs/sub-assemblies, auto-MO from a sale) · **Buy** (POs, vendors, receiving) · **Sell** (invoices, CRA tax modes, PDF) · **Operate** (roles enforced server-side, imports/exports, multi-org, realtime notifications). Each: 1-para copy + 3 bullets + mockup + "More →" to `/features#<area>`. Progressive enhancement: ARIA tabs w/ tiny vanilla JS; no-JS renders all panels stacked. |
| 4 | **Manufacturing wedge spotlight** | our differentiation (research §4) | The one deep-dive on the landing page: *"Assemblies inside assemblies"* — nested MO-tree diagram (SVG), copy: most light tools stop at single-level kits; Stocklore builds the whole tree and consumes components bottom-up, straight from a confirmed sale. |
| 5 | **Why Stocklore / honest comparison** | research pricing signal | Three columns: *Spreadsheets* (free, breaks at scale) · **Stocklore** (the loop, one price, no implementation) · *Legacy ERP* (powerful, $$$ + consultants). Generic categories, no named-competitor claims. Includes the **pricing note** (D4/Q3) + beta framing. |
| 6 | **Building in the open** | Drizzle timeline (teaser) | Kicker: *"Small team. Big shipping cadence."* Last ~4 shipped months from `roadmap.ts` + "Now building" chips + the **AI vision card** (D5): mini mock-chat of the Andrea's-Flowers example, badge `In development`, one line of principles (drafts everything, you approve, your permissions apply). CTA → `/roadmap`. |
| 7 | **FAQ** | preserved ranking content | Native `<details>` accordions + **FAQPage JSON-LD**. Rewrites of the existing 6 Q&As (they're the richest indexed text): differentiation (now cites the real wedge), cost (free beta, D4 wording), getting started, mobile (replaced per §12), privacy (kept, softened), join/contact. |
| 8 | **Final CTA band** | inFlow | Repeat primary CTA + inline email-capture (posts to `/api/email`) as the soft conversion. |

### 4.2 `/features`

Header + per-area sections (Catalog · Inventory · Manufacturing · Purchasing · Sales & Tax ·
Platform), each a grid of feature cards with a status badge: **Live** / **In progress** /
**Planned** (data-driven from `src/data/features.ts`, §8). Anchors (`#inventory`, …) receive
the landing-tour "More →" links. Closes with CTA band.

### 4.3 `/roadmap` — Building in the open

Drizzle-style **reverse-chronological shipped timeline** grouped by month (real phase history:
Phase 3 catalog rebuild + UoM/images/custom fields — July 2026; Phase 2 multi-location +
transfers; Phases 0–1 stock ledger, adjustments, alerts, server-enforced permissions;
self-serve demo tenants; exact dates pulled from the `open_ims` phase docs at build time),
then **Now building** (sales orders — design drafted), **Up next** (quotes, partial
receiving/fulfillment, kits, valuation reports, public REST API), and **The bigger vision**
(QuickBooks/Xero, AI assistant lane with the phased rollout A–E, barcode scanning,
lot/serial). Tone: Drizzle's confident-playful, quantified where true (e.g. e2e-suite scale,
"every stock change is one auditable ledger row"). Everything renders from `roadmap.ts`.

### 4.4 `/about`

The story the differentiators imply: small Canadian team; building the most powerful tool for
Canadian product businesses at the lowest possible price; ship-fast-with-heavy-e2e-testing
culture; open-beta invitation; contact links. (Copy drafted at build; user review welcome.)

### 4.5 `/contact`, `/email`, `404`

Same content jobs as today in the new shell; `/email` copy reframed around updates/beta
access; branded 404 with nav back to `/` and `/roadmap`.

### Shell

- **Header:** logo (SLTxt) → `/`; links Features · Roadmap · About · Contact; theme toggle;
  ghost **Sign in** + primary **Get started** (both → portal). Mobile: disclosure menu
  (button + `aria-expanded`, tiny script).
- **Footer:** inFlow-style columns — Product (Features, Roadmap, FAQ anchor), Company (About,
  Contact, Email list), Get started (portal link, "seed a demo company" note) — plus the
  Canadian-made flag mark and `© 2026 Stocklore`.

## 5. Design system (mirrors the app 1:1)

Tokens are **copied from** `open_ims` `client/src/styles/index.css` into
`src/styles/global.css` as CSS custom properties consumed by a Tailwind 4 `@theme inline`
block — same names, same values, so site and app can't drift apart visually:

| Token | Light | Dark |
| --- | --- | --- |
| `--background` | `#f8f6f1` (page-grey) | `#161411` |
| `--card` / surfaces | `#fffdfa` | `#1e1b17` |
| `--foreground` | `oklch(0.235 0.012 75)` | `#d8d3c8` |
| `--primary` | `#6268ff` (fg white) | `#6268ff` (fg `#f7f8fa`) |
| `--secondary` / `--lightest` | `#b9bcff` / `#e5e6ff` | `#ccceff` / `#484d80` |
| `--muted` / `--muted-foreground` | `oklch(0.962 0.008 84)` / `oklch(0.548 0.022 72)` | `#3f3b33` / `#b5afa3` |
| `--border` | `oklch(0.913 0.011 80)` | `oklch(1 0 0 / 10%)` |
| `--shadow-soft` / `--shadow-lifted` | warm-black soft pair (values verbatim from app) | black pair (verbatim) |

- **Radius scale:** `--radius: 10px` base → sm 6 / md 8 / lg 10 / xl 12. Buttons rectangular
  8px — no pills, no `rounded-2xl+`. **Shadows:** soft neutral only — no colored glows; the
  old purple→fuchsia "shiny" gradient CTA retires (§12).
- **Type:** `@fontsource-variable/rubik` (body/UI) + `@fontsource-variable/bricolage-grotesque`
  (all headings) — exactly the app's pairing; woff2 preloaded, `font-display: swap`. Roboto
  removed. Scale: hero `clamp(2.5rem, 6vw, 4.25rem)`; section titles ~2rem; uppercase kicker
  labels above sections (the app's `DetailSection` kicker idiom).
- **Color discipline:** no hardcoded hex in components — everything via tokens (the app's own
  styling rule, applied here). Dark mode = `.dark` class on `<html>` (toggle + system).
- **Motion:** subtle only — card hover lift (`--shadow-lifted`), gentle section fade/rise on
  scroll via CSS; everything behind `prefers-reduced-motion`.
- **Imagery (D6):** token-native mockups — a reusable `BrowserFrame.astro` composing fake-but-
  faithful app UI (tables with status pills, a nested-MO tree SVG, a ledger list) from the same
  tokens; renders perfectly in both themes; ~0 image bytes. Legacy PNGs deleted. Real
  screenshots slot into the same frames when provided (Q2).

## 6. Technical approach

### 6.1 Rendering: `output: "server"` → **static (Astro 5 default) + adapter**

Delete the `output` line, keep the Netlify adapter. Astro 5 prerenders everything by default;
`/api/email` keeps `prerender = false` and continues to deploy as the lone serverless
function. Result: all marketing HTML on the CDN (TTFB/CWV/crawl win, no cold starts), email
capture unchanged. Set `site: "https://stocklore.app"` (canonical + sitemap base).

### 6.2 CSS: Tailwind 4 via `@tailwindcss/vite`

Remove `@astrojs/tailwind` (deprecated, TW3-only), `tailwind.config.mjs`, `sass`, and
`src/styles/colors.scss`; add `@tailwindcss/vite` with a single `global.css` (`@import
"tailwindcss"` + `@theme inline` tokens + the `.dark` block + base styles). Fallback if
anything fights Astro 5: stay on TW3 and declare the same CSS variables — the token names in
components are identical either way, so the plan is stack-agnostic.

### 6.3 Component inventory

**New** (`src/components/`): `layout/` Header, Footer, ThemeToggle, MobileNav ·
`seo/BaseHead.astro` (title/description/canonical/OG/Twitter/JSON-LD props + defaults) ·
`ui/` Button, Card, Badge (Live/InProgress/Planned), SectionHeading (kicker+title), Tabs,
BrowserFrame, Accordion(`<details>`) · `sections/` Hero, BenefitStrip, ProductTour,
WedgeSpotlight, WhyStocklore, BuildingInTheOpen, AiVisionCard, Faq, CtaBand, EmailCapture ·
`roadmap/` Timeline, TimelineEntry. **Kept:** `emailForm` logic (restyled), logos/SVGs,
`api/email.ts`. **Retired:** DarkCard, DropDown, Button (old), SpinnerLoader (CSS spinner
instead), MainLayout (superseded by `BaseLayout.astro`), the 4 PNGs.

**Data modules** (`src/data/`): `roadmap.ts` (§7), `features.ts` (§8), `faq.ts`,
`site.ts` (URLs, social, contact email — one place).

### 6.4 JS budget

< 10 KB total, zero frameworks: theme toggle (~15 lines, inline head guard against FOUC),
mobile nav (~10), tabs (~30, ARIA-complete), email form fetch (existing). FAQ/accordions are
native `<details>`. Timeline/mockups are pure HTML/CSS/SVG.

### 6.5 `netlify.toml` (new, in-repo)

Build (`astro build` → `dist`), the `/blog → /roadmap` 301 (Q4), long-cache headers for
`/_astro/*` (hashed assets), basic security headers (X-Content-Type-Options,
Referrer-Policy, X-Frame-Options). Flagged: this file overrides UI build settings — verify at
repoint (§13).

### 6.6 Dependencies

Add: `@tailwindcss/vite`, `tailwindcss@4`, `@astrojs/sitemap`, `@fontsource-variable/rubik`,
`@fontsource-variable/bricolage-grotesque`. Remove: `@astrojs/tailwind`, `sass`,
`@fontsource/roboto`, `@google-cloud/local-auth` (unused). Keep: `astro`, `@astrojs/netlify`,
`googleapis`, prettier toolchain.

## 7. Roadmap data pipeline (D3)

```ts
// src/data/roadmap.ts
export type RoadmapStatus = "shipped" | "in-progress" | "planned" | "vision";
export interface RoadmapItem {
  id: string;                 // stable slug, e.g. "multi-location"
  title: string;              // "Stock by location + transfers"
  blurb: string;              // one customer-language sentence
  status: RoadmapStatus;
  area: "inventory" | "manufacturing" | "catalog" | "sales" | "purchasing" | "platform" | "ai";
  date?: string;              // "2026-07" — required when shipped (groups the timeline)
}
export const ROADMAP: RoadmapItem[] = [
  { id: "catalog-rebuild", title: "Product pages rebuilt — units of measure, photos, custom fields, categories", blurb: "Model your catalog your way: sell by the metre, attach photos, add your own fields.", status: "shipped", area: "catalog", date: "2026-07" },
  { id: "multi-location", title: "Multi-location stock + transfers", blurb: "See on-hand per location and move stock between them with a two-sided transfer document.", status: "shipped", area: "inventory", date: "2026-07" },
  { id: "stock-ledger", title: "The stock ledger — every movement, recorded", blurb: "Adjustments, low-stock alerts, and a full audit history behind every quantity.", status: "shipped", area: "inventory", date: "2026-07" },
  { id: "sales-orders", title: "Sales orders (separate from invoices)", blurb: "Quote → order → fulfill → invoice, the way real operations flow.", status: "in-progress", area: "sales" },
  { id: "public-api", title: "Public REST API v1", blurb: "Your data, programmable.", status: "planned", area: "platform" },
  { id: "ai-assistant", title: "The Stocklore assistant", blurb: "Describe the work — “draft an invoice for Andrea’s Flowers with four flower kits” — review what it prepared, approve, done. Human-approved, always.", status: "vision", area: "ai" },
  // … full set derived from MASTER_PLAN.md §3/§6 + agentic plan at build time
];
```

Rendering: `/roadmap` groups `shipped` by `date` (Drizzle months), then `in-progress`,
`planned`, `vision`; the landing teaser takes the newest few. **Refresh loop:** shipping a
feature = add/flip one entry, push, Netlify rebuilds (~1 min). A later automation (labeled
GitHub milestones → build-time fetch + scheduled build hook) is noted as a fast-follow, not v1.

## 8. Content & claims — what we may say (source-mapped)

**Live today** (master plan Phases 0–3 closed; competitive README §1): catalog with SKUs,
barcodes-as-data, categories, images, custom fields, units of measure, multi-vendor;
ledger-backed stock with full movement history, reason-coded adjustments, low-stock alerts,
reorder points; multi-location stock + transfers; BOMs with **nested manufacturing orders /
sub-assemblies (≤6 deep), auto-MO from a confirmed sale, BOM-aware fulfillment**; invoices
(draft→confirmed, PDF), POs + receiving; unified contacts; **CRA GST/HST/PST** agencies/rates
+ 3 tax modes; CSV/Excel import, PDF/Excel export; **server-enforced roles**; multi-org
accounts; realtime notifications; self-serve demo data.

**In progress:** sales orders (WP-4.1 design drafted). **Planned (MVP1):** quotes, partial
receiving, partial fulfillment, kits/bundles, valuation & aging reports, public REST API.
**Vision (post-MVP1 / agentic plan):** QuickBooks/Xero, the human-in-the-loop AI assistant
(phased: read-only chat → write-with-confirmation → outbound email → MCP/agent extensibility),
barcode scanning/printing, lot & serial tracking, forecasting.

**Guardrails:** every claim in copy traces to one of the rows above; anything not "live"
renders with its badge; the wedge claim uses the research's exact framing ("most tools at this
weight class only do single-level kits") — no named-competitor superiority claims; pricing
copy per D4/Q3; no "AI-powered" present-tense anywhere.

## 9. SEO plan

**Preserve (zero-loss):** all URLs 200 or 301 (§3); FAQ content themes carried forward;
"Stocklore" stays first in the home title (brand-SERP defense vs stocklore.ai); heading themes
migrate (the generic H1 is *deliberately* upgraded to a keyword-bearing one — documented
change, low risk given no category rankings exist to lose); Cloudflare/Netlify DNS untouched.

**Add (the fundamentals the site never had):**
- `BaseHead` on every page: unique title (`Stocklore — Inventory & Manufacturing Software for
  Canadian Small Business` home pattern; `<Page> · Stocklore` elsewhere), meta description,
  canonical (from `site`), OG + Twitter cards with a branded 1200×630 `public/og.png`
  (generated via a Playwright screenshot of a token-styled HTML template during build phase).
- JSON-LD: `Organization` + `WebSite` (site-wide), `SoftwareApplication`
  (offers: free-beta) on `/`, `FAQPage` on the FAQ.
- `@astrojs/sitemap` → `sitemap-index.xml` + `public/robots.txt` referencing it.
- Semantic structure: one H1/page, landmarks, descriptive link text, `<Image>`-optimized
  assets where raster images exist at all.

**CWV:** static HTML, <10 KB JS, preloaded variable fonts, no layout-shifting embeds —
targets LCP < 1.5s, CLS < 0.05, Lighthouse Perf/SEO/A11y/Best-Practices ≥ 95 (measured on
`astro preview` + PageSpeed after deploy).

**Post-launch (§13):** submit sitemap in GSC, "Validate" the home URL, watch
Coverage/Performance for 2–4 weeks for drops on brand queries; rollback = Netlify
one-click restore of the prior deploy (old build remains intact).

## 10. Mobile responsiveness & accessibility (hard requirements)

### 10.1 Mobile-first responsiveness — iPhone & Android device matrix

The site is built **mobile-first** (base styles target small screens; Tailwind breakpoints
enhance upward) and is validated against a concrete device matrix, not just "looks fine
narrow":

| Class | Devices emulated (viewport CSS px) |
| --- | --- |
| Small phones | iPhone SE (375×667) · small Android (360×640) — plus a **320 px reflow check** (WCAG 1.4.10 floor) |
| Mainstream iPhones | iPhone 12/13/14 (390×844) · iPhone 15/16 (393×852) |
| Large iPhones | 14/15/16 Pro Max & Plus (428–430×926–932) |
| Mainstream Android | Pixel 7/8 (412×915) · Galaxy S23/S24 (360×780, 384×832) |
| Tablets | iPad Mini portrait (768×1024) · iPad landscape (1024×768) |
| Desktop | 1280 · 1440 · 1920 |

Each phone size is also checked in **landscape** (short-viewport header/hero behavior).

**Engineering rules baked into every component:**
- **No horizontal scroll at any width ≥ 320 px** — automated assertion
  (`document.scrollingElement.scrollWidth ≤ clientWidth`) runs across the whole matrix.
- **Viewport meta** with `viewport-fit=cover`, and **safe-area insets**
  (`env(safe-area-inset-*)`) padding the sticky header and any full-bleed bands so notched
  iPhones never clip content.
- **`dvh` (with `vh` fallback) for any viewport-height sizing** — the classic iOS Safari
  URL-bar `100vh` bug is designed out.
- **Touch targets ≥ 44×44 px** (Apple HIG; exceeds WCAG 2.5.8) for every tappable: nav
  links, tabs, accordion summaries, buttons, footer links — with adequate spacing.
- **Inputs ≥ 16 px font-size** so iOS Safari never zoom-jumps on focus (email form).
- **No hover-dependent affordances** — hover flourishes live behind `@media (hover: hover)`;
  every interaction has a tap/focus equivalent.
- **Tab section on small screens:** the 5-tab tour degrades to a horizontally scrollable,
  snap-aligned tab row (own overflow container) — panels never force page overflow; wide
  mockups scroll inside their frame.
- Fluid type via `clamp()`; images/SVGs `max-width: 100%`; the hero stacks (copy over
  mockup) below `md`.
- **Mobile performance is part of responsiveness:** static HTML + <10 KB JS targets
  Lighthouse **mobile preset** (throttled mid-tier device) ≥ 90 performance, LCP < 2.5 s.

**Honest tooling note:** automated checks run in Playwright's Chromium (preinstalled here)
with device-accurate viewport/DPR/touch emulation — this catches layout, overflow, and
target-size issues but is not the real WebKit engine. The launch checklist (§13) therefore
includes a **real-device spot check on an actual iPhone (Safari) and Android (Chrome)**
before the Netlify repoint is called done; the `dvh`/safe-area/16px-input rules above
pre-empt the known iOS Safari failure classes.

### 10.2 Accessibility — WCAG 2.2 AA target

- **Semantics:** landmarks (`header/nav/main/footer`), exactly one `h1` per page, logical
  heading order, `html lang="en"`, skip-to-content link, descriptive link text (no bare
  "click here").
- **Keyboard:** every interaction operable — tabs follow the **WAI-ARIA APG Tabs pattern**
  (roving tabindex + arrow keys), mobile menu and theme toggle follow the disclosure/button
  patterns (`aria-expanded`/`aria-controls`), no focus traps, visible `:focus-visible` rings
  from the `--ring` token in both themes.
- **No-JS parity:** tabs render stacked-with-headings, menu renders expanded, FAQ uses native
  `<details>/<summary>` — content is never JS-gated.
- **Contrast:** 4.5:1 body text / 3:1 large text & UI components, verified **per token
  pairing in both themes** during build (the muted-foreground-on-background pairs get
  explicit checks); status badges never rely on color alone (always text + color).
- **Motion:** all animation behind `prefers-reduced-motion`; no autoplay, no parallax.
- **Forms:** visible labels + `autocomplete` attrs; submit state and success/error announced
  via an `aria-live="polite"` status region (the current form already swaps text — it gains
  the live region).
- **Zoom & reflow:** 200 % zoom and 320 px reflow with no loss (WCAG 1.4.4/1.4.10); tolerant
  of user text-spacing overrides (1.4.12) — no fixed-height text boxes.
- **Images/SVG:** informative images get alt text; decorative mockups/diagrams are
  `aria-hidden` with an adjacent text description where they carry meaning (the nested-MO
  diagram gets a proper text explanation, not just a picture).
- **Automated gate:** **axe-core (`@axe-core/playwright`) runs on every page in both themes
  — 0 serious/critical violations is a merge gate**, alongside the manual keyboard pass.
  VoiceOver (iOS) / TalkBack (Android) spot checks join the real-device step in §13.

## 11. Build sequence (post-approval)

| Phase | Work | Checkpoint (gate to next) |
| --- | --- | --- |
| **P0 Foundations** | Static output + `site`, TW4 migration, tokens/global.css, fonts, `BaseHead`, `BaseLayout`, netlify.toml, robots/sitemap, 404, dep cleanup | `npm run build` green; preview serves `/`, `/contact`, `/email` (old pages, new shell OK to be ugly); no console errors |
| **P1 Shell** | Header/nav (mobile + theme toggle), Footer | Keyboard-operable nav both themes; **§10.1 device-matrix screenshots (light/dark) + zero-horizontal-overflow assertion**; axe scan clean on the shell |
| **P2 Landing** | All 8 sections of §4.1, mockup components, copy v1 | Full-page screenshots **across the §10.1 matrix** both themes; tabs pass the APG keyboard pattern with and without JS; **overflow assertion + axe clean at every matrix width**; FAQ JSON-LD validates |
| **P3 Data pages** | `roadmap.ts`/`features.ts` (full sets from the source docs), `/roadmap`, `/features`, landing teaser wiring | Every entry traces to a source doc; badges render; anchors from the tour resolve |
| **P4 Remaining pages** | `/about`, `/contact` + `/email` refresh, `/blog` 301, delete retired files | Link-check all internal hrefs; form POST exercised against a local run |
| **P5 Hardening & handoff** | Lighthouse pass vs §9 targets (**mobile preset included**), full §10.1 matrix sweep (screenshots + overflow assertions, portrait & landscape), **axe-core gate on every page × both themes**, per-pairing contrast sweep, 200 %-zoom/320 px-reflow check, `format:check`, README rewrite, launch checklist doc, final screenshots posted for review | All budgets met, 0 serious/critical axe violations; PR-ready branch pushed |

Each phase = one or more commits on this branch; visual checkpoints (screenshots) shared for
feedback rather than waiting for the end. Estimated end-to-end: one focused session.

## 12. Deliberate removals (and why they're safe)

| Removed | Why | Implication |
| --- | --- | --- |
| "We do not support mobile screens" FAQ | Actively harmful copy; marketing site itself goes mobile-first. Replaced with: "Stocklore runs in any modern browser; a dedicated mobile experience is on the roadmap." | Positive. (App-side mobile claims stay conservative — Q6.) |
| Purple→fuchsia gradient + "shiny" CTA, stone-700 dark-only theme | Off-brand vs the app's warm system (no colored glows rule) | None — visual only |
| Empty `/blog` page | Thin content; 301 keeps equity and the "updates" intent lands on `/roadmap` | Q4 |
| 4 legacy PNGs, DarkCard/DropDown/old Button/SpinnerLoader, MainLayout, SCSS colors, Roboto, `@google-cloud/local-auth`, `sass` | Superseded by the new system; local-auth was never imported | None |
| "Stocklore 2025 ©" | Stale | Becomes dynamic year |

## 13. Launch checklist (Netlify repoint) & rollback

1. Merge approved branch → `main` of this repo; connect Netlify site to it (verify
   `netlify.toml` build settings win cleanly over UI config).
2. Set `GOOGLE_SERVICE_ACCOUNT_JSON` env var on the new site **before** first deploy; smoke-test
   `/api/email` (row appears in the sheet).
3. Deploy-preview sanity: all §3 URLs 200/301, favicon, og.png, sitemap-index reachable.
4. Flip production; spot-check `stocklore.app` (both themes, mobile) — including the
   **real-device pass from §10.1: an actual iPhone (Safari) and Android phone (Chrome)**,
   plus a quick VoiceOver/TalkBack sanity check of the landing page and email form.
5. GSC: submit sitemap, request indexing of `/`; monitor 2–4 weeks.
6. **Rollback:** Netlify "restore previous deploy" (instant); repo revert if needed; the 301 is
   one line to drop.

## 14. Open questions (answers refine, don't block — defaults in parentheses)

- **Q1 — Search Console:** can you export top queries/pages? (Default: proceed on the
  zero-loss posture verified in §2.)
- **Q2 — Assets:** real screenshots of the redesigned app and/or a brand kit? (Default:
  token-native mockups, §5, swap later.)
- **Q3 — Pricing sentence:** OK to promise "early users keep preferential rates"? (Default:
  soften to "transparent pricing announced before beta ends" — no rate promise.)
- **Q4 — `/blog` 301 → `/roadmap`?** (Default: yes.)
- **Q5 — Hero headline:** pick (a)/(b)/(c) from §4.1 or ask for more options. (Default: (a).)
- **Q6 — Mobile wording:** is "works in any modern browser" acceptable given the app's
  current desktop-first responsiveness? (Default: yes, with the roadmap caveat.)
- **Q7 — Analytics:** none found in-repo; add privacy-friendly analytics (e.g. Netlify
  Analytics) or skip? (Default: skip; note for later.)

## Success criteria (from the brief — how we'll know)

Visitor comprehension in one viewport (who/what/why-cheaper); one-click path to the portal
from every page; depth available via tabs → `/features`; the shipping-cadence story visible on
`/` and provable on `/roadmap` (incl. the honest AI vision); Lighthouse ≥ 95 across the board;
every pre-existing URL still resolving; brand SERP strengthened (title/description/schema
disambiguate us from stocklore.ai); **flawless rendering across the §10.1 iPhone/Android
matrix with zero horizontal overflow and WCAG 2.2 AA (0 serious/critical axe violations)**;
the site visually indistinguishable in family from the product it sells.
