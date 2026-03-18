import { Navbar } from "@/components/navbar/page";
import { getProducts } from "@/lib/index";
import { Hero } from "@/components/hero";
import Link from "next/link";
import Image from "next/image";

const fmt = (amount: string) =>
  `$${parseFloat(amount).toFixed(2)}`;

export default async function Home() {
  const products = await getProducts(12);
  // First 4 products cycle in the hero; first 2 back the editorial tiles
  const heroProducts = products.slice(0, 4);
  const tile1 = products[0];
  const tile2 = products[1] ?? products[0];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* ─── HERO ─── */}
        <Hero products={heroProducts} />

        {/* ─── EDITORIAL TILES ─── */}
        <section className="grid grid-cols-1 md:grid-cols-2 min-h-[65vh]">
          {/* Tile 1 — New Arrivals */}
          <Link
            href="/collections/new-arrivals"
            className="relative bg-[#0d0d0d] flex items-end p-10 md:p-16 group overflow-hidden min-h-[55vw] md:min-h-0"
          >
            {tile1?.featuredImage && (
              <Image
                src={tile1.featuredImage.url}
                alt={tile1.featuredImage.altText || tile1.title}
                fill
                className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )}
            {/* Gradient overlay — heavier at bottom for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
            <div className="relative z-10 text-white">
              <p className="text-[10px] uppercase tracking-[0.45em] mb-3 text-white/60">
                Just Dropped
              </p>
              <h3 className="font-serif italic text-5xl md:text-6xl leading-none mb-6 group-hover:tracking-wide transition-all duration-500">
                New Arrivals
              </h3>
              <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] border-b border-white/50 pb-0.5 group-hover:border-white transition-colors">
                Shop Now
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </div>
          </Link>

          {/* Tile 2 — The Essentials */}
          <Link
            href="/collections/essentials"
            className="relative bg-[#181818] flex items-end p-10 md:p-16 group overflow-hidden min-h-[55vw] md:min-h-0 border-t md:border-t-0 md:border-l border-white/5"
          >
            {tile2?.featuredImage && (
              <Image
                src={tile2.featuredImage.url}
                alt={tile2.featuredImage.altText || tile2.title}
                fill
                className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />
            <div className="relative z-10 text-white">
              <p className="text-[10px] uppercase tracking-[0.45em] mb-3 text-white/60">
                The Collection
              </p>
              <h3 className="font-serif italic text-5xl md:text-6xl leading-none mb-6 group-hover:tracking-wide transition-all duration-500">
                Essentials
              </h3>
              <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] border-b border-white/50 pb-0.5 group-hover:border-white transition-colors">
                Shop Now
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </div>
          </Link>
        </section>

        {/* ─── MARQUEE BAND ─── */}
        <div className="bg-black py-4 overflow-hidden border-y border-zinc-900">
          <div className="flex whitespace-nowrap animate-marquee w-max">
            {Array(6)
              .fill("NEW ARRIVALS · FREE SHIPPING OVER $75 · PREMIUM QUALITY · ")
              .map((t, i) => (
                <span
                  key={i}
                  className="text-white/40 text-[11px] font-semibold uppercase tracking-[0.3em] mr-0"
                >
                  {t}
                </span>
              ))}
          </div>
        </div>

        {/* ─── NEW ARRIVALS ─── */}
        <section className="py-20 px-4 md:px-8 lg:px-12 bg-white">
          <div className="max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end mb-10">
              <h2 className="font-serif italic text-5xl md:text-7xl text-black leading-none">
                New Arrivals
              </h2>
              <Link
                href="/collections/new-arrivals"
                className="hidden md:block text-[11px] font-semibold uppercase tracking-[0.2em] underline underline-offset-4 hover:opacity-50 transition-opacity"
              >
                View All
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {products.map((product) => (
                <Link
                  href={`/product/${product.handle}`}
                  key={product.id}
                  className="group block"
                >
                  {/* Image container */}
                  <div className="relative aspect-[3/4] bg-[#f5f5f5] overflow-hidden mb-3">
                    {product.featuredImage ? (
                      <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText || product.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-zinc-200" />
                    )}

                    {/* NEW badge */}
                    <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 z-10">
                      NEW
                    </span>

                    {/* Slide-up Quick Add bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/90 text-white py-[10px] text-[10px] font-bold uppercase tracking-[0.25em] text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                      Quick Add
                    </div>
                  </div>

                  {/* Product info */}
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-wide text-black leading-tight mb-1 group-hover:opacity-60 transition-opacity">
                      {product.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-black">
                      {fmt(product.priceRange.minVariantPrice.amount)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-10 text-center md:hidden">
              <Link
                href="/collections/all"
                className="inline-block bg-black text-white text-[11px] font-bold uppercase tracking-[0.25em] px-12 py-4"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* ─── BRAND STATEMENT ─── */}
        <section className="py-32 bg-black text-white overflow-hidden relative">
          {/* BG watermark */}
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          >
            <span className="font-display text-[30vw] text-white opacity-[0.03] leading-none whitespace-nowrap">
              TWO STONES
            </span>
          </div>

          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-6">
              Our Manifesto
            </p>
            <h2 className="font-serif italic text-[10vw] md:text-[7vw] lg:text-[5.5vw] leading-none mb-10">
              Built for
              <br />
              the Grind
            </h2>
            <p className="text-zinc-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-12 font-light">
              Every piece is designed for those who refuse to compromise.
              Premium materials, precision construction, built to move with you.
            </p>
            <Link
              href="/pages/about"
              className="inline-block border border-white/50 text-white text-[11px] font-semibold uppercase tracking-[0.3em] px-12 py-4 hover:bg-white hover:text-black transition-all duration-300"
            >
              Our Story
            </Link>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="bg-black border-t border-zinc-900 pt-16 pb-10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
            {/* Brand */}
            <div>
              <span className="font-serif italic text-white text-3xl block mb-4">
                Two Stones
              </span>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                Premium streetwear for the modern explorer.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.25em] mb-6">
                Shop
              </h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                {[
                  ["All Products", "/collections/all"],
                  ["New Arrivals", "/collections/new-arrivals"],
                  ["Essentials", "/collections/essentials"],
                  ["Accessories", "/collections/accessories"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.25em] mb-6">
                Support
              </h4>
              <ul className="space-y-3 text-sm text-zinc-500">
                {[
                  ["FAQ", "/pages/faq"],
                  ["Shipping & Returns", "/pages/shipping"],
                  ["Contact Us", "/pages/contact"],
                  ["Size Guide", "/pages/size-guide"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.25em] mb-6">
                Newsletter
              </h4>
              <p className="text-sm text-zinc-500 mb-5 leading-relaxed">
                Get early access to drops and exclusive deals.
              </p>
              <form className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-zinc-900 border border-zinc-700 text-white text-[12px] px-4 py-3 placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors w-full"
                />
                <button
                  type="submit"
                  className="bg-white text-black text-[11px] font-bold uppercase tracking-[0.25em] py-3 hover:bg-zinc-200 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-900 text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
            <p>© 2026 Two Stones. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span className="cursor-pointer hover:text-zinc-400 transition-colors">
                Privacy Policy
              </span>
              <span className="cursor-pointer hover:text-zinc-400 transition-colors">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
