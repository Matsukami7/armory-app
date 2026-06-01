// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
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