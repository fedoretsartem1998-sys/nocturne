"use client";

import { brand } from "@/brand.config";
import { useShop } from "@/store/shop";
import { dictionaries } from "./i18n";
import type { Localized } from "./types";

export const useLocale = () => useShop((state) => state.locale);

export const useT = () => dictionaries[useLocale()];

export const useLocalize = () => {
  const locale = useLocale();
  return (value: Localized) => value[locale] || value.uk;
};

export const formatPrice = (amount: number) =>
  `${amount.toLocaleString("uk-UA").replace(/,/g, " ")} ${brand.currency}`;

export const useCartCount = () => useShop((state) => state.cart.reduce((sum, line) => sum + line.qty, 0));

export const useCartTotals = () => {
  const cart = useShop((state) => state.cart);
  const subtotal = cart.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);
  const delivery = subtotal === 0 || subtotal >= brand.freeDeliveryFrom ? 0 : brand.deliveryFee;
  return { subtotal, delivery, total: subtotal + delivery };
};
