import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import { adminGetAllFeaturedItems } from "@/lib/firebase/admin-featured";
import { FEATURED_PANELS, parseFeaturedPanel } from "@/lib/featured-panels";
import type { FeaturedPanelNumber } from "@/types";
import FeaturedClient from "./FeaturedClient";
import FeaturedPanelTabs from "./FeaturedPanelTabs";

export const dynamic = "force-dynamic";

export default async function FeaturedPage({
  searchParams,
}: {
  searchParams: Promise<{ panel?: string }>;
}) {
  const panel = parseFeaturedPanel((await searchParams).panel);
  const all = await adminGetAllFeaturedItems();
  const items = all.filter((item) => item.panel === panel);
  const counts = { 1: 0, 2: 0, 3: 0 } as Record<FeaturedPanelNumber, number>;
  for (const item of all) counts[item.panel]++;
  const { label, location } = FEATURED_PANELS.find((p) => p.panel === panel)!;

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-walnut">Featured</h1>
          <p className="text-stone text-sm mt-1">
            {label} · {items.length} image{items.length === 1 ? "" : "s"} · shown in the homepage carousel {location}
          </p>
        </div>
        {items.length > 1 && (
          <Link
            href={`/admin/featured/reorder?panel=${panel}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-walnut text-walnut text-sm rounded-sm hover:bg-walnut/5 transition-colors"
          >
            <ArrowUpDown size={16} /> Reorder Images
          </Link>
        )}
      </div>

      <FeaturedPanelTabs basePath="/admin/featured" active={panel} counts={counts} />

      {/* key resets the upload field and any local state when switching panels */}
      <FeaturedClient key={panel} items={items} panel={panel} panelLabel={label} />
    </div>
  );
}
