/**
 * Builds the Claude Design card bundle — 16 self-contained HTML preview cards
 * (brand tokens, typography, buttons/badges, and every landing section)
 * extracted from the REAL built site, with the compiled CSS + latin brand
 * fonts + logo inlined so each card renders pixel-true anywhere.
 *
 * Usage:
 *   npm run build
 *   (cd dist && python3 -m http.server 8788 &)
 *   BUNDLE_DIR=./.design-bundle CHROMIUM_PATH=/path/to/chromium node scripts/design-bundle.mjs
 *
 * Then push the bundle to a claude.ai/design design-system project (DesignSync:
 * list_projects/create_project → finalize_plan → write_files → register_assets).
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const OUT = process.env.BUNDLE_DIR ?? "./.design-bundle";
const BASE = process.env.BASE_URL ?? "http://localhost:8788";
for (const d of ["brand", "components", "sections", "shell"]) mkdirSync(join(OUT, d), { recursive: true });

// --- self-contained CSS: compiled stylesheet + latin fonts inlined ---
const astroDir = "dist/_astro";
const cssFile = readdirSync(astroDir).find((f) => f.endsWith(".css"));
let css = readFileSync(join(astroDir, cssFile), "utf8");
for (const f of readdirSync(astroDir)) {
  if (/(?:rubik|bricolage-grotesque)-latin-wght-normal.*\.woff2$/.test(f)) {
    const b64 = readFileSync(join(astroDir, f)).toString("base64");
    css = css.replaceAll(`/_astro/${f}`, `data:font/woff2;base64,${b64}`);
  }
}
const FAVICON_URI = `data:image/svg+xml;base64,${readFileSync("public/favicon.svg").toString("base64")}`;

const wrap = ({ group, title, html, dark = false, pad = "2rem", maxWidth = "" }) =>
  `<!-- @dsCard group="${group}" -->
<!doctype html>
<html lang="en"${dark ? ' class="dark"' : ""}>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
<style>${css}</style></head>
<body class="bg-background font-sans text-foreground" style="padding:${pad}">${maxWidth ? `<div style="max-width:${maxWidth};margin:0 auto">` : ""}${html}${maxWidth ? "</div>" : ""}</body></html>`;

const inlineFavicon = (html) => html.replaceAll('src="/favicon.svg"', `src="${FAVICON_URI}"`);

// --- extract rendered sections from the built site ---
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(BASE + "/", { waitUntil: "networkidle" });

const grab = (sel) => page.$eval(sel, (el) => el.outerHTML);
const heroHtml = inlineFavicon(await grab("main > section:nth-of-type(1)"));
let panelIdx = 0;
const tourHtml = (await grab("#tour")).replace(/role="tabpanel"/g, () => (panelIdx++ === 0 ? 'role="tabpanel"' : 'role="tabpanel" hidden'));
const wedgeHtml = await grab("main > section:nth-of-type(4)");
const whyHtml = await grab("main > section:nth-of-type(5)");
const openHtml = await grab("main > section:nth-of-type(6)");
const faqHtml = await grab("#faq");
const ctaHtml = await grab("main > section:nth-of-type(8)");
const headerHtml = inlineFavicon(await grab("header"));
const footerHtml = inlineFavicon(await grab("footer"));
const frameHtml = await grab("main > section:nth-of-type(1) figure");
await browser.close();

// --- hand-composed cards reuse EXACT class strings from the site ---
const swatch = (name, v) =>
  `<div style="display:flex;flex-direction:column;gap:6px"><div style="background:var(${v});height:64px;border-radius:var(--radius-lg);border:1px solid var(--border)"></div><span class="text-xs text-muted-foreground">${name}<br><code style="font-size:10px">${v}</code></span></div>`;
const swatches = [
  "--background",
  "--card",
  "--primary",
  "--primary-strong",
  "--brand-text",
  "--secondary",
  "--lightest",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--border",
  "--success",
  "--destructive",
]
  .map((v) => swatch(v.slice(2), v))
  .join("");
const colorsHtml = `<h2 class="font-heading text-2xl font-bold">Stocklore tokens</h2>
<p class="mt-2 text-sm text-muted-foreground">Warm paper neutrals + periwinkle. Mirrored 1:1 from the app (open_ims index.css).</p>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:16px;margin-top:24px">${swatches}</div>
<h3 class="mt-8 font-heading text-lg font-bold">Shadows &amp; radius</h3>
<div style="display:flex;gap:24px;margin-top:16px">
  <div class="rounded-lg border border-border bg-card p-6 shadow-soft">shadow-soft · rounded-lg (10px)</div>
  <div class="rounded-lg border border-border bg-card p-6 shadow-lifted">shadow-lifted</div>
</div>`;

const typeHtml = `<p class="text-xs font-semibold uppercase tracking-widest text-brand">Kicker · Rubik 600</p>
<h1 class="sl-animate-in mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">Display — Bricolage Grotesque <span class="sl-scan-mark">scan-mark</span></h1>
<h2 class="mt-6 font-heading text-3xl font-bold tracking-tight sm:text-4xl">Section title — Bricolage 700</h2>
<h3 class="mt-6 font-heading text-2xl font-bold">Subsection — Bricolage 700</h3>
<p class="mt-6 text-lg text-muted-foreground">Lede — Rubik 400, muted-foreground. Stocklore gives Canadian small businesses real inventory control without enterprise pricing.</p>
<p class="mt-4 text-sm leading-relaxed text-muted-foreground">Body small — Rubik 400. Every quantity is backed by an append-only movement ledger.</p>`;

const btn = (extra, label) =>
  `<a href="#" class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${extra}">${label}</a>`;
const buttonsHtml = `<h2 class="font-heading text-2xl font-bold">Buttons</h2>
<p class="mt-2 text-sm text-muted-foreground">Rectangular 8px radius, 44px+ touch targets. Solid surfaces use <code>--primary-strong</code> (WCAG AA with white text).</p>
<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
${btn("bg-primary-strong text-primary-foreground shadow-soft hover:shadow-lifted hover:brightness-110 min-h-12 px-7 text-base", "Primary · lg")}
${btn("bg-primary-strong text-primary-foreground shadow-soft hover:shadow-lifted hover:brightness-110 min-h-11 px-5 text-sm", "Primary · md")}
${btn("border border-input bg-card text-foreground hover:bg-muted min-h-12 px-7 text-base", "Outline · lg")}
${btn("text-muted-foreground hover:bg-muted hover:text-foreground min-h-11 px-5 text-sm", "Ghost · md")}
</div>`;

const badge = (bg, fg, label) =>
  `<span class="inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold whitespace-nowrap" style="background: var(${bg}); color: var(${fg});">${label}</span>`;
const badgesHtml = `<h2 class="font-heading text-2xl font-bold">Status badges</h2>
<p class="mt-2 text-sm text-muted-foreground">Honesty badges — text + color, never color alone.</p>
<div class="mt-6 flex flex-wrap items-center gap-3">
${badge("--badge-live-bg", "--badge-live-fg", "Live")}
${badge("--badge-progress-bg", "--badge-progress-fg", "In progress")}
${badge("--badge-planned-bg", "--badge-planned-fg", "Planned")}
${badge("--badge-vision-bg", "--badge-vision-fg", "In development")}
</div>`;

const cards = [
  ["brand/colors.html", "Brand", "Color tokens — light", colorsHtml, false, "900px"],
  ["brand/colors-dark.html", "Brand", "Color tokens — dark", colorsHtml, true, "900px"],
  ["brand/type.html", "Brand", "Typography", typeHtml, false, "820px"],
  ["components/buttons.html", "Components", "Buttons", buttonsHtml, false, "820px"],
  ["components/badges.html", "Components", "Status badges", badgesHtml, false, "820px"],
  ["components/browser-frame.html", "Components", "BrowserFrame product mock", frameHtml, false, "560px"],
  ["shell/header.html", "Shell", "Site header", headerHtml, false, ""],
  ["shell/footer.html", "Shell", "Site footer", footerHtml, false, ""],
  ["sections/hero.html", "Sections", "Hero — light", heroHtml, false, ""],
  ["sections/hero-dark.html", "Sections", "Hero — dark", heroHtml, true, ""],
  ["sections/product-tour.html", "Sections", "Tabbed product tour", tourHtml, false, ""],
  ["sections/wedge.html", "Sections", "Manufacturing wedge", wedgeHtml, false, ""],
  ["sections/why.html", "Sections", "Why Stocklore comparison", whyHtml, false, ""],
  ["sections/building-open.html", "Sections", "Building in the open + AI vision", openHtml, false, ""],
  ["sections/faq.html", "Sections", "FAQ accordions", faqHtml, false, ""],
  ["sections/cta.html", "Sections", "CTA band + email capture", ctaHtml, false, ""],
];

for (const [path, group, title, html, dark, maxWidth] of cards) {
  writeFileSync(join(OUT, path), wrap({ group, title, html, dark, maxWidth, pad: path.startsWith("sections/") || path.startsWith("shell/") ? "0" : "2rem" }));
}
console.log(`bundle written: ${cards.length} cards → ${OUT}`);
