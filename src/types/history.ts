import type { StyleAnalysis } from "@/types/style-analysis";

export interface HistoryEntry {
  id: string;
  createdAt: number;
  thumbnailDataUrl: string;
  analysis: StyleAnalysis;
}