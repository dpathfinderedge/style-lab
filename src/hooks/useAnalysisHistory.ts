import { useCallback, useState } from "react";
import { loadHistory, saveHistory, MAX_HISTORY_ENTRIES } from "@/utils/history";
import type { HistoryEntry } from "@/types/history";
import type { StyleAnalysis } from "@/types/style-analysis";

interface UseAnalysisHistoryResult {
  entries: HistoryEntry[];
  addEntry: (analysis: StyleAnalysis, thumbnailDataUrl: string) => void;
  removeEntry: (id: string) => void;
  clearAll: () => void;
}

export function useAnalysisHistory(): UseAnalysisHistoryResult {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => loadHistory());

  const addEntry = useCallback((analysis: StyleAnalysis, thumbnailDataUrl: string) => {
    setEntries((prev) => {
      const next = [
        { id: crypto.randomUUID(), createdAt: Date.now(), thumbnailDataUrl, analysis },
        ...prev,
      ].slice(0, MAX_HISTORY_ENTRIES);
      saveHistory(next);
      return next;
    });
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveHistory(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
    saveHistory([]);
  }, []);

  return { entries, addEntry, removeEntry, clearAll };
}