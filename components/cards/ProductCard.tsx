"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/index";
import { useCart } from "@/lib/cartContext";
import { formatPrice } from "@/lib/utils";

type State = "idle" | "loading" | "added";

export function ProductCard({
  product,
  badge,
}: {
  product: Product;
  badge?: string;
}) {
  const { addItem } = useCart();
  const [state, setState] = useState<State>("idle");

  const quickAddVariant = useMemo(() => {
    const variants = product.variants.edges.map(({ node }) => node);
    const [firstVariant] = variants;

    if (firstVariant?.availableForSale) {
      return firstVariant;
    }

    return variants.find((variant) => variant.availableForSale) ?? null;
  }, [product.variants.edges]);

  useEffect(() => {
    if (state !== "added") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setState("idle");
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [state]);

  const isSoldOut = quickAddVariant === null;
  const isDisabled = isSoldOut || state === "loading";

  const handleQuickAdd = async () => {
    if (!quickAddVariant || isDisabled) {
      return;
    }

    setState("loading");

    try {
      await addItem(quickAddVariant.id);
      setState("added");
    } catch {
      setState("idle");
    }
  };

  const ctaLabel = isSoldOut
    ? "Sold Out"
    : state === "loading"
    ? "Adding…"
    : state === "added"
    ? "Added to Bag"
    : "Quick Add";

  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
        <Link href={`/product/${product.handle}`} className="block h-full">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-zinc-200" />
          )}

          {badge ? (
            <span className="absolute top-3 left-3 z-10 bg-black px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white">
              {badge}
            </span>
          ) : null}
        </Link>

        <button
          type="button"
          disabled={isDisabled}
          onClick={handleQuickAdd}
          className={[
            "absolute bottom-0 left-0 right-0 z-10 border-t border-white/10 py-[10px] text-center text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-200 ease-out",
            state === "idle"
              ? "translate-y-0 md:translate-y-full md:group-hover:translate-y-0"
              : "translate-y-0",
            isSoldOut
              ? "bg-zinc-200 text-zinc-500"
              : state === "added"
              ? "bg-zinc-700 text-white"
              : "bg-black/90 text-white hover:bg-black",
            isDisabled ? "cursor-not-allowed" : "",
          ].join(" ")}
        >
          {ctaLabel}
        </button>
      </div>

      <Link href={`/product/${product.handle}`} className="mt-3 block">
        <h3 className="mb-1 text-[11px] font-bold uppercase tracking-wide leading-tight text-black transition-opacity group-hover:opacity-60">
          {product.title}
        </h3>
        <p className="text-[11px] font-semibold text-black">
          {formatPrice(product.priceRange.minVariantPrice.amount)}
        </p>
      </Link>
    </article>
  );
}
