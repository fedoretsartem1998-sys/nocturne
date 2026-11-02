"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { brand } from "@/brand.config";
import { SIZES } from "@/lib/catalog";
import { formatPrice, useLocale, useLocalize, useT } from "@/lib/hooks";
import type { Product } from "@/lib/types";
import { useShop } from "@/store/shop";
import { CartLineArt } from "../cart/CartLineArt";
import { MoonMark, PlusIcon } from "../icons";
import { artFrame, ProductArt } from "../ProductArt";
import { buttonGhost, buttonPrimary, chipClass, fieldClass } from "../ui";
import { ProductEditor } from "./ProductEditor";

type Tab = "products" | "orders";

const blankProduct = (): Product => ({
  id: `bouquet-${Date.now().toString(36)}`,
  name: { uk: "", en: "" },
  description: { uk: "", en: "" },
  price: 1500,
  occasions: ["justBecause"],
  color: "pink",
  composition: [
    { kind: "rose", color: "#EBA6B8" },
    { kind: "rose", color: "#EBA6B8" },
    { kind: "rose", color: "#EBA6B8" },
    { kind: "rose", color: "#EBA6B8" },
    { kind: "rose", color: "#EBA6B8" },
  ],
  wrap: "kraft",
  ribbon: "#E9A9BE",
  available: true,
});

const PinGate = () => {
  const t = useT();
  const unlock = useShop((state) => state.setAdminUnlocked);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (pin === brand.adminPin) unlock(true);
    else setError(true);
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-24 text-center">
      <MoonMark size={36} className="mx-auto text-accent" />
      <h1 className="mt-6 text-4xl">{t.admin.pinTitle}</h1>
      <p className="mt-2 text-mist">{t.admin.pinHint}</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-3">
        <label htmlFor="pin" className="sr-only">
          {t.admin.pin}
        </label>
        <input
          id="pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          placeholder={t.admin.pin}
          className={`${fieldClass} tabular text-center text-xl tracking-[0.5em]`}
          value={pin}
          aria-invalid={error}
          onChange={(event) => {
            setPin(event.target.value);
            setError(false);
          }}
        />
        {error && <p className="text-sm text-accent">{t.admin.wrongPin}</p>}
        <button type="submit" className={`${buttonPrimary} w-full`}>
          {t.admin.enter}
        </button>
      </form>
    </div>
  );
};

