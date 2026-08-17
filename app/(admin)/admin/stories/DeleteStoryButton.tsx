"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiDeleteStory } from "@/lib/admin-api";

export default function DeleteStoryButton({ id, title }: { id: string; title: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await apiDeleteStory(id);
      router.refresh();
    } catch {
      alert("Failed to delete story.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs px-3 py-1.5 border border-red-300 text-red-600 rounded-sm hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
