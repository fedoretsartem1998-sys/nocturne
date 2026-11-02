"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { brand } from "@/brand.config";
import { useCartCount, useLocale, useT } from "@/lib/hooks";
import { useShop } from "@/store/shop";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, MoonMark } from "./icons";

const Badge = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="tabular absolute -top-1 -right-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[11px] font-semibold text-accent-ink">
      {count}
    </span>
  ) : null;

type NavLink = { href: string; label: string };

const DesktopNav = ({ links, pathname }: { links: NavLink[]; pathname?: string }) => (
  <nav className="ml-6 hidden items-center gap-7 md:flex" aria-label="Main">
    {links.map((link) => {
      const active = pathname === link.href;
      return (
        <Link
          key={link.href}
          href={link.href}
          aria-current={active ? "page" : undefined}
          className={`text-[15px] transition-colors hover:text-moon ${active ? "text-moon" : "text-mist"}`}
        >
          {link.label}
        </Link>
      );
    })}
  </nav>
);

/** Reads the current path; kept in its own Suspense boundary so dynamic routes can still prerender the header. */
const ActiveDesktopNav = ({ links }: { links: NavLink[] }) => <DesktopNav links={links} pathname={usePathname()} />;

export const Header = () => {
  const t = useT();
  const locale = useLocale();
  const setLocale = useShop((state) => state.setLocale);
  const favoritesCount = useShop((state) => state.favorites.length);
  const cartCount = useCartCount();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/catalog", label: t.nav.catalog },
    { href: "/builder", label: t.nav.builder },
    { href: "/#delivery", label: t.nav.delivery },
  ];

  const toggleLocale = () => setLocale(locale === "uk" ? "en" : "uk");

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5 text-moon">
          <MoonMark className="text-accent" size={20} />
          <span className="font-display text-[22px] leading-none">{brand.name[locale]}</span>
        </Link>

        <Suspense fallback={<DesktopNav links={links} />}>
          <ActiveDesktopNav links={links} />
        </Suspense>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={t.nav.switchLanguage}
            className="h-10 rounded-full px-3 text-sm text-mist transition-colors hover:text-moon"
          >
            <span className={locale === "uk" ? "text-moon" : ""}>UA</span>
            <span className="mx-1 text-line">/</span>
            <span className={locale === "en" ? "text-moon" : ""}>EN</span>
          </button>
          <Link
            href="/favorites"
            aria-label={t.nav.favorites}
            className="relative grid h-10 w-10 place-items-center rounded-full text-mist transition-colors hover:text-moon"
          >
            <HeartIcon />
            <Badge count={favoritesCount} />
          </Link>
          <Link
            href="/cart"
            aria-label={t.nav.cart}
            className="relative grid h-10 w-10 place-items-center rounded-full text-mist transition-colors hover:text-moon"
          >
            <BagIcon />
            <Badge count={cartCount} />
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-mist md:hidden"
            aria-label={open ? t.nav.close : t.nav.menu}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line/60 px-4 pb-6 pt-2 md:hidden" aria-label="Mobile">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block py-3 font-display text-2xl text-moon">
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};
