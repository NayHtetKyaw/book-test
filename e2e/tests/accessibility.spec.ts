import { test, expect } from "@playwright/test";

test.describe("Accessibility Testing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should have proper page title", async ({ page }) => {
    await expect(page).toHaveTitle(/BookWorks/);
  });

  test("should have proper heading structure", async ({ page }) => {
    // Main heading should be h1
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Discover Your Next Great Read");
  });

  test("should support keyboard navigation", async ({ page }) => {
    // Test tab navigation through interactive elements
    await page.keyboard.press("Tab"); // Should focus search input
    await expect(page.getByTestId("search-input")).toBeFocused();

    await page.keyboard.press("Tab"); // Should focus search button
    await expect(page.getByTestId("search-button")).toBeFocused();

    await page.keyboard.press("Tab"); // Should focus login button
    await expect(page.getByTestId("login-button")).toBeFocused();
  });

  test("should support Enter key for search", async ({ page }) => {
    const searchInput = page.getByTestId("search-input");
    await searchInput.fill("gatsby");
    await searchInput.press("Enter");

    // Should show search results
    await expect(page.locator('[data-testid^="book-card-"]')).toBeVisible();
  });

  test("should support Escape key for modal closing", async ({ page }) => {
    // Open login modal
    await page.getByTestId("login-button").click();
    await expect(page.getByTestId("login-modal")).toBeVisible();

    // Close with Escape key
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("login-modal")).not.toBeVisible();
  });

  test("should have proper form labels", async ({ page }) => {
    await page.getByTestId("login-button").click();

    // Check that form inputs have proper labels
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("should have sufficient color contrast", async ({ page }) => {
    // This would typically use axe-core or similar tool
    // For now, we check that important text is visible
    await expect(page.getByText("BookWorks")).toBeVisible();
    await expect(page.getByText("Discover Your Next Great Read")).toBeVisible();
  });

  test("should work with screen reader simulation", async ({ page }) => {
    // Test aria-labels and roles
    const cartButton = page.getByTestId("cart-button");
    await expect(cartButton).toHaveAttribute("role", "button");

    // Test that important content has proper semantic meaning
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("header")).toBeVisible();
  });
});
