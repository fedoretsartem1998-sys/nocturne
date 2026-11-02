"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { brand } from "@/brand.config";
import { useLocale, useT } from "@/lib/hooks";
import { MoonMark } from "../icons";
import { RisingWords } from "../Reveal";
import { buttonGhost, buttonPrimary } from "../ui";

const fade = (delay: number) => ({ "--fade-delay": `${delay}ms` }) as CSSProperties;

const RotatingBadge = ({ text }: { text: string }) => (
  <div className="relative grid h-[132px] w-[132px] place-items-center">
    <svg viewBox="0 0 132 132" className="spin-slow absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <path id="badge-circle" d="M66,66 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" />
      </defs>
      <text className="fill-moon/80" style={{ fontSize: 10.5 }}>
        <textPath href="#badge-circle" textLength={322} lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
    </svg>
    <span className="grid h-14 w-14 place-items-center rounded-full border border-moon/15 bg-ink/40 backdrop-blur-md">
      <MoonMark className="text-accent" size={20} />
    </span>
  </div>
);

export const Hero = () => {
  const t = useT();
  const locale = useLocale();

  return (
    <section className="relative -mt-[72px] flex min-h-[100svh] flex-col overflow-hidden">
      {/* photo layer */}
      <div className="absolute inset-0 lg:left-[30%]">
        <div className="hero-drift absolute inset-0">
          <Image
            src="/site/hero.jpg"
            alt={t.hero.photoAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="object-cover object-[50%_40%]"
          />
        </div>
      </div>
      {/* light shaping: fade into the page on the left and bottom, darken the top for the header */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />
      <div aria-hidden className="absolute inset-y-0 left-0 hidden w-[58%] bg-gradient-to-r from-ink from-40% via-ink/80 to-transparent lg:block" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(60% 50% at 70% 35%, transparent 0%, color-mix(in oklab, var(--brand-ink) 35%, transparent) 100%)" }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-end px-4 pb-10 pt-40 sm:px-6 lg:px-10 lg:pb-12">
        <p className="fade-up flex items-center gap-3 text-sm text-moon/70" style={fade(150)}>
          <span className="h-px w-10 bg-accent" />
          {t.premium.heroKicker}
        </p>

        <h1 className="mt-6 max-w-[11ch] text-[clamp(3.2rem,8.6vw,8.4rem)] leading-[0.96]">
          <RisingWords text={t.hero.title} startDelay={250} step={90} />
        </h1>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[46ch]">
            <p className="fade-up text-lg leading-relaxed text-moon/75" style={fade(700)}>
              {t.hero.lead}
            </p>
            <div className="fade-up mt-8 flex flex-wrap gap-3" style={fade(850)}>
              <Link href="/catalog" className={buttonPrimary}>
                {t.hero.primary}
              </Link>
              <Link href="/builder" className={buttonGhost}>
                {t.hero.secondary}
              </Link>
            </div>
          </div>
          <div className="fade-up hidden lg:block" style={fade(1100)}>
            <RotatingBadge text={t.premium.badge} />
          </div>
        </div>

        <div className="fade-up mt-14" style={fade(1200)}>
          <div className="hairline" />
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3 pt-5 text-[13px] text-moon/65">
            {t.premium.heroFacts.map((fact) => (
              <span key={fact} className="flex items-center gap-2.5">
                <span className="h-1 w-1 rounded-full bg-accent" />
                {fact}
              </span>
            ))}
            <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="tabular hover:text-moon">
              {brand.phone}
            </a>
            <span className="ml-auto hidden items-center gap-3 lg:flex">
              {t.premium.scroll}
              <span className="scroll-cue block h-10 w-px bg-moon/20" />
            </span>
          </div>
        </div>
      </div>
      <span className="sr-only">{brand.city[locale]}</span>
    </section>
  );
};
