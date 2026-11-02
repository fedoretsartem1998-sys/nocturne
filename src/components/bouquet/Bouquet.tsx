import { useMemo } from "react";
import { wrapInfo } from "@/lib/catalog";
import type { FlowerKind, Stem, WrapId } from "@/lib/types";
import { r2, shade } from "./color";
import { FlowerHead, HEAD_RADIUS, isHeadKind } from "./heads";

type BouquetProps = {
  stems: Stem[];
  wrap: WrapId;
  ribbon: string;
  /** Plays the bloom sequence when the bouquet mounts */
  bloom?: boolean;
  className?: string;
  title?: string;
};

const CX = 200;
const TOP = 170;
const STEM_GREEN = "#4D6A45";

type Point = { x: number; y: number };

const lerp = (a: Point, b: Point, t: number): Point => ({ x: r2(a.x + (b.x - a.x) * t), y: r2(a.y + (b.y - a.y) * t) });

const layout = (stems: Stem[]) => {
  const heads = stems.filter((stem) => isHeadKind(stem.kind));
  const fillers = stems.filter((stem) => !isHeadKind(stem.kind));
  const count = heads.length;
  const scale = Math.min(1.1, Math.max(0.6, 1.1 - Math.max(0, count - 5) * 0.02));
  const radius = r2(Math.min(118, 22 + Math.sqrt(Math.max(count, 1)) * 19 * scale));

  // biggest flowers sit in the centre of the dome
  const sorted = [...heads].sort((a, b) => radiusOf(b.kind) - radiusOf(a.kind));
  const placed = sorted.map((stem, index) => {
    const t = count === 1 ? 0 : Math.sqrt((index + 0.4) / count);
    const angle = index * 2.39996 + 0.6;
    const jitter = ((index * 37) % 11) - 5;
    return {
      stem,
      index,
      x: r2(CX + t * radius * Math.cos(angle) + jitter),
      y: r2(TOP + t * radius * 0.6 * Math.sin(angle) + t * t * radius * 0.28),
      r: r2(radiusOf(stem.kind) * scale),
      rotate: (index * 47) % 360,
    };
  });

  const bindY = r2(Math.min(390, TOP + radius * 0.88 + 72));
  const binding = { x: CX, y: bindY };

  const fillerCount = fillers.length;
  const placedFillers = fillers.map((stem, index) => {
    const spread = fillerCount === 1 ? 0.5 : index / (fillerCount - 1);
    const angle = (-168 + spread * 156 + ((index * 13) % 9)) * (Math.PI / 180);
    const reach = radius + 34 + ((index * 17) % 22);
    return {
      stem,
      index,
      tip: { x: r2(CX + Math.cos(angle) * reach * 1.05), y: r2(TOP + 10 + Math.sin(angle) * reach * 0.82) },
    };
  });

  return { placed: placed.sort((a, b) => a.y - b.y), placedFillers, radius, binding };
};

const radiusOf = (kind: FlowerKind) => (isHeadKind(kind) ? HEAD_RADIUS[kind] : 0);

const Filler = ({ stem, tip, binding }: { stem: Stem; tip: Point; binding: Point }) => {
  const color = stem.color;
  const along = (t: number) => lerp(binding, tip, t);
  const dx = tip.x - binding.x;
  const dy = tip.y - binding.y;
  const length = Math.hypot(dx, dy);
  const nx = r2(-dy / length);
  const ny = r2(dx / length);
  const budAngle = r2((Math.atan2(dy, dx) * 180) / Math.PI + 90);

  if (stem.kind === "lavender") {
    const buds = Array.from({ length: 11 }, (_, index) => {
      const point = along(0.55 + index * 0.042);
      const side = index % 2 ? 1 : -1;
      return { x: r2(point.x + nx * 3.2 * side), y: r2(point.y + ny * 3.2 * side), index };
    });
    return (
      <>
        <line x1={binding.x} y1={binding.y} x2={tip.x} y2={tip.y} stroke="#6B7F5A" strokeWidth={1.8} />
        {buds.map((bud) => (
          <ellipse
            key={bud.index}
            cx={bud.x}
            cy={bud.y}
            rx={3.4}
            ry={5}
            fill={bud.index % 3 ? color : shade(color, -0.2)}
            transform={`rotate(${budAngle} ${bud.x} ${bud.y})`}
          />
        ))}
      </>
    );
  }

  if (stem.kind === "eucalyptus") {
    const leaves = Array.from({ length: 8 }, (_, index) => {
      const point = along(0.42 + index * 0.075);
      const side = index % 2 ? 1 : -1;
      return { x: r2(point.x + nx * 8 * side), y: r2(point.y + ny * 8 * side), r: r2(9 - index * 0.55), index };
    });
    return (
      <>
        <line x1={binding.x} y1={binding.y} x2={tip.x} y2={tip.y} stroke="#6F8A78" strokeWidth={1.8} />
        {leaves.map((leaf) => (
          <circle
            key={leaf.index}
            cx={leaf.x}
            cy={leaf.y}
            r={leaf.r}
            fill={leaf.index % 2 ? color : shade(color, -0.14)}
            stroke={shade(color, -0.32)}
            strokeWidth={0.8}
          />
        ))}
      </>
    );
  }

  // gypsophila: a few thin branches tipped with tiny white clouds
  const fork = along(0.6);
  const branches = [-1, 0, 1].map((side) => ({
    x: r2(tip.x + nx * 16 * side),
    y: r2(tip.y + ny * 16 * side + Math.abs(side) * 6),
  }));
  return (
    <>
      <line x1={binding.x} y1={binding.y} x2={fork.x} y2={fork.y} stroke="#7A8F6C" strokeWidth={1.4} />
      {branches.map((end, branchIndex) => (
        <g key={branchIndex}>
          <line x1={fork.x} y1={fork.y} x2={end.x} y2={end.y} stroke="#7A8F6C" strokeWidth={1} />
          {Array.from({ length: 9 }, (_, dotIndex) => {
            const angle = dotIndex * 2.39996 + branchIndex;
            const distance = 2 + Math.sqrt(dotIndex) * 4.2;
            return (
              <circle
                key={dotIndex}
                cx={r2(end.x + Math.cos(angle) * distance)}
                cy={r2(end.y + Math.sin(angle) * distance)}
                r={r2(2.6 - (dotIndex % 3) * 0.4)}
                fill={dotIndex % 4 ? color : shade(color, -0.12)}
              />
            );
          })}
        </g>
      ))}
    </>
  );
};

