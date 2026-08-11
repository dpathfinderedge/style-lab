import { useCallback, useState } from "react";
import { validateImage, type ValidatedImage } from "@/utils/image";

interface UseImageUploadResult {
  image: ValidatedImage | null;
  previewUrl: string | null;
  error: string | null;
  isValidating: boolean;
  setFile: (file: File) => Promise<void>;
  reset: () => void;
}

export function useImageUpload(): UseImageUploadResult {
  const [image, setImage] = useState<ValidatedImage | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const setFile = useCallback(async (file: File) => {
    setIsValidating(true);
    setError(null);

    const result = await validateImage(file);

    if (!result.ok) {
      setError(result.error.message);
      setImage(null);
      setPreviewUrl(null);
      setIsValidating(false);
      return;
    }

    setImage(result.value);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setIsValidating(false);
  }, []);

  const reset = useCallback(() => {
    setImage(null);
    setError(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  return { image, previewUrl, error, isValidating, setFile, reset };
}