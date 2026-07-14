/** Single source for site-wide constants — never hardcode these in components. */
export const SITE = {
  name: "Stocklore",
  url: "https://stocklore.app",
  portalUrl: "https://portal.stocklore.app",
  supportEmail: "support@stocklore.app",
  description:
    "Track stock, build multi-level assemblies, manage purchase orders, and send CRA-ready invoices — one simple tool for Canadian product businesses. Free during open beta.",
  ogImage: "/og.png",
} as const;
