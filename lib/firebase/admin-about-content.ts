import { adminDb } from "./admin";
import type { AboutContent } from "@/types/about-content";

export async function adminGetAboutContent(): Promise<AboutContent | null> {
  const snap = await adminDb.collection("site_content").doc("about").get();
  if (!snap.exists) return null;
  return snap.data() as AboutContent;
}

export async function adminUpdateAboutSection<K extends keyof AboutContent>(
  section: K,
  data: AboutContent[K]
): Promise<void> {
  await adminDb
    .collection("site_content")
    .doc("about")
    .set({ [section]: data }, { merge: true });
}
