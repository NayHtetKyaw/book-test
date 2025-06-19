import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";

test.describe("Login Functionality", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("should login with valid credentials", async () => {
    await test.step("Open login modal", async () => {
      await loginPage.openLoginModal();
    });

    await test.step("Fill login form with valid credentials", async () => {
      await loginPage.fillCredentials("user@bookworks.com", "password123");
    });

    await test.step("Submit login form", async () => {
      await loginPage.submitLogin();
    });

    await test.step("Verify successful login", async () => {
      await loginPage.expectLoginSuccess();
    });
  });

  test("should show error for invalid credentials", async () => {
    await loginPage.openLoginModal();
    await loginPage.fillCredentials("invalid@email.com", "wrongpassword");
    await loginPage.submitLogin();

    await loginPage.expectLoginError("Invalid email or password");
  });

  test("should validate required fields", async () => {
    await loginPage.openLoginModal();
    await loginPage.expectRequiredFieldValidation();
  });

  test("should close login modal with escape key", async () => {
    await loginPage.openLoginModal();
    await loginPage.closeLoginModal();
  });

  test("should logout successfully", async () => {
    // First login
    await loginPage.login("user@bookworks.com", "password123");
    await loginPage.expectLoginSuccess();

    // Then logout
    await loginPage.clickLogout();
    await loginPage.expectLoggedOut();
  });

  test("should handle SQL injection attempts safely", async () => {
    await loginPage.openLoginModal();
    await loginPage.fillCredentials("admin'; DROP TABLE users; --", "password");
    await loginPage.submitLogin();

    await loginPage.expectLoginError();
  });

  test("should show loading state during login", async () => {
    await loginPage.openLoginModal();
    await loginPage.fillCredentials("user@bookworks.com", "password123");

    // Click submit and immediately check for loading state
    const submitPromise = loginPage.submitLogin();

    // Check if submit button shows loading (you might need to adjust based on actual implementation)
    await expect(loginPage.submitButton).toBeDisabled();

    await submitPromise;
    await loginPage.expectLoginSuccess();
  });
});
