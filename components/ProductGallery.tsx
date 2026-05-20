"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (images.length > 0 && idx >= images.length) {
      setIdx(0);
    }
  }, [images.length, idx, setIdx]);

  if (!images.length) {
    return <div className="aspect-[3/4] bg-zinc-100 md:aspect-[4/5]" />;
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
            <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 no-scrollbar md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0">
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
                      "group relative h-14 w-14 shrink-0 snap-start overflow-hidden border bg-[#f5f5f5] transition-all disabled:cursor-not-allowed disabled:opacity-40 md:h-16 md:w-16",
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
                    <span className="absolute inset-x-0 bottom-0 hidden bg-white/90 px-1 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-black opacity-0 transition-opacity group-hover:opacity-100 md:block">
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
      <div className="relative aspect-[3/4] bg-[#f5f5f5] overflow-hidden group md:aspect-[4/5]">
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
              className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/85 backdrop-blur-sm transition-opacity duration-200 hover:bg-white md:left-3 md:h-8 md:w-8 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/85 backdrop-blur-sm transition-opacity duration-200 hover:bg-white md:right-3 md:h-8 md:w-8 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight />
            </button>

            {/* Counter */}
            <span className="absolute bottom-3 right-3 z-10 bg-black/35 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white tabular-nums md:bg-transparent md:px-0 md:py-0 md:tracking-[0.2em] md:text-white/70">
              {String(idx + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
          </>
        )}
      </div>

      {/* ── Thumbnails ── */}
      {images.length > 1 && (
        <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 no-scrollbar md:mx-0 md:px-0 md:pb-0">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={[
                "relative h-16 w-[52px] shrink-0 snap-start overflow-hidden bg-[#f5f5f5] transition-all duration-200 md:h-[70px] md:w-14",
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
