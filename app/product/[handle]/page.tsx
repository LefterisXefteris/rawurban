import { ProductDetail } from "@/components/ProductDetail";
import { Navbar } from "@/components/navbar/page";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  return (
    <>
      <Navbar />
      <ProductDetail handle={handle} />
    </>
  );
}