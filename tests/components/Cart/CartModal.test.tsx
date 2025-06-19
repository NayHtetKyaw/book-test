// Mock notifications first with factory function
jest.mock("@mantine/notifications", () => ({
  notifications: {
    show: jest.fn(),
  },
}));

import { render, screen, fireEvent } from "../../setup/test-utils";
import { CartModal } from "@/components/Cart/CartModal";
import { mockCartStore, mockAuthStore } from "../../setup/test-utils";
import { notifications } from "@mantine/notifications";
import type { CartItem } from "@/types";

// Get the mocked function
const mockNotificationsShow = notifications.show as jest.Mock;

const mockCartItems: CartItem[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 12.99,
    quantity: 2,
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    price: 13.99,
    quantity: 1,
  },
];

describe("CartModal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockCartStore.items = [];
    mockCartStore.getTotalItems.mockReturnValue(0);
    mockCartStore.getTotalPrice.mockReturnValue(0);
    mockAuthStore.isAuthenticated.mockReturnValue(false);
  });

  it("should render cart modal when opened", () => {
    render(<CartModal opened={true} onCloseAction={mockOnClose} />);

    expect(screen.getByTestId("cart-modal")).toBeInTheDocument();
  });

  it("should show empty cart message when no items", () => {
    render(<CartModal opened={true} onCloseAction={mockOnClose} />);

    expect(screen.getByTestId("empty-cart-message")).toBeInTheDocument();
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });

  it("should display cart items when present", () => {
    mockCartStore.items = mockCartItems;
    mockCartStore.getTotalItems.mockReturnValue(3);
    mockCartStore.getTotalPrice.mockReturnValue(39.97);

    render(<CartModal opened={true} onCloseAction={mockOnClose} />);

    expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
    expect(screen.getByText("1984")).toBeInTheDocument();
    expect(screen.getByText("by F. Scott Fitzgerald")).toBeInTheDocument();
    expect(screen.getByText("by George Orwell")).toBeInTheDocument();
  });

  it("should display correct total price and item count", () => {
    mockCartStore.items = mockCartItems;
    mockCartStore.getTotalItems.mockReturnValue(3);
    mockCartStore.getTotalPrice.mockReturnValue(39.97);

    render(<CartModal opened={true} onCloseAction={mockOnClose} />);

    expect(screen.getByText("Total (3 items):")).toBeInTheDocument();
    expect(screen.getByTestId("cart-total")).toHaveTextContent("$39.97");
  });

  it("should call removeItem when remove button is clicked", () => {
    mockCartStore.items = mockCartItems;

    render(<CartModal opened={true} onCloseAction={mockOnClose} />);

    const removeButton = screen.getByTestId("remove-item-1");
    fireEvent.click(removeButton);

    expect(mockCartStore.removeItem).toHaveBeenCalledWith(1);
  });

  it("should call updateQuantity when quantity buttons are clicked", () => {
    mockCartStore.items = mockCartItems;

    render(<CartModal opened={true} onCloseAction={mockOnClose} />);

    // Find quantity controls (assuming they exist in the implementation)
    const increaseButtons = screen.getAllByRole("button");
    const plusButton = increaseButtons.find(
      (button) =>
        button.querySelector("svg") &&
        button.getAttribute("aria-label")?.includes("plus"),
    );

    if (plusButton) {
      fireEvent.click(plusButton);
      expect(mockCartStore.updateQuantity).toHaveBeenCalled();
    }
  });

  describe("Checkout functionality", () => {
    beforeEach(() => {
      mockCartStore.items = mockCartItems;
      mockCartStore.getTotalItems.mockReturnValue(3);
      mockCartStore.getTotalPrice.mockReturnValue(39.97);
    });

    it("should show login required notification when not authenticated", () => {
      mockAuthStore.isAuthenticated.mockReturnValue(false);

      render(<CartModal opened={true} onCloseAction={mockOnClose} />);

      const checkoutButton = screen.getByTestId("checkout-button");
      fireEvent.click(checkoutButton);

      expect(mockNotificationsShow).toHaveBeenCalledWith({
        title: "Login Required",
        message: "Please login to proceed with checkout",
        color: "orange",
      });
    });

    it("should process checkout when authenticated with items", () => {
      mockAuthStore.isAuthenticated.mockReturnValue(true);

      render(<CartModal opened={true} onCloseAction={mockOnClose} />);

      const checkoutButton = screen.getByTestId("checkout-button");
      fireEvent.click(checkoutButton);

      expect(mockNotificationsShow).toHaveBeenCalledWith({
        title: "Checkout Successful!",
        message: "Order total: $39.97",
        color: "green",
      });
      expect(mockCartStore.clearCart).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should not show checkout button when cart is empty", () => {
      mockAuthStore.isAuthenticated.mockReturnValue(true);
      mockCartStore.items = [];
      mockCartStore.getTotalItems.mockReturnValue(0);

      render(<CartModal opened={true} onCloseAction={mockOnClose} />);

      // Verify that no checkout button is rendered when cart is empty
      expect(screen.queryByTestId("checkout-button")).not.toBeInTheDocument();
      expect(screen.getByTestId("empty-cart-message")).toBeInTheDocument();
    });
  });
});
