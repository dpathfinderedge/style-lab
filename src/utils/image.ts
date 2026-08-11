const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_DIMENSION = 4096;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

export type AcceptedMediaType = (typeof ACCEPTED_TYPES)[number];

export interface ImageValidationError {
  message: string;
}

export interface ValidatedImage {
  file: File;
  mediaType: AcceptedMediaType;
  width: number;
  height: number;
}

function isAcceptedType(type: string): type is AcceptedMediaType {
  return (ACCEPTED_TYPES as readonly string[]).includes(type);
}

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image dimensions"));
    };
    img.src = url;
  });
}

/**
 * Validates a file before it's ever sent anywhere — catches wrong type,
 * oversized files, and unreasonably large dimensions client-side.
 */
export async function validateImage(
  file: File,
): Promise<{ ok: true; value: ValidatedImage } | { ok: false; error: ImageValidationError }> {
  if (!isAcceptedType(file.type)) {
    return { ok: false, error: { message: "Please upload a JPEG, PNG, WebP, or GIF image." } };
  }

  if (file.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      error: {
        message: `That image is too large. Please use a file under ${MAX_FILE_BYTES / 1024 / 1024}MB.`,
      },
    };
  }

  try {
    const { width, height } = await readImageDimensions(file);
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      return {
        ok: false,
        error: { message: `Image dimensions are too large (max ${MAX_DIMENSION}px on any side).` },
      };
    }
    return { ok: true, value: { file, mediaType: file.type, width, height } };
  } catch {
    return { ok: false, error: { message: "Couldn't read that file as an image." } };
  }
}

/** Converts a File to a bare base64 string (no data: URL prefix) for the API payload. */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Unexpected file reader result"));
        return;
      }
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}