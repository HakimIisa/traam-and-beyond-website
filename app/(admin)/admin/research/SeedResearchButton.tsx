"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiSeedResearch } from "@/lib/admin-api";
import { Database } from "lucide-react";

export default function SeedResearchButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSeed() {
    if (!confirm("Seed all existing research items to Firestore? Items already in Firestore will be skipped.")) return;
    setLoading(true);
    try {
      const result = await apiSeedResearch();
      alert(`Done! Created: ${result.created.length}, Skipped (already exist): ${result.skipped.length}`);
      router.refresh();
    } catch {
      alert("Seeding failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-walnut text-walnut text-sm rounded-sm hover:bg-walnut/5 transition-colors disabled:opacity-50"
    >
      <Database size={16} />
      {loading ? "Seeding..." : "Seed Existing Items"}
    </button>
  );
}
