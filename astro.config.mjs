import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/** @type {import('vite').PluginOption[]} */
const vitePlugins = [tailwindcss()];

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: vitePlugins,
  },
});
