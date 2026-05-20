import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/index";
import { formatPrice } from "@/lib/utils";

export function ProductCard({
  product,
  badge,
}: {
  product: Product;
  badge?: string;
}) {
  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
        <Link href={`/product/${product.handle}`} className="block h-full">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-zinc-200" />
          )}

          {badge ? (
            <span className="absolute top-3 left-3 z-10 bg-black px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white">
              {badge}
            </span>
          ) : null}
        </Link>
      </div>

      <Link href={`/product/${product.handle}`} className="mt-3 block">
        <h3 className="mb-1 text-[11px] font-bold uppercase tracking-wide leading-tight text-black transition-opacity group-hover:opacity-60">
          {product.title}
        </h3>
        <p className="text-[11px] font-semibold text-black">
          {formatPrice(product.priceRange.minVariantPrice.amount)}
        </p>
      </Link>
    </article>
  );
}
