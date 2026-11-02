export const buttonPrimary =
  "btn-sheen inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-[15px] font-medium text-accent-ink shadow-[0_10px_30px_-12px_color-mix(in_oklab,var(--brand-accent)_70%,transparent)] transition-[background-color,transform,opacity,box-shadow] duration-300 hover:shadow-[0_14px_40px_-12px_color-mix(in_oklab,var(--brand-accent)_90%,transparent)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:active:scale-100";

export const buttonGhost =
  "btn-sheen inline-flex h-12 items-center justify-center gap-2 rounded-full border border-moon/25 px-7 text-[15px] text-moon backdrop-blur-sm transition-[border-color,background-color,transform] duration-300 hover:border-moon/60 hover:bg-moon/5 active:scale-[0.97]";

export const fieldClass =
  "h-12 w-full rounded-2xl border border-line bg-plum px-4 text-[15px] text-moon placeholder:text-mist/60 transition-colors focus:border-accent focus:outline-none";

export const chipClass = (active: boolean) =>
  `inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
    active ? "border-accent bg-accent text-accent-ink" : "border-line text-moon hover:border-mist"
  }`;

/** Small text label above a section; sentence case, used only where it tells the reader where they are */
export const kicker = "text-sm text-accent";
