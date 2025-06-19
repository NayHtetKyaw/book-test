import { test, expect } from "@playwright/test";
import { SearchPage } from "../page-objects/SearchPage";

test.describe("Search Functionality", () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  test("should search for books by title", async () => {
    await test.step('Search for "gatsby"', async () => {
      await searchPage.search("gatsby");
    });

    await test.step("Verify search results", async () => {
      await searchPage.expectBookInResults("The Great Gatsby");
      const bookCount = await searchPage.getBookCount();
      expect(bookCount).toBe(1);
    });
  });

  test("should search for books by author", async () => {
    await searchPage.search("Harper Lee");
    await searchPage.expectBookInResults("To Kill a Mockingbird");
  });

  test("should search with Enter key", async () => {
    await searchPage.searchWithEnter("tolkien");
    await searchPage.expectBookInResults("Lord of the Rings");
  });

  test("should handle case-insensitive search", async () => {
    await searchPage.search("GATSBY");
    await searchPage.expectBookInResults("The Great Gatsby");
  });

  test("should handle partial matches", async () => {
    await searchPage.search("great");
    await searchPage.expectBookInResults("The Great Gatsby");
  });

  test("should show no results for non-existent books", async () => {
    await searchPage.search("nonexistentbook");
    await searchPage.expectNoResults();
  });

  test("should handle special characters in search", async () => {
    await searchPage.search("@#$%^&*()");
    await searchPage.expectNoResults();
  });

  test("should clear search and show all books", async () => {
    // First search for something specific
    await searchPage.search("gatsby");
    const filteredCount = await searchPage.getBookCount();
    expect(filteredCount).toBe(1);

    // Clear search
    await searchPage.clearSearch();
    await searchPage.expectAllBooks();
  });

  test("should handle empty search", async () => {
    await searchPage.search("");
    await searchPage.expectAllBooks();
  });

  test("should persist search query in input field", async () => {
    const query = "orwell";
    await searchPage.search(query);

    const inputValue = await searchPage.getSearchInputValue();
    expect(inputValue).toBe(query);
  });

  test("should maintain search functionality on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await searchPage.search("orwell");
    await searchPage.expectBookInResults("1984");
  });
});
