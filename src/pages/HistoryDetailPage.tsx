import { useParams } from "react-router-dom";
import { HeaderLink, SiteHeader } from "@/components/SiteHeader";
import { AnalysisResults } from "@/components/analysis/AnalysisResults";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";

export default function HistoryDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { entries } = useAnalysisHistory();
  const entry = entries.find((e) => e.id === id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <SiteHeader className="mb-10">
        <HeaderLink to="/history">Back to history</HeaderLink>
      </SiteHeader>

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