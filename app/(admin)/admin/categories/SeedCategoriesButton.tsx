"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { apiSeedCategories } from "@/lib/admin-api";

export default function SeedCategoriesButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSeed() {
    if (!confirm("This will rename existing categories (Copper→Copper Ware, Silver→Silverware, Jade→Green Serpentine) and create any missing craft categories. Continue?"))
      return;

    setLoading(true);
    setResult(null);
    try {
      const res = await apiSeedCategories();
      const lines: string[] = [];
      if (res.renamed.length) lines.push(`Renamed: ${res.renamed.join(", ")}`);
      if (res.created.length) lines.push(`Created: ${res.created.join(", ")}`);
      if (res.skipped.length) lines.push(`Skipped: ${res.skipped.join(", ")}`);
      setResult(lines.join(" | ") || "Nothing to do.");
      router.refresh();
    } catch {
      setResult("Error — check console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleSeed}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 bg-walnut text-cream text-sm rounded-sm hover:bg-walnut/80 transition-colors disabled:opacity-50"
      >
        <Sparkles size={15} />
        {loading ? "Seeding..." : "Seed All Crafts"}
      </button>
      {result && <p className="text-xs text-stone max-w-xs text-right">{result}</p>}
    </div>
  );
}
