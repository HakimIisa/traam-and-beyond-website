"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadFile } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  /** Existing image URLs already saved */
  images: string[];
  /** Called whenever images array changes */
  onChange: (images: string[]) => void;
  /** Storage path prefix, e.g. "items/item-id" or "categories/cat-id" */
  storagePath: string;
  /** Max number of images allowed. Default: unlimited */
  maxImages?: number;
  /** If true, only one image allowed (replaces on upload) */
  single?: boolean;
}

export default function ImageUploadField({
  images,
  onChange,
  storagePath,
  maxImages,
  single = false,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const fileArray = Array.from(files);
    const allowed = single ? 1 : maxImages ? maxImages - images.length : fileArray.length;
    const toUpload = fileArray.slice(0, allowed);

    setUploading(true);
    try {
      const urls = await Promise.all(
        toUpload.map((file) => {
          const ext = file.name.split(".").pop();
          const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          return uploadFile(file, `${storagePath}/${filename}`);
        })
      );
      onChange(single ? urls : [...images, ...urls]);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  const canAddMore = !single && (!maxImages || images.length < maxImages);

  return (
    <div className="space-y-3">
      {/* Existing images */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={url} className="relative group w-24 h-24 rounded-sm overflow-hidden border border-cream-dark">
              <Image
                src={url}
                alt={`Image ${i + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {(single || canAddMore) && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={!single}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 border-2 border-dashed rounded-sm text-sm transition-colors",
              uploading
                ? "border-stone/30 text-stone/40 cursor-not-allowed"
                : "border-stone/30 text-stone hover:border-terracotta hover:text-terracotta cursor-pointer"
            )}
          >
            {uploading ? (
              <><Loader2 size={16} className="animate-spin" /> Uploading...</>
            ) : (
              <><Upload size={16} /> {single ? "Upload Image" : "Add Images"}</>
            )}
          </button>
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          <p className="text-xs text-stone/60 mt-1">
            {single ? "1:1 ratio recommended" : "1:1 ratio recommended · Multiple images supported"}
          </p>
        </div>
      )}
    </div>
  );
}
