/**
 * Site validation harness — the merge gate from docs/REDESIGN_PLAN.md §10.
 *
 * For every page × theme × device in the matrix:
 *   1. asserts zero horizontal overflow (scrollWidth ≤ clientWidth), and
 *   2. runs axe-core (serious/critical violations fail the run) on a
 *      desktop + phone subset.
 *
 * Usage:  node scripts/site-check.mjs [baseUrl]     (default http://localhost:8788)
 *   env:  SCREENSHOT_DIR=/path  → also saves review screenshots.
 */
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:8788";
const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR;

const PAGES = ["/", "/features/", "/roadmap/", "/about/", "/contact/", "/email/", "/404.html"];
// The site is light-only by design decision (see docs/REDESIGN_PLAN.md addendum).
const THEMES = ["light"];

// REDESIGN_PLAN.md §10.1 device matrix (CSS px)
const DEVICES = [
  { name: "reflow-320", width: 320, height: 568 },
  { name: "iphone-se", width: 375, height: 667 },
  { name: "android-small", width: 360, height: 640 },
  { name: "iphone-14", width: 390, height: 844 },
  { name: "iphone-16", width: 393, height: 852 },
  { name: "iphone-pro-max", width: 430, height: 932 },
  { name: "pixel-8", width: 412, height: 915 },
  { name: "galaxy-s24", width: 384, height: 832 },
  { name: "iphone-14-landscape", width: 844, height: 390 },
  { name: "ipad-mini", width: 768, height: 1024 },
  { name: "ipad-landscape", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "desktop-xl", width: 1920, height: 1080 },
];

// axe runs on this subset (every page × theme, two representative widths)
const AXE_DEVICES = new Set(["iphone-14", "desktop"]);

const failures = [];
let checks = 0;

// CHROMIUM_PATH lets CI/sandboxes point at a preinstalled browser instead of
// downloading one (e.g. /opt/pw-browsers/chromium).
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});
if (SCREENSHOT_DIR) mkdirSync(SCREENSHOT_DIR, { recursive: true });

for (const theme of THEMES) {
  const context = await browser.newContext();
  await context.addInitScript((t) => localStorage.setItem("theme", t), theme);

  for (const device of DEVICES) {
    const page = await context.newPage();
    await page.setViewportSize({ width: device.width, height: device.height });

    for (const path of PAGES) {
      await page.goto(BASE + path, { waitUntil: "networkidle" });

      // 1. Horizontal-overflow assertion
      const overflow = await page.evaluate(() => {
        const el = document.scrollingElement;
        return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
      });
      checks++;
      if (overflow.scrollWidth > overflow.clientWidth + 1) {
        failures.push(`OVERFLOW ${path} [${theme}/${device.name}] scrollWidth=${overflow.scrollWidth} > clientWidth=${overflow.clientWidth}`);
      }

      // 2. axe-core on the representative subset
      if (AXE_DEVICES.has(device.name)) {
        const results = await new AxeBuilder({ page }).analyze();
        const serious = results.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
        checks++;
        for (const v of serious) {
          failures.push(`AXE ${path} [${theme}/${device.name}] ${v.impact}: ${v.id} — ${v.help} (${v.nodes.length} nodes)`);
        }
      }

      if (SCREENSHOT_DIR && ["desktop", "iphone-14"].includes(device.name)) {
        const slug = path === "/" ? "home" : path.replaceAll("/", "").replace(".html", "");
        await page.screenshot({
          path: `${SCREENSHOT_DIR}/${slug}-${theme}-${device.name}.png`,
          fullPage: true,
        });
      }
    }
    await page.close();
  }
  await context.close();
}

await browser.close();

console.log(`\n${checks} checks across ${PAGES.length} pages × ${THEMES.length} themes × ${DEVICES.length} devices`);
if (failures.length) {
  console.error(`\n❌ ${failures.length} failure(s):`);
  for (const f of failures) console.error("  " + f);
  process.exit(1);
}
console.log("✅ zero horizontal overflow, zero serious/critical axe violations");
