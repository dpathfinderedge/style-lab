import type { Platform, StyleAnalysis } from "@/types/style-analysis";

function paletteNames(analysis: StyleAnalysis): string {
  return analysis.color_palette.map((c) => c.name).join(", ");
}

function tags(analysis: StyleAnalysis): string[] {
  return [
    analysis.medium,
    analysis.lighting,
    analysis.composition,
    analysis.texture_and_detail,
    analysis.mood_atmosphere,
    `palette of ${paletteNames(analysis)}`,
    analysis.camera_or_render_settings,
  ].filter(Boolean);
}

function assembleMidjourney(analysis: StyleAnalysis): string {
  return `[SUBJECT], ${tags(analysis).join(", ")} --ar 3:4 --style raw`;
}

function assembleSdxl(analysis: StyleAnalysis): string {
  const weighted = [
    `(${analysis.medium}:1.2)`,
    `(${analysis.lighting}:1.1)`,
    analysis.composition,
    `(palette of ${paletteNames(analysis)}:1.1)`,
    analysis.texture_and_detail,
    analysis.mood_atmosphere,
    analysis.camera_or_render_settings,
  ].filter(Boolean);
  return `[SUBJECT], ${weighted.join(", ")}`;
}

function assembleDalle(analysis: StyleAnalysis): string {
  return `A [SUBJECT] rendered as ${analysis.medium}, with ${analysis.lighting} and ${analysis.composition}. The palette leans toward ${paletteNames(analysis)}, with ${analysis.texture_and_detail} and a ${analysis.mood_atmosphere} mood. ${analysis.camera_or_render_settings}.`;
}

function assembleGeneral(analysis: StyleAnalysis): string {
  return `[SUBJECT] in the style of ${analysis.medium}: ${analysis.lighting}, ${analysis.composition}, a palette of ${paletteNames(analysis)}, ${analysis.texture_and_detail}, ${analysis.mood_atmosphere}.`;
}

/**
 * Builds a ready-to-use prompt from the model's descriptive analysis, formatted
 * for the given platform. Deterministic and runs entirely client-side — this is
 * what makes platform switching instant instead of re-running the vision call.
 */
export function assemblePrompt(analysis: StyleAnalysis, platform: Platform): string {
  switch (platform) {
    case "midjourney":
      return assembleMidjourney(analysis);
    case "sdxl":
      return assembleSdxl(analysis);
    case "dalle":
      return assembleDalle(analysis);
    case "general":
      return assembleGeneral(analysis);
  }
}