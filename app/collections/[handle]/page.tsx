import { getCollection } from "@/lib/index";
import { Navbar } from "@/components/navbar/page";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const fmt = (amount: string) => `$${parseFloat(amount).toFixed(2)}`;

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await getCollection(handle);

  if (!collection) notFound();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Header ── */}
      <div className="pt-28 pb-12 px-4 md:px-8 lg:px-12 border-b border-zinc-100">
        <div className="max-w-[1600px] mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-black">{collection.title}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h1 className="font-serif italic text-6xl md:text-8xl leading-none text-black">
              {collection.title}
            </h1>
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
              {collection.products.length} {collection.products.length === 1 ? "product" : "products"}
            </p>
          </div>

          {collection.description && (
            <p className="mt-4 text-sm text-zinc-500 max-w-xl leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>
      </div>

      {/* ── Product Grid ── */}
      <section className="py-12 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          {collection.products.length === 0 ? (
            <div className="py-32 text-center">
              <p className="text-[12px] uppercase tracking-[0.3em] text-zinc-400">
                No products in this collection yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {collection.products.map((product) => (
                <Link
                  href={`/product/${product.handle}`}
                  key={product.id}
                  className="group block"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] bg-[#f5f5f5] overflow-hidden mb-3">
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

                    {/* Quick Add bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/90 text-white py-[10px] text-[10px] font-bold uppercase tracking-[0.25em] text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                      Quick Add
                    </div>
                  </div>

                  {/* Info */}
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
          )}
        </div>
      </section>
    </div>
  );
}
