import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { toPng } from "html-to-image";
import { SpecimenPlate } from "@/components/specimen/SpecimenPlate";
import { PLATFORMS, type Platform, type StyleAnalysis } from "@/types/style-analysis";
import type { SpecimenAttribute } from "@/types/specimen";
import { assemblePrompt } from "@/utils/promptAssembly";

interface AnalysisResultsProps {
  analysis: StyleAnalysis;
  previewUrl: string;
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];
const EXPORT_BACKGROUND = "#181714";

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
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

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

  async function handleExport(): Promise<void> {
    if (!exportRef.current || isExporting) return;
    setIsExporting(true);
    try {
      await document.fonts.ready; 
      const dataUrl = await toPng(exportRef.current, {
        backgroundColor: EXPORT_BACKGROUND,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `style-lab-specimen-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // Export can fail for reasons outside our control (browser quirks, etc.) —
      // fail quietly rather than blocking the rest of the page.
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
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

      <div ref={exportRef} className="bg-ink flex flex-col gap-6 p-6">
        <SpecimenPlate
          attributes={toAttributes(analysis)}
          image={{ kind: "photo", src: previewUrl, alt: "Analyzed reference" }}
        />

        <div>
          <div className="text-pencil mb-2 font-mono text-[11px] tracking-wide uppercase">
            Assembled prompt
          </div>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={4}
            className="border-pencil bg-ink/40 focus-visible:outline-index w-full resize-y border p-3 font-mono text-sm focus-visible:outline-2"
          />
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

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="text-bone/70 hover:text-bone flex items-center gap-1.5 text-sm transition-colors"
        >
          {copied ? (
            <>
              <Check size={14} /> Copied
            </>
          ) : (
            <>
              <Copy size={14} /> Copy prompt
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => void handleExport()}
          disabled={isExporting}
          className="text-bone/70 hover:text-bone flex items-center gap-1.5 text-sm transition-colors disabled:opacity-50"
        >
          <Download size={14} /> {isExporting ? "Exporting…" : "Download specimen"}
        </button>
      </div>

      <p className="text-pencil -mt-3 text-xs">
        Edit the prompt freely — swap [SUBJECT] for whatever you're generating.
      </p>
    </div>
  );
}