"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Cart, CartLine } from "@/lib/cartMutation";

// Re-export Cart and CartLine types so consumers don't need to import from cartMutation
export type { Cart, CartLine };

type CartContextType = {
  cart: Cart | null;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  loading: boolean;
  /** true while cart is being re-fetched from Shopify on mount */
  hydrating: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

// ── API helpers ────────────────────────────────────────────────────────────────
// These call /api/cart (a Next.js Route Handler) so that lib/index.ts and its
// top-level Shopify credential checks never enter the client bundle.

async function apiCart<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Cart API error");
  }
  return res.json() as Promise<T>;
}

// ── Cart validation ────────────────────────────────────────────────────────────

/** Returns true if a cart looks valid (has lines with real prices and quantities) */
function isValidCart(c: Cart): boolean {
  if (!c.lines?.edges?.length) return true; // empty cart is still valid
  return c.lines.edges.every(({ node }) => {
    if (node.quantity <= 0) return false; // Shopify shouldn't return qty 0, but guard anyway
    const amount = parseFloat(node.merchandise?.price?.amount ?? "");
    return !isNaN(amount) && amount > 0; // price must be present and positive
  });
}

function clearStoredCart() {
  localStorage.removeItem("cartId");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(true);

  // ── Hydrate cart from localStorage on mount ──────────────────────────────
  useEffect(() => {
    const cartId = localStorage.getItem("cartId");
    if (!cartId) {
      setHydrating(false);
      return;
    }

    apiCart<Cart | null>({ action: "get", cartId })
      .then((c) => {
        if (!c) {
          // Cart expired / not found — clear stale ID
          clearStoredCart();
          return;
        }
        if (!isValidCart(c)) {
          // Cart data looks corrupted (e.g. completed checkout returned as 0-price)
          clearStoredCart();
          return;
        }
        setCart(c);
      })
      .catch(() => clearStoredCart())
      .finally(() => setHydrating(false));
  }, []);

  // ── Add item ──────────────────────────────────────────────────────────────
  const addItem = useCallback(async (merchandiseId: string, quantity = 1) => {
    setLoading(true);
    try {
      const cartId = localStorage.getItem("cartId");
      let updated: Cart;

      if (cartId) {
        try {
          updated = await apiCart<Cart>({
            action: "add",
            cartId,
            lines: [{ merchandiseId, quantity }],
          });
        } catch {
          // Cart expired — create a fresh one
          clearStoredCart();
          updated = await apiCart<Cart>({
            action: "create",
            lines: [{ merchandiseId, quantity }],
          });
          localStorage.setItem("cartId", updated.id);
        }
      } else {
        updated = await apiCart<Cart>({
          action: "create",
          lines: [{ merchandiseId, quantity }],
        });
        localStorage.setItem("cartId", updated.id);
      }

      setCart(updated);
      setCartOpen(true);
    } catch (err) {
      console.error("[Cart] addItem error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Remove item implementation ────────────────────────────────────────────
  const removeItemImpl = useCallback(async (cartId: string, lineId: string) => {
    setLoading(true);
    try {
      const updated = await apiCart<Cart>({
        action: "remove",
        cartId,
        lineIds: [lineId],
      });
      setCart(updated);
    } catch (err) {
      console.error("[Cart] removeItem error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Update quantity ───────────────────────────────────────────────────────
  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    const cartId = localStorage.getItem("cartId");
    if (!cartId) return;

    // If quantity drops to 0, remove the line entirely
    if (quantity <= 0) {
      return removeItemImpl(cartId, lineId);
    }

    setLoading(true);
    try {
      const updated = await apiCart<Cart>({
        action: "update",
        cartId,
        lines: [{ id: lineId, quantity }],
      });
      setCart(updated);
    } catch (err) {
      console.error("[Cart] updateItem error:", err);
    } finally {
      setLoading(false);
    }
  }, [removeItemImpl]);

  // ── Remove item ───────────────────────────────────────────────────────────
  const removeItem = useCallback(async (lineId: string) => {
    const cartId = localStorage.getItem("cartId");
    if (!cartId) return;
    await removeItemImpl(cartId, lineId);
  }, [removeItemImpl]);

  return (
    <CartContext.Provider
      value={{ cart, cartOpen, setCartOpen, addItem, updateItem, removeItem, loading, hydrating }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    // Return a no-op during SSR before CartProvider hydrates
    return {
      cart: null,
      cartOpen: false,
      setCartOpen: () => {},
      addItem: async () => {},
      updateItem: async () => {},
      removeItem: async () => {},
      loading: false,
      hydrating: true,
    } satisfies CartContextType;
  }
  return ctx;
}
