import { Logo } from "@/components/logo";
import { Navbar } from "@/components/navbar/page";
import { getProducts } from "@/lib/index";
import { Hero } from "@/components/hero";
import {Button} from "@/components/addToCart";
import Link from 'next/link';

export default async function Home() {
  const products = await getProducts(20);
  return (
    <div className="min-h-screen bg-white">
      <Logo />
      <div className="bg-white border-b border-gray-200">
        <Navbar />
      </div>
      <div>
        <Hero />
      </div>
      <main className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight mb-8 md:mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <Link
                href={`/product/${product.handle}`}
                key={product.id}
                className="group"
              >
                <div className="relative overflow-hidden bg-gray-50 aspect-square mb-3">
                  {product.featuredImage && (
                    <img
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm md:text-base font-medium uppercase tracking-wide text-gray-900 line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-sm md:text-base font-bold text-gray-900">
                    {product.priceRange.minVariantPrice.currencyCode} {product.priceRange.minVariantPrice.amount}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <section className="py-16 md:py-24 border-t border-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-6">
              About Us
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              This is our story
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-black text-white mt-20">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
          <div className="text-center text-sm text-gray-400">
            <p>© 2024 All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}