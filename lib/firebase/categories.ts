import {
  collection,
  doc,
  getDocs,
  getDoc,
  orderBy,
  query,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./client";
import { MOCK_CATEGORIES } from "@/lib/mock-data";
import type { Category } from "@/types";

function isFirebaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

function serialize(id: string, data: DocumentData): Category {
  return {
    id,
    name: data.name,
    slug: data.slug,
    order: data.order,
    coverImage: data.coverImage ?? undefined,
    description: data.description ?? undefined,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
  };
}

export async function getAllCategories(): Promise<Category[]> {
  if (!isFirebaseConfigured()) return MOCK_CATEGORIES;

  const q = query(collection(db, "categories"), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => serialize(d.id, d.data()));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isFirebaseConfigured()) {
    return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }

  const categories = await getAllCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  if (!isFirebaseConfigured()) {
    return MOCK_CATEGORIES.find((c) => c.id === id) ?? null;
  }

  const snap = await getDoc(doc(db, "categories", id));
  if (!snap.exists()) return null;
  return serialize(snap.id, snap.data());
}
