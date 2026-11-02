"use client";

import Image from "next/image";
import Link from "next/link";
import { brand } from "@/brand.config";
import { OCCASIONS } from "@/lib/catalog";
import { formatPrice, useLocalize, useT } from "@/lib/hooks";
import { useShop } from "@/store/shop";
import { ProductCard } from "../ProductCard";
import { Reveal } from "../Reveal";
import { buttonPrimary, kicker } from "../ui";
import { Atelier } from "./Atelier";
import { Gallery } from "./Gallery";
import { Hero } from "./Hero";
import { Marquee } from "./Marquee";

const STEP_PHOTOS = ["/site/step-1.jpg", "/site/step-2.jpg", "/site/step-3.jpg", "/site/step-4.jpg"];

const Section = ({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`mx-auto max-w-[1400px] scroll-mt-24 px-4 sm:px-6 lg:px-10 ${className}`}>
    {children}
  </section>
);

const SectionHeading = ({ eyebrow, title }: { eyebrow?: string; title: string }) => (
  <div>
    {eyebrow && <p className={kicker}>{eyebrow}</p>}
    <h2 className={`${eyebrow ? "mt-3" : ""} text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.05]`}>{title}</h2>
  </div>
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

      <Section className="mt-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title={t.home.popularTitle} />
          <Link
            href="/catalog"
            className="text-moon/70 underline decoration-moon/20 underline-offset-8 transition-colors hover:text-moon hover:decoration-accent"
          >
            {t.home.seeAll}
          </Link>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
          {popular.map((product, index) => (
            <Reveal key={product.id} delay={index * 90}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Section>

      <div className="mt-24">
        <Marquee />
      </div>

      <div className="mt-20">
        <Atelier />
      </div>

      <Section className="mt-36">
        <Reveal>
          <SectionHeading title={t.home.occasionsTitle} />
        </Reveal>
        <Reveal as="ul" className="mt-10 flex flex-wrap gap-x-4 gap-y-2" delay={100}>
          {OCCASIONS.map((occasion, index) => (
            <li key={occasion.id} className="flex items-baseline">
              <Link
                href={`/catalog?occasion=${occasion.id}`}
                className="group relative font-display text-[clamp(1.9rem,4.8vw,4rem)] leading-[1.2] text-moon/45 transition-colors duration-500 hover:text-moon"
              >
                {localize(occasion.name)}
                <span className="absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out group-hover:scale-x-100" />
              </Link>
              {index < OCCASIONS.length - 1 && (
                <span aria-hidden className="ml-4 font-display text-[clamp(1.9rem,4.8vw,4rem)] text-accent/40">
                  /
                </span>
              )}
            </li>
          ))}
        </Reveal>
      </Section>

      <Section className="mt-36">
        <div className="relative grid items-center gap-10 overflow-hidden rounded-[40px] border border-moon/10 bg-plum/70 p-6 sm:p-10 md:grid-cols-[1fr_1.1fr] lg:p-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl"
            style={{ background: "color-mix(in oklab, var(--brand-accent) 18%, transparent)" }}
          />
          <Reveal className="relative max-w-xl">
            <SectionHeading eyebrow={t.nav.builder} title={t.home.builderTitle} />
            <p className="mt-6 text-lg leading-relaxed text-mist">{t.home.builderText}</p>
            <Link href="/builder" className={`${buttonPrimary} mt-10`}>
              {t.home.builderCta}
            </Link>
          </Reveal>
          <Reveal variant="image" className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px]">
            <div className="absolute inset-0">
              <Image src="/site/builder.jpg" alt={t.home.builderPhotoAlt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="delivery" className="mt-36">
        <Reveal>
          <SectionHeading eyebrow={t.nav.delivery} title={t.home.stepsTitle} />
        </Reveal>
        <ol className="mt-14 grid grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-6 lg:grid-cols-4">
          {t.home.steps.map((step, index) => (
            <li key={step.title}>
              <Reveal variant="image" delay={index * 110} className="group relative aspect-[3/4] overflow-hidden rounded-[24px] bg-plum">
                <div className="absolute inset-0">
                  <Image
                    src={STEP_PHOTOS[index] ?? STEP_PHOTOS[0]}
                    alt={step.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                </div>
              </Reveal>
              <Reveal delay={index * 110 + 200}>
                <span className="tabular mt-6 block font-display text-4xl text-accent">{index + 1}</span>
                <h3 className="mt-3 font-sans! text-lg font-medium!">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-mist">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <Reveal className="mt-14" delay={150}>
          <div className="hairline" />
          <div className="flex flex-wrap gap-x-12 gap-y-3 pt-6 text-mist">
            <p>
              {t.cart.delivery}: <span className="tabular text-moon">{formatPrice(brand.deliveryFee)}</span>
            </p>
            <p>
              {t.cart.free} {t.product.from} <span className="tabular text-moon">{formatPrice(brand.freeDeliveryFrom)}</span>
            </p>
            <p className="tabular">
              {brand.deliverySlots[0]?.split("–")[0]}–{brand.deliverySlots.at(-1)?.split("–")[1]}
            </p>
          </div>
        </Reveal>
      </Section>

      <Section className="mt-36">
        <Reveal>
          <SectionHeading title={t.home.reviewsTitle} />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {t.home.reviews.map((review, index) => (
            <Reveal
              as="figure"
              key={review.name}
              delay={index * 110}
              className="relative flex flex-col rounded-[28px] border border-moon/10 bg-plum/50 p-8"
            >
              <span aria-hidden className="font-display text-7xl leading-[0.6] text-accent/70">
                “
              </span>
              <blockquote className="mt-4 flex-1 font-display text-[1.3rem] leading-snug text-moon/90">{review.text}</blockquote>
              <figcaption className="mt-8 flex items-center justify-between gap-4 border-t border-moon/10 pt-5 text-sm">
                <span className="text-moon">{review.name}</span>
                <span className="text-right text-mist">{t.premium.reviewMeta[index]}</span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </Section>

      <div className="mt-36">
        <Gallery />
      </div>
    </>
  );
};
