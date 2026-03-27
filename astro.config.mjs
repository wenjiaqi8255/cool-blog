import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
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
