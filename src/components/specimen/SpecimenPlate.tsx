import type { SpecimenAttribute } from "@/types/specimen";

type SpecimenImage = { kind: "placeholder" } | { kind: "photo"; src: string; alt: string };

interface SpecimenPlateProps {
  attributes: SpecimenAttribute[];
  image: SpecimenImage;
}

/**
 * A mounted "specimen" with lettered, pinned labels running down its edge —
 * the app's signature element. Attribute order is meaningful (a real catalogue),
 * so lettering here is structural, not decorative. Shared by the landing page's
 * demo plate and the real analysis results view.
 */
export function SpecimenPlate({ attributes, image }: SpecimenPlateProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-stretch gap-6 sm:flex-row">
      {/* Outer wrapper is NOT clipped, so pins can sit half outside the frame. */}
      <div className="relative mx-auto aspect-4/5 w-full max-w-64 shrink-0 sm:mx-0 sm:w-64">
        <div className="border-pencil h-full w-full overflow-hidden border">
          {image.kind === "placeholder" ? (
            <div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(155deg, #5b7fb5 0%, #7695c2 35%, #d9a254 78%, #e6bd80 100%)",
              }}
              aria-hidden="true"
            />
          ) : (
            <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
          )}
        </div>

        {attributes.map((attr, i) => {
          const topPercent = attributes.length > 1 ? (i / (attributes.length - 1)) * 84 + 8 : 50;
          return (
            <span
              key={attr.id}
              className="bg-bone border-ink text-ink absolute right-0 flex h-5 w-5 translate-x-1/2 items-center justify-center rounded-full border font-mono text-[11px]"
              style={{ top: `${topPercent}%` }}
              aria-hidden="true"
            >
              {attr.letter}
            </span>
          );
        })}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 py-1 sm:gap-0">
        {attributes.map((attr) => (
          <div key={attr.id} className="flex items-center gap-3">
            <span
              className="border-pencil hidden w-6 shrink-0 border-t sm:block"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <div className="text-pencil font-mono text-[11px] tracking-wide uppercase">
                {attr.letter} · {attr.title}
              </div>
              <div className="flex items-center gap-2">
                {attr.swatch ? (
                  <span
                    className="border-pencil h-3 w-3 shrink-0 rounded-full border"
                    style={{ backgroundColor: attr.swatch }}
                    aria-hidden="true"
                  />
                ) : null}
                <p className="truncate text-sm">{attr.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}