export const Bouquet = ({ stems, wrap, ribbon, bloom = false, className, title }: BouquetProps) => {
  const { placed, placedFillers, radius, binding } = useMemo(() => layout(stems), [stems]);
  const paper = wrapInfo(wrap);
  const hasWrap = wrap !== "none";
  const width = radius + 46;
  const frontTop = TOP + radius * 0.7 + 18;
  const tipY = binding.y + 78;
  const halfWidth = radius + 74;
  const viewTop = r2(Math.min(TOP - radius * 1.15, TOP + 10 - (radius + 56) * 0.82) - 14);
  const viewBox = `${r2(CX - halfWidth)} ${viewTop} ${r2(halfWidth * 2)} ${r2(tipY + 22 - viewTop)}`;

  const stemEnd = (point: Point) => {
    const dx = binding.x - point.x;
    const dy = binding.y - point.y;
    const length = Math.hypot(dx, dy) || 1;
    const below = 70;
    return { x: r2(binding.x + (dx / length) * below * 0.55), y: r2(binding.y + (dy / length) * below) };
  };

  const order = [...placedFillers.map((filler) => filler.index), ...placed.map((head) => head.index)];
  const delayFor = (group: "filler" | "head", index: number) =>
    `${(group === "filler" ? index * 70 : 260 + order.length * 4 + index * 55)}ms`;

  return (
    <svg
      viewBox={viewBox}
      className={`${className ?? ""} ${bloom ? "is-blooming" : ""}`}
      role="img"
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}

      {hasWrap && (
        <path
          className="bloom-paper"
          d={`M ${CX} ${tipY - 20} L ${CX - width * 0.92} ${TOP - radius * 0.15} Q ${CX} ${TOP - radius * 1.15} ${CX + width * 0.92} ${TOP - radius * 0.15} Z`}
          fill={paper.back}
        />
      )}

      {placedFillers.map((filler) => (
        <g key={`f${filler.index}`} className="bloom-filler" style={{ animationDelay: delayFor("filler", filler.index), transformOrigin: `${binding.x}px ${binding.y}px` }}>
          <Filler stem={filler.stem} tip={filler.tip} binding={binding} />
        </g>
      ))}

      {placed.map((head) => {
        const end = stemEnd(head);
        return (
          <line
            key={`s${head.index}`}
            x1={head.x}
            y1={head.y}
            x2={end.x}
            y2={end.y}
            stroke={STEM_GREEN}
            strokeWidth={2.4}
            strokeLinecap="round"
          />
        );
      })}

      {placed.map((head) => {
        if (!isHeadKind(head.stem.kind)) return null;
        const outward = head.stem.kind === "tulip" ? ((head.x - CX) / radius) * 26 : head.rotate;
        return (
          <g key={`h${head.index}`} transform={`translate(${head.x.toFixed(1)} ${head.y.toFixed(1)}) rotate(${outward.toFixed(1)})`}>
            <g className="bloom-head" style={{ animationDelay: delayFor("head", head.index) }}>
              <FlowerHead kind={head.stem.kind} r={head.r} color={head.stem.color} />
            </g>
          </g>
        );
      })}

      {hasWrap && (
        <g className="bloom-paper">
          <path
            d={`M ${CX - width * 0.78} ${frontTop} Q ${CX} ${frontTop + 46} ${CX + width * 0.78} ${frontTop} L ${CX + 24} ${tipY} Q ${CX} ${tipY + 10} ${CX - 24} ${tipY} Z`}
            fill={paper.front}
          />
          <path
            d={`M ${CX - width * 0.78} ${frontTop} Q ${CX - width * 0.2} ${frontTop + 30} ${CX - 6} ${tipY}`}
            fill="none"
            stroke={shade(paper.front, -0.18)}
            strokeWidth={1.2}
            opacity={0.7}
          />
        </g>
      )}

      <g className="bloom-paper" transform={`translate(${binding.x} ${binding.y + 4})`}>
        <path d="M -3 4 C -14 30, -22 46, -30 62 L -22 64 C -14 48, -8 32, 2 6 Z" fill={shade(ribbon, -0.15)} />
        <path d="M 3 4 C 12 30, 18 46, 24 64 L 32 60 C 22 44, 14 30, 1 6 Z" fill={ribbon} />
        <ellipse cx={-17} cy={-4} rx={18} ry={9} fill={ribbon} transform="rotate(-18 -17 -4)" />
        <ellipse cx={17} cy={-4} rx={18} ry={9} fill={shade(ribbon, -0.1)} transform="rotate(18 17 -4)" />
        <ellipse cx={-15} cy={-4} rx={9} ry={3.6} fill={shade(ribbon, -0.32)} transform="rotate(-18 -15 -4)" />
        <ellipse cx={15} cy={-4} rx={9} ry={3.6} fill={shade(ribbon, -0.38)} transform="rotate(18 15 -4)" />
        <rect x={-6} y={-9} width={12} height={12} rx={4} fill={shade(ribbon, 0.08)} />
      </g>
    </svg>
  );
};
