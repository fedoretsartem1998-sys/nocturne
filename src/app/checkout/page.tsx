import type { Metadata } from "next";
import { CheckoutPage } from "@/components/checkout/CheckoutPage";

export const metadata: Metadata = { title: "Оформлення замовлення" };

export default function Page() {
  return <CheckoutPage />;
}
