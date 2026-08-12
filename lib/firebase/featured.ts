import type { FeaturedItem } from "@/types";

function isFirebaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

export async function getFeaturedItems(): Promise<FeaturedItem[]> {
  if (!isFirebaseConfigured()) return [];

  const { adminGetAllFeaturedItems } = await import("./admin-featured");
  return adminGetAllFeaturedItems();
}
