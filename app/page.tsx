import { Logo } from "@/components/logo";
import { Navbar } from "@/components/navbar/page";
import { getProducts } from "@/lib/index";
import { Hero } from "@/components/hero";
import Link from 'next/link';

export default async function Home() {
  const products = await getProducts(20);
  return (
    <div className="min-h-screen">
      <Logo />
      <div className="bg-white shadow-md">
        <Navbar />
      </div>
      <div>
        <Hero />
      </div>
      <main>
        <h2 className="text-2xl font-semibold">Featured Products</h2>
        <div className="grid grid-cols-3 gap-0">
          {products.map((product) => (
            <Link href={`/product/${product.handle}`} key={product.id}>
              {product.featuredImage && (
                <img
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title}
                  className="p-0 aspect-square object-cover w-full hover:scale-101 mask-b-from-20% mask-b-to-95%"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg pt-6">{product.title}</h3>
                <p className="text-blue-600 dark:text-sky-400">
                  {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <section className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6">About Us</h2>
          <div className="max-w-3xl">
            <p className="text-gray-700">This is our story</p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
        </div>
      </footer>
    </div>
  );
}