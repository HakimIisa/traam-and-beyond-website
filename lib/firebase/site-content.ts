import { adminGetHomeContent } from "./admin-site-content";
import { DEFAULT_HOME_CONTENT, type HomeContent } from "@/types/home-content";

export async function getHomeContent(): Promise<HomeContent> {
  try {
    const stored = await adminGetHomeContent();
    if (!stored) return DEFAULT_HOME_CONTENT;
    return {
      hero: { ...DEFAULT_HOME_CONTENT.hero, ...stored.hero },
      intro: { ...DEFAULT_HOME_CONTENT.intro, ...stored.intro },
      collections: { ...DEFAULT_HOME_CONTENT.collections, ...stored.collections },
      enquiry: { ...DEFAULT_HOME_CONTENT.enquiry, ...stored.enquiry },
    };
  } catch {
    return DEFAULT_HOME_CONTENT;
  }
}
