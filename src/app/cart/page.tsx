"use client";

import Link from "next/link";
import { brand } from "@/brand.config";
import { CartLineArt } from "@/components/cart/CartLineArt";
import { BagIcon, MinusIcon, PlusIcon } from "@/components/icons";
import { buttonPrimary } from "@/components/ui";
import { SIZES } from "@/lib/catalog";
import { formatPrice, useCartTotals, useLocalize, useT } from "@/lib/hooks";
import { useShop } from "@/store/shop";

export default function CartPage() {
  const t = useT();
  const localize = useLocalize();
  const hydrated = useShop((state) => state.hydrated);
  const cart = useShop((state) => state.cart);
  const setQty = useShop((state) => state.setQty);
  const removeFromCart = useShop((state) => state.removeFromCart);
  const { subtotal, delivery, total } = useCartTotals();
  const untilFree = brand.freeDeliveryFrom - subtotal;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-10">
      <h1 className="text-[clamp(2.4rem,5vw,4rem)] leading-tight">{t.cart.title}</h1>

      {!hydrated ? null : cart.length === 0 ? (
        <div className="mt-12 rounded-[28px] border border-dashed border-line px-6 py-16 text-center">
          <BagIcon size={32} className="mx-auto text-accent" />
          <h2 className="mt-4 text-2xl">{t.cart.emptyTitle}</h2>
          <p className="mx-auto mt-3 max-w-md text-mist">{t.cart.emptyText}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/catalog" className={buttonPrimary}>
              {t.cart.toCatalog}
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <ul className="divide-y divide-line/70 border-y border-line/70">
            {cart.map((item) => {
              const name = localize(item.name);
              const size = SIZES.find((option) => option.id === item.size);
              return (
                <li key={item.key} className="flex gap-4 py-5 sm:gap-6">
                  {item.productId ? (
                    <Link href={`/bouquet/${item.productId}`}>
                      <CartLineArt item={item} title={name} className="h-28 w-24 sm:h-32 sm:w-28" />
                    </Link>
                  ) : (
                    <CartLineArt item={item} title={name} className="h-28 w-24 sm:h-32 sm:w-28" />
                  )}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl leading-tight">{name}</h2>
                        <p className="mt-1 text-sm text-mist">
                          {item.custom ? t.builder.stemsCount(item.composition.length) : size ? localize(size.name) : null}
                        </p>
                      </div>
                      <p className="tabular shrink-0 text-lg">{formatPrice(item.unitPrice * item.qty)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center gap-1 rounded-full border border-line p-1">
                        <button
                          type="button"
                          aria-label={t.builder.decrease}
                          onClick={() => setQty(item.key, item.qty - 1)}
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-plum-raised"
                        >
                          <MinusIcon size={16} />
                        </button>
                        <span className="tabular w-6 text-center">{item.qty}</span>
                        <button
                          type="button"
                          aria-label={t.builder.increase}
                          onClick={() => setQty(item.key, item.qty + 1)}
                          className="grid h-8 w-8 place-items-center rounded-full hover:bg-plum-raised"
                        >
                          <PlusIcon size={16} />
                        </button>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item.key)} className="text-sm text-mist hover:text-moon">
                        {t.cart.remove}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit rounded-[28px] bg-plum p-6 lg:sticky lg:top-24">
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-mist">{t.cart.subtotal}</dt>
                <dd className="tabular">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-mist">{t.cart.delivery}</dt>
                <dd className="tabular">{delivery === 0 ? t.cart.free : formatPrice(delivery)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-xl">
                <dt>{t.cart.total}</dt>
                <dd className="tabular">{formatPrice(total)}</dd>
              </div>
            </dl>
            {untilFree > 0 && (
              <div className="mt-5">
                <div className="h-1 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-sage transition-[width] duration-500" style={{ width: `${(subtotal / brand.freeDeliveryFrom) * 100}%` }} />
                </div>
                <p className="mt-2 text-sm text-mist">{t.cart.untilFree(formatPrice(untilFree))}</p>
              </div>
            )}
            <Link href="/checkout" className={`${buttonPrimary} mt-6 w-full`}>
              {t.cart.checkout}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
