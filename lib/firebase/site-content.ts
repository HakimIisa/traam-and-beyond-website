import { doc, getDoc } from "firebase/firestore";
import { db } from "./client";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/types/home-content";

function isFirebaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

export async function getHomeContent(): Promise<HomeContent> {
  if (!isFirebaseConfigured()) return DEFAULT_HOME_CONTENT;

  try {
    const snap = await getDoc(doc(db, "site_content", "home"));
    if (!snap.exists()) return DEFAULT_HOME_CONTENT;

    const data = snap.data() as Partial<HomeContent>;
    // Deep merge with defaults so missing fields don't break the page
    return {
      hero: { ...DEFAULT_HOME_CONTENT.hero, ...data.hero },
      intro: { ...DEFAULT_HOME_CONTENT.intro, ...data.intro },
      collections: { ...DEFAULT_HOME_CONTENT.collections, ...data.collections },
      enquiry: { ...DEFAULT_HOME_CONTENT.enquiry, ...data.enquiry },
    };
  } catch {
    return DEFAULT_HOME_CONTENT;
  }
}
