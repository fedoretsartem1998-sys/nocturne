"use client";

import Link from "next/link";
import { formatPrice, useLocalize, useT } from "@/lib/hooks";
import type { Product } from "@/lib/types";
import { FavoriteButton } from "./FavoriteButton";
import { artFrame, ProductArt } from "./ProductArt";

export const ProductCard = ({ product }: { product: Product }) => {
  const t = useT();
  const localize = useLocalize();
  const name = localize(product.name);

  return (
    <article className="group relative">
      <Link href={`/bouquet/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-[28px] bg-plum">
          <div
            className={`absolute ${artFrame(product, "inset-x-[6%] bottom-0 top-[4%]")} transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.06]`}
          >
            <ProductArt product={product} title={name} sizes="(max-width: 1024px) 50vw, 25vw" />
          </div>

          {/* inner hairline frame, like a passe-partout */}
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-moon/10" />

          {/* hover veil with a quiet call to view */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-1/2 items-end justify-center bg-gradient-to-t from-ink/80 to-transparent pb-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="translate-y-2 rounded-full border border-moon/25 bg-ink/40 px-5 py-2 text-sm text-moon backdrop-blur-md transition-transform duration-500 group-hover:translate-y-0">
              {t.premium.viewBouquet}
            </span>
          </div>

          {product.badge && (
            <span
              className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-md ${
                product.badge === "new" ? "bg-sage/90 text-ink" : "bg-accent/90 text-accent-ink"
              }`}
            >
              {product.badge === "new" ? t.product.new : t.product.bestseller}
            </span>
          )}
          {!product.available && (
            <span className="absolute inset-x-4 bottom-4 rounded-full bg-ink/80 px-3 py-1.5 text-center text-sm text-mist">
              {t.product.unavailable}
            </span>
          )}
        </div>
        <div className="mt-5 flex items-baseline justify-between gap-4 px-1">
          <h3 className="text-[1.3rem] leading-tight transition-colors group-hover:text-accent">{name}</h3>
          <p className="tabular shrink-0 text-moon/70">{formatPrice(product.price)}</p>
        </div>
        <p className="mt-1 px-1 text-sm text-mist">{t.product.stems(product.composition.length)}</p>
      </Link>
      <FavoriteButton productId={product.id} className="absolute right-3 top-3" />
    </article>
  );
};
