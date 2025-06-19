import { test, expect } from "@playwright/test";
import { SearchPage } from "../page-objects/SearchPage";
import { CartPage } from "../page-objects/CartPage";

test.describe("Responsive Design Testing", () => {
  test("should work on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const searchPage = new SearchPage(page);
    const cartPage = new CartPage(page);

    await searchPage.goto();

    // Test search functionality on mobile
    await searchPage.search("gatsby");
    await searchPage.expectBookInResults("The Great Gatsby");

    // Test cart functionality on mobile
    await cartPage.addBookToCart(1);
    await cartPage.expectCartBadgeCount(1);

    // Test modal on mobile
    await cartPage.openCart();
    await cartPage.expectBookInCart("The Great Gatsby");
  });

  test("should work on tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const searchPage = new SearchPage(page);
    await searchPage.goto();

    // Test grid layout on tablet
    const bookCount = await searchPage.getBookCount();
    expect(bookCount).toBe(6);

    // Test that books are displayed in appropriate grid
    await expect(searchPage.booksGrid).toBeVisible();
  });

  test("should work on desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    const searchPage = new SearchPage(page);
    await searchPage.goto();

    // Test full functionality on desktop
    await searchPage.search("tolkien");
    await searchPage.expectBookInResults("Lord of the Rings");

    const cartPage = new CartPage(page);
    await cartPage.addBookToCart(6);
    await cartPage.expectCartBadgeCount(1);
  });

  test("should handle viewport changes gracefully", async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();

    // Start desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await searchPage.search("orwell");
    await searchPage.expectBookInResults("1984");

    // Switch to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await searchPage.expectBookInResults("1984"); // Should still show results

    // Switch back to desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await searchPage.expectBookInResults("1984"); // Should maintain state
  });
});
