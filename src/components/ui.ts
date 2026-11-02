export const buttonPrimary =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-[15px] font-medium text-accent-ink transition-[background-color,transform,opacity] duration-200 hover:bg-[color-mix(in_oklab,var(--brand-accent)_88%,white)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100";

export const buttonGhost =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line px-7 text-[15px] text-moon transition-[border-color,transform] duration-200 hover:border-mist active:scale-[0.97]";

export const fieldClass =
  "h-12 w-full rounded-2xl border border-line bg-plum px-4 text-[15px] text-moon placeholder:text-mist/60 transition-colors focus:border-accent focus:outline-none";

export const chipClass = (active: boolean) =>
  `inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
    active ? "border-accent bg-accent text-accent-ink" : "border-line text-moon hover:border-mist"
  }`;
