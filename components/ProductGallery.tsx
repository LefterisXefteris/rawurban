"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type GalleryImage = {
  url: string;
  altText: string | null;
};

export function ProductGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!images.length) {
    return <div className="aspect-[4/5] bg-zinc-100" />;
  }

  const go = (next: number) => {
    setDirection(next > idx ? 1 : -1);
    setIdx(next);
  };

  const prev = () => go(idx === 0 ? images.length - 1 : idx - 1);
  const next = () => go(idx === images.length - 1 ? 0 : idx + 1);

  return (
    <div className="flex flex-col gap-3">
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
