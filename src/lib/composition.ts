import { flowerInfo } from "./catalog";
import type { FlowerKind, Stem } from "./types";

export type CompositionLine = { kind: FlowerKind; color: string; count: number };

/** Groups stems into "5 × pink peony" lines, keeping the order flowers first appear in. */
export const groupStems = (stems: Stem[]): CompositionLine[] => {
  const lines: CompositionLine[] = [];
  for (const stem of stems) {
    const line = lines.find((item) => item.kind === stem.kind && item.color === stem.color);
    if (line) line.count += 1;
    else lines.push({ ...stem, count: 1 });
  }
  return lines;
};

/** Colour name, or undefined when the flower only comes in one colour and naming it adds nothing. */
export const colorName = (line: Pick<CompositionLine, "kind" | "color">) => {
  const { colors } = flowerInfo(line.kind);
  if (colors.length < 2) return undefined;
  return colors.find((color) => color.hex === line.color)?.name;
};
