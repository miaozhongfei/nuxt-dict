import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  retries: 1,
  use: {
    channel: 'chrome',
    baseURL: 'http://localhost:5000',
  },
  webServer: {
    command: 'pnpm nuxi dev --port 5000',
    port: 5000,
    reuseExistingServer: true,
    timeout: 60000,
  },
});
