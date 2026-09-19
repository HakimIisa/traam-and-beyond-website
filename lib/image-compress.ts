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
const QUALITY = 0.9;
// Small files are already well clear of the limit — skip re-encoding them.
const SKIP_BELOW_BYTES = 1.5 * 1024 * 1024;

/**
 * Resizes/re-encodes an image client-side before upload. Never throws —
 * falls back to the original file on any failure, so a compression problem
 * can never be the reason an upload doesn't go through.
 *
 * Transparency must survive this step: JPEG has no alpha channel, so encoding a
 * background-removed PNG as JPEG silently flattens every transparent pixel to solid
 * black (the featured carousels' cut-out images showed up as black squares). Only
 * files that are already JPEG (which can't be transparent) are re-encoded as JPEG;
 * everything else goes to WebP, which keeps alpha. Browsers that can't encode WebP
 * (Safari) hand back a PNG from toBlob instead — also alpha-safe — and if that isn't
 * any smaller than the original, the original is uploaded untouched.
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

    const outputType = file.type === "image/jpeg" ? "image/jpeg" : "image/webp";
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, outputType, QUALITY)
    );
    if (!blob || blob.size >= file.size) return file; // didn't actually help — keep the original

    // toBlob falls back to PNG when it can't encode the requested type, so name the
    // file after what it actually is rather than what was asked for.
    const extension = { "image/jpeg": ".jpg", "image/webp": ".webp", "image/png": ".png" }[blob.type] ?? "";
    const compressedName = file.name.replace(/\.[^./]+$/, "") + extension;
    return new File([blob], compressedName, { type: blob.type });
  } catch {
    return file;
  }
}
