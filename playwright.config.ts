import { defineConfig, devices } from '@playwright/test';

/**
 * Smoke tests run against a production build served by the Node standalone
 * entry — the same command used in production. No secrets required.
 * Run locally with:  npm run build && npm run test:e2e
 */
const PORT = 4321;

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm start',
    url: `http://localhost:${PORT}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: { PORT: String(PORT), NODE_ENV: 'production' },
  },
});
