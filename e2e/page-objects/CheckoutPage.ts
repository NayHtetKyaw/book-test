import { Page, expect } from "@playwright/test";
import { CartPage } from "./CartPage";
import { LoginPage } from "./LoginPage";

export class CheckoutPage extends CartPage {
  private loginPage: LoginPage;

  constructor(page: Page) {
    super(page);
    this.loginPage = new LoginPage(page);
  }

  async checkoutAsGuest() {
    await this.openCart();
    await this.proceedToCheckout();
  }

  async checkoutAsLoggedInUser(email: string, password: string) {
    await this.loginPage.login(email, password);
    await this.loginPage.expectLoginSuccess();
    await this.openCart();
    await this.proceedToCheckout();
  }

  async expectCheckoutSuccess(expectedTotal?: string) {
    // Wait for success notification
    const successNotification = this.page
      .locator('[class*="notification"]')
      .filter({ hasText: "Checkout Successful!" });
    await expect(successNotification).toBeVisible();

    if (expectedTotal) {
      await expect(successNotification).toContainText(expectedTotal);
    }

    // Verify cart is cleared
    await expect(this.cartModal).not.toBeVisible();
    await this.expectCartBadgeCount(0);
  }

  async expectLoginRequired() {
    const loginNotification = this.page
      .locator('[class*="notification"]')
      .filter({ hasText: "Login Required" });
    await expect(loginNotification).toBeVisible();
  }

  async expectEmptyCartError() {
    const emptyNotification = this.page
      .locator('[class*="notification"]')
      .filter({ hasText: "Empty Cart" });
    await expect(emptyNotification).toBeVisible();
  }
}
