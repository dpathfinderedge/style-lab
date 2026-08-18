export type AcceptedMediaType = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

const JPEG = [0xff, 0xd8, 0xff];
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const GIF87A = [0x47, 0x49, 0x46, 0x38, 0x37, 0x61];
const GIF89A = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61];
const RIFF = [0x52, 0x49, 0x46, 0x46];

export function isAcceptedMediaType(value: unknown): value is AcceptedMediaType {
  return (
    value === "image/jpeg" ||
    value === "image/png" ||
    value === "image/webp" ||
    value === "image/gif"
  );
}

function startsWith(buffer: Buffer, bytes: number[]): boolean {
  if (buffer.length < bytes.length) return false;
  return buffer.subarray(0, bytes.length).equals(Buffer.from(bytes));
}

export function bytesMatchMediaType(buffer: Buffer, mediaType: AcceptedMediaType): boolean {
  switch (mediaType) {
    case "image/jpeg":
      return startsWith(buffer, JPEG);
    case "image/png":
      return startsWith(buffer, PNG);
    case "image/gif":
      return startsWith(buffer, GIF87A) || startsWith(buffer, GIF89A);
    case "image/webp":
      return (
        startsWith(buffer, RIFF) &&
        buffer.length >= 12 &&
        buffer.subarray(8, 12).toString("ascii") === "WEBP"
      );
  }
}