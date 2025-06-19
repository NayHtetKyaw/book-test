import { useState, useMemo } from "react";
import { BOOKS } from "@/data/books";
import type { SearchFilters } from "@/types";

export const useBooks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});

  const filteredBooks = useMemo(() => {
    let result = BOOKS;

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.category?.toLowerCase().includes(query),
      );
    }

    // Apply filters
    if (filters.category) {
      result = result.filter((book) => book.category === filters.category);
    }

    if (filters.minPrice !== undefined) {
      result = result.filter((book) => book.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter((book) => book.price <= filters.maxPrice!);
    }

    if (filters.rating !== undefined) {
      result = result.filter((book) => (book.rating ?? 0) >= filters.rating!);
    }

    return result;
  }, [searchQuery, filters]);

  return {
    books: filteredBooks,
    allBooks: BOOKS,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    categories: Array.from(
      new Set(BOOKS.map((book) => book.category).filter(Boolean)),
    ),
  };
};
