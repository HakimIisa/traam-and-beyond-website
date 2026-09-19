import Link from "next/link";
import { adminGetAllFeaturedItems } from "@/lib/firebase/admin-featured";
import { FEATURED_PANELS, parseFeaturedPanel } from "@/lib/featured-panels";
import type { FeaturedPanelNumber } from "@/types";
import FeaturedPanelTabs from "../FeaturedPanelTabs";
import ReorderFeaturedClient from "./ReorderFeaturedClient";

export const dynamic = "force-dynamic";

export default async function ReorderFeaturedPage({
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
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-semibold text-walnut mb-1">Reorder Featured Images</h1>
      <p className="text-stone text-sm mb-6">
        {label} · drag to change the order they appear in the homepage carousel {location}.{" "}
        <Link href={`/admin/featured?panel=${panel}`} className="underline hover:text-walnut">
          Back to Featured
        </Link>
      </p>

      <FeaturedPanelTabs basePath="/admin/featured/reorder" active={panel} counts={counts} />

      {/* key remounts the client so its initial ordering state matches the selected panel */}
      <ReorderFeaturedClient key={panel} items={items} />
    </div>
  );
}
