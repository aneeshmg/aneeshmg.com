// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Static output only: Cloudflare serves dist/ as Workers Static Assets (see wrangler.jsonc).
export default defineConfig({
  site: "https://aneeshmg.com",
  integrations: [sitemap()],
  // three.js is one lazy chunk (~530 kB, ~135 kB gzipped) loaded after the page is usable; see src/scripts/scene.ts.
  vite: { build: { chunkSizeWarningLimit: 600 } },
});
