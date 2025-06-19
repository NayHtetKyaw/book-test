import { render, screen } from "../../setup/test-utils";
import { BookGrid } from "@/components/Books/BookGrid";
import type { Book } from "@/types";

const mockBooks: Book[] = [
  {
    id: 1,
    title: "Book One",
    author: "Author One",
    price: 10.99,
  },
  {
    id: 2,
    title: "Book Two",
    author: "Author Two",
    price: 15.99,
  },
];

describe("BookGrid", () => {
  it("should render books in grid layout", () => {
    render(<BookGrid books={mockBooks} />);

    expect(screen.getByTestId("books-grid")).toBeInTheDocument();
    expect(screen.getByText("Book One")).toBeInTheDocument();
    expect(screen.getByText("Book Two")).toBeInTheDocument();
  });

  it("should show loading message when loading", () => {
    render(<BookGrid books={[]} loading={true} />);

    expect(screen.getByText("Loading books...")).toBeInTheDocument();
    expect(screen.queryByTestId("books-grid")).not.toBeInTheDocument();
  });

  it("should show no books message when empty and not loading", () => {
    render(<BookGrid books={[]} loading={false} />);

    expect(screen.getByTestId("no-books-message")).toBeInTheDocument();
    expect(
      screen.getByText("No books found. Try adjusting your search or filters."),
    ).toBeInTheDocument();
  });

  it("should render correct number of book cards", () => {
    render(<BookGrid books={mockBooks} />);

    expect(screen.getByTestId("book-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("book-card-2")).toBeInTheDocument();
  });
});
