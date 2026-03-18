"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  Cart,
  createCart,
  addToCart,
  updateCart,
  removeFromCart,
  getCart,
} from "@/lib/cartMutation";

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

    getCart(cartId)
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
          updated = await addToCart(cartId, [{ merchandiseId, quantity }]);
        } catch {
          // Cart expired — create a fresh one
          clearStoredCart();
          updated = await createCart([{ merchandiseId, quantity }]);
          localStorage.setItem("cartId", updated.id);
        }
      } else {
        updated = await createCart([{ merchandiseId, quantity }]);
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
      const updated = await updateCart(cartId, [{ id: lineId, quantity }]);
      setCart(updated);
    } catch (err) {
      console.error("[Cart] updateItem error:", err);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Remove item ───────────────────────────────────────────────────────────
  async function removeItemImpl(cartId: string, lineId: string) {
    setLoading(true);
    try {
      const updated = await removeFromCart(cartId, [lineId]);
      setCart(updated);
    } catch (err) {
      console.error("[Cart] removeItem error:", err);
    } finally {
      setLoading(false);
    }
  }

  const removeItem = useCallback(async (lineId: string) => {
    const cartId = localStorage.getItem("cartId");
    if (!cartId) return;
    await removeItemImpl(cartId, lineId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
