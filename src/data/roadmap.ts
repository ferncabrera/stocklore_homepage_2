/**
 * The "building in the open" roadmap — the single source for the landing
 * teaser and the /roadmap page.
 *
 * Curated by hand from the open_ims planning docs (docs/roadmap/MASTER_PLAN.md,
 * docs/roadmap/phases/*, docs/roadmap/agentic/01-agentic-plan.md). Shipping a
 * feature = add/flip one entry here and push — Netlify rebuilds the site.
 *
 * Honesty rule: `shipped` requires the feature to be live in production.
 * Anything else carries its real status and renders with a visible badge.
 */

export type RoadmapStatus = "shipped" | "in-progress" | "planned" | "vision";

export type RoadmapArea = "inventory" | "manufacturing" | "catalog" | "sales" | "purchasing" | "platform" | "ai";

export interface RoadmapItem {
  id: string;
  title: string;
  blurb: string;
  status: RoadmapStatus;
  area: RoadmapArea;
  /** "YYYY-MM" — required when shipped; groups the timeline by month. */
  date?: string;
}

export const ROADMAP: RoadmapItem[] = [
  // ── Shipped ────────────────────────────────────────────────────────────────
  {
    id: "catalog-rebuild",
    title: "Product pages rebuilt — units of measure, photos, custom fields, categories",
    blurb:
      "Model your catalog your way: sell by the metre or the millilitre, attach product photos, define your own fields, and organize everything with categories.",
    status: "shipped",
    area: "catalog",
    date: "2026-07",
  },
  {
    id: "multi-location",
    title: "Multi-location stock + transfers",
    blurb: "See on-hand quantities per location and move stock between them with a proper two-sided transfer document — nothing goes missing in between.",
    status: "shipped",
    area: "inventory",
    date: "2026-07",
  },
  {
    id: "demo-self-serve",
    title: "Self-serve demo companies",
    blurb: "Curious? Seed a fully-stocked demo company from inside the app and explore with realistic data — no sales call required.",
    status: "shipped",
    area: "platform",
    date: "2026-07",
  },
  {
    id: "stock-ledger",
    title: "The stock ledger — every movement, recorded",
    blurb:
      "Every stock change is now one auditable ledger entry: sales, purchases, builds, transfers, and reason-coded manual adjustments — with low-stock alerts the moment a reorder point is crossed.",
    status: "shipped",
    area: "inventory",
    date: "2026-07",
  },
  {
    id: "permissions-enforced",
    title: "Role permissions enforced on every route",
    blurb: "Admin, edit, and view roles are now enforced server-side across all 100+ API routes — not just hidden buttons in the UI.",
    status: "shipped",
    area: "platform",
    date: "2026-07",
  },
  {
    id: "competitive-study",
    title: "Mapped the entire competitive field",
    blurb:
      "We scored Stocklore against 27 competitors across a 106-feature taxonomy — and published the verdicts into our own roadmap. What you see below is what that research said to build.",
    status: "shipped",
    area: "platform",
    date: "2026-06",
  },

  // ── Now building ──────────────────────────────────────────────────────────
  {
    id: "sales-orders",
    title: "Sales orders (separate from invoices)",
    blurb:
      "Quote → order → fulfill → invoice, the way real operations flow. Design is locked and in review; stock will move at fulfillment, not paperwork time.",
    status: "in-progress",
    area: "sales",
  },

  // ── Up next (MVP1) ────────────────────────────────────────────────────────
  {
    id: "quotes",
    title: "Quotes & estimates",
    blurb: "Send a quote, get a yes, convert it to an order in one click.",
    status: "planned",
    area: "sales",
  },
  {
    id: "partial-receiving",
    title: "Partial receiving",
    blurb: "Receive what actually arrived — per line, per shipment — and let delivery status follow reality.",
    status: "planned",
    area: "purchasing",
  },
  {
    id: "partial-fulfillment",
    title: "Partial shipping & fulfillment",
    blurb: "Ship what's ready now, backfill the rest, and keep the order's status honest throughout.",
    status: "planned",
    area: "sales",
  },
  {
    id: "kits",
    title: "Kits & bundles",
    blurb: "Sell a bundle whose components ship together — powered by the same BOM engine that runs manufacturing.",
    status: "planned",
    area: "catalog",
  },
  {
    id: "valuation-reports",
    title: "Inventory valuation & aging reports",
    blurb: "What is my inventory worth, and what's been sitting too long? Answered in-app, straight from the ledger's cost history.",
    status: "planned",
    area: "inventory",
  },
  {
    id: "public-api",
    title: "Public REST API v1",
    blurb: "Your data, programmable — API keys, docs, and a stability policy on the same typed surface the app itself runs on.",
    status: "planned",
    area: "platform",
  },

  // ── The bigger vision ─────────────────────────────────────────────────────
  {
    id: "ai-assistant",
    title: "The Stocklore assistant",
    blurb:
      "Describe the work — “draft an invoice for Andrea's Flowers with four flower kits and email her the PDF” — review exactly what it prepared, and approve. It works with your role and permissions, drafts every action for your sign-off, and never executes anything on its own.",
    status: "vision",
    area: "ai",
  },
  {
    id: "accounting-sync",
    title: "QuickBooks & Xero sync",
    blurb: "Keep Stocklore as the operations brain and your accounting suite as the ledger — first bet after the current milestone ships.",
    status: "vision",
    area: "platform",
  },
  {
    id: "barcode-scanning",
    title: "Barcode scanning & label printing",
    blurb: "Products already store barcodes; scanning and printing workflows come once the catalog and stock foundations settle.",
    status: "vision",
    area: "inventory",
  },
  {
    id: "lot-serial",
    title: "Lot & serial tracking",
    blurb: "Full traceability for batch- and serial-numbered goods — the ledger was designed with the dimension reserved for it.",
    status: "vision",
    area: "inventory",
  },
];

/* Convenience slices */
export const shipped = ROADMAP.filter((i) => i.status === "shipped");
export const inProgress = ROADMAP.filter((i) => i.status === "in-progress");
export const planned = ROADMAP.filter((i) => i.status === "planned");
export const vision = ROADMAP.filter((i) => i.status === "vision");

/** Shipped items grouped by month, newest first. */
export const shippedByMonth = (): [string, RoadmapItem[]][] => {
  const groups = new Map<string, RoadmapItem[]>();
  for (const item of shipped) {
    const key = item.date ?? "undated";
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return [...groups.entries()].sort(([a], [b]) => (a < b ? 1 : -1));
};

export const formatMonth = (yyyyMm: string): string => {
  const [y, m] = yyyyMm.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
  });
};
