import { getCollection } from "@/lib/index";
import { Navbar } from "@/components/navbar/page";
import { ProductCard } from "@/components/cards/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";

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
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
