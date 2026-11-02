"use client";

import { useT } from "@/lib/hooks";
import { useShop } from "@/store/shop";
import { HeartIcon } from "./icons";

type FavoriteButtonProps = { productId: string; className?: string; withLabel?: boolean };

export const FavoriteButton = ({ productId, className = "", withLabel = false }: FavoriteButtonProps) => {
  const t = useT();
  const active = useShop((state) => state.favorites.includes(productId));
  const toggleFavorite = useShop((state) => state.toggleFavorite);
  const label = active ? t.product.removeFavorite : t.product.addFavorite;

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(productId)}
      aria-pressed={active}
      aria-label={withLabel ? undefined : label}
      className={`inline-flex items-center gap-2 rounded-full transition-[color,background-color,transform] duration-200 active:scale-95 ${
        withLabel ? "h-12 border border-line px-5 hover:border-mist" : "h-11 w-11 justify-center bg-ink/60 backdrop-blur"
      } ${active ? "text-accent" : "text-moon hover:text-accent"} ${className}`}
    >
      <HeartIcon filled={active} />
      {withLabel && <span className="text-[15px]">{label}</span>}
    </button>
  );
};
