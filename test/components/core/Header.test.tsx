import { render, screen, fireEvent, waitFor } from "@/test/setup/test-utils";
import { HeaderComponent } from "@/components/core/Header";
import { mockAuthStore, mockCartStore } from "@/test/setup/test-utils";

// Mock notifications
jest.mock("@mantine/notifications", () => ({
  notifications: {
    show: jest.fn(),
  },
}));

describe("HeaderComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthStore.user = null;
    mockAuthStore.isLoading = false;
    mockCartStore.getTotalItems.mockReturnValue(0);
  });

  it("should render the header with logo and navigation", () => {
    render(<HeaderComponent />);

    expect(screen.getByText("BookWorks")).toBeInTheDocument();
    expect(screen.getByTestId("login-button")).toBeInTheDocument();
    expect(screen.getByTestId("cart-button")).toBeInTheDocument();
  });

  it("should show login button when user is not authenticated", () => {
    render(<HeaderComponent />);

    expect(screen.getByTestId("login-button")).toHaveTextContent("Login");
    expect(screen.queryByTestId("logout-button")).not.toBeInTheDocument();
  });

  it("should show logout button when user is authenticated", () => {
    mockAuthStore.user = {
      id: "1",
      email: "test@test.com",
      name: "Test User",
      isAuthenticated: true,
    };

    render(<HeaderComponent />);

    expect(screen.getByTestId("logout-button")).toHaveTextContent("Logout");
    expect(screen.queryByTestId("login-button")).not.toBeInTheDocument();
  });

  it("should display cart count badge when items are in cart", () => {
    mockCartStore.getTotalItems.mockReturnValue(3);

    render(<HeaderComponent />);

    expect(screen.getByTestId("cart-count")).toHaveTextContent("3");
  });

  it("should not display cart count badge when cart is empty", () => {
    mockCartStore.getTotalItems.mockReturnValue(0);

    render(<HeaderComponent />);

    expect(screen.queryByTestId("cart-count")).not.toBeInTheDocument();
  });

  it("should open login modal when login button is clicked", async () => {
    render(<HeaderComponent />);

    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor(() => {
      expect(screen.getByTestId("login-modal")).toBeInTheDocument();
    });
  });

  it("should call logout function when logout button is clicked", () => {
    mockAuthStore.user = {
      id: "1",
      email: "test@test.com",
      name: "Test User",
      isAuthenticated: true,
    };

    render(<HeaderComponent />);

    fireEvent.click(screen.getByTestId("logout-button"));

    expect(mockAuthStore.logout).toHaveBeenCalled();
  });

  describe("Login Form", () => {
    beforeEach(async () => {
      render(<HeaderComponent />);
      fireEvent.click(screen.getByTestId("login-button"));
      await waitFor(() => {
        expect(screen.getByTestId("login-modal")).toBeInTheDocument();
      });
    });

    it("should render login form with email and password fields", () => {
      expect(screen.getByTestId("email-input")).toBeInTheDocument();
      expect(screen.getByTestId("password-input")).toBeInTheDocument();
      expect(screen.getByTestId("login-submit")).toBeInTheDocument();
    });

    it("should update email and password fields when typed in", () => {
      const emailInput = screen.getByTestId("email-input");
      const passwordInput = screen.getByTestId("password-input");

      fireEvent.change(emailInput, { target: { value: "test@test.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      expect(emailInput).toHaveValue("test@test.com");
      expect(passwordInput).toHaveValue("password123");
    });

    it("should call login function when form is submitted", async () => {
      mockAuthStore.login.mockResolvedValue(true);

      const emailInput = screen.getByTestId("email-input");
      const passwordInput = screen.getByTestId("password-input");
      const submitButton = screen.getByTestId("login-submit");

      fireEvent.change(emailInput, { target: { value: "test@test.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      expect(mockAuthStore.login).toHaveBeenCalledWith(
        "test@test.com",
        "password123",
      );
    });

    it("should show error message when login fails", async () => {
      mockAuthStore.login.mockResolvedValue(false);

      const emailInput = screen.getByTestId("email-input");
      const passwordInput = screen.getByTestId("password-input");
      const submitButton = screen.getByTestId("login-submit");

      fireEvent.change(emailInput, { target: { value: "wrong@email.com" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId("login-error")).toBeInTheDocument();
        expect(screen.getByTestId("login-error")).toHaveTextContent(
          "Invalid email or password. Try user@bookworks.com / password123",
        );
      });
    });
  });
});
