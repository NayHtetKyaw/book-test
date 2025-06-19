import { Page, Locator, expect } from "@playwright/test";

export class BasePage {
  readonly page: Page;
  readonly header: Locator;
  readonly loginButton: Locator;
  readonly logoutButton: Locator;
  readonly cartButton: Locator;
  readonly cartCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator("header");
    this.loginButton = page.getByTestId("login-button");
    this.logoutButton = page.getByTestId("logout-button");
    this.cartButton = page.getByTestId("cart-button");
    this.cartCount = page.getByTestId("cart-count");
  }

  async goto() {
    await this.page.goto("/");
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async clickLogout() {
    await this.logoutButton.click();
  }

  async clickCart() {
    await this.cartButton.click();
  }

  async getCartCount(): Promise<number> {
    try {
      const count = await this.cartCount.textContent();
      return parseInt(count || "0");
    } catch {
      return 0; // Cart count badge not visible when empty
    }
  }

  async expectPageTitle(title: string) {
    await expect(this.page).toHaveTitle(title);
  }

  async expectLoggedIn() {
    await expect(this.logoutButton).toBeVisible();
    await expect(this.loginButton).not.toBeVisible();
  }

  async expectLoggedOut() {
    await expect(this.loginButton).toBeVisible();
    await expect(this.logoutButton).not.toBeVisible();
  }
}
