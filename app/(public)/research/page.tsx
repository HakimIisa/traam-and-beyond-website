import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Research — Traam and Beyond",
  description: "Research into Kashmiri craft heritage: adaptive reuse, reinterpretation, and graphic design.",
};

const RESEARCH_AREAS = [
  {
    title: "Adaptive Reuse",
    href: "/research/adaptive-reuse",
    description: "Exploring how traditional Kashmiri craft objects find new purpose and meaning in contemporary contexts.",
  },
  {
    title: "Reinterpretation",
    href: "/research/reinterpretation",
    description: "Re-examining the visual language of Kashmiri craftsmanship through a modern lens.",
  },
  {
    title: "Graphic Design",
    href: "/research/graphic-design",
    description: "Drawing on the patterns, motifs, and forms of Kashmiri crafts as a source for graphic design practice.",
  },
];

export default function ResearchPage() {
  return (
    <div className="bg-[#1a130a] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <ScrollReveal>
          <h1 className="font-display text-6xl sm:text-7xl text-cream mb-4">Research</h1>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-stone text-lg leading-relaxed mb-16">
            An ongoing investigation into the heritage, material culture, and living legacy of Kashmiri craftsmanship.
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-12">
          {RESEARCH_AREAS.map((area, i) => (
            <ScrollReveal key={area.href} delay={0.1 * (i + 2)}>
              <Link
                href={area.href}
                className="group block border-t border-cream-dark/20 pt-8 hover:border-terracotta transition-colors duration-300"
              >
                <h2 className="font-display text-4xl sm:text-5xl text-cream group-hover:text-terracotta transition-colors duration-300 mb-3">
                  {area.title}
                </h2>
                <p className="text-stone text-base leading-relaxed">{area.description}</p>
                <span className="text-terracotta text-sm mt-4 inline-block">Explore →</span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
