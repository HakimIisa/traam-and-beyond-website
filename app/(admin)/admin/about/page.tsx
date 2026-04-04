import { adminGetAboutContent } from "@/lib/firebase/admin-about-content";
import { DEFAULT_ABOUT_CONTENT, type AboutContent } from "@/types/about-content";
import AboutContentClient from "./AboutContentClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Page Content" };

export default async function AdminAboutPage() {
  let stored: AboutContent | null = null;
  try {
    stored = await adminGetAboutContent();
  } catch {
    // Firebase not available — fall back to defaults
  }

  const content: AboutContent = {
    intro: { ...DEFAULT_ABOUT_CONTENT.intro, ...stored?.intro },
    crafts: {
      ...DEFAULT_ABOUT_CONTENT.crafts,
      ...stored?.crafts,
      copper: { ...DEFAULT_ABOUT_CONTENT.crafts.copper, ...stored?.crafts?.copper },
      silver: { ...DEFAULT_ABOUT_CONTENT.crafts.silver, ...stored?.crafts?.silver },
      jade: { ...DEFAULT_ABOUT_CONTENT.crafts.jade, ...stored?.crafts?.jade },
      papierMache: { ...DEFAULT_ABOUT_CONTENT.crafts.papierMache, ...stored?.crafts?.papierMache },
    },
    enquiry: { ...DEFAULT_ABOUT_CONTENT.enquiry, ...stored?.enquiry },
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-walnut">About Page Content</h1>
        <p className="text-stone mt-1 text-sm">
          Edit the text for each section of the public about page. Changes are saved per section.
        </p>
      </div>

      <AboutContentClient content={content} />
    </div>
  );
}
