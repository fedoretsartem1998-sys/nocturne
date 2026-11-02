import type { Metadata } from "next";
import { AdminPage } from "@/components/admin/AdminPage";

export const metadata: Metadata = { title: "Адмін-панель", robots: { index: false } };

export default function Page() {
  return <AdminPage />;
}
