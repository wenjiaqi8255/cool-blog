import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const platform = process.env.DEPLOY_PLATFORM || 'node';

export default defineConfig({
  site: 'https://kernel-panic.dev',
  output: 'server',
  server: platform === 'node' ? {
    port: 4321,
    host: true
  } : undefined,
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    }
  },
  adapter: platform === 'cloudflare' ? cloudflare() : node({ mode: 'standalone' }),
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
