"use client";

import { FLOWERS } from "@/lib/catalog";
import { useLocalize } from "@/lib/hooks";
import { MoonMark } from "../icons";

/** Slow band of flower names; decorative, so hidden from screen readers. */
export const Marquee = () => {
  const localize = useLocalize();
  const names = FLOWERS.map((flower) => localize(flower.name));
  const row = [...names, ...names];

  return (
    <div className="marquee-wrap relative overflow-hidden py-10" aria-hidden>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
      <div className="marquee">
        {row.map((name, index) => (
          <span key={`${name}-${index}`} className="flex items-center">
            <span
              className={`whitespace-nowrap px-8 font-display text-[clamp(3rem,8vw,7.5rem)] leading-none ${
                index % 2 ? "text-outline" : "text-moon/90"
              }`}
            >
              {name}
            </span>
            <MoonMark size={22} className="shrink-0 text-accent/70" />
          </span>
        ))}
      </div>
    </div>
  );
};
