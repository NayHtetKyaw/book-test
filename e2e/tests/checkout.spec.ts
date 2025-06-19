import { test } from "@playwright/test";
import { CheckoutPage } from "../page-objects/CheckoutPage";

test.describe("Checkout Process", () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();
  });

  test("should complete checkout when logged in with items in cart", async () => {
    await test.step("Login user", async () => {
      await checkoutPage.checkoutAsLoggedInUser(
        "user@bookworks.com",
        "password123",
      );
    });

    await test.step("Add items to cart", async () => {
      await checkoutPage.closeCart(); // Close cart from login
      await checkoutPage.addBookToCart(1);
      await checkoutPage.addBookToCart(2);
    });

    await test.step("Proceed to checkout", async () => {
      await checkoutPage.openCart();
      await checkoutPage.proceedToCheckout();
    });

    await test.step("Verify checkout success", async () => {
      await checkoutPage.expectCheckoutSuccess("$27.98");
    });
  });

  test("should require login when not authenticated", async () => {
    await checkoutPage.addBookToCart(1);
    await checkoutPage.checkoutAsGuest();
    await checkoutPage.expectLoginRequired();
  });

  test("should prevent checkout with empty cart", async () => {
    // Login first
    const loginPage = new (await import("../page-objects/LoginPage")).LoginPage(
      checkoutPage.page,
    );
    await loginPage.login("user@bookworks.com", "password123");
    await loginPage.expectLoginSuccess();

    await checkoutPage.openCart();
    await checkoutPage.proceedToCheckout();
    await checkoutPage.expectEmptyCartError();
  });

  test("should calculate correct total for multiple items", async () => {
    await checkoutPage.checkoutAsLoggedInUser(
      "user@bookworks.com",
      "password123",
    );

    // Close cart and add multiple books
    await checkoutPage.closeCart();
    await checkoutPage.addBookToCart(1); // $12.99
    await checkoutPage.addBookToCart(3); // $13.99
    await checkoutPage.addBookToCart(6); // $24.99
    // Total should be $51.97

    await checkoutPage.openCart();
    await checkoutPage.proceedToCheckout();
    await checkoutPage.expectCheckoutSuccess("$51.97");
  });

  test("should handle checkout with quantity greater than 1", async () => {
    await checkoutPage.checkoutAsLoggedInUser(
      "user@bookworks.com",
      "password123",
    );

    // Close cart and add same book multiple times
    await checkoutPage.closeCart();
    await checkoutPage.addBookToCart(1);
    await checkoutPage.addBookToCart(1);
    await checkoutPage.addBookToCart(1);
    // 3x $12.99 = $38.97

    await checkoutPage.openCart();
    await checkoutPage.proceedToCheckout();
    await checkoutPage.expectCheckoutSuccess("$38.97");
  });
});
