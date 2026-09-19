import type { Metadata } from "next";
import { getAllStories } from "@/lib/firebase/stories";
import StoriesPageClient from "@/components/stories/StoriesPageClient";

export const metadata: Metadata = {
  title: "Stories",
  description: "Stories from the artisans and collectors of Kashmir.",
};

export const dynamic = "force-dynamic";

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ story?: string }>;
}) {
  const [stories, { story }] = await Promise.all([getAllStories(), searchParams]);
  return <StoriesPageClient stories={stories} initialStoryId={story} />;
}
