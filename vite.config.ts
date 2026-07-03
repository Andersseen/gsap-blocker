/// <reference types="vitest" />
import analog from '@analogjs/platform';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2022'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog({
      nitro: {
        preset: process.env['BUILD_PRESET'] ?? 'node-server',
        routeRules: {
          '/': { prerender: true },
          '/blocks/**': { isr: 60 },
          '/docs': { prerender: true },
        },
      },
      prerender: {
        routes: async () => [
          '/',
          '/blocks',
          '/blocks/heroes',
          '/blocks/features',
          '/blocks/pricing',
          '/blocks/cta',
          '/blocks/footers',
          '/blocks/testimonials',
          '/blocks/infinite-marquee',
          '/blocks/parallax-scroll',
          '/docs',
        ],
      },
      vite: {
        inlineStylesExtension: 'css',
      },
    }),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
