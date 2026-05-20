"use client";

import { useState } from "react";
import { AddToCartButton } from "./addToCart";
import { SizeGuideModal } from "./product/SizeGuideModal";

type Option = { name: string; values: string[] };

type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: { amount: string; currencyCode: string };
};

const COLOR_MAP: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  red: "#ef4444",
  blue: "#3b82f6",
  navy: "#1e3a5f",
  green: "#22c55e",
  grey: "#9ca3af",
  gray: "#9ca3af",
  brown: "#92400e",
  beige: "#d4b896",
  pink: "#ec4899",
  purple: "#a855f7",
  yellow: "#eab308",
  orange: "#f97316",
  cream: "#f5f0e8",
  khaki: "#c3b091",
  olive: "#6b7c3a",
  camel: "#c19a6b",
  tan: "#d2b48c",
  sand: "#c2b280",
  teal: "#14b8a6",
  burgundy: "#800020",
  maroon: "#800000",
  coral: "#ff6b6b",
  mint: "#98ff98",
  lavender: "#e6e6fa",
  charcoal: "#36454f",
  stone: "#b5a49a",
};

export function colorForValue(value: string): string | null {
  const key = value.toLowerCase().trim();
  for (const [name, hex] of Object.entries(COLOR_MAP)) {
    if (key === name || key.includes(name)) return hex;
  }
  return null;
}

function isColorOption(name: string): boolean {
  return ["color", "colour"].includes(name.toLowerCase());
}

function isSizeOption(name: string): boolean {
  return name.toLowerCase() === "size";
}

