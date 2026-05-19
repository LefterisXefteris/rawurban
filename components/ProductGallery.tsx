"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type GalleryImage = {
  url: string;
  altText: string | null;
};

type ColorChoice = {
  value: string;
  hex: string | null;
  image?: GalleryImage | null;
  available: boolean;
};

export function ProductGallery({
  images,
  title,
  activeIndex,
  onIndexChange,
  colors,
  selectedColor,
  onColorChange,
}: {
  images: GalleryImage[];
  title: string;
  activeIndex?: number;
  onIndexChange?: (index: number) => void;
  colors?: ColorChoice[];
  selectedColor?: string | null;
  onColorChange?: (color: string) => void;
}) {
  const [internalIdx, setInternalIdx] = useState(0);

  // Use controlled index if provided, otherwise internal
  const idx = activeIndex ?? internalIdx;
  const setIdx = onIndexChange ?? setInternalIdx;

  if (!images.length) {
    return <div className="aspect-[4/5] bg-zinc-100" />;
  }

  const go = (next: number) => {
    setIdx(next);
  };
  const direction = 1;

  const prev = () => go(idx === 0 ? images.length - 1 : idx - 1);
  const next = () => go(idx === images.length - 1 ? 0 : idx + 1);

  return (
    <div className="grid gap-3 md:grid-cols-[88px_minmax(0,1fr)]">
      {colors && colors.length > 0 && (
        <aside className="order-2 md:order-1 md:row-span-2">
          <div className="border border-zinc-200 bg-white p-2 md:sticky md:top-28">
            <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              Colour
            </p>
            <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
              {colors.map((color) => {
                const isSelected = selectedColor === color.value;

                return (
                  <button
                    key={color.value}
                    type="button"
                    title={color.value}
                    aria-label={`Select ${color.value}`}
                    aria-pressed={isSelected}
                    disabled={!color.available}
                    onClick={() => onColorChange?.(color.value)}
                    className={[
                      "group relative h-16 w-16 shrink-0 overflow-hidden border bg-[#f5f5f5] transition-all disabled:cursor-not-allowed disabled:opacity-40",
                      isSelected
                        ? "border-black ring-1 ring-black ring-offset-1"
                        : "border-zinc-200 hover:border-zinc-500",
                    ].join(" ")}
                  >
                    {color.image ? (
                      <Image
                        src={color.image.url}
                        alt={color.image.altText || color.value}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <span
                        className="absolute inset-0"
                        style={
                          color.hex
                            ? { backgroundColor: color.hex }
                            : undefined
                        }
                      />
                    )}
                    {!color.hex && !color.image && (
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase text-black">
                        {color.value.slice(0, 2)}
                      </span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 bg-white/90 px-1 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-black opacity-0 transition-opacity group-hover:opacity-100">
                      {color.value}
                    </span>
                    {!color.available && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="block h-px w-[140%] rotate-45 bg-zinc-500" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      )}

      <div className="order-1 flex flex-col gap-3 md:order-2">
      {/* ── Main image ── */}
      <div className="relative aspect-[4/5] bg-[#f5f5f5] overflow-hidden group">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={idx}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -24 }}
            transition={{ duration: 0.35, ease: [0.32, 0, 0.67, 0] }}
            className="absolute inset-0"
          >
            <Image
              src={images[idx].url}
              alt={images[idx].altText || title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={idx === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Arrows — appear on hover */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
            >
              <ChevronRight />
            </button>

            {/* Counter */}
            <span className="absolute bottom-3 right-3 z-10 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 tabular-nums">
              {String(idx + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
          </>
        )}
      </div>

      {/* ── Thumbnails ── */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={[
                "relative shrink-0 w-14 h-[70px] bg-[#f5f5f5] overflow-hidden transition-all duration-200",
                i === idx
                  ? "ring-1 ring-black ring-offset-1"
                  : "opacity-50 hover:opacity-80",
              ].join(" ")}
            >
              <Image
                src={img.url}
                alt={img.altText || `${title} ${i + 1}`}
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11L5 7l4-4" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3l4 4-4 4" />
    </svg>
  );
}
