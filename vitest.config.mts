import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

/** Unit tests for logic that does not need React Native (ADR 0001). Screens are covered by Maestro. */
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['src/**/*.test.ts', '*.test.ts'],
    environment: 'node',
    typecheck: { enabled: true, include: ['src/**/*.test.ts'] },
  },
});
