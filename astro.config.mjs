import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import { SITE_URL } from "./src/data/config";
import { remarkReadingTime } from './remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap(), robotsTxt()],
  site: SITE_URL,
  markdown: {
    remarkPlugins: [remarkReadingTime],
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'nord',
      wrap: false,
    },
  },
});
