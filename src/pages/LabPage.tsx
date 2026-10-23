import { useCallback, useEffect, useRef } from "react";
import { HeaderLink, SiteHeader } from "@/components/SiteHeader";
import { ImageDropzone } from "@/components/upload/ImageDropzone";
import { AnalysisSkeleton } from "@/components/analysis/AnalysisSkeleton";
import { AnalysisResults } from "@/components/analysis/AnalysisResults";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useStyleAnalysis } from "@/hooks/useStyleAnalysis";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { createThumbnailDataUrl } from "@/utils/image";
import type { StyleAnalysis } from "@/types/style-analysis";

export default function LabPage(): React.JSX.Element {
  const {
    image,
    previewUrl,
    error: uploadError,
    isValidating,
    setFile,
    reset: resetUpload,
  } = useImageUpload();
  const {
    result,
    error: analysisError,
    isLoading,
    analyze,
    reset: resetAnalysis,
  } = useStyleAnalysis();
  const { addEntry } = useAnalysisHistory();

  const savedResultRef = useRef<StyleAnalysis | null>(null);

  useEffect(() => {
    if (!result || !image || savedResultRef.current === result) return;
    savedResultRef.current = result;
    void createThumbnailDataUrl(image.file).then((thumbnailDataUrl) => {
      addEntry(result, thumbnailDataUrl);
    });
  }, [result, image, addEntry]);

  const handleFileSelected = useCallback(
    (file: File) => {
      resetAnalysis();
      void setFile(file);
    },
    [resetAnalysis, setFile],
  );

  const handleAnalyze = useCallback(() => {
    if (!image) return;
    void analyze(image);
  }, [image, analyze]);

  const handleStartOver = useCallback(() => {
    resetUpload();
    resetAnalysis();
    savedResultRef.current = null;
  }, [resetUpload, resetAnalysis]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <SiteHeader className="mb-12">
        <HeaderLink to="/history">History</HeaderLink>
        {(image ?? result) ? (
          <button
            type="button"
            onClick={handleStartOver}
            className="text-bone/80 hover:text-bone text-sm underline underline-offset-4"
          >
            Start over
          </button>
        ) : null}
      </SiteHeader>

      {!result && !isLoading ? (
        <div className="flex flex-col gap-6">
          <ImageDropzone
            onFileSelected={handleFileSelected}
            previewUrl={previewUrl}
            isValidating={isValidating}
          />

          {uploadError ? <p className="text-ochre text-sm">{uploadError}</p> : null}

          {image ? (
            <button
              type="button"
              onClick={handleAnalyze}
              className="bg-index text-bone mx-auto self-start px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 sm:mx-0"
            >
              Analyze style
            </button>
          ) : null}
        </div>
      ) : null}

      {isLoading ? <AnalysisSkeleton /> : null}

      {analysisError ? (
        <div className="border-pencil flex flex-col items-start gap-3 border p-4">
          <p className="text-sm">{analysisError}</p>
          <button
            type="button"
            onClick={handleAnalyze}
            className="border-bone/40 hover:bg-bone hover:text-ink border px-4 py-1.5 text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      ) : null}

      {result && previewUrl ? <AnalysisResults analysis={result} previewUrl={previewUrl} /> : null}
    </div>
  );
}