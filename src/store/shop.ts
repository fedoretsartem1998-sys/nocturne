"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SEED_PRODUCTS } from "@/lib/products";
import type { CartItem, Locale, Order, Product } from "@/lib/types";

type ShopState = {
  hydrated: boolean;
  locale: Locale;
  products: Product[];
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  adminUnlocked: boolean;
};

type ShopActions = {
  setLocale: (locale: Locale) => void;
  addToCart: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  placeOrder: (order: Omit<Order, "id" | "createdAt">) => Order;
  saveProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  resetProducts: () => void;
  setAdminUnlocked: (unlocked: boolean) => void;
};

const orderId = () => `N-${Math.floor(10000 + Math.random() * 89999)}`;

export const useShop = create<ShopState & ShopActions>()(
  persist(
    (set) => ({
      hydrated: false,
      locale: "uk",
      products: SEED_PRODUCTS,
      cart: [],
      favorites: [],
      orders: [],
      adminUnlocked: false,

      setLocale: (locale) => set({ locale }),

      addToCart: (item, qty = 1) =>
        set((state) => {
          const existing = state.cart.find((line) => line.key === item.key);
          if (existing) {
            return {
              cart: state.cart.map((line) => (line.key === item.key ? { ...line, qty: line.qty + qty } : line)),
            };
          }
          return { cart: [...state.cart, { ...item, qty }] };
        }),

      setQty: (key, qty) =>
        set((state) => ({
          cart: qty <= 0 ? state.cart.filter((line) => line.key !== key) : state.cart.map((line) => (line.key === key ? { ...line, qty } : line)),
        })),

      removeFromCart: (key) => set((state) => ({ cart: state.cart.filter((line) => line.key !== key) })),

      clearCart: () => set({ cart: [] }),

      toggleFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.includes(productId)
            ? state.favorites.filter((id) => id !== productId)
            : [...state.favorites, productId],
        })),

      placeOrder: (draft) => {
        const order: Order = { ...draft, id: orderId(), createdAt: new Date().toISOString() };
        set((state) => ({ orders: [order, ...state.orders], cart: [] }));
        return order;
      },

      saveProduct: (product) =>
        set((state) => {
          const exists = state.products.some((item) => item.id === product.id);
          return {
            products: exists
              ? state.products.map((item) => (item.id === product.id ? product : item))
              : [product, ...state.products],
          };
        }),

      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((item) => item.id !== productId),
          favorites: state.favorites.filter((id) => id !== productId),
        })),

      resetProducts: () => set({ products: SEED_PRODUCTS }),

      setAdminUnlocked: (adminUnlocked) => set({ adminUnlocked }),
    }),
    {
      name: "nocturne-shop",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({ locale, products, cart, favorites, orders }) => ({ locale, products, cart, favorites, orders }),
      onRehydrateStorage: () => () => {
        useShop.setState({ hydrated: true });
      },
    },
  ),
);
