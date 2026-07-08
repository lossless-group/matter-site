import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('vite').PluginOption[]} */
const vitePlugins = [tailwindcss()];

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://matter-site.vercel.app',
  output: 'server',  // Enable SSR for authentication and protected routes
  adapter: vercel(),
  // Astro 7: legacy `type: 'content'` collections (narratives, changelog,
  // slides — see src/content.config.ts) are no longer auto-wired to a
  // glob() loader unless this flag is set. Without it, getCollection()
  // silently returns an empty array for every legacy collection. Keeping
  // this on preserves existing behavior; migrating the three collections
  // to explicit `loader: glob(...)` definitions is the longer-term fix.
  legacy: {
    collectionsBackwardsCompat: true,
  },
  markdown: {
    shikiConfig: {
      // Dual themes to match matter-theme light/dark modes
      themes: {
        light: 'github-light',
        dark: 'tokyo-night',
      },
      // Wrap long lines instead of horizontal scroll
      wrap: true,
    },
  },
  vite: {
    plugins: vitePlugins,
    resolve: {
      alias: {
        '@config': path.resolve(__dirname, './src/config'),
      },
    },
  },
});
