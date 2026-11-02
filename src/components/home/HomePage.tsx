"use client";

import Image from "next/image";
import Link from "next/link";
import { brand } from "@/brand.config";
import { OCCASIONS } from "@/lib/catalog";
import { formatPrice, useLocalize, useT } from "@/lib/hooks";
import { useShop } from "@/store/shop";
import { ProductCard } from "../ProductCard";
import { Reveal } from "../Reveal";
import { buttonPrimary } from "../ui";
import { Hero } from "./Hero";

const STEP_PHOTOS = ["/site/step-1.jpg", "/site/step-2.jpg", "/site/step-3.jpg", "/site/step-4.jpg"];

const Section = ({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`mx-auto max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-10 ${className}`}>
    {children}
  </section>
);

export const HomePage = () => {
  const t = useT();
  const localize = useLocalize();
  const products = useShop((state) => state.products);
  const popular = [...products]
    .filter((product) => product.available)
    .sort((a, b) => Number(b.badge === "bestseller") - Number(a.badge === "bestseller"))
    .slice(0, 4);

  return (
    <>
      <Hero />

      <Section className="mt-20">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[clamp(2rem,3.6vw,3rem)] leading-tight">{t.home.popularTitle}</h2>
          <Link href="/catalog" className="text-mist underline decoration-line underline-offset-8 transition-colors hover:text-moon hover:decoration-accent">
            {t.home.seeAll}
          </Link>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {popular.map((product, index) => (
            <Reveal key={product.id} delay={index * 80}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="mt-32">
        <Reveal>
          <h2 className="text-[clamp(2rem,3.6vw,3rem)] leading-tight">{t.home.occasionsTitle}</h2>
        </Reveal>
        <Reveal as="ul" className="mt-8 flex flex-wrap gap-x-3 gap-y-1" delay={100}>
          {OCCASIONS.map((occasion, index) => (
            <li key={occasion.id} className="flex items-baseline">
              <Link
                href={`/catalog?occasion=${occasion.id}`}
                className="font-display text-[clamp(1.8rem,4.6vw,3.6rem)] leading-[1.25] text-mist transition-colors hover:text-accent"
              >
                {localize(occasion.name)}
              </Link>
              {index < OCCASIONS.length - 1 && (
                <span aria-hidden className="ml-3 font-display text-[clamp(1.8rem,4.6vw,3.6rem)] text-line">
                  /
                </span>
              )}
            </li>
          ))}
        </Reveal>
      </Section>

      <Section className="mt-32">
        <Reveal className="grid items-center gap-8 overflow-hidden rounded-[40px] bg-plum px-6 py-10 sm:px-12 md:grid-cols-[1fr_1fr] md:py-10">
          <div className="max-w-xl">
            <h2 className="text-[clamp(2rem,3.6vw,3rem)] leading-tight">{t.home.builderTitle}</h2>
            <p className="mt-5 text-lg leading-relaxed text-mist">{t.home.builderText}</p>
            <Link href="/builder" className={`${buttonPrimary} mt-8`}>
              {t.home.builderCta}
            </Link>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px]">
            <Image src="/site/builder.jpg" alt={t.home.builderPhotoAlt} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
          </div>
        </Reveal>
      </Section>

      <Section id="delivery" className="mt-32">
        <Reveal>
          <h2 className="text-[clamp(2rem,3.6vw,3rem)] leading-tight">{t.home.stepsTitle}</h2>
        </Reveal>
        <ol className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-4">
          {t.home.steps.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 90}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] bg-plum">
                <Image src={STEP_PHOTOS[index] ?? STEP_PHOTOS[0]} alt={step.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" />
              </div>
              <span className="tabular mt-6 block font-display text-4xl text-accent">{index + 1}</span>
              <h3 className="mt-4 font-sans! text-lg font-medium!">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-mist">{step.text}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-12 flex flex-wrap gap-x-10 gap-y-3 text-mist" delay={150}>
          <p>
            {t.cart.delivery}: <span className="tabular text-moon">{formatPrice(brand.deliveryFee)}</span>
          </p>
          <p>
            {t.cart.free} {t.product.from} <span className="tabular text-moon">{formatPrice(brand.freeDeliveryFrom)}</span>
          </p>
          <p>
            {brand.deliverySlots[0]?.split("–")[0]}–{brand.deliverySlots.at(-1)?.split("–")[1]}
          </p>
        </Reveal>
      </Section>

      <Section className="mt-32">
        <Reveal>
          <h2 className="text-[clamp(2rem,3.6vw,3rem)] leading-tight">{t.home.reviewsTitle}</h2>
        </Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {t.home.reviews.map((review, index) => (
            <Reveal as="figure" key={review.name} delay={index * 90}>
              <blockquote className="font-display text-[1.35rem] leading-snug">«{review.text}»</blockquote>
              <figcaption className="mt-4 text-mist">{review.name}</figcaption>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
};
