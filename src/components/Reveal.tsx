"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  /** "fade" lifts content in; "image" uncovers a photo like a curtain */
  variant?: "fade" | "image";
};

/** Animates content once it scrolls into view. Reduced motion is handled in CSS. */
export const Reveal = ({ children, as: Tag = "div", delay = 0, className = "", variant = "fade" }: RevealProps) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${variant === "image" ? "reveal-img" : "reveal"} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
};

/** Splits a headline into words that rise in sequence on first paint. */
export const RisingWords = ({ text, startDelay = 0, step = 70 }: { text: string; startDelay?: number; step?: number }) => (
  <>
    {text.split(" ").map((word, index) => (
      <span key={`${word}-${index}`} className="word-mask">
        <span style={{ "--word-delay": `${startDelay + index * step}ms` } as CSSProperties}>{word}</span>
        {" "}
      </span>
    ))}
  </>
);
