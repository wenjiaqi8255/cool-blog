import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kernel-panic.dev',
  output: 'server',
  server: {
    port: 4321,
    host: true
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    }
  },
  adapter: node({
    mode: 'standalone'
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
    },
    optimizeDeps: {
      exclude: ['drizzle-orm', '@neondatabase/serverless', '@modelcontextprotocol/sdk']
    }
  }
});
