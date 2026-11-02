import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const HeartIcon = ({ size = 20, filled = false, ...props }: IconProps & { filled?: boolean }) => (
  <svg {...base(size)} {...props}>
    <path
      d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"
      fill={filled ? "currentColor" : "none"}
    />
  </svg>
);

export const BagIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
);

export const MenuIcon = ({ size = 22, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);

export const CloseIcon = ({ size = 22, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const PlusIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M5 12h14" />
  </svg>
);

export const CheckIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const MoonMark = ({ size = 22, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden {...props}>
    <path d="M15.5 3.2A9 9 0 1 0 20.8 15 7.2 7.2 0 0 1 15.5 3.2Z" fill="currentColor" />
  </svg>
);

export const FilterIcon = ({ size = 18, ...props }: IconProps) => (
  <svg {...base(size)} {...props}>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </svg>
);
