"use client";

// Vercel Serverless Functions reject request bodies over ~4.5MB
// (FUNCTION_PAYLOAD_TOO_LARGE) before app code ever runs — a limit that
// isn't configurable and doesn't exist locally under `next dev`, which is
// why an oversized upload can work on a developer's machine and fail on the
// live site. This step exists purely to keep uploads under that limit; it is
// deliberately conservative (large max dimension, high quality) because the
// server's own pipeline (app/api/admin/upload/route.ts, using sharp) still
// does the real, final resize-to-2000px/WebP-quality-82 compression — this
// only needs to get the file there safely.
const MAX_DIMENSION = 3000;
const JPEG_QUALITY = 0.9;
// Small files are already well clear of the limit — skip re-encoding them.
const SKIP_BELOW_BYTES = 1.5 * 1024 * 1024;

/**
 * Resizes/re-encodes an image client-side before upload. Never throws —
 * falls back to the original file on any failure, so a compression problem
 * can never be the reason an upload doesn't go through.
 */
export async function compressImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  if (file.size <= SKIP_BELOW_BYTES) return file;

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });

    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    );
    if (!blob || blob.size >= file.size) return file; // didn't actually help — keep the original

    const compressedName = file.name.replace(/\.[^./]+$/, "") + ".jpg";
    return new File([blob], compressedName, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