const ProductsTab = () => {
  const t = useT();
  const localize = useLocalize();
  const products = useShop((state) => state.products);
  const saveProduct = useShop((state) => state.saveProduct);
  const deleteProduct = useShop((state) => state.deleteProduct);
  const resetProducts = useShop((state) => state.resetProducts);
  const [editing, setEditing] = useState<Product | null>(null);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" className={buttonPrimary} onClick={() => setEditing(blankProduct())}>
          <PlusIcon /> {t.admin.add}
        </button>
        <button
          type="button"
          className="text-sm text-mist underline decoration-line underline-offset-4 hover:text-moon"
          onClick={() => window.confirm(t.admin.resetConfirm) && resetProducts()}
        >
          {t.admin.resetAll}
        </button>
      </div>

      <ul className="mt-6 divide-y divide-line/70 border-y border-line/70">
        {products.map((product) => {
          const name = localize(product.name);
          return (
            <li key={product.id} className="flex flex-wrap items-center gap-4 py-4">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-plum">
                <div className={`absolute ${artFrame(product, "inset-[6%]")}`}>
                  <ProductArt product={product} title={name} sizes="80px" />
                </div>
              </div>
              <div className="min-w-[160px] flex-1">
                <Link href={`/bouquet/${product.id}`} className="text-lg hover:text-accent">
                  {name}
                </Link>
                <p className="mt-0.5 text-sm text-mist">
                  {t.product.stems(product.composition.length)}
                  {product.badge && `, ${product.badge === "bestseller" ? t.product.bestseller : t.product.new}`.toLowerCase()}
                  {!product.available && <span className="text-accent"> {t.admin.hidden}</span>}
                </p>
              </div>
              <p className="tabular w-28 text-right">{formatPrice(product.price)}</p>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-mist">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[var(--brand-accent)]"
                  checked={product.available}
                  onChange={(event) => saveProduct({ ...product, available: event.target.checked })}
                />
                {t.admin.available}
              </label>
              <div className="flex gap-2">
                <button type="button" className={`${buttonGhost} h-10 px-4 text-sm`} onClick={() => setEditing(product)}>
                  {t.admin.edit}
                </button>
                <button
                  type="button"
                  className="h-10 rounded-full px-4 text-sm text-mist hover:text-accent"
                  onClick={() => window.confirm(t.admin.deleteConfirm) && deleteProduct(product.id)}
                >
                  {t.admin.delete}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {editing && (
        <ProductEditor
          product={editing}
          onClose={() => setEditing(null)}
          onSave={(product) => {
            saveProduct(product);
            setEditing(null);
          }}
        />
      )}
    </>
  );
};

const OrdersTab = () => {
  const t = useT();
  const locale = useLocale();
  const localize = useLocalize();
  const orders = useShop((state) => state.orders);

  if (orders.length === 0) {
    return <p className="rounded-[28px] border border-dashed border-line px-6 py-14 text-center text-mist">{t.admin.noOrders}</p>;
  }

  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <li key={order.id} className="rounded-[28px] bg-plum p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="tabular text-2xl">{order.id}</h2>
            <p className="tabular text-xl">{formatPrice(order.total)}</p>
          </div>
          <p className="mt-1 text-sm text-mist">
            {new Date(order.createdAt).toLocaleString(locale === "uk" ? "uk-UA" : "en-GB", { dateStyle: "medium", timeStyle: "short" })}
          </p>
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            <ul className="space-y-3">
              {order.items.map((item) => (
                <li key={item.key} className="flex items-center gap-3">
                  <CartLineArt item={item} title={localize(item.name)} className="h-14 w-12" />
                  <span className="text-sm">
                    {localize(item.name)}
                    {item.size && <span className="text-mist"> {localize(SIZES.find((size) => size.id === item.size)?.name ?? { uk: "", en: "" })}</span>}
                    {item.qty > 1 && <span className="tabular text-mist"> × {item.qty}</span>}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="space-y-1 text-sm">
              <dt className="text-mist">{order.pickup ? t.checkout.pickup : t.checkout.courier}</dt>
              <dd className="tabular">
                {order.delivery.date}, {order.delivery.slot}
              </dd>
              {!order.pickup && (
                <>
                  <dd>{order.delivery.address}</dd>
                  <dd>
                    {order.delivery.recipientName}, <span className="tabular">{order.delivery.recipientPhone}</span>
                  </dd>
                </>
              )}
              <dt className="pt-2 text-mist">{t.checkout.you}</dt>
              <dd>
                {order.customer.name}, <span className="tabular">{order.customer.phone}</span>
                {order.anonymous && <span className="text-accent">. {t.checkout.anonymous}</span>}
              </dd>
            </dl>
            {order.cardText && (
              <blockquote className="h-fit rounded-2xl bg-moon px-4 py-3 font-display text-ink">{order.cardText}</blockquote>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export const AdminPage = () => {
  const t = useT();
  const hydrated = useShop((state) => state.hydrated);
  const unlocked = useShop((state) => state.adminUnlocked);
  const ordersCount = useShop((state) => state.orders.length);
  const lock = useShop((state) => state.setAdminUnlocked);
  const [tab, setTab] = useState<Tab>("products");

  if (!hydrated) return <div className="min-h-[70vh]" />;
  if (!unlocked) return <PinGate />;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(2.4rem,5vw,4rem)] leading-tight">{t.admin.title}</h1>
          <p className="mt-2 max-w-[60ch] text-mist">{t.admin.lead}</p>
        </div>
        <button type="button" className="text-sm text-mist hover:text-moon" onClick={() => lock(false)}>
          {t.admin.logout}
        </button>
      </div>

      <div className="mt-8 flex gap-2" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "products"} className={chipClass(tab === "products")} onClick={() => setTab("products")}>
          {t.admin.products}
        </button>
        <button type="button" role="tab" aria-selected={tab === "orders"} className={chipClass(tab === "orders")} onClick={() => setTab("orders")}>
          {t.admin.orders}
          {ordersCount > 0 && <span className="tabular opacity-70">{ordersCount}</span>}
        </button>
      </div>

      <div className="mt-8">{tab === "products" ? <ProductsTab /> : <OrdersTab />}</div>
    </div>
  );
};
