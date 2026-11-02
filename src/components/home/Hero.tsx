"use client";

import Image from "next/image";
import Link from "next/link";
import { brand } from "@/brand.config";
import { useLocale, useT } from "@/lib/hooks";
import { buttonGhost, buttonPrimary } from "../ui";

export const Hero = () => {
  const t = useT();
  const locale = useLocale();

  return (
    <section className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pb-10 pt-6 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6 lg:px-10 lg:pt-12">
      <div className="relative z-10 order-2 lg:order-1">
        <h1 className="max-w-[11ch] text-[clamp(2.9rem,7vw,6rem)] leading-[1]">{t.hero.title}</h1>
        <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-mist">{t.hero.lead}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/catalog" className={buttonPrimary}>
            {t.hero.primary}
          </Link>
          <Link href="/builder" className={buttonGhost}>
            {t.hero.secondary}
          </Link>
        </div>
        <p className="mt-10 text-sm text-mist">
          {brand.city[locale]}. {brand.workingHours[locale]}.{" "}
          <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="tabular text-moon hover:text-accent">
            {brand.phone}
          </a>
        </p>
      </div>

      <div className="hero-photo relative order-1 aspect-[4/3] w-full lg:order-2 lg:-mr-10">
        <Image
          src="/site/hero.jpg"
          alt={t.hero.photoAlt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
      </div>
    </section>
  );
};
