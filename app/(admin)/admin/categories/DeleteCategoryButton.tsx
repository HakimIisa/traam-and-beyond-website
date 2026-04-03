"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiDeleteCategory } from "@/lib/admin-api";

export default function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await apiDeleteCategory(id);
      router.refresh();
    } catch {
      alert("Failed to delete category.");
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
