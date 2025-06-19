import { render, screen, fireEvent, waitFor } from "@/test/setup/test-utils";
import { SearchBar } from "@/components/Search/SearchBar";
import { BookGrid } from "@/components/Books/BookGrid";
import { useBooks } from "@/hooks/useBooks";
import { mockCartStore } from "../setup/test-utils";
import { Book } from "@/types";

// Mock the useBooks hook
const mockUseBooks = {
  books: [] as Book[],
  allBooks: [] as Book[],
  searchQuery: "",
  setSearchQuery: jest.fn(),
  filters: {},
  setFilters: jest.fn(),
  categories: [],
};

jest.mock("@/hooks/useBooks", () => ({
  useBooks: () => mockUseBooks,
}));

// Integration test component
function SearchAndCartIntegration() {
  const { books, setSearchQuery } = useBooks();

  return (
    <div>
      <SearchBar onSearchAction={setSearchQuery} />
      <BookGrid books={books} />
    </div>
  );
}

describe("Search and Cart Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBooks.books = [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 12.99,
      },
    ];
  });

  it("should integrate search with book display", () => {
    render(<SearchAndCartIntegration />);

    const searchInput = screen.getByTestId("search-input");
    const searchButton = screen.getByTestId("search-button");

    fireEvent.change(searchInput, { target: { value: "gatsby" } });
    fireEvent.click(searchButton);

    waitFor(() => {
      expect(mockUseBooks.setSearchQuery).toHaveBeenCalledWith("gatsby");
    });
  });

  it("should display books based on search results", () => {
    render(<SearchAndCartIntegration />);

    waitFor(() => {
      expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
    });
  });

  it("should add book to cart from search results", () => {
    render(<SearchAndCartIntegration />);

    const addButton = screen.getByTestId("add-to-cart-1");
    fireEvent.click(addButton);

    waitFor(() => {
      expect(mockCartStore.addItem).toHaveBeenCalledWith(mockUseBooks.books[0]);
    });
  });
});
