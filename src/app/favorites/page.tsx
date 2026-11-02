"use client";

import Link from "next/link";
import { HeartIcon } from "@/components/icons";
import { ProductCard } from "@/components/ProductCard";
import { buttonPrimary } from "@/components/ui";
import { useT } from "@/lib/hooks";
import { useShop } from "@/store/shop";

export default function FavoritesPage() {
  const t = useT();
  const hydrated = useShop((state) => state.hydrated);
  const favorites = useShop((state) => state.favorites);
  const products = useShop((state) => state.products);
  const saved = products.filter((product) => favorites.includes(product.id));

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-10">
      <h1 className="text-[clamp(2.4rem,5vw,4rem)] leading-tight">{t.favorites.title}</h1>
      {!hydrated ? null : saved.length === 0 ? (
        <div className="mt-12 rounded-[28px] border border-dashed border-line px-6 py-16 text-center">
          <HeartIcon size={32} className="mx-auto text-accent" />
          <h2 className="mt-4 text-2xl">{t.favorites.emptyTitle}</h2>
          <p className="mx-auto mt-3 max-w-md text-mist">{t.favorites.emptyText}</p>
          <Link href="/catalog" className={`${buttonPrimary} mt-8`}>
            {t.cart.toCatalog}
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {saved.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
