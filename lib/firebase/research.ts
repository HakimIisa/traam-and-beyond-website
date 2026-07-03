import { RESEARCH_SECTIONS } from "@/lib/research-data";
import type { ResearchItem } from "@/types";

function isFirebaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

export async function getResearchItemsBySection(sectionSlug: string): Promise<ResearchItem[]> {
  if (!isFirebaseConfigured()) {
    const section = RESEARCH_SECTIONS.find((s) => s.sectionSlug === sectionSlug);
    return (section?.items ?? []).map((item, i) => ({
      id: item.slug,
      slug: item.slug,
      title: item.title,
      description: item.description,
      images: item.images,
      sectionSlug,
      order: i,
      createdAt: new Date().toISOString(),
    }));
  }

  const { adminGetResearchItemsBySection } = await import("./admin-research");
  return adminGetResearchItemsBySection(sectionSlug);
}

export async function getAllResearchItems(): Promise<ResearchItem[]> {
  if (!isFirebaseConfigured()) {
    return RESEARCH_SECTIONS.flatMap((section) =>
      section.items.map((item, i) => ({
        id: item.slug,
        slug: item.slug,
        title: item.title,
        description: item.description,
        images: item.images,
        sectionSlug: section.sectionSlug,
        order: i,
        createdAt: new Date().toISOString(),
      }))
    );
  }

  const { adminGetAllResearchItems } = await import("./admin-research");
  return adminGetAllResearchItems();
}

export async function getResearchItemBySlug(
  sectionSlug: string,
  slug: string
): Promise<ResearchItem | null> {
  if (!isFirebaseConfigured()) {
    const section = RESEARCH_SECTIONS.find((s) => s.sectionSlug === sectionSlug);
    const item = section?.items.find((i) => i.slug === slug);
    if (!item) return null;
    return {
      id: slug,
      slug: item.slug,
      title: item.title,
      description: item.description,
      images: item.images,
      sectionSlug,
      order: 0,
      createdAt: new Date().toISOString(),
    };
  }

  const { adminGetResearchItemBySlug } = await import("./admin-research");
  return adminGetResearchItemBySlug(sectionSlug, slug);
}
