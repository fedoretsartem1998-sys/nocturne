"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FLOWERS, RIBBONS, WRAPS, wrapInfo } from "@/lib/catalog";
import { formatPrice, useLocalize, useT } from "@/lib/hooks";
import { dictionaries } from "@/lib/i18n";
import type { FlowerKind, Stem, WrapId } from "@/lib/types";
import { useShop } from "@/store/shop";
import { Bouquet } from "../bouquet/Bouquet";
import { CheckIcon, MinusIcon, PlusIcon } from "../icons";
import { buttonPrimary } from "../ui";

const MIN_STEMS = 3;
const MAX_STEMS = 41;

const stemKey = (kind: FlowerKind, color: string) => `${kind}|${color}`;

const useBuilder = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [selectedColor, setSelectedColor] = useState<Record<string, string>>(() =>
    Object.fromEntries(FLOWERS.map((flower) => [flower.kind, flower.colors[0]?.hex ?? "#ffffff"])),
  );
  const [wrap, setWrap] = useState<WrapId>("kraft");
  const [ribbon, setRibbon] = useState<string>(RIBBONS[0] ?? "#E9A9BE");

  const stems = useMemo<Stem[]>(
    () =>
      FLOWERS.flatMap((flower) =>
        flower.colors.flatMap((color) =>
          Array.from({ length: counts[stemKey(flower.kind, color.hex)] ?? 0 }, () => ({ kind: flower.kind, color: color.hex })),
        ),
      ),
    [counts],
  );

  const flowersPrice = FLOWERS.reduce(
    (sum, flower) => sum + flower.colors.reduce((inner, color) => inner + (counts[stemKey(flower.kind, color.hex)] ?? 0) * flower.pricePerStem, 0),
    0,
  );
  const total = flowersPrice + (stems.length ? wrapInfo(wrap).price : 0);

  const change = (kind: FlowerKind, delta: number) => {
    const key = stemKey(kind, selectedColor[kind] ?? "");
    setCounts((current) => {
      const next = Math.max(0, (current[key] ?? 0) + delta);
      const totalNow = Object.values(current).reduce((sum, value) => sum + value, 0);
      if (delta > 0 && totalNow >= MAX_STEMS) return current;
      return { ...current, [key]: next };
    });
  };

  const countFor = (kind: FlowerKind) =>
    Object.entries(counts).reduce((sum, [key, value]) => (key.startsWith(`${kind}|`) ? sum + value : sum), 0);

  const reset = () => setCounts({});

  return { counts, stems, total, wrap, setWrap, ribbon, setRibbon, selectedColor, setSelectedColor, change, countFor, reset };
};

