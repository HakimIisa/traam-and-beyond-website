import type { FeaturedPanelNumber } from "@/types";

export const FEATURED_PANELS: { panel: FeaturedPanelNumber; label: string; location: string }[] = [
  { panel: 1, label: "Featured 1", location: "above the Collections title" },
  { panel: 2, label: "Featured 2", location: "above the Research title" },
  { panel: 3, label: "Featured 3", location: "above the Stories title" },
];

// Anything that isn't a valid panel number (missing, garbage) falls back to Featured 1 —
// which is also where every image uploaded before panels existed belongs.
export function parseFeaturedPanel(value: unknown): FeaturedPanelNumber {
  const n = Number(value);
  return n === 2 || n === 3 ? n : 1;
}
