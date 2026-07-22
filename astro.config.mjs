// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  // Astro's built-in CSRF Origin check computes the request's own origin from the raw
  // socket, which is wrong behind a TLS-terminating reverse proxy — see src/middleware/index.ts
  // for a proxy-aware replacement that trusts the ORIGIN env var.
  security: {
    checkOrigin: false,
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: ['nodemailer'],
      },
    },
  },
  adapter: node({
    mode: 'standalone'
  })
});