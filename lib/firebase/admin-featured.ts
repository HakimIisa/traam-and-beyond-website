import { adminDb, adminStorage } from "./admin";
import { Timestamp } from "firebase-admin/firestore";
import type { FeaturedItem, FeaturedPanelNumber } from "@/types";
import { parseFeaturedPanel } from "@/lib/featured-panels";

export interface FeaturedItemWriteData {
  imageUrl: string;
  order: number;
  panel: FeaturedPanelNumber;
}

function serializeItem(d: FirebaseFirestore.QueryDocumentSnapshot): FeaturedItem {
  const data = d.data();
  return {
    id: d.id,
    imageUrl: data.imageUrl,
    order: data.order ?? 0,
    // Images uploaded before panels existed have no `panel` field — they are Featured 1
    panel: parseFeaturedPanel(data.panel),
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
  };
}

export async function adminGetAllFeaturedItems(): Promise<FeaturedItem[]> {
  const snapshot = await adminDb
    .collection("featured_items")
    .orderBy("order", "asc")
    .get();
  return snapshot.docs.map(serializeItem);
}

// Filtered in memory rather than with .where("panel", "==", n): legacy docs have no
// `panel` field so a Firestore filter would miss them, and the collection is tiny.
export async function adminGetFeaturedItemsByPanel(panel: FeaturedPanelNumber): Promise<FeaturedItem[]> {
  const items = await adminGetAllFeaturedItems();
  return items.filter((item) => item.panel === panel);
}

export async function adminCreateFeaturedItem(data: FeaturedItemWriteData): Promise<string> {
  const ref = adminDb.collection("featured_items").doc();
  await ref.set({
    ...data,
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function adminReorderFeaturedItems(
  items: Array<{ id: string; order: number }>
): Promise<void> {
  const batch = adminDb.batch();
  for (const { id, order } of items) {
    batch.update(adminDb.collection("featured_items").doc(id), { order });
  }
  await batch.commit();
}

export async function adminDeleteFeaturedItem(id: string): Promise<void> {
  await adminDb.collection("featured_items").doc(id).delete();
  try {
    const bucket = adminStorage.bucket();
    await bucket.deleteFiles({ prefix: `featured/${id}/` });
  } catch {
    console.warn(`Could not delete storage files for featured item ${id}`);
  }
}
