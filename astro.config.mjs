import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  site: 'https://kernel-panic.dev',
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    }
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/draft/'),
      customPages: ['/articles/'],
    })
  ],
  vite: {
    ssr: {
      noExternal: ['@fontsource/inter', '@fontsource/jetbrains-mono']
    }
  }
});