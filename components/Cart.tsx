'use client';

import Image from 'next/image';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCart } from '@/lib/cartContext';
import { cn } from '@/lib/utils';

// ─── helpers ────────────────────────────────────────────────────────────────

/** Safely parse a Shopify MoneyV2 amount string → number */
function parsePrice(amount: string | undefined | null): number {
  const n = parseFloat(amount ?? '0');
  return isNaN(n) ? 0 : n;
}

/** Format as GBP, e.g. 55 → "£55.00" */
function gbp(n: number): string {
  return `£${n.toFixed(2)}`;
}

// ─── component ──────────────────────────────────────────────────────────────

export function Cart({ isDark = true }: { isDark?: boolean }) {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateItem,
    removeItem,
    loading,
    hydrating,
  } = useCart();

  const totalItems =
    cart?.lines.edges.reduce((sum, { node }) => sum + node.quantity, 0) ?? 0;

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      {/* ── Bag icon in navbar ── */}
      <SheetTrigger asChild>
        <button
          className="relative p-2 hover:opacity-60 transition-opacity"
          aria-label="Open cart"
        >
          {/* Icon inherits currentColor from Navbar wrapper */}
          <ShoppingBag className="h-[18px] w-[18px]" />
          {totalItems > 0 && (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center text-[9px] font-black rounded-full leading-none transition-colors duration-300",
                isDark
                  ? "bg-white text-black"   // white icons → dark badge for contrast
                  : "bg-black text-white"   // dark icons → light badge for contrast
              )}
            >
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>

      {/* ── Drawer ── */}
      <SheetContent className="flex flex-col h-full bg-white sm:max-w-[400px] p-0">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-7 pb-5 border-b border-zinc-100 shrink-0">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-black">
              Your Bag
            </p>
            {totalItems > 0 && (
              <p className="text-[10px] text-zinc-400 mt-0.5">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-black transition-colors"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Hydration skeleton ── */}
        {hydrating ? (
          <div className="flex-1 px-6 py-6 space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-[80px] h-[104px] bg-zinc-100 shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 bg-zinc-100 rounded w-3/4" />
                  <div className="h-2 bg-zinc-100 rounded w-1/2" />
                  <div className="h-2 bg-zinc-100 rounded w-1/4 mt-4" />
                </div>
              </div>
            ))}
          </div>

        ) : !cart || cart.lines.edges.length === 0 ? (

          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6 pb-16">
            <ShoppingBag className="h-8 w-8 text-zinc-200" strokeWidth={1.5} />
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
              Your bag is empty
            </p>
            <button
              onClick={() => setCartOpen(false)}
              className="mt-1 text-[10px] uppercase tracking-[0.18em] underline underline-offset-4 text-zinc-400 hover:text-black transition-colors"
            >
              Continue Shopping
            </button>
          </div>

        ) : (
          <>
            {/* ── Line items ── */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 divide-y divide-zinc-100">
              {cart.lines.edges.map(({ node }) => {
                const productTitle =
                  node.merchandise.product?.title ?? node.merchandise.title ?? 'Product';
                const variantLabel =
                  node.merchandise.title !== 'Default Title'
                    ? node.merchandise.title
                    : null;

                const unitPrice = parsePrice(node.merchandise.price?.amount);
                const lineTotal = unitPrice * node.quantity;

                return (
                  <div key={node.id} className="py-5 flex gap-4">

                    {/* Thumbnail */}
                    <div className="relative w-[80px] h-[104px] shrink-0 bg-zinc-50 overflow-hidden">
                      {node.merchandise.image?.url ? (
                        <Image
                          src={node.merchandise.image.url}
                          alt={node.merchandise.image.altText ?? productTitle}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-100" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col flex-1 min-w-0">

                      {/* Name + price */}
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] leading-snug line-clamp-2 text-black">
                          {productTitle}
                        </h3>
                        {/* Always show unit price — line total only when qty > 1 */}
                        <div className="text-right shrink-0">
                          {node.quantity > 1 ? (
                            <>
                              <p className="text-[12px] font-semibold tabular-nums text-black">
                                {gbp(lineTotal)}
                              </p>
                              <p className="text-[10px] text-zinc-400 tabular-nums mt-0.5">
                                {gbp(unitPrice)} each
                              </p>
                            </>
                          ) : (
                            <p className="text-[12px] font-semibold tabular-nums text-black">
                              {gbp(unitPrice)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Variant label */}
                      {variantLabel && (
                        <p className="mt-1 text-[10px] text-zinc-400 uppercase tracking-[0.1em]">
                          {variantLabel}
                        </p>
                      )}

                      {/* Out-of-stock warning */}
                      {node.quantity === 0 && (
                        <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-red-400">
                          Out of stock — remove from bag
                        </p>
                      )}

                      {/* Qty stepper + remove */}
                      <div className="flex items-center justify-between mt-auto pt-4">
                        <div className="flex items-center h-7 border border-zinc-200">
                          {/* At qty ≤ 1 the − becomes a trash that removes the item */}
                          <button
                            onClick={() =>
                              node.quantity <= 1
                                ? removeItem(node.id)
                                : updateItem(node.id, node.quantity - 1)
                            }
                            disabled={loading}
                            aria-label={node.quantity <= 1 ? 'Remove item' : 'Decrease quantity'}
                            className="w-7 h-full flex items-center justify-center text-zinc-500 hover:bg-zinc-50 disabled:opacity-30 transition-colors border-r border-zinc-200"
                          >
                            {node.quantity <= 1
                              ? <Trash2 className="h-2.5 w-2.5" />
                              : <Minus className="h-2.5 w-2.5" />
                            }
                          </button>
                          <span className="w-8 text-center text-[11px] font-semibold tabular-nums text-black select-none">
                            {node.quantity}
                          </span>
                          <button
                            onClick={() => updateItem(node.id, node.quantity + 1)}
                            // Disable + for OOS items (qty=0 means Shopify couldn't fulfil)
                            disabled={loading || node.quantity === 0}
                            aria-label="Increase quantity"
                            className="w-7 h-full flex items-center justify-center text-zinc-500 hover:bg-zinc-50 disabled:opacity-30 transition-colors border-l border-zinc-200"
                          >
                            <Plus className="h-2.5 w-2.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(node.id)}
                          disabled={loading}
                          aria-label="Remove item"
                          className="p-1 text-zinc-300 hover:text-red-400 disabled:opacity-30 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Summary + checkout ── */}
            <div className="shrink-0 px-6 pt-5 pb-8 border-t border-zinc-100 bg-white">

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                    Subtotal
                  </span>
                  <span className="text-[12px] font-semibold tabular-nums text-black">
                    {gbp(parsePrice(cart.cost.subtotalAmount?.amount))}
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                    Shipping
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Calculated at checkout
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-zinc-100">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-black">
                    Total
                  </span>
                  <span className="text-[14px] font-bold tabular-nums text-black">
                    {gbp(parsePrice(cart.cost.totalAmount?.amount))}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <a
                href={cart.checkoutUrl}
                className="block w-full bg-black text-white text-[11px] font-bold uppercase tracking-[0.28em] text-center py-[14px] hover:bg-zinc-800 active:bg-zinc-900 transition-colors"
              >
                Proceed to Checkout
              </a>

              <p className="mt-4 text-center text-[9px] text-zinc-400 uppercase tracking-[0.18em]">
                Secure checkout &nbsp;·&nbsp; UK delivery only
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
