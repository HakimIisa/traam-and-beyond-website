import { adminDb, adminStorage } from "./admin";
import { Timestamp } from "firebase-admin/firestore";
import { tokenize } from "@/lib/utils";
import type { Item } from "@/types";

export interface ItemWriteData {
  title: string;
  description: string;
  price: number | null;
  notForSale: boolean;
  dimensions: string | null;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  images: string[];
}

function buildSearchTokens(title: string, description: string): string[] {
  return tokenize(`${title} ${description}`);
}

export async function adminCreateItem(data: ItemWriteData): Promise<string> {
  const ref = adminDb.collection("items").doc();
  await ref.set({
    ...data,
    searchTokens: buildSearchTokens(data.title, data.description),
    createdAt: Timestamp.now(),
  });
  return ref.id;
}

export async function adminUpdateItem(
  id: string,
  data: Partial<ItemWriteData>
): Promise<void> {
  const update: Record<string, unknown> = { ...data };
  if (data.title || data.description) {
    const snap = await adminDb.collection("items").doc(id).get();
    const existing = snap.data() ?? {};
    update.searchTokens = buildSearchTokens(
      data.title ?? existing.title ?? "",
      data.description ?? existing.description ?? ""
    );
  }
  await adminDb.collection("items").doc(id).update(update);
}

export async function adminDeleteItem(id: string): Promise<void> {
  // Delete Firestore doc
  await adminDb.collection("items").doc(id).delete();

  // Delete all images in storage under items/{id}/
  try {
    const bucket = adminStorage.bucket();
    await bucket.deleteFiles({ prefix: `items/${id}/` });
  } catch {
    // Storage cleanup failure is non-fatal
    console.warn(`Could not delete storage files for item ${id}`);
  }
}

export async function adminGetAllItems(): Promise<Item[]> {
  const snapshot = await adminDb
    .collection("items")
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title,
      description: data.description,
      price: data.price ?? null,
      notForSale: data.notForSale ?? false,
      dimensions: data.dimensions ?? null,
      categoryId: data.categoryId,
      categorySlug: data.categorySlug,
      categoryName: data.categoryName,
      images: data.images ?? [],
      searchTokens: data.searchTokens ?? [],
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    } as Item;
  });
}
