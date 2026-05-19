import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import HomePageClient from "@/components/home/HomePageClient";
import { getAllCategories } from "@/lib/firebase/categories";
import { getHomeContent } from "@/lib/firebase/site-content";
import { getAboutContent } from "@/lib/firebase/about-content";

export const metadata: Metadata = {
  title: "Traam and Beyond — Kashmiri Handcrafted Items",
  description:
    "Discover a curated collection of authentic Kashmiri handcrafted items — copper, silver, jade, papier-mâché, terracotta jewellery, and more.",
};

export default async function HomePage() {
  const [categories, content, aboutContent] = await Promise.all([
    getAllCategories(),
    getHomeContent(),
    getAboutContent(),
  ]);

  return (
    <HomePageClient
      categories={categories}
      content={content}
      aboutContent={aboutContent}
    />
  );
}
