import type { Metadata } from "next";
import Link from "next/link";
import { RESEARCH_SECTIONS } from "@/lib/research-data";
import ResearchItemCard from "@/components/items/ResearchItemCard";

export const metadata: Metadata = {
  title: "Research — Traam and Beyond",
  description:
    "An ongoing exploration into the living relevance of Kashmiri craft and building traditions.",
};

export default function ResearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      {/* Research sections */}
      {RESEARCH_SECTIONS.map((section) => (
        <section key={section.sectionSlug} className="mb-24">
          <div className="mb-10">
            <Link
              href={`/research/${section.sectionSlug}`}
              className="hover:text-terracotta transition-colors duration-200 inline-block"
            >
              <h2 className="font-display text-3xl lg:text-5xl text-cream mb-4">
                {section.title}
              </h2>
            </Link>
            <p className="text-stone text-sm lg:text-base leading-relaxed text-justify mb-8">
              {section.description}
            </p>
            <div className="border-t border-white/10" />
          </div>

          <div className="flex flex-col">
            {section.items.map((item, index) => (
              <ResearchItemCard
                key={item.slug}
                item={item}
                sectionSlug={section.sectionSlug}
                index={index}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
