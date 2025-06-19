import { test, expect } from "@playwright/test";
import { CartPage } from "../page-objects/CartPage";

test.describe("Shopping Cart Functionality", () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    await cartPage.goto();
  });

  test("should add single book to cart", async () => {
    await test.step("Verify cart starts empty", async () => {
      await cartPage.expectCartBadgeCount(0);
    });

    await test.step("Add book to cart", async () => {
      await cartPage.addBookToCart(1); // The Great Gatsby
    });

    await test.step("Verify cart count updated", async () => {
      await cartPage.expectCartBadgeCount(1);
    });

    await test.step("Verify book appears in cart", async () => {
      await cartPage.expectBookInCart("The Great Gatsby");
    });
  });

  test("should add multiple different books to cart", async () => {
    await cartPage.addBookToCart(1); // The Great Gatsby
    await cartPage.addBookToCart(2); // To Kill a Mockingbird
    await cartPage.addBookToCart(3); // 1984

    await cartPage.expectCartBadgeCount(3);

    await cartPage.openCart();
    const itemsCount = await cartPage.getCartItemsCount();
    expect(itemsCount).toBe(3);
  });

  test("should increment quantity when adding same book multiple times", async () => {
    // Add the same book three times
    await cartPage.addBookToCart(1);
    await cartPage.addBookToCart(1);
    await cartPage.addBookToCart(1);

    await cartPage.expectCartBadgeCount(3);

    await cartPage.openCart();
    // Should show one item with quantity 3, not three separate items
    const itemsCount = await cartPage.getCartItemsCount();
    expect(itemsCount).toBe(1);
  });

  test("should remove book from cart", async () => {
    // Add book first
    await cartPage.addBookToCart(1);
    await cartPage.expectBookInCart("The Great Gatsby");

    // Remove book
    await cartPage.removeBookFromCart(1);

    // Verify cart is empty
    await cartPage.expectEmptyCart();
    await cartPage.expectCartBadgeCount(0);
  });

  test("should display correct cart total", async () => {
    // Add books with known prices
    await cartPage.addBookToCart(1); // $12.99
    await cartPage.addBookToCart(2); // $14.99

    await cartPage.openCart();
    await cartPage.expectCartTotal("$27.98");
  });

  test("should show empty cart message when no items", async () => {
    await cartPage.expectEmptyCart();
  });

  test("should open and close cart modal", async () => {
    await cartPage.openCart();
    await cartPage.closeCart();
  });

  test("should handle rapid consecutive clicks", async () => {
    // Rapidly click add to cart multiple times
    const addButton = cartPage.page.getByTestId("add-to-cart-1");

    // Click multiple times quickly
    await addButton.click();
    await addButton.click();
    await addButton.click();

    // Should handle this gracefully
    const count = await cartPage.getCartCount();
    expect(count).toBeGreaterThan(0);
  });

  test("should persist cart state during session", async ({ page }) => {
    // Add items to cart
    await cartPage.addBookToCart(1);
    await cartPage.addBookToCart(2);

    await cartPage.expectCartBadgeCount(2);

    // Reload page
    await page.reload();
    await cartPage.waitForPageLoad();

    // Cart should maintain state (with localStorage persistence)
    await cartPage.expectCartBadgeCount(2);
    await cartPage.expectBookInCart("The Great Gatsby");
    await cartPage.expectBookInCart("To Kill a Mockingbird");
  });
});
