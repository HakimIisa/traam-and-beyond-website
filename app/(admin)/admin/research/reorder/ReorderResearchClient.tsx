"use client";

import { useState, useCallback, useMemo } from "react";
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
import type { ResearchItem } from "@/types";

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function SortableResearchItem({ item }: { item: ResearchItem }) {
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
        {item.images[0] && (
          <Image
            src={item.images[0]}
            alt={item.title}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        )}
      </div>
      <span className="text-sm font-medium text-walnut flex-1 line-clamp-1">
        {item.title}
      </span>
    </div>
  );
}

export default function ReorderResearchClient({ items }: { items: ResearchItem[] }) {
  const { user } = useAdminAuth();

  const sections = useMemo(() => {
    const slugs = Array.from(new Set(items.map((i) => i.sectionSlug)));
    return slugs.map((slug) => ({ slug, name: slugToTitle(slug) }));
  }, [items]);

  const [selectedSection, setSelectedSection] = useState<string>(
    sections[0]?.slug ?? ""
  );
  const [orderedItems, setOrderedItems] = useState<ResearchItem[]>(items);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const sectionItems = orderedItems
    .filter((i) => i.sectionSlug === selectedSection)
    .sort((a, b) => a.order - b.order);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = sectionItems.findIndex((i) => i.id === active.id);
      const newIndex = sectionItems.findIndex((i) => i.id === over.id);
      const reordered = arrayMove(sectionItems, oldIndex, newIndex);

      setOrderedItems((prev) => {
        const others = prev.filter((i) => i.sectionSlug !== selectedSection);
        const updated = reordered.map((item, index) => ({ ...item, order: index }));
        return [...others, ...updated];
      });
      setSaved(false);
    },
    [sectionItems, selectedSection]
  );

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      const token = await user.getIdToken();
      const payload = sectionItems.map((item, index) => ({
        id: item.id,
        order: index,
      }));
      const res = await fetch("/api/admin/research/reorder", {
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
      {/* Section tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((sec) => (
          <button
            key={sec.slug}
            onClick={() => {
              setSelectedSection(sec.slug);
              setSaved(false);
            }}
            className={cn(
              "px-4 py-2 rounded-sm text-sm transition-colors border",
              selectedSection === sec.slug
                ? "bg-walnut text-cream border-walnut"
                : "bg-white text-stone border-cream-dark hover:border-walnut hover:text-walnut"
            )}
          >
            {sec.name}
            <span className="ml-2 text-xs opacity-70">
              {items.filter((i) => i.sectionSlug === sec.slug).length}
            </span>
          </button>
        ))}
      </div>

      {/* Save button */}
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

      {/* Drag list */}
      {sectionItems.length === 0 ? (
        <p className="text-stone text-sm p-8 text-center bg-white border border-cream-dark rounded-sm">
          No items in this section.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sectionItems.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {sectionItems.map((item) => (
                <SortableResearchItem key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
