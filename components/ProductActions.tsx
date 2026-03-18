"use client";

import { useState } from "react";
import { AddToCartButton } from "./addToCart";

type Variant = {
  id: string;
  title: string;
  quantityAvailable: number;
  price: { amount: string; currencyCode: string };
};

export function ProductActions({ variants }: { variants: Variant[] }) {
  const [selected, setSelected] = useState<Variant>(variants[0]);

  const unitPrice = selected
    ? `£${parseFloat(selected.price.amount).toFixed(2)}`
    : null;

  const isOOS = selected ? selected.quantityAvailable === 0 : false;

  return (
    <div className="space-y-6">
      {/* Price */}
      {unitPrice && (
        <p className="text-2xl font-bold tracking-wide">{unitPrice}</p>
      )}

      {/* Variant / Size selector */}
      {variants.length > 1 && (
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
              Size:{" "}
              <span className="font-semibold">{selected?.title}</span>
            </span>
            <button className="text-[11px] underline underline-offset-4 text-zinc-500 hover:text-black transition-colors">
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelected(v)}
                disabled={v.quantityAvailable === 0}
                className={[
                  "px-5 py-2 text-[11px] font-semibold uppercase tracking-wider border transition-colors disabled:opacity-35 disabled:cursor-not-allowed",
                  selected?.id === v.id
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-zinc-300 hover:border-black",
                ].join(" ")}
              >
                {v.title}
                {v.quantityAvailable === 0 && (
                  <span className="ml-1 text-[9px] normal-case tracking-normal opacity-60">
                    · sold out
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to Bag — disabled & labelled when OOS */}
      <AddToCartButton
        merchandiseId={selected?.id}
        disabled={isOOS}
      />

      {isOOS && (
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 -mt-2">
          This size is currently out of stock
        </p>
      )}

      {/* Trust badges */}
      <ul className="space-y-2 pt-2">
        {[
          "Free UK delivery on orders over £75",
          "Free returns on all orders",
          "Premium quality guarantee",
        ].map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500"
          >
            <span className="text-green-600 font-bold">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
