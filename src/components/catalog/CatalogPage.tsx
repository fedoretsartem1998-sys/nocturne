"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { COLOR_TAGS, FLOWERS, OCCASIONS } from "@/lib/catalog";
import { formatPrice, useLocalize, useT } from "@/lib/hooks";
import type { ColorTag, FlowerKind, Occasion, Product } from "@/lib/types";
import { useShop } from "@/store/shop";
import { CloseIcon, FilterIcon } from "../icons";
import { ProductCard } from "../ProductCard";
import { buttonGhost, buttonPrimary, chipClass } from "../ui";

type SortId = "popular" | "cheap" | "expensive";

type Filters = {
  occasion: Occasion | null;
  colors: ColorTag[];
  flowers: FlowerKind[];
  maxPrice: number | null;
};

const EMPTY_FILTERS: Filters = { occasion: null, colors: [], flowers: [], maxPrice: null };

const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

const isOccasion = (value: string | null): value is Occasion => OCCASIONS.some((occasion) => occasion.id === value);

const popularity = (product: Product) => (product.badge === "bestseller" ? 2 : product.badge === "new" ? 1 : 0);

const applyFilters = (products: Product[], filters: Filters, sort: SortId) => {
  const filtered = products.filter((product) => {
    if (filters.occasion && !product.occasions.includes(filters.occasion)) return false;
    if (filters.colors.length && !filters.colors.includes(product.color)) return false;
    if (filters.flowers.length && !product.composition.some((stem) => filters.flowers.includes(stem.kind))) return false;
    if (filters.maxPrice !== null && product.price > filters.maxPrice) return false;
    return true;
  });
  const sorters: Record<SortId, (a: Product, b: Product) => number> = {
    popular: (a, b) => Number(b.available) - Number(a.available) || popularity(b) - popularity(a),
    cheap: (a, b) => a.price - b.price,
    expensive: (a, b) => b.price - a.price,
  };
  return filtered.sort(sorters[sort]);
};

const FilterGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <fieldset className="border-t border-line pt-5">
    <legend className="float-left mb-4 w-full text-sm text-mist">{title}</legend>
    <div className="clear-both flex flex-wrap gap-2">{children}</div>
  </fieldset>
);

