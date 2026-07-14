/**
 * The /features page content — every claim traces to the open_ims planning
 * docs (MASTER_PLAN.md phase status + competitive-research feature study).
 * Status honesty: "live" means in production today; everything else is badged.
 */

export type FeatureStatus = "live" | "in-progress" | "planned";

export interface FeatureItem {
  title: string;
  blurb: string;
  status: FeatureStatus;
}

export interface FeatureArea {
  /** Anchor id — the landing tour links to /features#<id>. */
  id: string;
  title: string;
  lede: string;
  items: FeatureItem[];
}

export const FEATURE_AREAS: FeatureArea[] = [
  {
    id: "inventory",
    title: "Inventory control",
    lede: "Numbers you can trust, because every change is a recorded movement.",
    items: [
      {
        title: "Ledger-backed stock tracking",
        blurb:
          "Every quantity is the sum of an append-only movement ledger — sales, purchases, builds, transfers, adjustments — with the full history one click away.",
        status: "live",
      },
      {
        title: "Movement history & audit trail",
        blurb: "Who changed what, when, from which document — for every product.",
        status: "live",
      },
      {
        title: "Manual adjustments with reasons",
        blurb: "Recount, damaged, lost, found — corrections are reason-coded and auditable.",
        status: "live",
      },
      {
        title: "Reorder points & low-stock alerts",
        blurb: "Set a threshold; the moment stock crosses it, your whole team gets notified.",
        status: "live",
      },
      {
        title: "Multi-location stock",
        blurb: "Per-location on-hand quantities, with a location context on every document.",
        status: "live",
      },
      {
        title: "Stock transfers",
        blurb: "Move stock between locations with a two-sided transfer document.",
        status: "live",
      },
      {
        title: "Valuation & aging reports",
        blurb: "What your inventory is worth and what's been sitting too long — in-app.",
        status: "planned",
      },
    ],
  },
  {
    id: "manufacturing",
    title: "Manufacturing",
    lede: "Real BOM depth — the kind rivals gate behind $300+/month tiers.",
    items: [
      {
        title: "Multi-level bills of materials",
        blurb: "Recipes within recipes: BOMs nest through sub-assemblies up to six levels deep.",
        status: "live",
      },
      {
        title: "Nested manufacturing orders",
        blurb: "Building a product that contains sub-assemblies spawns the entire MO tree — not a flattened approximation.",
        status: "live",
      },
      {
        title: "Auto-MO from a confirmed sale",
        blurb: "Confirm an invoice for a manufactured product and the build orders create themselves.",
        status: "live",
      },
      {
        title: "BOM-aware fulfillment",
        blurb: "Completion consumes components bottom-up and yields the finished good — every leg recorded in the stock ledger.",
        status: "live",
      },
    ],
  },
  {
    id: "catalog",
    title: "Product catalog",
    lede: "Model products the way your business actually works.",
    items: [
      {
        title: "SKUs, barcodes & product types",
        blurb: "Goods and services, tracked or untracked, with barcode fields ready for future scanning.",
        status: "live",
      },
      { title: "Units of measure", blurb: "Stock in one unit, buy and sell in others — conversions are handled for you.", status: "live" },
      { title: "Product images", blurb: "Upload photos, pick a primary, and see them across the app.", status: "live" },
      { title: "Custom fields", blurb: "Define your own typed fields (text, number, date, yes/no) and use them everywhere.", status: "live" },
      { title: "Categories", blurb: "Organize the catalog with editable categories.", status: "live" },
      { title: "Multiple vendors per product", blurb: "Track every supplier for a product, not just a single preferred one.", status: "live" },
      { title: "Kits & bundles", blurb: "Sell bundles whose components ship together — same BOM engine, sales-side.", status: "planned" },
    ],
  },
  {
    id: "purchasing",
    title: "Purchasing",
    lede: "Buying that keeps the stock number honest.",
    items: [
      { title: "Purchase orders", blurb: "POs with line items, delivery and payment tracking, and PDF export.", status: "live" },
      { title: "Vendor management", blurb: "Unified contacts for customers and vendors, with addresses and net terms.", status: "live" },
      { title: "Receiving", blurb: "Receiving a PO writes the stock in — straight onto the ledger.", status: "live" },
      { title: "Partial receiving", blurb: "Receive per line and per shipment as goods actually arrive.", status: "planned" },
    ],
  },
  {
    id: "sales",
    title: "Sales, invoicing & tax",
    lede: "From draft to paid — CRA-ready from day one.",
    items: [
      { title: "Invoices", blurb: "Draft → confirmed workflow with delivery and payment status, and professional PDF export.", status: "live" },
      { title: "Canadian tax, natively", blurb: "GST, HST, and PST agencies and rates per province, out of the box.", status: "live" },
      { title: "Tax modes", blurb: "Tax-exclusive, tax-inclusive, or non-taxable — per document.", status: "live" },
      { title: "Sales orders", blurb: "A true order document between quote and invoice; stock moves at fulfillment.", status: "in-progress" },
      { title: "Quotes & estimates", blurb: "Quote first, convert to an order on a yes.", status: "planned" },
      { title: "Partial fulfillment", blurb: "Ship what's ready now and keep status honest.", status: "planned" },
    ],
  },
  {
    id: "platform",
    title: "Platform & team",
    lede: "Small-business simple, engineered like it matters.",
    items: [
      { title: "Roles enforced server-side", blurb: "Admin, edit, and view floors enforced on every single API route.", status: "live" },
      { title: "CSV & Excel import / PDF & Excel export", blurb: "Bring your data in from spreadsheets; take documents and lists out.", status: "live" },
      { title: "Multiple organizations", blurb: "Run several businesses under one account; invite teammates with scoped roles.", status: "live" },
      { title: "Realtime notifications", blurb: "Low-stock alerts and team activity, live in the app.", status: "live" },
      { title: "Self-serve demo data", blurb: "Seed a realistic demo company and explore before you commit.", status: "live" },
      { title: "Public REST API v1", blurb: "Keys, docs, and a stability policy on the same typed contract the app uses.", status: "planned" },
    ],
  },
];
