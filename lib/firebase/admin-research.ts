import { adminDb, adminStorage } from "./admin";
import { Timestamp } from "firebase-admin/firestore";
import type { ResearchItem } from "@/types";

export interface ResearchItemWriteData {
  slug: string;
  title: string;
  description: string;
  images: string[];
  sectionSlug: string;
  order: number;
}

function serializeItem(d: FirebaseFirestore.QueryDocumentSnapshot): ResearchItem {
  const data = d.data();
  return {
    id: d.id,
    slug: data.slug,
    title: data.title,
    description: data.description ?? "",
    images: data.images ?? [],
    sectionSlug: data.sectionSlug,
    order: data.order ?? 0,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
  };
}

export async function adminGetAllResearchItems(): Promise<ResearchItem[]> {
  const snapshot = await adminDb
    .collection("research_items")
    .orderBy("order", "asc")
    .get();
  return snapshot.docs.map(serializeItem);
}

export async function adminGetResearchItemsBySection(sectionSlug: string): Promise<ResearchItem[]> {
  const snapshot = await adminDb
    .collection("research_items")
    .where("sectionSlug", "==", sectionSlug)
    .get();
  const items = snapshot.docs.map(serializeItem);
  return items.sort((a, b) => a.order - b.order);
}

export async function adminGetResearchItemBySlug(
  sectionSlug: string,
  slug: string
): Promise<ResearchItem | null> {
  const snapshot = await adminDb
    .collection("research_items")
    .where("sectionSlug", "==", sectionSlug)
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  return serializeItem(snapshot.docs[0]);
}

export async function adminCreateResearchItem(data: ResearchItemWriteData): Promise<string> {
  const ref = adminDb.collection("research_items").doc();
  await ref.set({
    ...data,
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function adminUpdateResearchItem(
  id: string,
  data: Partial<ResearchItemWriteData>
): Promise<void> {
  await adminDb.collection("research_items").doc(id).update(data);
}

export async function adminReorderResearchItems(
  items: Array<{ id: string; order: number }>
): Promise<void> {
  const batch = adminDb.batch();
  for (const { id, order } of items) {
    batch.update(adminDb.collection("research_items").doc(id), { order });
  }
  await batch.commit();
}

export async function adminDeleteResearchItem(id: string): Promise<void> {
  await adminDb.collection("research_items").doc(id).delete();
  try {
    const bucket = adminStorage.bucket();
    await bucket.deleteFiles({ prefix: `research/${id}/` });
  } catch {
    console.warn(`Could not delete storage files for research item ${id}`);
  }
}
