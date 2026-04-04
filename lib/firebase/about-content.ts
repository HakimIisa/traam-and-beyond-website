import { adminGetAboutContent } from "./admin-about-content";
import { DEFAULT_ABOUT_CONTENT, type AboutContent } from "@/types/about-content";

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const stored = await adminGetAboutContent();
    if (!stored) return DEFAULT_ABOUT_CONTENT;
    return {
      intro: { ...DEFAULT_ABOUT_CONTENT.intro, ...stored.intro },
      crafts: {
        ...DEFAULT_ABOUT_CONTENT.crafts,
        ...stored.crafts,
        copper: { ...DEFAULT_ABOUT_CONTENT.crafts.copper, ...stored.crafts?.copper },
        silver: { ...DEFAULT_ABOUT_CONTENT.crafts.silver, ...stored.crafts?.silver },
        jade: { ...DEFAULT_ABOUT_CONTENT.crafts.jade, ...stored.crafts?.jade },
        papierMache: { ...DEFAULT_ABOUT_CONTENT.crafts.papierMache, ...stored.crafts?.papierMache },
      },
      enquiry: { ...DEFAULT_ABOUT_CONTENT.enquiry, ...stored.enquiry },
    };
  } catch {
    return DEFAULT_ABOUT_CONTENT;
  }
}
