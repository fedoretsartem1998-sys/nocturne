"use client";

import Link from "next/link";
import { useState } from "react";
import { brand } from "@/brand.config";
import { useLocale, useT } from "@/lib/hooks";
import type { Stem } from "@/lib/types";
import { Bouquet } from "../bouquet/Bouquet";
import { buttonGhost, buttonPrimary } from "../ui";

const HERO_STEMS: Stem[] = [
  ...Array(3).fill({ kind: "eucalyptus", color: "#8FA898" }),
  ...Array(3).fill({ kind: "lavender", color: "#9C83C9" }),
  ...Array(2).fill({ kind: "gypsophila", color: "#F7F2F4" }),
  ...Array(3).fill({ kind: "peony", color: "#EE9DB6" }),
  { kind: "peony", color: "#F6E7EA" },
  { kind: "hydrangea", color: "#C9A6DD" },
  ...Array(4).fill({ kind: "rose", color: "#EBA6B8" }),
  ...Array(3).fill({ kind: "ranunculus", color: "#8E3B6E" }),
  ...Array(3).fill({ kind: "ranunculus", color: "#F5DDE3" }),
  ...Array(2).fill({ kind: "rose", color: "#F3E6DA" }),
];

export const Hero = () => {
  const t = useT();
  const locale = useLocale();
  const [bloomKey, setBloomKey] = useState(0);

  return (
    <section className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-10 lg:pt-16">
      <div className="order-2 lg:order-1">
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

      <div className="relative order-1 mx-auto w-full max-w-[560px] lg:order-2">
        <div
          aria-hidden
          className="absolute left-1/2 top-[6%] aspect-square w-[78%] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 38% 34%, color-mix(in oklab, var(--brand-moon) 16%, transparent), color-mix(in oklab, var(--brand-accent) 8%, transparent) 58%, transparent 72%)",
          }}
        />
        <Bouquet
          key={bloomKey}
          stems={HERO_STEMS}
          wrap="night"
          ribbon="#E9A9BE"
          bloom
          title={t.hero.title}
          className="relative w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)]"
        />
        <button
          type="button"
          onClick={() => setBloomKey((key) => key + 1)}
          className="absolute bottom-2 right-2 rounded-full px-3 py-2 text-sm text-mist transition-colors hover:text-moon"
        >
          {t.hero.replay}
        </button>
      </div>
    </section>
  );
};
