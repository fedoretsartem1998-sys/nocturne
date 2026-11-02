"use client";

import type { CartItem } from "@/lib/types";
import { ProductArt } from "../ProductArt";

export const CartLineArt = ({ item, title, className = "h-24 w-20" }: { item: CartItem; title: string; className?: string }) => (
  <div className={`relative shrink-0 overflow-hidden rounded-2xl bg-plum ${className}`}>
    <div className="absolute inset-[6%]">
      <ProductArt product={item} title={title} />
    </div>
  </div>
);
