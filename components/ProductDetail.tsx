import { getProductByHandle } from "@/lib/index";
import Link from "next/link";
import { ProductActions } from "./ProductActions";
import { ProductGallery } from "./ProductGallery";

export async function ProductDetail({ handle }: { handle: string }) {
  const product = await getProductByHandle(handle);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm uppercase tracking-widest text-zinc-400">
          Product not found
        </p>
      </div>
    );
  }

  const variants = product.variants.edges.map((e) => e.node);

  return (
    <div className="min-h-screen bg-white">
      {/* Content pushed below fixed header (announcement 36px + navbar ~64px) */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-28 pb-24">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-black">{product.title}</span>
        </nav>

        {/* 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* ── Left: Gallery ── */}
          <ProductGallery
            images={product.images.edges.map((e) => e.node)}
            title={product.title}
          />

          {/* ── Right: Info ── */}
          <div className="flex flex-col justify-center lg:py-8">
            {/* Brand */}
            <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 mb-2">
              Two Stones
            </p>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide leading-tight mb-6">
              {product.title}
            </h1>

            {/* Interactive: variant selector + add to cart */}
            <ProductActions variants={variants} />

            {/* Description */}
            {product.description && (
              <div className="mt-8 pt-8 border-t border-zinc-100">
                <button className="w-full flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                  Description
                  <span className="text-zinc-400">+</span>
                </button>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}