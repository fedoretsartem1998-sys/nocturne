import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import "@fontsource/prata/cyrillic-400.css";
import "@fontsource/prata/latin-400.css";
import "@fontsource/onest/cyrillic-400.css";
import "@fontsource/onest/cyrillic-500.css";
import "@fontsource/onest/cyrillic-600.css";
import "@fontsource/onest/400.css";
import "@fontsource/onest/500.css";
import "@fontsource/onest/600.css";
import "./globals.css";
import { brand } from "@/brand.config";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StoreHydrator } from "@/components/StoreHydrator";

export const metadata: Metadata = {
  title: { default: `${brand.name.uk} — ${brand.tagline.uk}`, template: `%s · ${brand.name.uk}` },
  description: "Квіткова майстерня з доставкою букетів по місту за дві години. Каталог, конструктор букета, листівка від руки.",
};

export const viewport: Viewport = {
  themeColor: brand.colors.ink,
};

const brandVariables = {
  "--brand-ink": brand.colors.ink,
  "--brand-plum": brand.colors.plum,
  "--brand-plum-raised": brand.colors.plumRaised,
  "--brand-line": brand.colors.line,
  "--brand-moon": brand.colors.moon,
  "--brand-mist": brand.colors.mist,
  "--brand-accent": brand.colors.accent,
  "--brand-accent-ink": brand.colors.accentInk,
  "--brand-sage": brand.colors.sage,
} as CSSProperties;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk" style={brandVariables}>
      <body className="flex min-h-dvh flex-col">
        <StoreHydrator />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
