import { render, screen, fireEvent, waitFor } from "../setup/test-utils";
import { CartModal } from "@/components/Cart/CartModal";
import { mockAuthStore, mockCartStore } from "../setup/test-utils";

describe("Authentication and Checkout Integration", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockCartStore.items = [
      {
        id: 1,
        title: "Test Book",
        author: "Test Author",
        price: 19.99,
        quantity: 1,
      },
    ];
    mockCartStore.getTotalItems.mockReturnValue(1);
    mockCartStore.getTotalPrice.mockReturnValue(19.99);
  });

  it("should prevent checkout when not authenticated", () => {
    mockAuthStore.isAuthenticated.mockReturnValue(false);

    render(<CartModal opened={true} onCloseAction={mockOnClose} />);

    const checkoutButton = screen.getByTestId("checkout-button");
    fireEvent.click(checkoutButton);

    waitFor(() => {
      expect(mockAuthStore.isAuthenticated).toHaveBeenCalled();
    });
  });

  it("should allow checkout when authenticated", () => {
    mockAuthStore.isAuthenticated.mockReturnValue(true);

    render(<CartModal opened={true} onCloseAction={mockOnClose} />);

    const checkoutButton = screen.getByTestId("checkout-button");
    fireEvent.click(checkoutButton);

    waitFor(() => {
      expect(mockCartStore.clearCart).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
