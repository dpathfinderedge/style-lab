import { useState } from "react";
import { PLATFORMS } from "@/types/style-analysis";
import type { Platform } from "@/types/style-analysis";
import { assemblePrompt } from "@/utils/promptAssembly";
import { getStyle, getSubject } from "./scene";

interface PromptPanelProps {
  styleId: string;
  subjectId: string;
}

const capitalise = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

type Fill = "template" | "filled";

export function PromptPanel({ styleId, subjectId }: PromptPanelProps): React.JSX.Element {
  const [platform, setPlatform] = useState<Platform>("midjourney");
  const [fill, setFill] = useState<Fill>("template");
  const [copied, setCopied] = useState(false);

  const style = getStyle(styleId);
  const subject = getSubject(subjectId);
  const template = assemblePrompt(style.analysis, platform);
  const note = PLATFORMS.find((p) => p.id === platform)?.note ?? "";
  const body =
    fill === "filled" && template.startsWith("A [SUBJECT]") ? template.slice(2) : template;
  const parts = body.split("[SUBJECT]");
  const slotText = (i: number): string => {
    if (fill === "template") return "[SUBJECT]";
    return i === 1 && parts[0] === "" ? capitalise(subject.phrase) : subject.phrase;
  };
  const shown = parts.reduce(
    (acc, part, i) => (i === 0 ? part : `${acc}${slotText(i)}${part}`),
    "",
  );

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(shown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid gap-x-12 gap-y-8 md:grid-cols-[14rem_1fr]">
      <div
        role="tablist"
        aria-label="Platform"
        className="flex flex-wrap gap-2 md:flex-col md:gap-1"
      >
        {PLATFORMS.map((p) => {
          const selected = p.id === platform;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              id={`tab-${p.id}`}
              aria-selected={selected}
              aria-controls="prompt-panel"
              onClick={() => setPlatform(p.id)}
              className={`px-3 py-2 text-left text-sm transition-colors md:border-l-2 ${selected ? "text-bone md:border-ochre bg-bone/5" : "text-bone/70 hover:text-bone md:border-transparent"}`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div id="prompt-panel" role="tabpanel" aria-labelledby={`tab-${platform}`}>
        <p className="text-bone/70 mb-4 text-sm">{note}</p>
        <div className="border-pencil border">
          <p
            key={`${styleId}-${platform}-${fill}-${subjectId}`}
            className="min-h-28 p-5 font-mono text-[13px] leading-relaxed break-words"
            style={{ animation: "develop 400ms ease-out both" }}
          >
            {parts.map((part, i) => (
              <span key={i}>
                {i > 0 ? <mark className="bg-ochre/20 text-ochre px-1">{slotText(i)}</mark> : null}
                {part}
              </span>
            ))}
          </p>
          <div className="border-pencil flex flex-wrap items-center justify-between gap-3 border-t px-3 py-2">
            <div role="radiogroup" aria-label="Prompt view" className="flex gap-1 text-sm">
              {(
                [
                  ["template", "Template"],
                  ["filled", `With ${subject.label.toLowerCase()}`],
                ] as const
              ).map(([value, text]) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={fill === value}
                  onClick={() => setFill(value)}
                  className={`px-2.5 py-1 transition-colors ${fill === value ? "bg-bone/10 text-bone" : "text-bone/70 hover:text-bone"}`}
                >
                  {text}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => void copy()}
              className="border-bone/40 hover:bg-bone hover:text-ink border px-3.5 py-1 text-sm transition-colors"
            >
              {copied ? "Copied" : "Copy prompt"}
            </button>
            <span className="sr-only" role="status">
              {copied ? "Prompt copied to clipboard" : ""}
            </span>
          </div>
        </div>
        <p className="text-bone/60 mt-4 text-xs leading-relaxed">
          Built by the same code the lab uses to assemble prompts. The demo analyses are written by
          hand. Your own images are analysed by the vision model.
        </p>
      </div>
    </div>
  );
}
