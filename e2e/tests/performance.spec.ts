import { test, expect } from "@playwright/test";

test.describe("Performance Testing", () => {
  test("should load homepage within performance budget", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test("should have good Core Web Vitals", async ({ page }) => {
    await page.goto("/");

    // Measure largest contentful paint
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ["largest-contentful-paint"] });
      });
    });

    // LCP should be under 2.5 seconds
    expect(lcp).toBeLessThan(2500);
  });

  test("should handle search without performance degradation", async ({
    page,
  }) => {
    await page.goto("/");

    const searchInput = page.getByTestId("search-input");
    const searchButton = page.getByTestId("search-button");

    const startTime = Date.now();

    await searchInput.fill("gatsby");
    await searchButton.click();

    // Wait for results
    await page.waitForSelector('[data-testid^="book-card-"]');

    const searchTime = Date.now() - startTime;

    // Search should complete within 1 second
    expect(searchTime).toBeLessThan(1000);
  });
});
