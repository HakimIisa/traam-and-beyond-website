import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import { adminGetAllFeaturedItems } from "@/lib/firebase/admin-featured";
import FeaturedClient from "./FeaturedClient";

export const dynamic = "force-dynamic";

export default async function FeaturedPage() {
  const items = await adminGetAllFeaturedItems();

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-walnut">Featured</h1>
          <p className="text-stone text-sm mt-1">
            {items.length} image{items.length === 1 ? "" : "s"} · shown in the homepage carousel between the Collections image and title
          </p>
        </div>
        {items.length > 1 && (
          <Link
            href="/admin/featured/reorder"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-walnut text-walnut text-sm rounded-sm hover:bg-walnut/5 transition-colors"
          >
            <ArrowUpDown size={16} /> Reorder Images
          </Link>
        )}
      </div>

      <FeaturedClient items={items} />
    </div>
  );
}
