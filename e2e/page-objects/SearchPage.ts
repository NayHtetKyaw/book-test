import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SearchPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly booksGrid: Locator;
  readonly bookCards: Locator;
  readonly noBooksMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByTestId("search-input");
    this.searchButton = page.getByTestId("search-button");
    this.booksGrid = page.getByTestId("books-grid");
    this.bookCards = page.locator('[data-testid^="book-card-"]');
    this.noBooksMessage = page.getByTestId("no-books-message");
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await this.page.waitForTimeout(500); // Wait for search results
  }

  async searchWithEnter(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press("Enter");
    await this.page.waitForTimeout(500);
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.searchButton.click();
    await this.page.waitForTimeout(500);
  }

  async getBookCount(): Promise<number> {
    try {
      await expect(this.booksGrid).toBeVisible();
      return await this.bookCards.count();
    } catch {
      return 0;
    }
  }

  async getBookTitles(): Promise<string[]> {
    const titleElements = this.bookCards.locator('h5, [class*="title"]');
    return await titleElements.allTextContents();
  }

  async expectBookInResults(bookTitle: string) {
    const bookCard = this.bookCards.filter({ hasText: bookTitle });
    await expect(bookCard).toBeVisible();
  }

  async expectNoResults() {
    await expect(this.noBooksMessage).toBeVisible();
    await expect(this.noBooksMessage).toContainText("No books found");
  }

  async expectAllBooks() {
    await expect(this.bookCards).toHaveCount(6); // Based on our demo data
  }

  async getSearchInputValue(): Promise<string> {
    return await this.searchInput.inputValue();
  }
}
