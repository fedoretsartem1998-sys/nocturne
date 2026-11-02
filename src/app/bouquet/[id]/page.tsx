import { Suspense } from "react";
import { ProductPage } from "@/components/product/ProductPage";
import { SEED_PRODUCTS } from "@/lib/products";

export const generateStaticParams = () => SEED_PRODUCTS.map((product) => ({ id: product.id }));

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <ProductPage />
    </Suspense>
  );
}
