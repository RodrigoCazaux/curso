import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e', fullyParallel: false, workers: 1, timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:3001', trace: 'retain-on-failure', screenshot: 'only-on-failure', launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROME_PATH || undefined } },
  projects: [{ name: 'desktop', use: { ...devices['Desktop Chrome'] } }, { name: 'mobile', use: { ...devices['Pixel 7'] } }],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 3001', url: 'http://127.0.0.1:3001', reuseExistingServer: false, timeout: 60000,
    env: { FIREBASE_EMULATORS: 'true', FIREBASE_PROJECT_ID: 'demo-inquieto', FIREBASE_API_KEY: 'demo-api-key', FIREBASE_AUTH_DOMAIN: 'demo-inquieto.firebaseapp.com', FIREBASE_STORAGE_BUCKET: 'demo-inquieto.appspot.com', FIREBASE_APP_ID: 'demo-app', NUXT_TELEMETRY_DISABLED: '1', NUXT_DEBUG: 'false', DEBUG: '' },
  },
});
