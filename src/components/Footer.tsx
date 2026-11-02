"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { brand } from "@/brand.config";
import { useLocale, useT } from "@/lib/hooks";
import { CheckIcon, MoonMark } from "./icons";
import { buttonPrimary } from "./ui";

const Newsletter = () => {
  const t = useT();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (email.includes("@")) setDone(true);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
      <div>
        <h2 className="text-[clamp(2rem,4vw,3.4rem)] leading-[1.05]">{t.premium.newsletterTitle}</h2>
        <p className="mt-4 max-w-[48ch] text-mist">{t.premium.newsletterText}</p>
      </div>
      {done ? (
        <p className="flex items-center gap-3 text-moon" role="status">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-ink">
            <CheckIcon size={16} />
          </span>
          {t.premium.newsletterDone}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center gap-2 rounded-full border border-moon/15 bg-moon/[0.03] p-1.5 pl-5 focus-within:border-accent">
          <label htmlFor="newsletter" className="sr-only">
            {t.premium.newsletterPlaceholder}
          </label>
          <input
            id="newsletter"
            type="email"
            required
            autoComplete="email"
            placeholder={t.premium.newsletterPlaceholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-[15px] text-moon placeholder:text-mist/60 focus:outline-none"
          />
          <button type="submit" className={`${buttonPrimary} h-11 px-5`}>
            {t.premium.newsletterButton}
          </button>
        </form>
      )}
    </div>
  );
};

export const Footer = () => {
  const t = useT();
  const locale = useLocale();

  return (
    <footer className="relative mt-36 overflow-hidden border-t border-moon/10">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "color-mix(in oklab, var(--brand-accent) 10%, transparent)" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-4 pt-20 sm:px-6 lg:px-10">
        <Newsletter />

        <div className="hairline mt-16" />

        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <MoonMark className="text-accent" size={18} />
              <span className="font-display text-2xl tracking-[0.04em]">{brand.name[locale]}</span>
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
      </div>

      {/* oversized wordmark, cropped by the page edge */}
      <div aria-hidden className="relative -mb-[3vw] select-none overflow-hidden text-center">
        <span
          className="block font-display leading-[0.8] tracking-[-0.02em]"
          style={{
            fontSize: "min(19vw, 17.5rem)",
            background: "linear-gradient(180deg, color-mix(in oklab, var(--brand-moon) 14%, transparent), transparent 85%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {brand.name[locale]}
        </span>
      </div>
    </footer>
  );
};
