import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

/** @type {import('vite').PluginOption[]} */
const vitePlugins = [tailwindcss()];

// https://astro.build/config
export default defineConfig({
  output: 'server',  // Enable SSR for authentication and protected routes
  adapter: vercel(),
  vite: {
    plugins: vitePlugins,
  },
});
