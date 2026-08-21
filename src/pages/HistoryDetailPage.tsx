import { Link, useParams } from "react-router-dom";
import { AnalysisResults } from "@/components/analysis/AnalysisResults";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { LogoMark } from "@/components/LogoMark";

export default function HistoryDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { entries } = useAnalysisHistory();
  const entry = entries.find((e) => e.id === id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg tracking-tight">
          <LogoMark className="h-6 w-6" />
          Style Lab
        </Link>
        <Link
          to="/history"
          className="text-bone/70 hover:text-bone text-sm underline underline-offset-4"
        >
          ← Back to history
        </Link>
      </header>

      {entry ? (
        <AnalysisResults analysis={entry.analysis} previewUrl={entry.thumbnailDataUrl} />
      ) : (
        <p className="text-bone/70 text-sm">
          That entry isn't in your history anymore — it may have been cleared.
        </p>
      )}
    </div>
  );
}