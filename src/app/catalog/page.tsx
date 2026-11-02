import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogPage } from "@/components/catalog/CatalogPage";

export const metadata: Metadata = { title: "Каталог букетів" };

export default function Page() {
  return (
    <Suspense>
      <CatalogPage />
    </Suspense>
  );
}
