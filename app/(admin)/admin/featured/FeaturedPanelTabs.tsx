import Link from "next/link";
import { cn } from "@/lib/utils";
import { FEATURED_PANELS } from "@/lib/featured-panels";
import type { FeaturedPanelNumber } from "@/types";

interface FeaturedPanelTabsProps {
  basePath: string;
  active: FeaturedPanelNumber;
  counts: Record<FeaturedPanelNumber, number>;
}

// Link-based (not client state) so the selected panel lives in the URL — the server page
// fetches the right images, and router.refresh() after an upload/delete keeps the tab.
export default function FeaturedPanelTabs({ basePath, active, counts }: FeaturedPanelTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {FEATURED_PANELS.map(({ panel, label }) => (
        <Link
          key={panel}
          href={`${basePath}?panel=${panel}`}
          className={cn(
            "px-4 py-2 rounded-sm text-sm transition-colors border",
            active === panel
              ? "bg-walnut text-cream border-walnut"
              : "bg-white text-stone border-cream-dark hover:border-walnut hover:text-walnut"
          )}
        >
          {label}
          <span className="ml-2 text-xs opacity-70">{counts[panel]}</span>
        </Link>
      ))}
    </div>
  );
}
