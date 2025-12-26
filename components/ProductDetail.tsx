// components/ProductDetail.tsx
import { getProductByHandle } from "@/lib/index"; // you'll need this function

export async function ProductDetail({ handle }: { handle: string }) {
  const product = await getProductByHandle(handle);

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <main>
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        {product.featuredImage && (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            className="w-full max-w-md"
          />
        )}
      </section>
    </main>
  );
}