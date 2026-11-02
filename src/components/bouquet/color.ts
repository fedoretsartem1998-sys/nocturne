const toRgb = (hex: string) => {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.split("").map((char) => char + char).join("") : value;
  const number = parseInt(full, 16);
  return [(number >> 16) & 255, (number >> 8) & 255, number & 255] as const;
};

const toHex = (channels: readonly number[]) =>
  `#${channels.map((channel) => Math.round(Math.min(255, Math.max(0, channel))).toString(16).padStart(2, "0")).join("")}`;

/** Positive amount mixes toward white, negative toward a deep plum shadow. */
export const shade = (hex: string, amount: number) => {
  const [r, g, b] = toRgb(hex);
  const target = amount >= 0 ? [255, 255, 255] : [34, 16, 40];
  const weight = Math.abs(amount);
  return toHex([r + (target[0] - r) * weight, g + (target[1] - g) * weight, b + (target[2] - b) * weight]);
};

/** Rounds trig results so server and browser render identical SVG attributes. */
export const r2 = (value: number) => Math.round(value * 100) / 100;
