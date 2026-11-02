import type { ReactNode } from "react";
import type { FlowerKind } from "@/lib/types";
import { r2, shade } from "./color";

type HeadProps = { r: number; color: string };

const ring = (count: number, radius: number, offset = 0) =>
  Array.from({ length: count }, (_, index) => {
    const angle = offset + (index / count) * Math.PI * 2;
    return { x: r2(Math.cos(angle) * radius), y: r2(Math.sin(angle) * radius), deg: r2((angle * 180) / Math.PI) };
  });

const Rose = ({ r, color }: HeadProps) => {
  const spiral = Array.from({ length: 40 }, (_, index) => {
    const theta = (index / 39) * Math.PI * 3.2;
    const radius = r * 0.03 + theta * r * 0.032;
    return `${(Math.cos(theta) * radius).toFixed(2)},${(Math.sin(theta) * radius).toFixed(2)}`;
  }).join(" ");
  return (
    <>
      <circle r={r} fill={shade(color, -0.22)} />
      {ring(5, r * 0.4, 0.3).map((petal, index) => (
        <circle key={index} cx={petal.x} cy={petal.y} r={r * 0.6} fill={shade(color, -0.06)} />
      ))}
      <circle r={r * 0.66} fill={color} />
      {ring(3, r * 0.2, 1.1).map((petal, index) => (
        <circle key={`i${index}`} cx={petal.x} cy={petal.y} r={r * 0.36} fill={shade(color, 0.08)} />
      ))}
      <polyline points={spiral} fill="none" stroke={shade(color, -0.24)} strokeWidth={r * 0.05} opacity={0.85} strokeLinecap="round" />
    </>
  );
};

const Peony = ({ r, color }: HeadProps) => (
  <>
    {ring(12, r * 0.6).map((petal, index) => (
      <circle key={`o${index}`} cx={petal.x} cy={petal.y} r={r * 0.42} fill={shade(color, index % 2 ? -0.14 : -0.06)} />
    ))}
    {ring(9, r * 0.36, 0.4).map((petal, index) => (
      <circle key={`m${index}`} cx={petal.x} cy={petal.y} r={r * 0.36} fill={index % 2 ? color : shade(color, 0.06)} />
    ))}
    {ring(6, r * 0.17, 0.9).map((petal, index) => (
      <circle key={`c${index}`} cx={petal.x} cy={petal.y} r={r * 0.24} fill={shade(color, 0.16)} />
    ))}
    <circle r={r * 0.12} fill={shade(color, 0.26)} />
  </>
);

const Ranunculus = ({ r, color }: HeadProps) => (
  <>
    {[1, 0.8, 0.62, 0.45, 0.29].map((scale, index) => (
      <circle
        key={scale}
        cy={-(1 - scale) * r * 0.32}
        r={r * scale}
        fill={index % 2 ? shade(color, 0.04 * index) : shade(color, -0.1 + 0.03 * index)}
        stroke={shade(color, -0.22)}
        strokeWidth={r * 0.025}
      />
    ))}
    <circle cy={-r * 0.25} r={r * 0.11} fill="#4A6340" />
  </>
);

const Tulip = ({ r, color }: HeadProps) => (
  <>
    <path
      d={`M ${-0.62 * r} 0 C ${-0.7 * r} ${-0.95 * r}, ${-0.25 * r} ${-1.15 * r}, 0 ${-0.78 * r} C ${0.25 * r} ${-1.15 * r}, ${0.7 * r} ${-0.95 * r}, ${0.62 * r} 0 C ${0.52 * r} ${0.6 * r}, ${-0.52 * r} ${0.6 * r}, ${-0.62 * r} 0 Z`}
      fill={shade(color, -0.12)}
    />
    <path
      d={`M ${-0.34 * r} ${0.32 * r} C ${-0.42 * r} ${-0.6 * r}, ${-0.05 * r} ${-1.2 * r}, 0 ${-1.22 * r} C ${0.05 * r} ${-1.2 * r}, ${0.42 * r} ${-0.6 * r}, ${0.34 * r} ${0.32 * r} Z`}
      fill={shade(color, 0.08)}
    />
    <path d={`M 0 ${-1.1 * r} L 0 ${0.25 * r}`} stroke={shade(color, -0.2)} strokeWidth={r * 0.04} opacity={0.5} />
  </>
);

const Daisy = ({ r, color }: HeadProps) => (
  <>
    {ring(16, 0).map((petal, index) => (
      <ellipse
        key={index}
        cx={0}
        cy={-r * 0.55}
        rx={r * 0.15}
        ry={r * 0.46}
        fill={index % 2 ? color : shade(color, -0.06)}
        transform={`rotate(${petal.deg})`}
      />
    ))}
    <circle r={r * 0.3} fill="#E3AE32" />
    <circle r={r * 0.3} fill="none" stroke="#B5801D" strokeWidth={r * 0.05} strokeDasharray={`${r * 0.05} ${r * 0.07}`} />
  </>
);

const Hydrangea = ({ r, color }: HeadProps) => {
  const florets = Array.from({ length: 19 }, (_, index) => {
    const t = Math.sqrt((index + 0.5) / 19) * r * 0.8;
    const angle = index * 2.39996;
    return { x: r2(Math.cos(angle) * t), y: r2(Math.sin(angle) * t), tone: index % 3 };
  });
  return (
    <>
      <circle r={r} fill={shade(color, -0.3)} />
      {florets.map((floret, index) => (
        <g key={index} transform={`translate(${floret.x} ${floret.y}) rotate(${index * 23})`}>
          {ring(4, r * 0.1).map((petal, petalIndex) => (
            <circle
              key={petalIndex}
              cx={petal.x}
              cy={petal.y}
              r={r * 0.12}
              fill={floret.tone === 0 ? shade(color, 0.12) : floret.tone === 1 ? color : shade(color, -0.08)}
            />
          ))}
          <circle r={r * 0.03} fill={shade(color, -0.4)} />
        </g>
      ))}
    </>
  );
};

const HEADS: Record<Exclude<FlowerKind, "lavender" | "eucalyptus" | "gypsophila">, (props: HeadProps) => ReactNode> = {
  rose: Rose,
  peony: Peony,
  ranunculus: Ranunculus,
  tulip: Tulip,
  daisy: Daisy,
  hydrangea: Hydrangea,
};

export const HEAD_RADIUS: Record<keyof typeof HEADS, number> = {
  hydrangea: 46,
  peony: 42,
  rose: 31,
  ranunculus: 29,
  tulip: 27,
  daisy: 24,
};

export const isHeadKind = (kind: FlowerKind): kind is keyof typeof HEADS => kind in HEADS;

export const FlowerHead = ({ kind, r, color }: HeadProps & { kind: keyof typeof HEADS }) => {
  const Head = HEADS[kind];
  return <Head r={r} color={color} />;
};
