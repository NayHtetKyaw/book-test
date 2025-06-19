import { renderHook, act } from "@testing-library/react";
import { useCartStore } from "@/store/cartStore";
import type { Book } from "@/types";

// Mock Zustand persist
jest.mock("zustand/middleware", () => ({
  persist: (fn: any) => fn,
}));

const mockBook: Book = {
  id: 1,
  title: "Test Book",
  author: "Test Author",
  price: 19.99,
};

const mockBook2: Book = {
  id: 2,
  title: "Another Book",
  author: "Another Author",
  price: 24.99,
};

describe("cartStore", () => {
  beforeEach(() => {
    // Reset store state
    useCartStore.setState({
      items: [],
    });
  });

  it("should initialize with empty cart", () => {
    const { result } = renderHook(() => useCartStore());

    expect(result.current.items).toHaveLength(0);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it("should add item to cart", () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockBook);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({ ...mockBook, quantity: 1 });
    expect(result.current.getTotalItems()).toBe(1);
    expect(result.current.getTotalPrice()).toBe(19.99);
  });

  it("should increment quantity when adding same item", () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockBook);
      result.current.addItem(mockBook);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.getTotalItems()).toBe(2);
    expect(result.current.getTotalPrice()).toBe(39.98);
  });

  it("should add multiple different items", () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockBook);
      result.current.addItem(mockBook2);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.getTotalItems()).toBe(2);
    expect(result.current.getTotalPrice()).toBe(44.98);
  });

  it("should remove item from cart", () => {
    const { result } = renderHook(() => useCartStore());

    // Add item first
    act(() => {
      result.current.addItem(mockBook);
    });

    expect(result.current.items).toHaveLength(1);

    // Remove item
    act(() => {
      result.current.removeItem(mockBook.id);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it("should update item quantity", () => {
    const { result } = renderHook(() => useCartStore());

    // Add item first
    act(() => {
      result.current.addItem(mockBook);
    });

    // Update quantity
    act(() => {
      result.current.updateQuantity(mockBook.id, 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.getTotalItems()).toBe(5);
    expect(result.current.getTotalPrice()).toBe(99.95);
  });

  it("should remove item when quantity is set to 0", () => {
    const { result } = renderHook(() => useCartStore());

    // Add item first
    act(() => {
      result.current.addItem(mockBook);
    });

    // Set quantity to 0
    act(() => {
      result.current.updateQuantity(mockBook.id, 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it("should clear entire cart", () => {
    const { result } = renderHook(() => useCartStore());

    // Add multiple items
    act(() => {
      result.current.addItem(mockBook);
      result.current.addItem(mockBook2);
    });

    expect(result.current.items).toHaveLength(2);

    // Clear cart
    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it("should calculate total price correctly with multiple items", () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockBook); // $19.99
      result.current.addItem(mockBook); // +$19.99 = $39.98
      result.current.addItem(mockBook2); // +$24.99 = $64.97
    });

    expect(result.current.getTotalPrice()).toBe(64.97);
  });
});
