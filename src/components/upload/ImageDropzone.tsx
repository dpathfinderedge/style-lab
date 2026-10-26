import { useCallback, useRef, useState } from "react";

interface ImageDropzoneProps {
  onFileSelected: (file: File) => void;
  previewUrl: string | null;
  isValidating: boolean;
}

export function ImageDropzone({
  onFileSelected,
  previewUrl,
  isValidating,
}: ImageDropzoneProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDraggingOver(false);
      const file = event.dataTransfer.files[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) onFileSelected(file);
      event.target.value = "";
    },
    [onFileSelected],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDrop}
      className={`focus-visible:outline-index relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 border border-dashed p-6 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
        previewUrl ? "aspect-4/5 max-w-64" : "min-h-72 sm:aspect-video sm:min-h-0"
      } ${isDraggingOver ? "border-index bg-index/10" : "border-pencil hover:border-bone/50"}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={handleInputChange}
        aria-label="Upload a reference image"
      />

      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Uploaded reference"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <p className="font-display text-2xl">
            {isValidating
              ? "Checking image…"
              : isDraggingOver
                ? "Release to upload"
                : "Drop a reference image here"}
          </p>
          <p className="text-bone/70 text-sm">
            or <span className="underline underline-offset-4">browse your files</span>
          </p>
          <p className="text-bone/60 mt-3 text-xs">JPEG, PNG, WebP or GIF, up to 5MB</p>
        </>
      )}
    </div>
  );
}