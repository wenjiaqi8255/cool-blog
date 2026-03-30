import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';

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
    react()
  ],
  vite: {
    ssr: {
      noExternal: ['@fontsource/inter', '@fontsource/jetbrains-mono']
    }
  }
});
