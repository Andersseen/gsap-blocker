import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: './',
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    environment: 'jsdom',
    watch: false,
    reporters: ['default'],
    coverage: {
      enabled: false,
      excludeAfterRemap: true,
    },
  },
  plugins: [
    {
      name: 'angular-coverage-exclude',
      configureVitest(context) {
        context.project.config.coverage.exclude = ['**/*.{test,spec}.?(c|m)ts'];
      },
    },
  ],
});
