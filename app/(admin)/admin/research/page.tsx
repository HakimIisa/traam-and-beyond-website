import Link from "next/link";
import { Plus, ArrowUpDown } from "lucide-react";
import { adminGetAllResearchItems } from "@/lib/firebase/admin-research";
import ResearchClient from "./ResearchClient";

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const items = await adminGetAllResearchItems();

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-walnut">Research</h1>
          <p className="text-stone text-sm mt-1">{items.length} research items</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/research/reorder"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-walnut text-walnut text-sm rounded-sm hover:bg-walnut/5 transition-colors"
          >
            <ArrowUpDown size={16} /> Reorder Items
          </Link>
          <Link
            href="/admin/research/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-cream text-sm rounded-sm hover:bg-terracotta-dark transition-colors"
          >
            <Plus size={16} /> Add Item
          </Link>
        </div>
      </div>

      <ResearchClient items={items} />
    </div>
  );
}
