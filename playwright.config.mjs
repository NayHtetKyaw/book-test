export default {
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results/e2e-results.json" }],
    ["junit", { outputFile: "test-results/e2e-results.xml" }],
  ],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects: [
    { name: "Desktop Chrome", use: { browserName: "chromium" } },
    { name: "Desktop Firefox", use: { browserName: "firefox" } },
    { name: "Desktop Safari", use: { browserName: "webkit" } },
    {
      name: "Mobile Chrome",
      use: {
        browserName: "chromium",
        viewport: { width: 360, height: 640 },
        isMobile: true,
      },
    },
    {
      name: "Mobile Safari",
      use: {
        browserName: "webkit",
        viewport: { width: 375, height: 667 },
        isMobile: true,
      },
    },
  ],
  webServer: {
    command: "pnpm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
};
