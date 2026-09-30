// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    // Copied from the web repository by `pnpm sync:web` (ADR 0002); linted there.
    ignores: ['dist/*', 'src/shared/web/**', 'android/**', 'ios/**', '.expo/**'],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]);