export const CatalogPage = () => {
  const t = useT();
  const localize = useLocalize();
  const searchParams = useSearchParams();
  const products = useShop((state) => state.products);
  const initialOccasion = searchParams.get("occasion");
  const [filters, setFilters] = useState<Filters>({
    ...EMPTY_FILTERS,
    occasion: isOccasion(initialOccasion) ? initialOccasion : null,
  });
  const [sort, setSort] = useState<SortId>("popular");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const priceBounds = useMemo(() => {
    const prices = products.map((product) => product.price);
    const min = Math.floor((Math.min(...prices, 500) - 1) / 100) * 100;
    const max = Math.ceil(Math.max(...prices, 1000) / 100) * 100;
    return { min, max };
  }, [products]);

  const results = useMemo(() => applyFilters(products, filters, sort), [products, filters, sort]);
  const activeCount =
    Number(Boolean(filters.occasion)) + filters.colors.length + filters.flowers.length + Number(filters.maxPrice !== null);
  const maxPrice = filters.maxPrice ?? priceBounds.max;

  const filterPanel = (
    <div className="space-y-6">
      <FilterGroup title={t.catalog.occasion}>
        {OCCASIONS.map((occasion) => (
          <button
            key={occasion.id}
            type="button"
            aria-pressed={filters.occasion === occasion.id}
            className={chipClass(filters.occasion === occasion.id)}
            onClick={() => setFilters((current) => ({ ...current, occasion: current.occasion === occasion.id ? null : occasion.id }))}
          >
            {localize(occasion.name)}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup title={t.catalog.color}>
        {COLOR_TAGS.map((color) => {
          const active = filters.colors.includes(color.id);
          return (
            <button
              key={color.id}
              type="button"
              aria-pressed={active}
              className={chipClass(active)}
              onClick={() => setFilters((current) => ({ ...current, colors: toggle(current.colors, color.id) }))}
            >
              <span className="h-3.5 w-3.5 rounded-full ring-1 ring-black/20" style={{ background: color.swatch }} />
              {localize(color.name)}
            </button>
          );
        })}
      </FilterGroup>

      <FilterGroup title={t.catalog.flower}>
        {FLOWERS.map((flower) => {
          const active = filters.flowers.includes(flower.kind);
          return (
            <button
              key={flower.kind}
              type="button"
              aria-pressed={active}
              className={chipClass(active)}
              onClick={() => setFilters((current) => ({ ...current, flowers: toggle(current.flowers, flower.kind) }))}
            >
              {localize(flower.name)}
            </button>
          );
        })}
      </FilterGroup>

      <fieldset className="border-t border-line pt-5">
        <legend className="float-left mb-4 flex w-full justify-between text-sm text-mist">
          <span>{t.catalog.price}</span>
          <span className="tabular text-moon">
            {filters.maxPrice === null ? t.catalog.any : `${t.catalog.priceUpTo} ${formatPrice(maxPrice)}`}
          </span>
        </legend>
        <input
          type="range"
          className="clear-both w-full"
          min={priceBounds.min}
          max={priceBounds.max}
          step={50}
          value={maxPrice}
          aria-label={t.catalog.price}
          onChange={(event) => {
            const value = Number(event.target.value);
            setFilters((current) => ({ ...current, maxPrice: value >= priceBounds.max ? null : value }));
          }}
        />
        <div className="tabular mt-1 flex justify-between text-xs text-mist">
          <span>{formatPrice(priceBounds.min)}</span>
          <span>{formatPrice(priceBounds.max)}</span>
        </div>
      </fieldset>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => setFilters(EMPTY_FILTERS)}
          className="text-sm text-mist underline decoration-line underline-offset-4 hover:text-moon"
        >
          {t.catalog.reset}
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-10">
      <h1 className="text-[clamp(2.4rem,5vw,4rem)] leading-tight">{t.catalog.title}</h1>
      <p className="mt-3 max-w-[60ch] text-mist">{t.catalog.lead}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">{filterPanel}</div>
        </aside>

        <div>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <p className="tabular text-mist" aria-live="polite">
              {t.catalog.found(results.length)}
            </p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setDrawerOpen(true)} className={`${buttonGhost} h-10 px-4 lg:hidden`}>
                <FilterIcon />
                {t.catalog.filters}
                {activeCount > 0 && <span className="tabular text-accent">{activeCount}</span>}
              </button>
              <label className="sr-only" htmlFor="sort">
                {t.catalog.sort}
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortId)}
                className="h-10 rounded-full border border-line bg-ink px-4 text-sm text-moon focus:border-accent focus:outline-none"
              >
                <option value="popular">{t.catalog.sortPopular}</option>
                <option value="cheap">{t.catalog.sortCheap}</option>
                <option value="expensive">{t.catalog.sortExpensive}</option>
              </select>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 xl:grid-cols-3">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-line px-6 py-16 text-center">
              <h2 className="text-2xl">{t.catalog.emptyTitle}</h2>
              <p className="mx-auto mt-3 max-w-md text-mist">{t.catalog.emptyText}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button type="button" className={buttonGhost} onClick={() => setFilters(EMPTY_FILTERS)}>
                  {t.catalog.reset}
                </button>
                <Link href="/builder" className={buttonPrimary}>
                  {t.nav.builder}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t.catalog.filters}>
          <button type="button" aria-label={t.nav.close} className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[32px] bg-ink px-5 pb-6 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl">{t.catalog.filters}</h2>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label={t.nav.close} className="grid h-10 w-10 place-items-center">
                <CloseIcon />
              </button>
            </div>
            {filterPanel}
            <button type="button" onClick={() => setDrawerOpen(false)} className={`${buttonPrimary} mt-8 w-full`}>
              {t.catalog.showResults} {t.catalog.found(results.length)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