export const BuilderPage = () => {
  const t = useT();
  const localize = useLocalize();
  const addToCart = useShop((state) => state.addToCart);
  const builder = useBuilder();
  const [added, setAdded] = useState(false);
  const stemCount = builder.stems.length;
  const tooFew = stemCount < MIN_STEMS;
  const atMax = stemCount >= MAX_STEMS;

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 2500);
    return () => window.clearTimeout(timer);
  }, [added]);

  const handleAdd = () => {
    const signature = builder.stems.map((stem) => stemKey(stem.kind, stem.color)).join(",");
    addToCart({
      key: `custom-${builder.wrap}-${builder.ribbon}-${signature}`,
      name: { uk: dictionaries.uk.builder.customName, en: dictionaries.en.builder.customName },
      unitPrice: builder.total,
      composition: builder.stems,
      wrap: builder.wrap,
      ribbon: builder.ribbon,
      custom: true,
    });
    setAdded(true);
  };

  const summary = (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-sm text-mist">{t.builder.stemsCount(stemCount)}</p>
        <p className="tabular text-2xl">{formatPrice(builder.total)}</p>
      </div>
      <button type="button" className={buttonPrimary} disabled={tooFew} onClick={handleAdd}>
        {added ? (
          <>
            <CheckIcon /> {t.product.added}
          </>
        ) : (
          t.builder.addToCart
        )}
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-12 sm:px-6 lg:px-10 lg:pb-0">
      <h1 className="text-[clamp(2.4rem,5vw,4rem)] leading-tight">{t.builder.title}</h1>
      <p className="mt-3 max-w-[60ch] text-mist">{t.builder.lead}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_minmax(0,0.95fr)] lg:gap-14">
        <div className="order-2 lg:order-1">
          <h2 className="font-sans! text-sm text-mist">{t.builder.flowers}</h2>
          <ul className="mt-3 divide-y divide-line/70 border-y border-line/70">
            {FLOWERS.map((flower) => {
              const count = builder.countFor(flower.kind);
              const activeColor = builder.selectedColor[flower.kind];
              const colorCount = builder.counts[stemKey(flower.kind, activeColor ?? "")] ?? 0;
              return (
                <li key={flower.kind} className="flex flex-wrap items-center gap-x-4 gap-y-3 py-4">
                  <div className="min-w-[150px] flex-1">
                    <p className="text-[17px]">{localize(flower.name)}</p>
                    <p className="tabular text-sm text-mist">
                      {formatPrice(flower.pricePerStem)} {t.builder.perStem}
                    </p>
                  </div>

                  {flower.colors.length > 1 && (
                    <div className="flex gap-1.5" role="radiogroup" aria-label={localize(flower.name)}>
                      {flower.colors.map((color) => {
                        const selected = color.hex === activeColor;
                        const perColor = builder.counts[stemKey(flower.kind, color.hex)] ?? 0;
                        return (
                          <button
                            key={color.hex}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            aria-label={localize(color.name)}
                            title={localize(color.name)}
                            onClick={() => builder.setSelectedColor((current) => ({ ...current, [flower.kind]: color.hex }))}
                            className={`relative grid h-9 w-9 place-items-center rounded-full transition-shadow ${
                              selected ? "ring-2 ring-accent ring-offset-2 ring-offset-ink" : "ring-1 ring-line"
                            }`}
                          >
                            <span className="h-6 w-6 rounded-full" style={{ background: color.hex }} />
                            {perColor > 0 && (
                              <span className="tabular absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-moon px-1 text-[10px] font-semibold text-ink">
                                {perColor}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-center gap-1 rounded-full border border-line p-1">
                    <button
                      type="button"
                      aria-label={`${t.builder.decrease}: ${localize(flower.name)}`}
                      disabled={colorCount === 0}
                      onClick={() => builder.change(flower.kind, -1)}
                      className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-plum-raised active:scale-95 disabled:opacity-30"
                    >
                      <MinusIcon />
                    </button>
                    <span className="tabular w-7 text-center" aria-live="polite">
                      {count}
                    </span>
                    <button
                      type="button"
                      aria-label={`${t.builder.increase}: ${localize(flower.name)}`}
                      disabled={atMax}
                      onClick={() => builder.change(flower.kind, 1)}
                      className="grid h-9 w-9 place-items-center rounded-full bg-plum-raised transition-colors hover:bg-line active:scale-95 disabled:opacity-30"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <h2 className="mt-10 font-sans! text-sm text-mist">{t.builder.wrap}</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {WRAPS.map((wrap) => {
              const active = wrap.id === builder.wrap;
              return (
                <button
                  key={wrap.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => builder.setWrap(wrap.id)}
                  className={`rounded-2xl border p-3 text-left transition-colors ${active ? "border-accent bg-accent/10" : "border-line hover:border-mist"}`}
                >
                  <span
                    className="block h-6 w-10 rounded-md"
                    style={{
                      background: wrap.id === "none" ? "transparent" : `linear-gradient(135deg, ${wrap.front} 50%, ${wrap.back} 50%)`,
                      border: wrap.id === "none" ? "1px dashed var(--brand-line)" : undefined,
                    }}
                  />
                  <span className="mt-2 block text-sm">{localize(wrap.name)}</span>
                  <span className="tabular block text-xs text-mist">{wrap.price ? `+${formatPrice(wrap.price)}` : t.builder.free}</span>
                </button>
              );
            })}
          </div>

          <h2 className="mt-10 font-sans! text-sm text-mist">{t.builder.ribbon}</h2>
          <div className="mt-3 flex gap-2">
            {RIBBONS.map((color) => (
              <button
                key={color}
                type="button"
                aria-pressed={color === builder.ribbon}
                aria-label={color}
                onClick={() => builder.setRibbon(color)}
                className={`grid h-10 w-10 place-items-center rounded-full ${
                  color === builder.ribbon ? "ring-2 ring-accent ring-offset-2 ring-offset-ink" : "ring-1 ring-line"
                }`}
              >
                <span className="h-7 w-7 rounded-full" style={{ background: color }} />
              </button>
            ))}
          </div>
        </div>

        <div className="sticky top-16 z-10 order-1 -mx-4 self-start bg-ink px-4 pb-3 pt-2 sm:-mx-6 sm:px-6 lg:top-24 lg:order-2 lg:mx-0 lg:bg-transparent lg:p-0">
          <div>
            <div className="relative h-[36dvh] overflow-hidden rounded-[28px] bg-plum sm:h-[44dvh] lg:aspect-square lg:h-auto lg:rounded-[36px]">
              {stemCount === 0 ? (
                <div className="absolute inset-0 grid place-items-center p-8 text-center">
                  <p className="font-display text-2xl text-mist">{t.builder.emptyPreview}</p>
                </div>
              ) : (
                <div className="absolute inset-[6%]">
                  <Bouquet stems={builder.stems} wrap={builder.wrap} ribbon={builder.ribbon} title={t.builder.yourBouquet} className="h-full w-full" />
                </div>
              )}
              {stemCount > 0 && (
                <button
                  type="button"
                  onClick={builder.reset}
                  className="absolute right-4 top-4 rounded-full bg-ink/60 px-4 py-2 text-sm text-mist backdrop-blur transition-colors hover:text-moon"
                >
                  {t.builder.clear}
                </button>
              )}
            </div>

            <div className="mt-6 hidden lg:block">
              {summary}
              <p className="mt-3 min-h-5 text-sm text-mist" role="status">
                {tooFew ? t.builder.minHint : atMax ? t.builder.maxHint : added ? (
                  <Link href="/cart" className="text-moon underline decoration-accent underline-offset-4">
                    {t.cart.checkout}
                  </Link>
                ) : null}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink/95 px-4 py-3 backdrop-blur lg:hidden">
        {summary}
      </div>
    </div>
  );
};
