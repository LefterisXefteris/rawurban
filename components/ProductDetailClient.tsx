"use client";

import { useState, useCallback } from "react";
import { colorForValue, ProductActions } from "./ProductActions";
import { ProductGallery } from "./ProductGallery";

type GalleryImage = {
  url: string;
  altText: string | null;
};

type Variant = {
  id: string;
  title: string;
  quantityAvailable: number;
  selectedOptions: { name: string; value: string }[];
  image: { url: string; altText: string | null } | null;
  price: { amount: string; currencyCode: string };
};

type Option = { name: string; values: string[] };

export function ProductDetailClient({
  images,
  title,
  variants,
  options,
}: {
  images: GalleryImage[];
  title: string;
  variants: Variant[];
  options?: Option[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const colorOption = options?.find((option) =>
    ["color", "colour"].includes(option.name.toLowerCase())
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    colorOption?.values[0] ?? null
  );

  const handleColorChange = useCallback(
    (color: string) => {
      setSelectedColor(color);

      // Find a variant matching this color to get its image
      const variant = variants.find((v) =>
        v.selectedOptions?.some(
          (o) =>
            ["color", "colour"].includes(o.name.toLowerCase()) &&
            o.value === color
        )
      );

      if (variant?.image?.url) {
        // Compare base paths without query params (Shopify CDN may add different params)
        const variantBase = variant.image.url.split("?")[0];
        const matchIdx = images.findIndex(
          (img) => img.url.split("?")[0] === variantBase
        );
        if (matchIdx !== -1) {
          setActiveIndex(matchIdx);
        }
      }
    },
    [variants, images]
  );

  const colorChoices = colorOption?.values.map((value) => {
    const variant = variants.find((v) =>
      v.selectedOptions?.some(
        (option) =>
          ["color", "colour"].includes(option.name.toLowerCase()) &&
          option.value === value
      )
    );

    return {
      value,
      hex: colorForValue(value),
      image: variant?.image,
      available: variants.some((v) => {
        const matchesColor = v.selectedOptions?.some(
          (option) =>
            ["color", "colour"].includes(option.name.toLowerCase()) &&
            option.value === value
        );
        return matchesColor && v.quantityAvailable > 0;
      }),
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
      {/* Gallery */}
      <ProductGallery
        images={images}
        title={title}
        activeIndex={activeIndex}
        onIndexChange={setActiveIndex}
        colors={colorChoices}
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
      />

      {/* Info */}
      <div className="flex flex-col justify-center lg:py-8">
        <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 mb-2">
          Two Stones
        </p>
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide leading-tight mb-6">
          {title}
        </h1>
        <ProductActions
          variants={variants}
          options={options}
          selectedColor={selectedColor}
          onColorChange={handleColorChange}
          showColorSelector={!colorChoices?.length}
        />
      </div>
    </div>
  );
}
