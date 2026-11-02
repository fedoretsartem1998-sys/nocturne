"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { Bouquet } from "./bouquet/Bouquet";

type ProductArtProps = {
  product: Pick<Product, "composition" | "wrap" | "ribbon" | "image">;
  title: string;
  bloom?: boolean;
  className?: string;
};

/** Shows the owner's photo when there is one, otherwise draws the bouquet from its flowers. */
export const ProductArt = ({ product, title, bloom, className = "" }: ProductArtProps) => {
  const [brokenSrc, setBrokenSrc] = useState<string>();
  const broken = brokenSrc !== undefined && brokenSrc === product.image;

  if (product.image && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- owner-supplied URLs from any host
      <img
        src={product.image}
        alt={title}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
        onError={() => setBrokenSrc(product.image)}
      />
    );
  }

  return (
    <Bouquet
      stems={product.composition}
      wrap={product.wrap}
      ribbon={product.ribbon}
      bloom={bloom}
      title={title}
      className={`h-full w-full ${className}`}
    />
  );
};
