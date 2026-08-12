import { adminDb, adminStorage } from "./admin";
import { Timestamp } from "firebase-admin/firestore";
import type { FeaturedItem } from "@/types";

export interface FeaturedItemWriteData {
  imageUrl: string;
  order: number;
}

function serializeItem(d: FirebaseFirestore.QueryDocumentSnapshot): FeaturedItem {
  const data = d.data();
  return {
    id: d.id,
    imageUrl: data.imageUrl,
    order: data.order ?? 0,
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
