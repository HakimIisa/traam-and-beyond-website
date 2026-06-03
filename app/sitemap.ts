import { MetadataRoute } from "next";
import { getAllCategories } from "@/lib/firebase/categories";
import { getItemsByCategory } from "@/lib/firebase/items";

const BASE_URL = "https://traamandbeyond.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/collections`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/research`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/research/adaptive-reuse`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/research/reinterpretation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/research/graphic-design`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
  ];

  try {
    const categories = await getAllCategories();

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${BASE_URL}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const itemRoutes: MetadataRoute.Sitemap = (
      await Promise.all(
        categories.map(async (cat) => {
          const items = await getItemsByCategory(cat.slug);
          return items.map((item) => ({
            url: `${BASE_URL}/category/${cat.slug}/${item.id}`,
            lastModified: new Date(item.createdAt),
            changeFrequency: "monthly" as const,
            priority: 0.7,
          }));
        })
      )
    ).flat();

    return [...staticRoutes, ...categoryRoutes, ...itemRoutes];
  } catch {
    return staticRoutes;
  }
}
