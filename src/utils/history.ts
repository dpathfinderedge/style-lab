import type { HistoryEntry } from "@/types/history";

const STORAGE_KEY = "style-lab:history";
export const MAX_HISTORY_ENTRIES = 30;

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    if (entries.length <= 1) return;
    const trimmed = entries.slice(0, Math.ceil(entries.length / 2));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // Storage may be disabled entirely (private browsing, etc.) — give up silently.
    }
  }
}