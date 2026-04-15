import { adminGetAboutContent } from "./admin-about-content";
import { DEFAULT_ABOUT_CONTENT, type AboutContent } from "@/types/about-content";

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const stored = await adminGetAboutContent();
    if (!stored) return DEFAULT_ABOUT_CONTENT;
    return {
      introduction: { ...DEFAULT_ABOUT_CONTENT.introduction, ...stored.introduction },
      craftHeritage: { ...DEFAULT_ABOUT_CONTENT.craftHeritage, ...stored.craftHeritage },
    };
  } catch {
    return DEFAULT_ABOUT_CONTENT;
  }
}
