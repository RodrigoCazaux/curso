import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)), '~': fileURLToPath(new URL('.', import.meta.url)) } },
  test: { include: ['test/**/*.spec.js'], exclude: process.env.FIRESTORE_EMULATOR_HOST ? [] : ['test/rules.spec.js'], environment: 'jsdom', testTimeout: 15000, hookTimeout: 30000 },
});
