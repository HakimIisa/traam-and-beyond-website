import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import HomePageClient from "@/components/home/HomePageClient";
import { getAllCategories } from "@/lib/firebase/categories";
import { getHomeContent } from "@/lib/firebase/site-content";
import { getAboutContent } from "@/lib/firebase/about-content";
import { getFeaturedItems } from "@/lib/firebase/featured";

export const metadata: Metadata = {
  title: "Traam and Beyond — Silenced crafts, Speaking again",
  description:
    "An evolving repository of Kashmir’s material heritage, bringing together distinctive antiques, craft research, artisan stories, and contemporary approaches to its traditional design language.",
};

export default async function HomePage() {
  const [categories, content, aboutContent, featuredItems] = await Promise.all([
    getAllCategories(),
    getHomeContent(),
    getAboutContent(),
    getFeaturedItems(),
  ]);

  return (
    <HomePageClient
      categories={categories}
      content={content}
      aboutContent={aboutContent}
      featuredImages={featuredItems.map((item) => item.imageUrl)}
    />
  );
}
