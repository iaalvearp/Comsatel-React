import { defineConfig } from 'astro/config';
import react from '@astrojs/react';     // <- Se agregó esto
import tailwind from '@astrojs/tailwind'; // <- Se agregó esto

export default defineConfig({
  integrations: [react(), tailwind()], // <- Y deben estar aquí dentro
  vite: {
    plugins: [tailwind()],
  },
});