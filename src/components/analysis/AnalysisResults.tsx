import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { SpecimenPlate } from "@/components/specimen/SpecimenPlate";
import { PLATFORMS, type Platform, type StyleAnalysis } from "@/types/style-analysis";
import type { SpecimenAttribute } from "@/types/specimen";
import { assemblePrompt } from "@/utils/promptAssembly";

interface AnalysisResultsProps {
  analysis: StyleAnalysis;
  previewUrl: string;
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function toAttributes(analysis: StyleAnalysis): SpecimenAttribute[] {
  const paletteSummary = analysis.color_palette.map((c) => c.name).join(", ");
  const primarySwatch = analysis.color_palette[0]?.hex;

  const fields: { title: string; value: string; swatch?: string }[] = [
    { title: "Medium", value: analysis.medium },
    { title: "Lighting", value: analysis.lighting },
    { title: "Composition", value: analysis.composition },
    primarySwatch
      ? { title: "Palette", value: paletteSummary, swatch: primarySwatch }
      : { title: "Palette", value: paletteSummary },
    { title: "Texture", value: analysis.texture_and_detail },
    { title: "Mood", value: analysis.mood_atmosphere },
  ];

  return fields.map((f, i) => {
    const attr: SpecimenAttribute = {
      id: f.title.toLowerCase(),
      letter: LETTERS[i] ?? "?",
      title: f.title,
      value: f.value,
    };
    return f.swatch ? { ...attr, swatch: f.swatch } : attr;
  });
}

export function AnalysisResults({
  analysis,
  previewUrl,
}: AnalysisResultsProps): React.JSX.Element {
  const [platform, setPlatform] = useState<Platform>("general");
  const [promptText, setPromptText] = useState(() => assemblePrompt(analysis, platform));
  const [copied, setCopied] = useState(false);

  // Regenerating from source fields on platform change is the whole point of
  // doing this client-side — instant, and never re-runs the vision call.
  useEffect(() => {
    setPromptText(assemblePrompt(analysis, platform));
    setCopied(false);
  }, [analysis, platform]);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard permission can be denied — the textarea is still selectable/copyable manually.
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <SpecimenPlate
        attributes={toAttributes(analysis)}
        image={{ kind: "photo", src: previewUrl, alt: "Analyzed reference" }}
      />

      <div>
        <div className="text-pencil mb-2 font-mono text-[11px] tracking-wide uppercase">
          Format for
        </div>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatform(p.id)}
              aria-pressed={platform === p.id}
              className={`border px-3 py-1.5 text-sm transition-colors ${
                platform === p.id
                  ? "bg-index border-index text-bone"
                  : "border-pencil hover:border-bone/50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="text-pencil mt-2 text-xs">{PLATFORMS.find((p) => p.id === platform)?.note}</p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-pencil font-mono text-[11px] tracking-wide uppercase">
            Assembled prompt
          </div>
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="text-bone/70 hover:text-bone flex items-center gap-1.5 text-xs transition-colors"
          >
            {copied ? (
              <>
                <Check size={13} /> Copied
              </>
            ) : (
              <>
                <Copy size={13} /> Copy
              </>
            )}
          </button>
        </div>
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          rows={4}
          className="border-pencil bg-ink/40 focus-visible:outline-index w-full resize-y border p-3 font-mono text-sm focus-visible:outline-2"
        />
        <p className="text-pencil mt-1.5 text-xs">
          Edit freely — swap [SUBJECT] for whatever you're generating.
        </p>
      </div>

      {analysis.style_references.length > 0 ? (
        <div>
          <div className="text-pencil mb-2 font-mono text-[11px] tracking-wide uppercase">
            Style references
          </div>
          <p className="text-bone/70 text-sm">{analysis.style_references.join(" · ")}</p>
        </div>
      ) : null}
    </div>
  );
}