"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

function SortableThumbnail({
  url,
  index,
  onRemove,
}: {
  url: string;
  index: number;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group w-24 h-24 rounded-sm overflow-hidden border border-cream-dark",
        isDragging && "shadow-lg opacity-80 z-10"
      )}
    >
      <Image src={url} alt={`Image ${index + 1}`} fill sizes="96px" className="object-cover" />
      {index === 0 && (
        <span className="absolute bottom-1 left-1 bg-terracotta text-cream text-[10px] px-1.5 py-0.5 rounded-sm leading-none">
          Cover
        </span>
      )}
      <button
        {...attributes}
        {...listeners}
        type="button"
        aria-label="Drag to reorder"
        className="absolute top-1 left-1 bg-black/50 text-white rounded-sm p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical size={12} />
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove image"
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={12} />
      </button>
    </div>
  );
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
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.indexOf(active.id as string);
    const newIndex = images.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    onChange(arrayMove(images, oldIndex, newIndex));
  }

  const canAddMore = !single && (!maxImages || images.length < maxImages);

  return (
    <div className="space-y-3">
      {/* Existing images */}
      {images.length > 0 && (
        <>
          {single ? (
            <div className="flex flex-wrap gap-3">
              {images.map((url, i) => (
                <div
                  key={url}
                  className="relative group w-24 h-24 rounded-sm overflow-hidden border border-cream-dark"
                >
                  <Image src={url} alt={`Image ${i + 1}`} fill sizes="96px" className="object-cover" />
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
          ) : (
            <>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={images} strategy={rectSortingStrategy}>
                  <div className="flex flex-wrap gap-3">
                    {images.map((url, i) => (
                      <SortableThumbnail key={url} url={url} index={i} onRemove={() => removeImage(i)} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              {images.length > 1 && (
                <p className="text-xs text-stone/60">
                  Drag to reorder · the first image is used as the cover.
                </p>
              )}
            </>
          )}
        </>
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
