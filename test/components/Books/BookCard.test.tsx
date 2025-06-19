import { render, screen, fireEvent } from "../../setup/test-utils";
import { BookCard } from "@/components/Books/BookCard";
import { mockCartStore } from "../../setup/test-utils";
import type { Book } from "@/types";

// Mock notifications
const mockNotificationsShow = jest.fn();
jest.mock("@mantine/notifications", () => ({
  notifications: {
    show: mockNotificationsShow,
  },
}));

const mockBook: Book = {
  id: 1,
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  price: 12.99,
  description:
    "A classic American novel about the Jazz Age and the American Dream.",
  category: "Classic Literature",
  rating: 4.2,
  stock: 15,
  isbn: "978-0-7432-7356-5",
};

describe("BookCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render book information correctly", () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
    expect(screen.getByText("by F. Scott Fitzgerald")).toBeInTheDocument();
    expect(screen.getByText("$12.99")).toBeInTheDocument();
    expect(screen.getByText("Classic Literature")).toBeInTheDocument();
    expect(screen.getByText(/A classic American novel/)).toBeInTheDocument();
    expect(screen.getByText("15 in stock")).toBeInTheDocument();
  });

  it("should render rating when provided", () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText("(4.2)")).toBeInTheDocument();
  });

  it("should show out of stock when stock is 0", () => {
    const outOfStockBook = { ...mockBook, stock: 0 };
    render(<BookCard book={outOfStockBook} />);

    expect(screen.getByText("Out of stock")).toBeInTheDocument();
  });

  it("should disable add to cart button when out of stock", () => {
    const outOfStockBook = { ...mockBook, stock: 0 };
    render(<BookCard book={outOfStockBook} />);

    const addButton = screen.getByTestId("add-to-cart-1");
    expect(addButton).toBeDisabled();
  });

  it("should call addItem when add to cart is clicked", () => {
    render(<BookCard book={mockBook} />);

    const addButton = screen.getByTestId("add-to-cart-1");
    fireEvent.click(addButton);

    expect(mockCartStore.addItem).toHaveBeenCalledWith(mockBook);
  });

  it("should show notification when item is added to cart", () => {
    render(<BookCard book={mockBook} />);

    const addButton = screen.getByTestId("add-to-cart-1");
    fireEvent.click(addButton);

    expect(mockNotificationsShow).toHaveBeenCalledWith({
      title: "Added to Cart",
      message: "The Great Gatsby has been added to your cart",
      color: "green",
    });
  });

  it("should render without optional properties", () => {
    const minimalBook: Book = {
      id: 2,
      title: "Simple Book",
      author: "Simple Author",
      price: 9.99,
    };

    render(<BookCard book={minimalBook} />);

    expect(screen.getByText("Simple Book")).toBeInTheDocument();
    expect(screen.getByText("by Simple Author")).toBeInTheDocument();
    expect(screen.getByText("$9.99")).toBeInTheDocument();
    expect(screen.queryByText(/in stock/)).not.toBeInTheDocument();
  });

  it("should have correct test id", () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByTestId("book-card-1")).toBeInTheDocument();
  });
});
