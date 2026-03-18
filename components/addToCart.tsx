"use client";

import { useState } from "react";
import { useCart } from "@/lib/cartContext";

type State = "idle" | "loading" | "added";

export function AddToCartButton({
  merchandiseId,
  disabled: externallyDisabled = false,
}: {
  merchandiseId: string | undefined;
  disabled?: boolean;
}) {
  const { addItem } = useCart();
  const [state, setState] = useState<State>("idle");

  const isDisabled =
    externallyDisabled || !merchandiseId || state === "loading";

  const handleAdd = async () => {
    if (isDisabled) return;
    setState("loading");
    try {
      await addItem(merchandiseId!);
      setState("added");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("idle");
    }
  };

  const label = externallyDisabled
    ? "Out of Stock"
    : state === "loading"
    ? "Adding…"
    : state === "added"
    ? "✓ Added to Bag"
    : "Add to Bag";

  return (
    <button
      onClick={handleAdd}
      disabled={isDisabled}
      className={[
        "w-full py-4 text-[12px] font-bold uppercase tracking-[0.25em] transition-all duration-300 disabled:cursor-not-allowed",
        externallyDisabled
          ? "bg-zinc-100 text-zinc-400 disabled:opacity-100"
          : state === "added"
          ? "bg-zinc-700 text-white"
          : "bg-black text-white hover:bg-zinc-800 disabled:opacity-40",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

// Backward-compat alias
export { AddToCartButton as Button };
