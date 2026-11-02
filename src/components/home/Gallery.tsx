"use client";

import Image from "next/image";
import { brand } from "@/brand.config";
import { useLocalize, useT } from "@/lib/hooks";
import { useShop } from "@/store/shop";
import { Reveal } from "../Reveal";
import { buttonGhost } from "../ui";

export const Gallery = () => {
  const t = useT();
  const localize = useLocalize();
  const products = useShop((state) => state.products);
  const photos = products.filter((product) => product.image?.startsWith("/")).slice(4, 9);

  if (photos.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[clamp(2rem,3.6vw,3rem)] leading-tight">{t.premium.galleryTitle}</h2>
          <p className="mt-2 text-mist">{t.premium.galleryHandle}</p>
        </div>
        <a href={brand.instagram} target="_blank" rel="noreferrer" className={buttonGhost}>
          {t.premium.galleryCta}
        </a>
      </Reveal>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {photos.map((product, index) => (
          <Reveal
            key={product.id}
            variant="image"
            delay={index * 90}
            className={`group relative aspect-square overflow-hidden rounded-[20px] ${index === 4 ? "hidden lg:block" : ""}`}
          >
            <a href={brand.instagram} target="_blank" rel="noreferrer" className="absolute inset-0">
              <Image
                src={product.image ?? ""}
                alt={localize(product.name)}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30" />
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
};
