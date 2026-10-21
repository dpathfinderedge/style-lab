import { useId } from "react";
import type { CSSProperties } from "react";
import type { RolePaint, ShapeRole, StyleDef, SubjectDef } from "./types";

interface StyleSceneProps {
  style: StyleDef;
  subject: SubjectDef;
  className?: string;
  playKey?: string;
  developMs?: number;
  label: string;
}

function place(scale: number, dx: number, dy: number): string {
  const tx = 200 * (1 - scale) + dx;
  const ty = 430 * (1 - scale) + dy;
  return `translate(${tx} ${ty}) scale(${scale})`;
}

const PLACEMENT: Record<StyleDef["id"], string> = {
  film: place(1, 0, 0),
  riso: place(1.1, -4, 6),
  wash: place(0.78, -46, 8),
};

export function StyleScene({
  style,
  subject,
  className,
  playKey,
  developMs = 0,
  label,
}: StyleSceneProps): React.JSX.Element {
  const uid = useId().replace(/:/g, "");
  const id = (name: string): string => `${uid}-${name}`;
  const ref = (name: string): string => `url(#${id(name)})`;

  const paintFor = (role: ShapeRole): RolePaint => {
    const base = style.roles[role];
    if (style.id === "film" && role === "body") return { ...base, fill: ref("lit") };
    if (style.id === "riso" && role === "body") return { ...base, fill: ref("dots-a") };
    return base;
  };

  const renderShapes = (plate?: "a" | "b"): React.JSX.Element[] =>
    subject.shapes
      .map((shape, i) => ({ shape, i, paint: paintFor(shape.role) }))
      .filter(({ paint }) => (plate ? paint.plate === plate : true))
      .map(({ shape, i, paint }) => {
        const filter =
          style.id === "wash"
            ? shape.role === "ground"
              ? ref("soft")
              : ref("bleed")
            : style.id === "film" && shape.role === "beam"
              ? ref("soft")
              : undefined;
        return (
          <path
            key={i}
            d={shape.d}
            fill={paint.fill}
            {...(paint.opacity !== undefined ? { fillOpacity: paint.opacity } : {})}
            {...(filter ? { filter } : {})}
          />
        );
      });

  const animation: CSSProperties =
    developMs > 0
      ? { animation: `develop ${developMs}ms cubic-bezier(0.2, 0.7, 0.2, 1) both` }
      : {};

  return (
    <svg
      key={playKey}
      viewBox="0 0 400 500"
      role="img"
      aria-label={label}
      className={className}
      style={animation}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={style.sky[0]} />
          <stop offset="0.85" stopColor={style.sky[1]} />
        </linearGradient>
        <linearGradient id={id("lit")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6f685e" />
          <stop offset="0.55" stopColor="#c9b78f" />
          <stop offset="1" stopColor="#f6dca4" />
        </linearGradient>
        <radialGradient id={id("vig")} cx="0.5" cy="0.48" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
        <pattern
          id={id("dots-a")}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(22)"
        >
          <circle cx="4" cy="4" r="2.7" fill="#2f4ccf" />
        </pattern>
        <pattern
          id={id("dots-b")}
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-14)"
        >
          <circle cx="4.5" cy="4.5" r="2.4" fill="#ff6a3d" />
        </pattern>
        <linearGradient id={id("fade")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.25" stopColor="#000" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <mask id={id("fademask")}>
          <rect width="400" height="500" fill={ref("fade")} />
        </mask>
        <filter id={id("grain")} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <filter id={id("paper")} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.5" numOctaves="3" seed="2" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <filter id={id("bleed")} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035"
            numOctaves="3"
            seed="11"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="11" />
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
        <filter id={id("soft")} x="-20%" y="-30%" width="140%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <rect width="400" height="500" fill={ref("sky")} />

      {style.id === "riso" ? (
        <rect
          width="400"
          height="500"
          fill={ref("dots-b")}
          mask={`url(#${id("fademask")})`}
          opacity="0.85"
        />
      ) : null}

      {style.id === "wash" ? (
        <circle cx="300" cy="120" r="46" fill="#efece4" opacity="0.75" filter={ref("bleed")} />
      ) : null}

      <g transform={PLACEMENT[style.id]}>
        {style.id === "riso" ? (
          <>
            <g>{renderShapes("a")}</g>
            <g transform="translate(4 -3)" style={{ mixBlendMode: "multiply" }}>
              {renderShapes("b")}
            </g>
          </>
        ) : (
          renderShapes()
        )}
      </g>

      {style.id === "film" ? (
        <>
          <rect width="400" height="500" fill={ref("vig")} />
          <rect
            width="400"
            height="500"
            filter={ref("grain")}
            style={{ mixBlendMode: "overlay" }}
            opacity="0.55"
          />
        </>
      ) : null}

      {style.id === "wash" ? (
        <rect
          width="400"
          height="500"
          filter={ref("paper")}
          style={{ mixBlendMode: "multiply" }}
          opacity="0.18"
        />
      ) : null}
    </svg>
  );
}
