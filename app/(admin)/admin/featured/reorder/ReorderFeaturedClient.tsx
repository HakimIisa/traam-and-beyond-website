"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
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
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Check, Loader2 } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { cn } from "@/lib/utils";
import type { FeaturedItem } from "@/types";

function SortableFeaturedItem({ item, index }: { item: FeaturedItem; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 bg-white border border-cream-dark rounded-sm px-4 py-3 select-none",
        isDragging && "shadow-lg opacity-80 z-50 border-walnut"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-stone/40 hover:text-stone cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </button>
      <div className="w-10 h-10 rounded-sm overflow-hidden bg-cream-dark flex-shrink-0">
        <Image
          src={item.imageUrl}
          alt={`Featured image ${index + 1}`}
          width={40}
          height={40}
          className="object-cover w-full h-full"
        />
      </div>
      <span className="text-sm font-medium text-walnut flex-1">
        Image {index + 1}
      </span>
    </div>
  );
}

export default function ReorderFeaturedClient({ items }: { items: FeaturedItem[] }) {
  const { user } = useAdminAuth();
  const [orderedItems, setOrderedItems] = useState<FeaturedItem[]>(
    [...items].sort((a, b) => a.order - b.order)
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrderedItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
    setSaved(false);
  }, []);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      const token = await user.getIdToken();
      const payload = orderedItems.map((item, index) => ({ id: item.id, order: index }));
      const res = await fetch("/api/admin/featured/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: payload }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save order. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-stone">
          Drag to reorder · changes apply immediately on save
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm rounded-sm transition-colors",
            saved
              ? "bg-green-600 text-white"
              : "bg-terracotta hover:bg-terracotta-dark text-cream"
          )}
        >
          {saving ? (
            <><Loader2 size={14} className="animate-spin" /> Saving…</>
          ) : saved ? (
            <><Check size={14} /> Saved</>
          ) : (
            "Save Order"
          )}
        </button>
      </div>

      {orderedItems.length === 0 ? (
        <p className="text-stone text-sm p-8 text-center bg-white border border-cream-dark rounded-sm">
          No featured images yet.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedItems.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {orderedItems.map((item, index) => (
                <SortableFeaturedItem key={item.id} item={item} index={index} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
