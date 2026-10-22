import type { StyleAnalysis } from "@/types/style-analysis";

export type ShapeRole = "body" | "trim" | "light" | "ground" | "shadow" | "beam";

export interface SubjectShape {
  d: string;
  role: ShapeRole;
}

export interface SubjectDef {
  id: "lighthouse" | "teapot" | "cabin";
  label: string;
  phrase: string;
  shapes: SubjectShape[];
}

export type TextureKind = "grain" | "halftone" | "wash";

export interface RolePaint {
  fill: string;
  opacity?: number;
  plate?: "a" | "b";
}

export interface StyleDef {
  id: "film" | "riso" | "wash";
  label: string;
  texture: TextureKind;
  sky: [string, string];
  roles: Record<ShapeRole, RolePaint>;
  analysis: StyleAnalysis;
  pins: { medium: string; lighting: string; composition: string; palette: string; texture: string };
}
