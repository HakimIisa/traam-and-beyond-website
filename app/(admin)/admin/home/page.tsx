import { adminGetHomeContent } from "@/lib/firebase/admin-site-content";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/types/home-content";
import HomeContentClient from "./HomeContentClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Home Page Content" };

export default async function AdminHomePage() {
  let stored: HomeContent | null = null;
  try {
    stored = await adminGetHomeContent();
  } catch {
    // Firebase not available — fall back to defaults
  }

  const content: HomeContent = {
    hero: { ...DEFAULT_HOME_CONTENT.hero, ...stored?.hero },
    intro: { ...DEFAULT_HOME_CONTENT.intro, ...stored?.intro },
    collections: { ...DEFAULT_HOME_CONTENT.collections, ...stored?.collections },
    enquiry: { ...DEFAULT_HOME_CONTENT.enquiry, ...stored?.enquiry },
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-walnut">Home Page Content</h1>
        <p className="text-stone mt-1 text-sm">
          Edit the text for each section of the public home page. Changes are saved per section.
        </p>
      </div>

      <HomeContentClient content={content} />
    </div>
  );
}
