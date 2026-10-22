import { getStyle, STYLES, StyleScene, SUBJECTS } from "./scene";

interface ControlsProps {
  styleId: string;
  subjectId: string;
  onStyle: (id: string) => void;
  onSubject: (id: string) => void;
}

export function Controls({
  styleId,
  subjectId,
  onStyle,
  onSubject,
}: ControlsProps): React.JSX.Element {
  const subject = SUBJECTS.find((s) => s.id === subjectId) ?? SUBJECTS[0];
  const active = getStyle(styleId);
  return (
    <div className="mt-0 flex flex-col gap-6">
      <fieldset className="m-0 border-0 p-0">
        <legend className="text-bone/70 mb-3 text-sm">Style, lifted from a reference</legend>
        <div className="flex gap-3" role="radiogroup" aria-label="Style">
          {STYLES.map((s) => {
            const selected = s.id === styleId;
            return (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onStyle(s.id)}
                className={`group w-20 text-left transition-opacity ${selected ? "" : "opacity-70 hover:opacity-100"}`}
              >
                <span
                  className={`block aspect-4/5 overflow-hidden border transition-colors ${selected ? "border-bone" : "border-pencil"}`}
                >
                  {subject ? (
                    <StyleScene
                      style={s}
                      subject={subject}
                      label=""
                      className="block h-full w-full"
                    />
                  ) : null}
                </span>
                <span className={`mt-1.5 block text-xs ${selected ? "text-bone" : "text-bone/70"}`}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
        <p className="sr-only">Selected style: {active.label}</p>
      </fieldset>

      <fieldset className="m-0 border-0 p-0">
        <legend className="text-bone/70 mb-3 text-sm">Subject, supplied by you</legend>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Subject">
          {SUBJECTS.map((s) => {
            const selected = s.id === subjectId;
            return (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onSubject(s.id)}
                className={`border px-3.5 py-1.5 text-sm transition-colors ${selected ? "bg-bone text-ink border-bone" : "border-pencil text-bone/80 hover:border-bone/60"}`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
