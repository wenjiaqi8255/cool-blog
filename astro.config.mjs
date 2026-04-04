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
      enabled: false  // Disable for local dev to use .env.local
    },
    imageService: 'cloudflare',
    // Enable on-demand API routes in production
    routes: {
      extend: {
        include: [{ pattern: '/api/*' }]
      }
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
    },
    optimizeDeps: {
      exclude: ['drizzle-orm', '@neondatabase/serverless', '@modelcontextprotocol/sdk']
    },
    define: {
      'process.env.DATABASE_URL': JSON.stringify(process.env.DATABASE_URL || '')
    }
  }
});
