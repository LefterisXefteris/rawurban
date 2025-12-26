import { ProductDetail } from "@/components/ProductDetail";

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  return <ProductDetail handle={handle} />;
}