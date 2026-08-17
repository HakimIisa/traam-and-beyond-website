import type { StoryItem } from "@/types";

function isFirebaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

export async function getAllStories(): Promise<StoryItem[]> {
  if (!isFirebaseConfigured()) return [];

  const { adminGetAllStories } = await import("./admin-stories");
  return adminGetAllStories();
}
