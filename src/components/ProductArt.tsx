"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { Bouquet } from "./bouquet/Bouquet";

type ArtSource = Pick<Product, "composition" | "wrap" | "ribbon" | "image">;

type ProductArtProps = {
  product: ArtSource;
  title: string;
  bloom?: boolean;
  className?: string;
  /** Hint for the image optimizer, e.g. "(max-width: 1024px) 50vw, 25vw" */
  sizes?: string;
  priority?: boolean;
};

/** Photos fill their frame edge to edge; drawn bouquets keep a little air around them. */
export const artFrame = (product: ArtSource, drawingInset: string) => (product.image ? "inset-0" : drawingInset);

/** Shows the bouquet's photo when there is one, otherwise draws the bouquet from its flowers. */
export const ProductArt = ({ product, title, bloom, className = "", sizes = "50vw", priority = false }: ProductArtProps) => {
  const [brokenSrc, setBrokenSrc] = useState<string>();
  const broken = brokenSrc !== undefined && brokenSrc === product.image;

  if (product.image && !broken) {
    // photos shipped with the site go through the image optimizer; owner-pasted URLs can live on any host
    if (product.image.startsWith("/")) {
      return (
        <Image
          src={product.image}
          alt={title}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${className}`}
          onError={() => setBrokenSrc(product.image)}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element -- owner-supplied URLs from any host
      <img
        src={product.image}
        alt={title}
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
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
