import Link from "next/link";
import { Plus, ArrowUpDown } from "lucide-react";
import { adminGetAllStories } from "@/lib/firebase/admin-stories";
import StoriesClient from "./StoriesClient";

export const dynamic = "force-dynamic";

export default async function StoriesPage() {
  const items = await adminGetAllStories();

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-walnut">Stories</h1>
          <p className="text-stone text-sm mt-1">{items.length} stories</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/stories/reorder"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-walnut text-walnut text-sm rounded-sm hover:bg-walnut/5 transition-colors"
          >
            <ArrowUpDown size={16} /> Reorder Stories
          </Link>
          <Link
            href="/admin/stories/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-terracotta text-cream text-sm rounded-sm hover:bg-terracotta-dark transition-colors"
          >
            <Plus size={16} /> Add Story
          </Link>
        </div>
      </div>

      <StoriesClient items={items} />
    </div>
  );
}
