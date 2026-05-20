"use client";

import { useState, useCallback, useMemo } from "react";
import { colorForValue, ProductActions } from "./ProductActions";
import { ProductGallery } from "./ProductGallery";

type GalleryImage = {
  url: string;
  altText: string | null;
};

type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  image: { url: string; altText: string | null } | null;
  price: { amount: string; currencyCode: string };
};

type Option = { name: string; values: string[] };

function isColorOptionName(name: string): boolean {
  return ["color", "colour"].includes(name.toLowerCase());
}

function normalizeOptionValue(value: string): string {
  return value.trim().toLowerCase();
}

function imageKey(url: string): string {
  return url.split("?")[0];
}

function uniqueImages(images: GalleryImage[]): GalleryImage[] {
  const seen = new Set<string>();

  return images.filter((image) => {
    const key = imageKey(image.url);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function variantMatchesColor(variant: Variant, color: string): boolean {
  const normalizedColor = normalizeOptionValue(color);

  return variant.selectedOptions?.some(
    (option) =>
      isColorOptionName(option.name) &&
      normalizeOptionValue(option.value) === normalizedColor
  );
}

function variantImagesForColor(variants: Variant[], color: string): GalleryImage[] {
  return uniqueImages(
    variants
      .filter((variant) => variantMatchesColor(variant, color))
      .map((variant) => variant.image)
      .filter((image): image is GalleryImage => Boolean(image?.url))
  );
}

function galleryImagesForColor({
  images,
  variants,
  color,
  allColors,
}: {
  images: GalleryImage[];
  variants: Variant[];
  color: string;
  allColors: string[];
}): GalleryImage[] {
  const variantImages = variantImagesForColor(variants, color);

  if (variantImages.length === 0) {
    return images;
  }

  if (variantImages.length > 1) {
    return variantImages;
  }

  const startKey = imageKey(variantImages[0].url);
  const startIndex = images.findIndex((image) => imageKey(image.url) === startKey);

  if (startIndex === -1) {
    return variantImages;
  }

  const otherColorMarkerKeys = new Set(
    allColors
      .filter(
        (value) => normalizeOptionValue(value) !== normalizeOptionValue(color)
      )
      .flatMap((value) => variantImagesForColor(variants, value))
      .map((image) => imageKey(image.url))
  );

  const nextColorIndex = images.findIndex(
    (image, index) =>
      index > startIndex && otherColorMarkerKeys.has(imageKey(image.url))
  );
  const endIndex = nextColorIndex === -1 ? images.length : nextColorIndex;
  const orderedColorImages = uniqueImages(images.slice(startIndex, endIndex));

  return orderedColorImages.length > 0 ? orderedColorImages : variantImages;
}

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
    isColorOptionName(option.name)
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    colorOption?.values[0] ?? null
  );
  const galleryImages = useMemo(() => {
    if (!selectedColor || !colorOption) {
      return images;
    }

    return galleryImagesForColor({
      images,
      variants,
      color: selectedColor,
      allColors: colorOption.values,
    });
  }, [colorOption, images, selectedColor, variants]);

  const handleColorChange = useCallback(
    (color: string) => {
      setSelectedColor(color);
      setActiveIndex(0);
    },
    []
  );

  const colorChoices = colorOption?.values.map((value) => {
    const variant = variants.find((v) => variantMatchesColor(v, value));

    return {
      value,
      hex: colorForValue(value),
      image: variant?.image,
      available: variants.some((v) => {
        const matchesColor = variantMatchesColor(v, value);
        return matchesColor && v.availableForSale;
      }),
    };
  });

  return (
    <div className="grid grid-cols-1 gap-7 md:gap-10 lg:grid-cols-2 lg:gap-20">
      {/* Gallery */}
      <ProductGallery
        images={galleryImages}
        title={title}
        activeIndex={activeIndex}
        onIndexChange={setActiveIndex}
        colors={colorChoices}
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
      />

      {/* Info */}
      <div className="flex flex-col justify-center lg:py-8">
        <p className="mb-2 text-[10px] uppercase tracking-[0.32em] text-zinc-400 md:tracking-[0.4em]">
          Two Stones
        </p>
        <h1 className="mb-5 text-2xl font-bold uppercase leading-tight tracking-wide md:mb-6 md:text-4xl">
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
