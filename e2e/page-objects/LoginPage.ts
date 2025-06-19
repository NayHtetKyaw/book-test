import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  readonly loginModal: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.loginModal = page.getByTestId("login-modal");
    this.emailInput = page.getByTestId("email-input");
    this.passwordInput = page.getByTestId("password-input");
    this.submitButton = page.getByTestId("login-submit");
    this.errorAlert = page.getByTestId("login-error");
  }

  async openLoginModal() {
    await this.clickLogin();
    await expect(this.loginModal).toBeVisible();
  }

  async closeLoginModal() {
    await this.page.keyboard.press("Escape");
    await expect(this.loginModal).not.toBeVisible();
  }

  async fillCredentials(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submitLogin() {
    await this.submitButton.click();
  }

  async login(email: string, password: string) {
    await this.openLoginModal();
    await this.fillCredentials(email, password);
    await this.submitLogin();
  }

  async expectLoginError(message?: string) {
    await expect(this.errorAlert).toBeVisible();
    if (message) {
      await expect(this.errorAlert).toContainText(message);
    }
  }

  async expectLoginSuccess() {
    await expect(this.loginModal).not.toBeVisible();
    await this.expectLoggedIn();
  }

  async expectRequiredFieldValidation() {
    // Check HTML5 validation
    await expect(this.emailInput).toHaveAttribute("required");
    await expect(this.passwordInput).toHaveAttribute("required");
  }
}
