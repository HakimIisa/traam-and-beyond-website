"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageUploadField from "@/components/forms/ImageUploadField";
import { apiCreateFeaturedItem, apiDeleteFeaturedItem } from "@/lib/admin-api";
import type { FeaturedItem } from "@/types";

export default function FeaturedClient({ items }: { items: FeaturedItem[] }) {
  const router = useRouter();
  const [uploadKey, setUploadKey] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(urls: string[]) {
    const url = urls[0];
    if (!url) return;
    setSaving(true);
    setError(null);
    try {
      await apiCreateFeaturedItem({ imageUrl: url, order: items.length });
      setUploadKey((k) => k + 1);
      router.refresh();
    } catch {
      setError("Failed to save the new image. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this image from the featured carousel?")) return;
    setDeletingId(id);
    try {
      await apiDeleteFeaturedItem(id);
      router.refresh();
    } catch {
      alert("Failed to delete image.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-walnut mb-2">Add Image</p>
        <ImageUploadField
          key={uploadKey}
          images={[]}
          onChange={handleUpload}
          storagePath={`featured/temp-${uploadKey}-${Date.now()}`}
          single
        />
        {saving && <p className="text-xs text-stone mt-1">Saving…</p>}
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>

      {items.length === 0 ? (
        <p className="text-stone text-sm p-8 text-center bg-white border border-cream-dark rounded-sm">
          No featured images yet. Add one above.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative group aspect-square rounded-sm overflow-hidden border border-cream-dark bg-cream-dark"
            >
              <Image
                src={item.imageUrl}
                alt="Featured"
                fill
                sizes="200px"
                className="object-cover"
              />
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs py-1.5 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                {deletingId === item.id ? "Removing..." : "Remove"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
