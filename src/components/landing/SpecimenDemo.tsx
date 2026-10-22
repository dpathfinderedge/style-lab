import { getStyle, getSubject, StyleScene } from "./scene";
import type { StyleDef } from "./scene";

interface Pin {
  key: keyof StyleDef["pins"];
  letter: string;
  title: string;
  col: number;
  row: number;
}

const PINS: Pin[] = [
  { key: "medium", letter: "A", title: "Medium", col: 4, row: 0 },
  { key: "lighting", letter: "B", title: "Lighting", col: 1, row: 1 },
  { key: "composition", letter: "C", title: "Composition", col: 4, row: 3 },
  { key: "palette", letter: "D", title: "Palette", col: 6, row: 4 },
  { key: "texture", letter: "E", title: "Texture", col: 4, row: 7 },
];

const FRAME_SHARE = 75;
const cell = (n: number): number => ((n + 0.5) / 8) * 100;

interface SpecimenDemoProps {
  styleId: string;
  subjectId: string;
  firstReveal: boolean;
}

export function SpecimenDemo({
  styleId,
  subjectId,
  firstReveal,
}: SpecimenDemoProps): React.JSX.Element {
  const style = getStyle(styleId);
  const subject = getSubject(subjectId);

  return (
    <figure className="m-0">
      <div className="relative">
        <div className="relative w-full md:w-[75%]" style={{ aspectRatio: "4 / 5" }}>
          <div className="border-pencil h-full w-full overflow-hidden border">
            <StyleScene
              style={style}
              subject={subject}
              playKey={`${styleId}-${subjectId}`}
              developMs={firstReveal ? 1500 : 600}
              label={`Illustration of ${subject.phrase} in the ${style.label.toLowerCase()} style`}
              className="block h-full w-full"
            />
          </div>

          {PINS.map((pin, i) => {
            const delay = firstReveal ? 900 + i * 140 : 0;
            return (
              <span
                key={pin.letter}
                aria-hidden="true"
                className="bg-bone text-ink ring-ink absolute flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-medium ring-2"
                style={{
                  left: `${cell(pin.col)}%`,
                  top: `${cell(pin.row)}%`,
                  transform: "translate(-50%, -50%)",
                  animation: `pin-drop 420ms cubic-bezier(0.3, 1.4, 0.5, 1) ${delay}ms both`,
                }}
              >
                {pin.letter}
              </span>
            );
          })}
        </div>

        {PINS.map((pin, i) => {
          const left = (cell(pin.col) * FRAME_SHARE) / 100;
          const delay = firstReveal ? 1100 + i * 140 : 0;
          return (
            <span
              key={pin.letter}
              aria-hidden="true"
              className="bg-bone/50 absolute hidden h-px origin-left md:block"
              style={{
                left: `calc(${left}% + 14px)`,
                width: `calc(${FRAME_SHARE - left}% - 14px + 12px)`,
                top: `${cell(pin.row) * 1}%`,
                animation: `leader-draw 520ms ease-out ${delay}ms both`,
              }}
            />
          );
        })}

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 md:mt-0 md:block">
          {PINS.map((pin) => (
            <div
              key={pin.letter}
              className="md:absolute md:right-0 md:w-[calc(25%-16px)] md:-translate-y-1/2"
              style={{ top: `${cell(pin.row)}%` }}
            >
              <dt className="text-bone/60 text-xs">
                <span className="text-bone font-mono">{pin.letter}</span> {pin.title}
              </dt>
              <dd
                key={`${styleId}-${pin.key}`}
                className="m-0 mt-0.5 text-[13px] leading-snug"
                style={{ animation: "develop 500ms ease-out both" }}
              >
                {pin.key === "palette" ? (
                  <span className="mb-1.5 flex gap-1" aria-hidden="true">
                    {style.analysis.color_palette.map((c) => (
                      <span
                        key={c.hex}
                        className="border-bone/20 h-3 w-3 rounded-full border"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </span>
                ) : null}
                {style.pins[pin.key]}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <figcaption className="text-bone/60 mt-6 max-w-md text-xs leading-relaxed">
        An illustration drawn in your browser to show the idea. It is not output from the vision
        model.
      </figcaption>
    </figure>
  );
}
