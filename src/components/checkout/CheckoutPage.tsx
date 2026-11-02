"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { brand } from "@/brand.config";
import { formatPrice, useCartTotals, useLocale, useLocalize, useT } from "@/lib/hooks";
import type { Order } from "@/lib/types";
import { useShop } from "@/store/shop";
import { CartLineArt } from "../cart/CartLineArt";
import { CheckIcon, MoonMark } from "../icons";
import { buttonGhost, buttonPrimary, chipClass, fieldClass } from "../ui";

const CARD_LIMIT = 200;
const PHONE_PATTERN = /^\+?\d[\d\s()-]{8,}$/;

type FormState = {
  name: string;
  phone: string;
  recipientName: string;
  recipientPhone: string;
  pickup: boolean;
  address: string;
  dayOffset: number;
  slot: string;
  cardText: string;
  anonymous: boolean;
};

type FieldKey = "name" | "phone" | "recipientName" | "recipientPhone" | "address" | "slot";

const INITIAL: FormState = {
  name: "",
  phone: "",
  recipientName: "",
  recipientPhone: "",
  pickup: false,
  address: "",
  dayOffset: 0,
  slot: "",
  cardText: "",
  anonymous: false,
};

const dateFor = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date;
};

const slotStartHour = (slot: string) => Number(slot.slice(0, 2));

const Field = ({ label, error, hint, children, id }: { label: string; error?: string; hint?: string; children: ReactNode; id: string }) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-sm text-mist">
      {label}
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} className="mt-1.5 text-sm text-accent">
        {error}
      </p>
    ) : hint ? (
      <p className="mt-1.5 text-sm text-mist/80">{hint}</p>
    ) : null}
  </div>
);

