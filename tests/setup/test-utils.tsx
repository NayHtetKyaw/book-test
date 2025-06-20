import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { CartItem } from "@/types";

// Mock Zustand stores
interface MockUser {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
}

export const mockAuthStore: {
  user: MockUser | null;
  isLoading: boolean;
  login: jest.Mock;
  logout: jest.Mock;
  isAuthenticated: jest.Mock;
} = {
  user: null,
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: jest.fn(() => false),
};

export const mockCartStore = {
  items: [] as CartItem[],
  addItem: jest.fn(),
  removeItem: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  getTotalItems: jest.fn(() => 0),
  getTotalPrice: jest.fn(() => 0),
};

// Setup store mocks
jest.mock("@/store/authStore", () => ({
  useAuthStore: () => mockAuthStore,
}));

jest.mock("@/store/cartStore", () => ({
  useCartStore: () => mockCartStore,
}));

// Custom render function with MantineProvider
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <MantineProvider>{children}</MantineProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
