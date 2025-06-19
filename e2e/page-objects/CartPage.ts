import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  readonly cartModal: Locator;
  readonly cartTotal: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.cartModal = page.getByTestId("cart-modal");
    this.cartTotal = page.getByTestId("cart-total");
    this.checkoutButton = page.getByTestId("checkout-button");
    this.emptyCartMessage = page.getByTestId("empty-cart-message");
    this.addToCartButtons = page.locator('[data-testid^="add-to-cart-"]');
  }

  async addBookToCart(bookId: number) {
    const addButton = this.page.getByTestId(`add-to-cart-${bookId}`);
    await addButton.click();

    // Wait for notification to appear and disappear
    const notification = this.page.locator('[class*="notification"]').first();
    await expect(notification).toBeVisible();
    await expect(notification).not.toBeVisible({ timeout: 4000 });
  }

  async addFirstBookToCart() {
    await this.addToCartButtons.first().click();
    await this.page.waitForTimeout(500);
  }

  async openCart() {
    await this.clickCart();
    await expect(this.cartModal).toBeVisible();
  }

  async closeCart() {
    await this.page.keyboard.press("Escape");
    await expect(this.cartModal).not.toBeVisible();
  }

  async removeBookFromCart(bookId: number) {
    const removeButton = this.page.getByTestId(`remove-item-${bookId}`);
    await removeButton.click();
    await this.page.waitForTimeout(300);
  }

  async getCartItemsCount(): Promise<number> {
    await this.openCart();
    try {
      const cartItems = this.cartModal.locator(
        '[class*="cart-item"], div:has-text("by ")',
      );
      return await cartItems.count();
    } catch {
      return 0;
    }
  }

  async expectBookInCart(bookTitle: string) {
    await this.openCart();
    await expect(this.cartModal).toContainText(bookTitle);
  }

  async expectEmptyCart() {
    await this.openCart();
    await expect(this.emptyCartMessage).toBeVisible();
    await expect(this.emptyCartMessage).toContainText("Your cart is empty");
  }

  async expectCartTotal(expectedTotal: string) {
    await expect(this.cartTotal).toContainText(expectedTotal);
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async expectCartBadgeCount(expectedCount: number) {
    if (expectedCount > 0) {
      await expect(this.cartCount).toBeVisible();
      await expect(this.cartCount).toContainText(expectedCount.toString());
    } else {
      await expect(this.cartCount).not.toBeVisible();
    }
  }

  async increaseQuantity(bookId: number) {
    const increaseButton = this.cartModal
      .locator(`[data-testid="remove-item-${bookId}"]`)
      .locator("..")
      .locator("button")
      .filter({ hasText: "+" });
    await increaseButton.click();
  }

  async decreaseQuantity(bookId: number) {
    const decreaseButton = this.cartModal
      .locator(`[data-testid="remove-item-${bookId}"]`)
      .locator("..")
      .locator("button")
      .filter({ hasText: "-" });
    await decreaseButton.click();
  }
}
