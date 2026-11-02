"use client";

import { useEffect } from "react";
import { useShop } from "@/store/shop";

/** Loads cart, favorites and catalog edits from localStorage after the first render, avoiding hydration mismatches. */
export const StoreHydrator = () => {
  const locale = useShop((state) => state.locale);

  useEffect(() => {
    void useShop.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
};
