import { useCallback, useState } from "react";
import { fileToBase64, type ValidatedImage } from "@/utils/image";
import type { AnalyzeErrorBody, StyleAnalysis } from "@/types/style-analysis";

interface UseStyleAnalysisResult {
  result: StyleAnalysis | null;
  error: string | null;
  isLoading: boolean;
  analyze: (image: ValidatedImage) => Promise<void>;
  reset: () => void;
}

export function useStyleAnalysis(): UseStyleAnalysisResult {
  const [result, setResult] = useState<StyleAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyze = useCallback(async (image: ValidatedImage) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const imageBase64 = await fileToBase64(image.file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mediaType: image.mediaType }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as AnalyzeErrorBody | null;
        setError(body?.error ?? `Analysis failed (${response.status}). Please try again.`);
        return;
      }

      const data = (await response.json()) as StyleAnalysis;
      setResult(data);
    } catch {
      setError("Couldn't reach the analysis service. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, error, isLoading, analyze, reset };
}