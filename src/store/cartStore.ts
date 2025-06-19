import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartState, Book } from "@/types";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (book: Book) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === book.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === book.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          set({
            items: [...items, { ...book, quantity: 1 }],
          });
        }
      },

      removeItem: (bookId: number) => {
        const { items } = get();
        set({
          items: items.filter((item) => item.id !== bookId),
        });
      },

      updateQuantity: (bookId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(bookId);
          return;
        }

        const { items } = get();
        set({
          items: items.map((item) =>
            item.id === bookId ? { ...item, quantity } : item,
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);