export const CheckoutPage = () => {
  const t = useT();
  const locale = useLocale();
  const localize = useLocalize();
  const hydrated = useShop((state) => state.hydrated);
  const cart = useShop((state) => state.cart);
  const placeOrder = useShop((state) => state.placeOrder);
  const { subtotal, delivery, total } = useCartTotals();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [order, setOrder] = useState<Order | null>(null);
  // read the clock only in the browser; the form itself renders after the store hydrates, so server HTML never depends on it
  const [now] = useState<Date | null>(() => (typeof window === "undefined" ? null : new Date()));

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (key in errors) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const isSlotPast = (slot: string) => {
    if (!now || form.dayOffset !== 0) return false;
    return slotStartHour(slot) < now.getHours() + brand.leadTimeHours;
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString(locale === "uk" ? "uk-UA" : "en-GB", { weekday: "long", day: "numeric", month: "long" });

  const validate = () => {
    const next: Partial<Record<FieldKey, string>> = {};
    if (!form.name.trim()) next.name = t.checkout.required;
    if (!PHONE_PATTERN.test(form.phone.trim())) next.phone = form.phone.trim() ? t.checkout.phoneInvalid : t.checkout.required;
    if (!form.pickup) {
      if (!form.recipientName.trim()) next.recipientName = t.checkout.required;
      if (!PHONE_PATTERN.test(form.recipientPhone.trim()))
        next.recipientPhone = form.recipientPhone.trim() ? t.checkout.phoneInvalid : t.checkout.required;
      if (!form.address.trim()) next.address = t.checkout.required;
    }
    if (!form.slot || isSlotPast(form.slot)) next.slot = t.checkout.pickSlot;
    return next;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    const firstError = Object.keys(found)[0];
    if (firstError) {
      document.getElementById(firstError)?.focus();
      return;
    }
    const placed = placeOrder({
      items: cart,
      total: form.pickup ? subtotal : total,
      delivery: {
        date: dateFor(form.dayOffset).toISOString().slice(0, 10),
        slot: form.slot,
        address: form.pickup ? "" : form.address.trim(),
        recipientName: form.recipientName.trim(),
        recipientPhone: form.recipientPhone.trim(),
      },
      customer: { name: form.name.trim(), phone: form.phone.trim() },
      cardText: form.cardText.trim(),
      anonymous: form.anonymous,
      pickup: form.pickup,
    });
    setOrder(placed);
    window.scrollTo({ top: 0 });
  };

  if (order) {
    const dateLabel = formatDate(new Date(`${order.delivery.date}T12:00:00`));
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-ink">
          <CheckIcon size={28} />
        </span>
        <h1 className="mt-8 text-[clamp(2.2rem,5vw,3.6rem)] leading-tight">{t.checkout.thanksTitle}</h1>
        <p className="mt-5 text-lg text-mist">{t.checkout.thanksText(order.id)}</p>
        <p className="mt-2 text-lg">
          {order.pickup ? t.checkout.thanksPickup(dateLabel, order.delivery.slot) : t.checkout.thanksDelivery(dateLabel, order.delivery.slot)}
        </p>
        <p className="mt-10 max-w-md text-sm text-mist/80">{t.checkout.demoNote}</p>
        <Link href="/" className={`${buttonGhost} mt-8`}>
          {t.checkout.backHome}
        </Link>
      </div>
    );
  }

  if (!hydrated) return <div className="min-h-[70vh]" />;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-4xl">{t.cart.emptyTitle}</h1>
        <p className="mt-3 text-mist">{t.cart.emptyText}</p>
        <Link href="/catalog" className={`${buttonPrimary} mt-8`}>
          {t.cart.toCatalog}
        </Link>
      </div>
    );
  }

  const errorProps = (key: FieldKey) =>
    errors[key] ? { "aria-invalid": true, "aria-describedby": `${key}-error` } : {};

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-10">
      <h1 className="text-[clamp(2.4rem,5vw,4rem)] leading-tight">{t.checkout.title}</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl">{t.checkout.you}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field id="name" label={t.checkout.yourName} error={errors.name}>
                <input id="name" className={fieldClass} autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)} {...errorProps("name")} />
              </Field>
              <Field id="phone" label={t.checkout.yourPhone} error={errors.phone}>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+380"
                  className={`${fieldClass} tabular`}
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  {...errorProps("phone")}
                />
              </Field>
            </div>
          </section>

          <section>
            <h2 className="text-2xl">{t.checkout.deliveryTitle}</h2>
            <div className="mt-5 flex gap-2">
              <button type="button" aria-pressed={!form.pickup} className={chipClass(!form.pickup)} onClick={() => update("pickup", false)}>
                {t.checkout.courier}
              </button>
              <button type="button" aria-pressed={form.pickup} className={chipClass(form.pickup)} onClick={() => update("pickup", true)}>
                {t.checkout.pickup}
              </button>
            </div>

            {form.pickup ? (
              <p className="mt-5 text-mist">
                {brand.city[locale]}, {brand.address[locale]}. {brand.workingHours[locale]}.
              </p>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field id="recipientName" label={t.checkout.recipientName} error={errors.recipientName}>
                  <input id="recipientName" className={fieldClass} value={form.recipientName} onChange={(e) => update("recipientName", e.target.value)} {...errorProps("recipientName")} />
                </Field>
                <Field id="recipientPhone" label={t.checkout.recipientPhone} error={errors.recipientPhone} hint={t.checkout.recipientHint}>
                  <input
                    id="recipientPhone"
                    type="tel"
                    inputMode="tel"
                    placeholder="+380"
                    className={`${fieldClass} tabular`}
                    value={form.recipientPhone}
                    onChange={(e) => update("recipientPhone", e.target.value)}
                    {...errorProps("recipientPhone")}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field id="address" label={t.checkout.address} error={errors.address}>
                    <input
                      id="address"
                      autoComplete="street-address"
                      placeholder={t.checkout.addressPlaceholder}
                      className={fieldClass}
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                      {...errorProps("address")}
                    />
                  </Field>
                </div>
              </div>
            )}

            <fieldset className="mt-8">
              <legend className="mb-3 text-sm text-mist">{t.checkout.date}</legend>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3, 4].map((offset) => {
                  const date = dateFor(offset);
                  const label =
                    offset === 0
                      ? t.checkout.today
                      : offset === 1
                        ? t.checkout.tomorrow
                        : now
                          ? date.toLocaleDateString(locale === "uk" ? "uk-UA" : "en-GB", { weekday: "short", day: "numeric" })
                          : "";
                  return (
                    <button
                      key={offset}
                      type="button"
                      aria-pressed={form.dayOffset === offset}
                      className={`${chipClass(form.dayOffset === offset)} min-w-[96px] justify-center capitalize`}
                      onClick={() => update("dayOffset", offset)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className="mb-3 text-sm text-mist">{t.checkout.slot}</legend>
              <div id="slot" tabIndex={-1} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {brand.deliverySlots.map((slot) => {
                  const past = isSlotPast(slot);
                  const active = form.slot === slot && !past;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={past}
                      title={past ? t.checkout.slotUnavailable : undefined}
                      aria-pressed={active}
                      onClick={() => update("slot", slot)}
                      className={`tabular h-11 rounded-2xl border text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                        active ? "border-accent bg-accent text-accent-ink" : "border-line hover:border-mist"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {errors.slot && <p className="mt-2 text-sm text-accent">{errors.slot}</p>}
            </fieldset>
          </section>

          <section>
            <h2 className="text-2xl">{t.checkout.card}</h2>
            <textarea
              aria-label={t.checkout.card}
              maxLength={CARD_LIMIT}
              rows={4}
              placeholder={t.checkout.cardPlaceholder}
              className={`${fieldClass} mt-5 h-auto resize-none py-3 font-display text-lg leading-relaxed`}
              value={form.cardText}
              onChange={(e) => update("cardText", e.target.value)}
            />
            <p className="tabular mt-1.5 text-right text-sm text-mist">{t.checkout.cardLeft(CARD_LIMIT - form.cardText.length)}</p>
            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 accent-[var(--brand-accent)]"
                checked={form.anonymous}
                onChange={(e) => update("anonymous", e.target.checked)}
              />
              <span>
                <span className="block">{t.checkout.anonymous}</span>
                <span className="block text-sm text-mist">{t.checkout.anonymousHint}</span>
              </span>
            </label>
          </section>
        </div>

        <aside className="h-fit rounded-[28px] bg-plum p-6 lg:sticky lg:top-24">
          <h2 className="text-2xl">{t.checkout.summary}</h2>
          <ul className="mt-5 space-y-4">
            {cart.map((item) => (
              <li key={item.key} className="flex items-center gap-3">
                <CartLineArt item={item} title={localize(item.name)} className="h-16 w-14" />
                <span className="min-w-0 flex-1 truncate">
                  {localize(item.name)}
                  {item.qty > 1 && <span className="tabular text-mist"> × {item.qty}</span>}
                </span>
                <span className="tabular">{formatPrice(item.unitPrice * item.qty)}</span>
              </li>
            ))}
          </ul>
          {form.cardText.trim() && (
            <div className="mt-6 rounded-2xl bg-moon px-5 py-4 text-ink">
              <MoonMark size={14} className="text-accent-ink/60" />
              <p className="mt-2 whitespace-pre-line font-display text-[17px] leading-relaxed">{form.cardText}</p>
            </div>
          )}
          <dl className="mt-6 space-y-2 border-t border-line pt-4">
            <div className="flex justify-between">
              <dt className="text-mist">{t.cart.subtotal}</dt>
              <dd className="tabular">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mist">{t.cart.delivery}</dt>
              <dd className="tabular">{form.pickup || delivery === 0 ? t.cart.free : formatPrice(delivery)}</dd>
            </div>
            <div className="flex justify-between pt-2 text-xl">
              <dt>{t.cart.total}</dt>
              <dd className="tabular">{formatPrice(form.pickup ? subtotal : total)}</dd>
            </div>
          </dl>
          <button type="submit" className={`${buttonPrimary} mt-6 w-full`}>
            {t.checkout.place}
          </button>
          <p className="mt-4 text-xs leading-relaxed text-mist/80">{t.checkout.demoNote}</p>
        </aside>
      </form>
    </div>
  );
};
