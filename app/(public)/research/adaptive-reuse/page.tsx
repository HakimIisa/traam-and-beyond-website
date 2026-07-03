import type { Metadata } from "next";
import { getResearchItemsBySection } from "@/lib/firebase/research";
import { getResearchSection } from "@/lib/research-data";
import ResearchItemCard from "@/components/items/ResearchItemCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Adaptive Reuse",
  description: "Research on adaptive reuse of Kashmiri crafts and building traditions.",
};

export default async function AdaptiveReusePage() {
  const section = getResearchSection("adaptive-reuse")!;
  const items = await getResearchItemsBySection("adaptive-reuse");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl lg:text-6xl text-cream mb-4">
          {section.title}
        </h1>
        <p className="text-stone text-sm lg:text-base leading-relaxed text-justify mb-8">
          {section.description}
        </p>
        <div className="border-t border-white/10" />
      </div>

      <div className="flex flex-col">
        {items.map((item, index) => (
          <ResearchItemCard
            key={item.id}
            item={item}
            sectionSlug="adaptive-reuse"
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
