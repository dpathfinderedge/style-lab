export type Platform = "midjourney" | "sdxl" | "dalle" | "general";

export const PLATFORMS: { id: Platform; label: string; note: string }[] = [
  {
    id: "midjourney",
    label: "Midjourney",
    note: "Comma-separated tags with --ar / --style parameters.",
  },
  {
    id: "sdxl",
    label: "Stable Diffusion (SDXL)",
    note: "Weighted tags, e.g. (cinematic lighting:1.2).",
  },
  { id: "dalle", label: "DALL·E", note: "A natural-language sentence." },
  { id: "general", label: "General", note: "Plain descriptive prompt, no special syntax." },
];

/**
 * Purely descriptive — no platform formatting baked in. The prompt text itself
 * is assembled client-side (see utils/promptAssembly.ts) so switching platforms
 * never requires another vision call.
 */
export interface StyleAnalysis {
  medium: string;
  /** One short clause on literal contents — not the focus of the analysis. */
  subject_description: string;
  composition: string;
  lighting: string;
  color_palette: { name: string; hex: string }[];
  mood_atmosphere: string;
  texture_and_detail: string;
  camera_or_render_settings: string;
  /** 2-4 movements, genres, or techniques — not living artists. */
  style_references: string[];
}

export interface AnalyzeRequestBody {
  imageBase64: string;
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
}

export interface AnalyzeErrorBody {
  error: string;
}