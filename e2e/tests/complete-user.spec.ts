import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import { SearchPage } from "../page-objects/SearchPage";
import { CartPage } from "../page-objects/CartPage";
import { CheckoutPage } from "../page-objects/CheckoutPage";

test.describe("Complete User Journey", () => {
  test("should complete full user journey from search to checkout", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const searchPage = new SearchPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await test.step("Navigate to homepage", async () => {
      await searchPage.goto();
    });

    await test.step("Search for first book", async () => {
      await searchPage.search("gatsby");
      await searchPage.expectBookInResults("The Great Gatsby");
    });

    await test.step("Add first book to cart", async () => {
      await cartPage.addBookToCart(1);
      await cartPage.expectCartBadgeCount(1);
    });

    await test.step("Search for second book", async () => {
      await searchPage.search("orwell");
      await searchPage.expectBookInResults("1984");
    });

    await test.step("Add second book to cart", async () => {
      await cartPage.addBookToCart(3);
      await cartPage.expectCartBadgeCount(2);
    });

    await test.step("Review cart contents", async () => {
      await cartPage.openCart();
      await cartPage.expectBookInCart("The Great Gatsby");
      await cartPage.expectBookInCart("1984");
      await cartPage.expectCartTotal("$26.98");
      await cartPage.closeCart();
    });

    await test.step("Login for checkout", async () => {
      await loginPage.login("user@bookworks.com", "password123");
      await loginPage.expectLoginSuccess();
    });

    await test.step("Complete checkout", async () => {
      await checkoutPage.openCart();
      await checkoutPage.proceedToCheckout();
      await checkoutPage.expectCheckoutSuccess("$26.98");
    });

    await test.step("Verify post-checkout state", async () => {
      await checkoutPage.expectCartBadgeCount(0);
    });
  });

  test("should handle guest user journey with login prompt", async ({
    page,
  }) => {
    const searchPage = new SearchPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await searchPage.goto();

    // Add items as guest
    await cartPage.addBookToCart(1);
    await cartPage.addBookToCart(2);
    await cartPage.expectCartBadgeCount(2);

    // Try to checkout without login
    await checkoutPage.checkoutAsGuest();
    await checkoutPage.expectLoginRequired();

    // Login and complete checkout
    await checkoutPage.checkoutAsLoggedInUser(
      "user@bookworks.com",
      "password123",
    );
    await checkoutPage.closeCart();
    await checkoutPage.openCart();
    await checkoutPage.proceedToCheckout();
    await checkoutPage.expectCheckoutSuccess();
  });
});
