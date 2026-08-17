import { adminDb, adminStorage } from "./admin";
import { Timestamp } from "firebase-admin/firestore";
import type { StoryItem } from "@/types";

export interface StoryWriteData {
  title: string;
  subtitle: string;
  body: string;
  image: string;
  order: number;
}

function serializeStory(d: FirebaseFirestore.QueryDocumentSnapshot): StoryItem {
  const data = d.data();
  return {
    id: d.id,
    title: data.title,
    subtitle: data.subtitle ?? "",
    body: data.body ?? "",
    image: data.image ?? "",
    order: data.order ?? 0,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
  };
}

export async function adminGetAllStories(): Promise<StoryItem[]> {
  const snapshot = await adminDb.collection("stories").orderBy("order", "asc").get();
  return snapshot.docs.map(serializeStory);
}

export async function adminCreateStory(data: StoryWriteData): Promise<string> {
  const ref = adminDb.collection("stories").doc();
  await ref.set({
    ...data,
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function adminUpdateStory(
  id: string,
  data: Partial<StoryWriteData>
): Promise<void> {
  await adminDb.collection("stories").doc(id).update(data);
}

export async function adminReorderStories(
  items: Array<{ id: string; order: number }>
): Promise<void> {
  const batch = adminDb.batch();
  for (const { id, order } of items) {
    batch.update(adminDb.collection("stories").doc(id), { order });
  }
  await batch.commit();
}

export async function adminDeleteStory(id: string): Promise<void> {
  await adminDb.collection("stories").doc(id).delete();
  try {
    const bucket = adminStorage.bucket();
    await bucket.deleteFiles({ prefix: `stories/${id}/` });
  } catch {
    console.warn(`Could not delete storage files for story ${id}`);
  }
}
