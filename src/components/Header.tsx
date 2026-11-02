"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { brand } from "@/brand.config";
import { useCartCount, useLocale, useT } from "@/lib/hooks";
import { useShop } from "@/store/shop";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, MoonMark } from "./icons";

const Badge = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="tabular absolute -top-0.5 -right-1 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-ink">
      {count}
    </span>
  ) : null;

type NavLink = { href: string; label: string };

const DesktopNav = ({ links, pathname }: { links: NavLink[]; pathname?: string }) => (
  <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
    {links.map((link) => {
      const active = pathname === link.href;
      return (
        <Link
          key={link.href}
          href={link.href}
          aria-current={active ? "page" : undefined}
          className={`group relative py-1 text-[14px] transition-colors hover:text-moon ${active ? "text-moon" : "text-moon/70"}`}
        >
          {link.label}
          <span
            className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-500 ease-out ${
              active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
            }`}
          />
        </Link>
      );
    })}
  </nav>
);

/** Reads the current path; kept in its own Suspense boundary so dynamic routes can still prerender the header. */
const ActiveDesktopNav = ({ links }: { links: NavLink[] }) => <DesktopNav links={links} pathname={usePathname()} />;

const iconButton = "relative grid h-10 w-10 place-items-center rounded-full text-moon/80 transition-colors hover:bg-moon/5 hover:text-moon";

export const Header = () => {
  const t = useT();
  const locale = useLocale();
  const setLocale = useShop((state) => state.setLocale);
  const favoritesCount = useShop((state) => state.favorites.length);
  const cartCount = useCartCount();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/catalog", label: t.nav.catalog },
    { href: "/builder", label: t.nav.builder },
    { href: "/#delivery", label: t.nav.delivery },
  ];

  const toggleLocale = () => setLocale(locale === "uk" ? "en" : "uk");
  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-500 ${
        solid ? "border-b border-moon/10 bg-ink/75 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto grid h-[72px] max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-10">
        <div className="flex items-center">
          <button
            type="button"
            className={`${iconButton} -ml-2 md:hidden`}
            aria-label={open ? t.nav.close : t.nav.menu}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
          <Suspense fallback={<DesktopNav links={links} />}>
            <ActiveDesktopNav links={links} />
          </Suspense>
        </div>

        <Link href="/" className="flex items-center gap-2.5 text-moon" aria-label={brand.name[locale]}>
          <MoonMark className="text-accent" size={18} />
          <span className="font-display text-[22px] leading-none tracking-[0.04em] sm:text-[24px]">{brand.name[locale]}</span>
        </Link>

        <div className="flex items-center justify-end gap-0.5">
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={t.nav.switchLanguage}
            className="mr-1 hidden h-10 rounded-full px-3 text-[13px] text-moon/60 transition-colors hover:text-moon sm:block"
          >
            <span className={locale === "uk" ? "text-moon" : ""}>UA</span>
            <span className="mx-1.5 text-moon/25">/</span>
            <span className={locale === "en" ? "text-moon" : ""}>EN</span>
          </button>
          <Link href="/favorites" aria-label={t.nav.favorites} className={iconButton}>
            <HeartIcon />
            <Badge count={favoritesCount} />
          </Link>
          <Link href="/cart" aria-label={t.nav.cart} className={iconButton}>
            <BagIcon />
            <Badge count={cartCount} />
          </Link>
        </div>
      </div>

      {open && (
        <nav className="border-t border-moon/10 px-4 pb-8 pt-4 md:hidden" aria-label="Mobile">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block py-3 font-display text-3xl text-moon">
              {link.label}
            </Link>
          ))}
          <button type="button" onClick={toggleLocale} className="mt-4 text-sm text-mist">
            {t.nav.switchLanguage}
          </button>
        </nav>
      )}
    </header>
  );
};
