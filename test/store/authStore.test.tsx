import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "@/store/authStore";

// Mock Zustand persist
jest.mock("zustand/middleware", () => ({
  persist: (fn: any) => fn,
}));

describe("authStore", () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      user: null,
      isLoading: false,
    });
  });

  it("should initialize with no user", () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated()).toBe(false);
  });

  it("should login with valid credentials", async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      const success = await result.current.login(
        "user@bookworks.com",
        "password123",
      );
      expect(success).toBe(true);
    });

    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.email).toBe("user@bookworks.com");
    expect(result.current.user?.name).toBe("John Doe");
    expect(result.current.isAuthenticated()).toBe(true);
  });

  it("should reject login with invalid credentials", async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      const success = await result.current.login(
        "wrong@email.com",
        "wrongpassword",
      );
      expect(success).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated()).toBe(false);
  });

  it("should set loading state during login", async () => {
    const { result } = renderHook(() => useAuthStore());

    // Start login
    const loginPromise = act(async () => {
      return result.current.login("user@bookworks.com", "password123");
    });

    // Check loading state immediately
    expect(result.current.isLoading).toBe(true);

    // Wait for completion
    await loginPromise;

    expect(result.current.isLoading).toBe(false);
  });

  it("should logout user", () => {
    const { result } = renderHook(() => useAuthStore());

    // First set a user
    act(() => {
      useAuthStore.setState({
        user: {
          id: "1",
          email: "test@test.com",
          name: "Test User",
          isAuthenticated: true,
        },
      });
    });

    expect(result.current.user).not.toBeNull();

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated()).toBe(false);
  });
});
