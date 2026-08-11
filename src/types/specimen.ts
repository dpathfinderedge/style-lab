/**
 * A single catalogued attribute shown on a specimen plate.
 * Deliberately separate from the eventual `StyleAnalysis` API shape (phase 4) —
 * this just describes what the plate needs to render.
 */
export interface SpecimenAttribute {
  id: string;
  /** Catalogue letter, e.g. "A" — labels are a real sequence here, not decoration. */
  letter: string;
  title: string;
  value: string;
  /** Optional hex swatch for palette-type attributes. */
  swatch?: string;
}
