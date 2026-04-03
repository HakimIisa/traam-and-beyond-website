import { adminDb, adminStorage } from "./admin";
import { Timestamp } from "firebase-admin/firestore";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types";

export interface CategoryWriteData {
  name: string;
  slug: string;
  order: number;
  coverImage?: string;
  description?: string;
}

export async function adminCreateCategory(data: CategoryWriteData): Promise<string> {
  const id = slugify(data.name);
  await adminDb.collection("categories").doc(id).set({
    ...data,
    createdAt: Timestamp.now(),
  });
  return id;
}

export async function adminUpdateCategory(
  id: string,
  data: Partial<CategoryWriteData>
): Promise<void> {
  await adminDb.collection("categories").doc(id).update(data);
}

export async function adminDeleteCategory(id: string): Promise<void> {
  await adminDb.collection("categories").doc(id).delete();
  try {
    const bucket = adminStorage.bucket();
    await bucket.deleteFiles({ prefix: `categories/${id}/` });
  } catch {
    console.warn(`Could not delete storage files for category ${id}`);
  }
}

export async function adminGetAllCategories(): Promise<Category[]> {
  const snapshot = await adminDb
    .collection("categories")
    .orderBy("order", "asc")
    .get();
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      slug: data.slug,
      order: data.order,
      coverImage: data.coverImage ?? undefined,
      description: data.description ?? undefined,
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    } as Category;
  });
}
