// @ts-check
import { defineConfig } from "astro/config";

import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// Static-first: every marketing page is prerendered HTML on the CDN.
// The Netlify adapter serves only the routes that opt out of prerendering
// (src/pages/api/email.ts) as serverless functions.
export default defineConfig({
  site: "https://stocklore.app",
  adapter: netlify(),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
