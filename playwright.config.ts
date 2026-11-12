import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for the smoke tests in e2e/.
 *
 * The webServer block builds and starts the production app, so the tests run
 * against the same output that is deployed. On CI the server is always rebuilt;
 * locally an already-running dev/prod server is reused when present.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
