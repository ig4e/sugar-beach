import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface CartItem {
  id: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (id: string, quantity?: number) => void;
  removeItem: (id: string, quantity?: number) => void;
  setItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        addItem(id, quantity = 1) {
          set((state) => {
            const item = state.items.find((item) => item.id === id);
            if (item) {
              return {
                items: state.items.map((item) =>
                  item.id === id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                ),
              };
            }
            return {
              items: [...state.items, { id, quantity: quantity }],
            };
          });
        },
        setItemQuantity(id, quantity) {
          set((state) => {
            const item = state.items.find((item) => item.id === id);
            if (item) {
              return {
                items: state.items.map((item) =>
                  item.id === id ? { ...item, quantity: quantity } : item
                ),
              };
            }
            return {
              items: [...state.items, { id, quantity: quantity }],
            };
          });
        },
        clearCart() {
          set((state) => ({ ...state, items: [] }));
        },
        removeItem(id, quantity = 1) {
          set((state) => {
            const item = state.items.find((item) => item.id === id);
            if (!item) return state;
            const itemQuantity = item.quantity;

            if (itemQuantity - quantity > 1) {
              return {
                items: state.items.map((item) =>
                  item.id === id
                    ? { ...item, quantity: item.quantity - quantity }
                    : item
                ),
              };
            } else {
              return {
                items: state.items.filter((item) => item.id !== id),
              };
            }
          });
        },
      }),
      { name: "cart" }
    )
  )
);
