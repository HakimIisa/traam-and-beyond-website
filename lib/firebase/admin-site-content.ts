import { adminDb } from "./admin";
import type { HomeContent } from "@/types/home-content";

export async function adminGetHomeContent(): Promise<HomeContent | null> {
  const snap = await adminDb.collection("site_content").doc("home").get();
  if (!snap.exists) return null;
  return snap.data() as HomeContent;
}

export async function adminSetHomeContent(content: HomeContent): Promise<void> {
  await adminDb.collection("site_content").doc("home").set(content);
}

export async function adminUpdateHomeSection<K extends keyof HomeContent>(
  section: K,
  data: HomeContent[K]
): Promise<void> {
  await adminDb
    .collection("site_content")
    .doc("home")
    .set({ [section]: data }, { merge: true });
}
