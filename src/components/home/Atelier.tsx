"use client";

import Image from "next/image";
import { useT } from "@/lib/hooks";
import { Reveal } from "../Reveal";
import { kicker } from "../ui";

export const Atelier = () => {
  const t = useT();

  return (
    <section className="mx-auto grid max-w-[1400px] items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:px-10">
      {/* layered photographs: the big frame plus a smaller print tucked over its corner */}
      <div className="relative pb-16 pr-10 sm:pb-20 sm:pr-16">
        <Reveal variant="image" className="relative aspect-[4/5] overflow-hidden rounded-[32px]">
          <Image src="/site/step-2.jpg" alt={t.home.steps[1]?.title ?? ""} fill sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover" />
        </Reveal>
        <Reveal
          variant="image"
          delay={350}
          className="absolute bottom-0 right-0 aspect-[3/4] w-[42%] overflow-hidden rounded-[24px] ring-[10px] ring-ink"
        >
          <Image src="/site/step-4.jpg" alt={t.home.steps[3]?.title ?? ""} fill sizes="(max-width: 1024px) 40vw, 20vw" className="object-cover" />
        </Reveal>
        <div
          aria-hidden
          className="absolute -left-6 -top-6 -z-10 h-40 w-40 rounded-full blur-3xl"
          style={{ background: "color-mix(in oklab, var(--brand-accent) 22%, transparent)" }}
        />
      </div>

      <div>
        <Reveal>
          <p className={kicker}>{t.premium.atelierKicker}</p>
          <h2 className="mt-4 text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.05]">{t.premium.atelierTitle}</h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-mist">{t.premium.atelierText}</p>
        </Reveal>

        <Reveal as="figure" delay={120} className="mt-10 border-l border-accent/60 pl-6">
          <blockquote className="font-display text-[1.6rem] leading-snug text-moon">«{t.premium.atelierQuote}»</blockquote>
          <figcaption className="mt-4 text-sm text-mist">
            <span className="text-moon">{t.premium.atelierName}</span>, {t.premium.atelierRole}
          </figcaption>
        </Reveal>

        <Reveal delay={200} className="mt-12">
          <div className="hairline" />
          <dl className="grid grid-cols-3 gap-4 pt-6">
            {t.premium.atelierFacts.map((fact) => (
              <div key={fact.value}>
                <dt className="tabular font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-none text-moon">{fact.value}</dt>
                <dd className="mt-2 text-[13px] leading-snug text-mist">{fact.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
};
