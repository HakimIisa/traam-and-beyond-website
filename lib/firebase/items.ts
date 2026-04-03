import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./client";
import {
  MOCK_ITEMS,
  getMockItemsByCategory,
  getMockItemById,
  searchMockItems,
} from "@/lib/mock-data";
import type { Item } from "@/types";

function isFirebaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

function serialize(id: string, data: DocumentData): Item {
  return {
    id,
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
  };
}

export async function getItemsByCategory(categorySlug: string): Promise<Item[]> {
  if (!isFirebaseConfigured()) return getMockItemsByCategory(categorySlug);

  const q = query(
    collection(db, "items"),
    where("categorySlug", "==", categorySlug),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => serialize(d.id, d.data()));
}

export async function getItemById(id: string): Promise<Item | null> {
  if (!isFirebaseConfigured()) return getMockItemById(id);

  const snap = await getDoc(doc(db, "items", id));
  if (!snap.exists()) return null;
  return serialize(snap.id, snap.data());
}

export async function getAllItems(): Promise<Item[]> {
  if (!isFirebaseConfigured()) return MOCK_ITEMS;

  const snapshot = await getDocs(collection(db, "items"));
  return snapshot.docs.map((d) => serialize(d.id, d.data()));
}

export async function searchItems(queryText: string): Promise<Item[]> {
  if (!isFirebaseConfigured()) return searchMockItems(queryText);

  if (!queryText.trim()) return [];
  const tokens = [
    ...new Set(
      queryText
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((t) => t.length > 1)
    ),
  ].slice(0, 10);

  if (tokens.length === 0) return [];

  const q = query(
    collection(db, "items"),
    where("searchTokens", "array-contains-any", tokens)
  );
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map((d) => serialize(d.id, d.data()));

  return items.sort((a, b) => {
    const aMatches = tokens.filter((t) => a.searchTokens?.includes(t)).length;
    const bMatches = tokens.filter((t) => b.searchTokens?.includes(t)).length;
    return bMatches - aMatches;
  });
}

export async function getPaginatedItems(
  pageSize: number,
  cursor?: QueryDocumentSnapshot
) {
  if (!isFirebaseConfigured()) {
    return { items: MOCK_ITEMS.slice(0, pageSize), lastDoc: undefined };
  }

  let q = query(
    collection(db, "items"),
    orderBy("createdAt", "desc"),
    limit(pageSize)
  );
  if (cursor) {
    q = query(
      collection(db, "items"),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(pageSize)
    );
  }
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map((d) => serialize(d.id, d.data()));
  const lastDoc = snapshot.docs[snapshot.docs.length - 1];
  return { items, lastDoc };
}
