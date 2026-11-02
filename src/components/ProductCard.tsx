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
        <div className="relative aspect-square overflow-hidden rounded-[28px] bg-plum transition-colors duration-300 group-hover:bg-plum-raised">
          <div className={`absolute ${artFrame(product, "inset-x-[6%] bottom-0 top-[4%]")} transition-transform duration-500 ease-out group-hover:scale-[1.03]`}>
            <ProductArt product={product} title={name} sizes="(max-width: 1024px) 50vw, 25vw" />
          </div>
          {product.badge && (
            <span
              className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium ${
                product.badge === "new" ? "bg-sage text-ink" : "bg-accent text-accent-ink"
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
        <div className="mt-4 flex items-baseline justify-between gap-4 px-1">
          <h3 className="text-xl leading-tight">{name}</h3>
          <p className="tabular shrink-0 text-mist">{formatPrice(product.price)}</p>
        </div>
      </Link>
      <FavoriteButton productId={product.id} className="absolute right-3 top-3" />
    </article>
  );
};
