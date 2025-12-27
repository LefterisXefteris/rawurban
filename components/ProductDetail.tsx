
import { getProductByHandle } from "@/lib/index"; // you'll need this function
import Image from 'next/image';
import { Button } from "./addToCart";

export async function ProductDetail({ handle }: { handle: string }) {
  const product = await getProductByHandle(handle);

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <main className="bg-white">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left side - Image */}
          <div className="sticky top-8 self-start">
            {product?.featuredImage && (
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                width={800}
                height={800}
                className="w-full h-auto object-cover"
              />
            )}
          </div>

          {/* Right side - Product Info */}
          <div className="lg:pt-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 uppercase">
              {product.title}
            </h1>

            <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Variants Section */}
            <div className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-900">
                Select Color
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {product.variants.edges.map(({ node: variant }) => (
                  <div key={variant.id} className="group cursor-pointer">
                    <div className="relative border-2 border-gray-200 hover:border-black transition-colors duration-200 overflow-hidden">
                      {variant.image && (
                        <Image
                          src={variant.image.url}
                          alt={variant.image.altText || variant.title}
                          width={200}
                          height={200}
                          className="w-full aspect-square object-cover"
                        />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-900">
                        {variant.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {variant.quantityAvailable > 0 ? 'In Stock' : 'Out of Stock'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price and Add to Cart */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold">
                  {product.variants.edges[0]?.node.price.currencyCode} {product.variants.edges[0]?.node.price.amount}
                </span>
              </div>

              <div className="space-y-3">
                <Button merchandiseId={product.variants.edges[0]?.node.id} />
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="space-y-4 text-sm">
                <p className="flex items-center gap-2 text-gray-700">
                  <span className="font-semibold">Free shipping</span> on orders over $50
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <span className="font-semibold">Free returns</span> within 30 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}