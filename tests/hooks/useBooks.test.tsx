import { renderHook, act } from "@testing-library/react";
import { useBooks } from "@/hooks/useBooks";

// Mock the books data
jest.mock("@/data/books", () => ({
  BOOKS: [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 12.99,
      category: "Classic Literature",
      rating: 4.2,
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 14.99,
      category: "Classic Literature",
      rating: 4.5,
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      price: 13.99,
      category: "Science Fiction",
      rating: 4.4,
    },
  ],
}));

describe("useBooks hook", () => {
  it("should initialize with all books", () => {
    const { result } = renderHook(() => useBooks());

    expect(result.current.books).toHaveLength(3);
    expect(result.current.allBooks).toHaveLength(3);
    expect(result.current.searchQuery).toBe("");
    expect(result.current.categories).toContain("Classic Literature");
    expect(result.current.categories).toContain("Science Fiction");
  });

  it("should filter books by search query", () => {
    const { result } = renderHook(() => useBooks());

    act(() => {
      result.current.setSearchQuery("gatsby");
    });

    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0].title).toBe("The Great Gatsby");
  });

  it("should filter books by author", () => {
    const { result } = renderHook(() => useBooks());

    act(() => {
      result.current.setSearchQuery("Harper Lee");
    });

    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0].author).toBe("Harper Lee");
  });

  it("should filter books by category", () => {
    const { result } = renderHook(() => useBooks());

    act(() => {
      result.current.setSearchQuery("Science Fiction");
    });

    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0].title).toBe("1984");
  });

  it("should handle case-insensitive search", () => {
    const { result } = renderHook(() => useBooks());

    act(() => {
      result.current.setSearchQuery("GATSBY");
    });

    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0].title).toBe("The Great Gatsby");
  });

  it("should return empty array for non-matching search", () => {
    const { result } = renderHook(() => useBooks());

    act(() => {
      result.current.setSearchQuery("nonexistentbook");
    });

    expect(result.current.books).toHaveLength(0);
  });

  it("should filter by category filter", () => {
    const { result } = renderHook(() => useBooks());

    act(() => {
      result.current.setFilters({ category: "Classic Literature" });
    });

    expect(result.current.books).toHaveLength(2);
    expect(
      result.current.books.every(
        (book) => book.category === "Classic Literature",
      ),
    ).toBe(true);
  });

  it("should filter by price range", () => {
    const { result } = renderHook(() => useBooks());

    act(() => {
      result.current.setFilters({ minPrice: 13, maxPrice: 14 });
    });

    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0].price).toBe(13.99);
  });

  it("should filter by rating", () => {
    const { result } = renderHook(() => useBooks());

    act(() => {
      result.current.setFilters({ rating: 4.4 });
    });

    expect(result.current.books).toHaveLength(2);
    expect(
      result.current.books.every((book) => (book.rating ?? 0) >= 4.4),
    ).toBe(true);
  });

  it("should combine search query and filters", () => {
    const { result } = renderHook(() => useBooks());

    act(() => {
      result.current.setSearchQuery("Literature");
      result.current.setFilters({ minPrice: 14 });
    });

    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0].title).toBe("To Kill a Mockingbird");
  });
});
