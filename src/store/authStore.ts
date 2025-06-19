import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, User } from "@/types";

const DEMO_USER = {
  email: "user@bookworks.com",
  password: "password123",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (email === DEMO_USER.email && password === DEMO_USER.password) {
          const user: User = {
            id: "1",
            email,
            name: "John Doe",
            isAuthenticated: true,
          };
          set({ user, isLoading: false });
          return true;
        }

        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({ user: null });
      },

      isAuthenticated: () => {
        const { user } = get();
        return user?.isAuthenticated ?? false;
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
