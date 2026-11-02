import type { Metadata } from "next";
import { BuilderPage } from "@/components/builder/BuilderPage";

export const metadata: Metadata = { title: "Конструктор букета" };

export default function Page() {
  return <BuilderPage />;
}
