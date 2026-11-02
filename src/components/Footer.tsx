"use client";

import Link from "next/link";
import { brand } from "@/brand.config";
import { useLocale, useT } from "@/lib/hooks";
import { MoonMark } from "./icons";

export const Footer = () => {
  const t = useT();
  const locale = useLocale();

  return (
    <footer className="mt-32 border-t border-line/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div>
          <div className="flex items-center gap-2.5">
            <MoonMark className="text-accent" size={20} />
            <span className="font-display text-2xl">{brand.name[locale]}</span>
          </div>
          <p className="mt-3 max-w-xs text-mist">{brand.tagline[locale]}</p>
          <p className="mt-8 max-w-sm text-sm text-mist/70">{t.footer.rights}</p>
        </div>

        <div>
          <h2 className="font-sans! text-sm text-mist">{t.footer.contacts}</h2>
          <ul className="mt-4 space-y-2 text-[15px]">
            <li>
              <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="tabular hover:text-accent">
                {brand.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${brand.email}`} className="hover:text-accent">
                {brand.email}
              </a>
            </li>
            <li className="text-mist">
              {brand.city[locale]}, {brand.address[locale]}
            </li>
            <li className="text-mist">{brand.workingHours[locale]}</li>
            <li className="flex gap-4 pt-2">
              <a href={brand.instagram} className="hover:text-accent" target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href={brand.telegram} className="hover:text-accent" target="_blank" rel="noreferrer">
                Telegram
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-sans! text-sm text-mist">{t.footer.shop}</h2>
          <ul className="mt-4 space-y-2 text-[15px]">
            <li>
              <Link href="/catalog" className="hover:text-accent">
                {t.nav.catalog}
              </Link>
            </li>
            <li>
              <Link href="/builder" className="hover:text-accent">
                {t.nav.builder}
              </Link>
            </li>
            <li>
              <Link href="/favorites" className="hover:text-accent">
                {t.nav.favorites}
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-mist hover:text-accent">
                {t.footer.admin}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
