export function AnalysisSkeleton(): React.JSX.Element {
  return (
    <div
      className="flex animate-pulse flex-col items-stretch gap-6 sm:flex-row"
      aria-live="polite"
    >
      <span className="sr-only">Analyzing image style…</span>
      <div className="border-pencil bg-pencil/20 mx-auto aspect-4/5 w-full max-w-64 shrink-0 border sm:mx-0 sm:w-64" />
      <div className="flex flex-1 flex-col justify-between gap-4 py-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="border-pencil hidden w-6 shrink-0 border-t sm:block" />
            <div className="flex-1 space-y-2">
              <div className="bg-pencil/30 h-2.5 w-20 rounded-full" />
              <div className="bg-pencil/20 h-3 w-3/4 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}