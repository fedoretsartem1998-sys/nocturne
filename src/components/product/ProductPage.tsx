"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { brand } from "@/brand.config";
import { flowerInfo, SIZES, sizePrice } from "@/lib/catalog";
import { colorName, groupStems } from "@/lib/composition";
import { formatPrice, useLocalize, useT } from "@/lib/hooks";
import type { SizeId } from "@/lib/types";
import { useShop } from "@/store/shop";
import { FavoriteButton } from "../FavoriteButton";
import { CheckIcon, PlusIcon } from "../icons";
import { artFrame, ProductArt } from "../ProductArt";
import { ProductCard } from "../ProductCard";
import { buttonGhost, buttonPrimary } from "../ui";

export const ProductPage = () => {
  const t = useT();
  const localize = useLocalize();
  const { id } = useParams<{ id: string }>();
  const hydrated = useShop((state) => state.hydrated);
  const products = useShop((state) => state.products);
  const addToCart = useShop((state) => state.addToCart);
  const product = products.find((item) => item.id === id);
  const [size, setSize] = useState<SizeId>("M");
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const timer = window.setTimeout(() => setJustAdded(false), 2200);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  if (!product) {
    if (!hydrated) return <div className="min-h-[70vh]" />;
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 text-center sm:px-6">
        <h1 className="text-4xl">{t.product.notFound}</h1>
        <Link href="/catalog" className={`${buttonGhost} mt-8`}>
          {t.product.backToCatalog}
        </Link>
      </div>
    );
  }

  const name = localize(product.name);
  const price = sizePrice(product.price, size);
  const multiplier = SIZES.find((option) => option.id === size)?.multiplier ?? 1;
  const lines = groupStems(product.composition).map((line) => ({ ...line, count: Math.max(1, Math.round(line.count * multiplier)) }));
  const stemsTotal = lines.reduce((sum, line) => sum + line.count, 0);
  const similar = products
    .filter((item) => item.id !== product.id && item.available && item.occasions.some((occasion) => product.occasions.includes(occasion)))
    .slice(0, 4);

  const handleAdd = () => {
    addToCart({
      key: `${product.id}-${size}`,
      productId: product.id,
      name: product.name,
      unitPrice: price,
      size,
      composition: product.composition,
      wrap: product.wrap,
      ribbon: product.ribbon,
      image: product.image,
      custom: false,
    });
    setJustAdded(true);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-8 sm:px-6 lg:px-10 lg:pb-0">
      <nav className="text-sm text-mist" aria-label="Breadcrumbs">
        <Link href="/catalog" className="hover:text-moon">
          {t.nav.catalog}
        </Link>
        <span className="mx-2 text-line">/</span>
        <span className="text-moon">{name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div
          className={`relative overflow-hidden rounded-[36px] bg-plum lg:sticky lg:top-24 lg:self-start ${
            product.image ? "aspect-[4/3]" : "aspect-[4/5]"
          }`}
        >
          <div className={`absolute ${artFrame(product, "inset-x-[8%] bottom-0 top-[5%]")}`}>
            <ProductArt key={product.id} product={product} title={name} bloom sizes="(max-width: 1024px) 100vw, 55vw" priority />
          </div>
        </div>

        <div className="lg:pt-6">
          <h1 className="text-[clamp(2.4rem,4.4vw,3.8rem)] leading-[1.05]">{name}</h1>
          <p className="tabular mt-4 text-2xl">{formatPrice(price)}</p>
          <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-mist">{localize(product.description)}</p>

          <fieldset className="mt-10">
            <legend className="text-sm text-mist">{t.product.size}</legend>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {SIZES.map((option) => {
                const active = option.id === size;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSize(option.id)}
                    className={`rounded-2xl border px-3 py-3 text-left transition-colors ${
                      active ? "border-accent bg-accent/10" : "border-line hover:border-mist"
                    }`}
                  >
                    <span className="block text-[15px]">{localize(option.name)}</span>
                    <span className="tabular mt-0.5 block text-sm text-mist">{formatPrice(sizePrice(product.price, option.id))}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className={`${buttonPrimary} min-w-[220px] flex-1 sm:flex-none`} disabled={!product.available} onClick={handleAdd}>
              {!product.available ? (
                t.product.unavailable
              ) : justAdded ? (
                <>
                  <CheckIcon /> {t.product.added}
                </>
              ) : (
                t.product.addToCart
              )}
            </button>
            <FavoriteButton productId={product.id} withLabel />
          </div>
          {justAdded && (
            <p className="mt-3 text-sm text-mist" role="status">
              <Link href="/cart" className="text-moon underline decoration-accent underline-offset-4">
                {t.cart.checkout}
              </Link>
            </p>
          )}

          <p className="mt-6 text-sm text-mist">
            {t.product.deliveryNote} <span className="tabular text-moon">{formatPrice(brand.freeDeliveryFrom)}</span>.
          </p>

          <ul className="mt-8 grid gap-3 rounded-[24px] border border-moon/10 bg-plum/50 p-5 sm:grid-cols-3 sm:gap-4">
            {t.premium.guarantees.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-snug text-moon/85">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                  <CheckIcon size={13} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <section className="mt-12 border-t border-line pt-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-sans! text-sm text-mist">{t.product.composition}</h2>
              <span className="tabular text-sm text-mist">{t.product.stems(stemsTotal)}</span>
            </div>
            <ul className="mt-4 divide-y divide-line/60">
              {lines.map((line) => {
                const color = colorName(line);
                return (
                  <li key={`${line.kind}-${line.color}`} className="flex items-center gap-3 py-3">
                    <span className="h-4 w-4 rounded-full ring-1 ring-black/30" style={{ background: line.color }} />
                    <span className="flex-1">
                      {localize(flowerInfo(line.kind).name)}
                      {color && <span className="text-mist"> {localize(color).toLowerCase()}</span>}
                    </span>
                    <span className="tabular text-mist">{line.count}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <details className="group mt-6 border-y border-line">
            <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-moon [&::-webkit-details-marker]:hidden">
              {t.premium.careTitle}
              <span className="grid h-8 w-8 place-items-center rounded-full border border-line transition-transform duration-300 group-open:rotate-45">
                <PlusIcon size={14} />
              </span>
            </summary>
            <ol className="space-y-3 pb-6">
              {t.premium.careSteps.map((step, index) => (
                <li key={step} className="flex gap-4 text-mist">
                  <span className="tabular font-display text-accent">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </details>
        </div>
      </div>

      {product.available && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-moon/10 bg-ink/90 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="min-w-0">
            <p className="truncate text-sm text-mist">{name}</p>
            <p className="tabular text-lg">{formatPrice(price)}</p>
          </div>
          <button type="button" className={buttonPrimary} onClick={handleAdd}>
            {justAdded ? <CheckIcon /> : null}
            {justAdded ? t.product.added : t.product.addToCart}
          </button>
        </div>
      )}

      {similar.length > 0 && (
        <section className="mt-28">
          <h2 className="text-[clamp(1.8rem,3vw,2.6rem)]">{t.product.similar}</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {similar.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
