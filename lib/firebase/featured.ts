import type { FeaturedPanelNumber } from "@/types";

function isFirebaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

export async function getFeaturedImagesByPanel(): Promise<Record<FeaturedPanelNumber, string[]>> {
  const panels: Record<FeaturedPanelNumber, string[]> = { 1: [], 2: [], 3: [] };
  if (!isFirebaseConfigured()) return panels;

  const { adminGetAllFeaturedItems } = await import("./admin-featured");
  // Already sorted by `order`, so pushing in sequence keeps each panel's own order
  for (const item of await adminGetAllFeaturedItems()) {
    panels[item.panel].push(item.imageUrl);
  }
  return panels;
}