export function ProductActions({
  variants,
  options,
  selectedColor,
  onColorChange,
  showColorSelector = true,
}: {
  variants: Variant[];
  options?: Option[];
  selectedColor?: string | null;
  onColorChange?: (color: string) => void;
  showColorSelector?: boolean;
}) {
  const sizeOption = options?.find((o) => isSizeOption(o.name));
  const colorOption = options?.find((o) => isColorOption(o.name));

  const [internalColor, setInternalColor] = useState<string | null>(
    colorOption?.values[0] ?? null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizeOption?.values[0] ?? null
  );
  const activeColor = selectedColor ?? internalColor;

  function selectColor(color: string) {
    setInternalColor(color);
    onColorChange?.(color);
  }

  // Find matching variant based on selected options
  const selectedVariant = variants.find((v) => {
    if (!v.selectedOptions?.length) return false;
      const colorMatch = colorOption
        ? v.selectedOptions.some(
          (o) => isColorOption(o.name) && o.value === activeColor
        )
      : true;
    const sizeMatch = sizeOption
      ? v.selectedOptions.some(
          (o) => isSizeOption(o.name) && o.value === selectedSize
        )
      : true;
    return colorMatch && sizeMatch;
  }) ?? variants[0];

  // For a given size, is it available in the selected color?
  function isSizeAvailable(size: string): boolean {
    return variants.some((v) => {
      const sizeMatches = v.selectedOptions?.some(
        (o) => isSizeOption(o.name) && o.value === size
      );
      const colorMatches = colorOption
          ? v.selectedOptions?.some(
            (o) => isColorOption(o.name) && o.value === activeColor
          )
        : true;
      return sizeMatches && colorMatches && v.availableForSale;
    });
  }

  // For a given color, is it available in the selected size?
  function isColorAvailable(color: string): boolean {
    return variants.some((v) => {
      const colorMatches = v.selectedOptions?.some(
        (o) => isColorOption(o.name) && o.value === color
      );
      const sizeMatches = sizeOption
        ? v.selectedOptions?.some(
            (o) => isSizeOption(o.name) && o.value === selectedSize
          )
        : true;
      return colorMatches && sizeMatches && v.availableForSale;
    });
  }

  const unitPrice = selectedVariant
    ? `£${parseFloat(selectedVariant.price.amount).toFixed(2)}`
    : null;

  const isOOS = selectedVariant ? !selectedVariant.availableForSale : false;

  // Fallback: single variant, no options — just show price + add to cart
  const hasOptions = (sizeOption?.values.length ?? 0) > 0 || (colorOption?.values.length ?? 0) > 0;
  const singleVariantNoOptions = !hasOptions && variants.length === 1;

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Price */}
      {unitPrice && (
        <p className="text-xl font-bold tracking-wide md:text-2xl">{unitPrice}</p>
      )}

      {/* Color selector */}
      {showColorSelector && colorOption && colorOption.values.length > 0 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
            Colour:{" "}
            <span className="font-semibold">{activeColor}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colorOption.values.map((val) => {
              const hex = colorForValue(val);
              const available = isColorAvailable(val);
              const isSelected = activeColor === val;

              return (
                <button
                  key={val}
                  title={val}
                  onClick={() => selectColor(val)}
                  disabled={!available}
                  className={[
                    "relative h-11 w-11 rounded-full border-2 transition-all disabled:cursor-not-allowed disabled:opacity-40 md:h-9 md:w-9",
                    isSelected
                      ? "border-black scale-110 shadow-md"
                      : "border-transparent hover:border-zinc-400",
                  ].join(" ")}
                  style={hex ? { backgroundColor: hex } : undefined}
                >
                  {/* No hex match — show text label */}
                  {!hex && (
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold uppercase text-black">
                      {val.slice(0, 2)}
                    </span>
                  )}
                  {/* Strikethrough if unavailable */}
                  {!available && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="block w-[130%] h-px bg-zinc-400 rotate-45 origin-center" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size selector */}
      {sizeOption && sizeOption.values.length > 0 && (
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
              Size:{" "}
              <span className="font-semibold">{selectedSize}</span>
            </span>
            <SizeGuideModal />
          </div>
          <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
            {sizeOption.values.map((val) => {
              const available = isSizeAvailable(val);
              const isSelected = selectedSize === val;
              return (
                <button
                  key={val}
                  onClick={() => setSelectedSize(val)}
                  disabled={!available}
                  className={[
                    "min-h-11 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider border transition-colors disabled:cursor-not-allowed disabled:opacity-35 sm:px-5 sm:min-h-0",
                    isSelected
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-zinc-300 hover:border-black",
                  ].join(" ")}
                >
                  {val}
                  {!available && (
                    <span className="ml-1 text-[9px] normal-case tracking-normal opacity-60">
                      · sold out
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Flat variant list (no structured options, e.g. "Black / M") */}
      {!hasOptions && variants.length > 1 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
            Option:{" "}
            <span className="font-semibold">{selectedVariant?.title}</span>
          </p>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedSize(v.title);
                }}
                disabled={!v.availableForSale}
                className={[
                  "min-h-11 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider border transition-colors disabled:cursor-not-allowed disabled:opacity-35 sm:px-5 sm:min-h-0",
                  selectedVariant?.id === v.id
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-zinc-300 hover:border-black",
                ].join(" ")}
              >
                {v.title}
                {!v.availableForSale && (
                  <span className="ml-1 text-[9px] normal-case tracking-normal opacity-60">
                    · sold out
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to Bag */}
      <AddToCartButton
        merchandiseId={selectedVariant?.id ?? (singleVariantNoOptions ? variants[0].id : undefined)}
        disabled={isOOS}
      />

      {isOOS && (
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 -mt-2">
          This option is currently out of stock
        </p>
      )}

      {/* Trust badges */}
      <ul className="space-y-2 pt-1 md:pt-2">
        {[
          "Free UK delivery on orders over £75",
          "Free returns on all orders",
          "Premium quality guarantee",
        ].map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-[10px] uppercase leading-relaxed tracking-wider text-zinc-500 md:items-center md:text-[11px]"
          >
            <span className="text-green-600 font-bold">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
