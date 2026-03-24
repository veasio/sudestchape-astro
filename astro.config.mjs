import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Note: @astrojs/sitemap has a Windows path bug (absolute paths) with Astro 3.x.
// Sitemap is disabled locally but will be re-enabled on Cloudflare Pages (Linux).
const isCi = process.env.CI === 'true' || process.env.CF_PAGES === '1';

export default defineConfig({
  site: 'https://sudestchape.fr',
  integrations: isCi ? [sitemap()] : [],
  output: 'static',
});
