import { getProductByHandle } from "@/lib/index";
import Link from "next/link";
import { ProductDetailClient } from "./ProductDetailClient";
import { DescriptionAccordion } from "./product/DescriptionAccordion";

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
  const images = product.images.edges.map((e) => e.node);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-28 pb-24">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-black">{product.title}</span>
        </nav>

        {/* 2-col layout with shared state */}
        <ProductDetailClient
          images={images}
          title={product.title}
          variants={variants}
          options={product.options}
        />

        {/* Description */}
        {product.description && (
          <div className="max-w-[1400px] mx-auto mt-8 pt-8 border-t border-zinc-100 lg:pl-[calc(50%+40px)]">
            <DescriptionAccordion description={product.description} />
          </div>
        )}
      </div>
    </div>
  );
}
