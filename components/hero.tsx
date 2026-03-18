"use client";

import { useState, useEffect } from "react";
import { LazyMotion, domAnimation, m, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type HeroProduct = {
  id: string;
  title: string;
  handle: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  featuredImage: { url: string; altText: string | null } | null;
};

export function Hero({ products = [] }: { products?: HeroProduct[] }) {
  const [idx, setIdx] = useState(0);
  const { scrollY } = useScroll();
  const contentOpacity = useTransform(scrollY, [0, 380], [1, 0]);

  // Cycle through products every 5 s
  useEffect(() => {
    if (products.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % products.length), 5000);
    return () => clearInterval(t);
  }, [products.length]);

  const current = products[idx];
  const price = current
    ? `$${parseFloat(current.priceRange.minVariantPrice.amount).toFixed(2)}`
    : null;

  return (
    <LazyMotion features={domAnimation}>
    <div className="relative h-screen w-full flex overflow-hidden bg-[#0a0a0a]">
      {/* ═══════════════════════════════════════
          RIGHT PANEL — cycling product image
      ═══════════════════════════════════════ */}
      <div className="absolute inset-0 lg:relative lg:order-2 lg:w-[58%] lg:shrink-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {current?.featuredImage ? (
            <m.div
              key={idx}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1.12 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 1.0, ease: "easeInOut" },
                scale: { duration: 9, ease: "linear" },
              }}
              className="absolute inset-0"
            >
              <Image
                src={current.featuredImage.url}
                alt={current.featuredImage.altText || current.title}
                fill
                className="object-cover object-center"
                priority={idx === 0}
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </m.div>
          ) : (
            <div className="absolute inset-0 bg-zinc-900" />
          )}
        </AnimatePresence>

        {/* Mobile dark overlay; desktop light vignette at left edge */}
        <div className="absolute inset-0 bg-black/60 lg:bg-gradient-to-r lg:from-black/30 lg:via-transparent lg:to-transparent" />
        {/* Bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* ── Product label ── */}
        <AnimatePresence mode="wait">
          <m.div
            key={`lbl-${idx}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-10 left-8 z-20 hidden lg:block"
          >
            <p className="text-white/40 text-[9px] uppercase tracking-[0.35em] mb-1">
              {idx + 1} / {products.length}
            </p>
            <p className="text-white/80 text-[12px] font-medium uppercase tracking-[0.18em]">
              {current?.title}
            </p>
            {price && (
              <p className="text-white/50 text-[11px] mt-0.5">{price}</p>
            )}
          </m.div>
        </AnimatePresence>

        {/* ── Dot / pill indicators ── */}
        {products.length > 1 && (
          <div className="absolute bottom-10 right-8 flex gap-2 z-20 hidden lg:flex">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={[
                  "transition-all duration-400",
                  i === idx
                    ? "w-6 h-[3px] bg-white"
                    : "w-[3px] h-[3px] rounded-full bg-white/35 hover:bg-white/60",
                ].join(" ")}
                aria-label={`Product ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════
          LEFT PANEL — brand text (white on desktop, transparent on mobile)
      ═══════════════════════════════════════ */}
      <m.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 order-1 w-full lg:w-[42%] lg:shrink-0 lg:bg-white flex flex-col justify-end lg:justify-center px-8 md:px-14 lg:px-16 pb-28 lg:pb-0 pt-36 lg:pt-0"
      >
        {/* text is white on mobile (over dark overlay), black on desktop (on white bg) */}
        <div className="text-white lg:text-black">
          {/* Eyebrow */}
          <m.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-[10px] uppercase tracking-[0.55em] opacity-50 mb-5"
          >
            New Season — 2026
          </m.p>

          {/* Brand name — Cormorant Garamond italic */}
          <m.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif italic text-[15vw] md:text-[11vw] lg:text-[7.5vw] leading-[0.88] mb-7"
          >
            Two
            <br />
            Stones
          </m.h1>

          {/* Hairline rule */}
          <m.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
            className="origin-left w-12 h-px bg-current opacity-30 mb-7"
          />

          {/* Tagline */}
          <m.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5 }}
            className="text-[12px] font-light tracking-[0.22em] uppercase opacity-60 mb-10 max-w-[260px] leading-relaxed"
          >
            Premium unisex streetwear
            <br />
            for the modern world
          </m.p>

          {/* CTA — arrow link style */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.62 }}
          >
            <Link
              href="/collections/all"
              className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] group"
            >
              <span className="border-b border-current pb-0.5 group-hover:tracking-[0.42em] transition-all duration-350">
                Shop the Collection
              </span>
              <m.span
                className="text-sm"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </m.span>
            </Link>
          </m.div>
        </div>

        {/* Scroll nudge (desktop only) */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="hidden lg:flex absolute bottom-10 left-16 items-center gap-3 text-black/30"
        >
          <div className="w-8 h-px bg-current" />
          <span className="text-[9px] uppercase tracking-[0.35em]">Scroll</span>
        </m.div>

        {/* Vertical divider line (desktop) */}
        <div className="hidden lg:block absolute right-0 top-16 bottom-16 w-px bg-black/8" />
      </m.div>
    </div>
    </LazyMotion>
  );
}
