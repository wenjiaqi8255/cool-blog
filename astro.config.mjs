import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

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
