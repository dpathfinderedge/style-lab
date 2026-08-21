import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";
import { LogoMark } from "@/components/LogoMark";

export default function HistoryPage(): React.JSX.Element {
  const { entries, removeEntry, clearAll } = useAnalysisHistory();

  function handleClearAll(): void {
    if (window.confirm("Clear all saved analyses? This can't be undone.")) {
      clearAll();
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg tracking-tight">
          <LogoMark className="h-6 w-6" />
          Style Lab
        </Link>
        <Link
          to="/lab"
          className="text-bone/70 hover:text-bone text-sm underline underline-offset-4"
        >
          New analysis
        </Link>
      </header>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl">History</h1>
        {entries.length > 0 ? (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-pencil hover:text-ochre text-xs transition-colors"
          >
            Clear all
          </button>
        ) : null}
      </div>

      {entries.length === 0 ? (
        <p className="text-bone/70 text-sm">
          Nothing catalogued yet.{" "}
          <Link to="/lab" className="text-index underline underline-offset-4">
            Analyze an image
          </Link>{" "}
          to start building a history.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <li key={entry.id} className="border-pencil flex items-center gap-4 border p-3">
              <Link to={`/history/${entry.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                <img
                  src={entry.thumbnailDataUrl}
                  alt=""
                  className="border-pencil h-14 w-14 shrink-0 border object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm">{entry.analysis.medium}</p>
                  <p className="text-pencil font-mono text-[11px]">
                    {new Date(entry.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                aria-label="Delete this entry"
                className="text-pencil hover:text-ochre shrink-0 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}