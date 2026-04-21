import type { Metadata } from "next";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getAboutContent } from "@/lib/firebase/about-content";
import OurStoryTimeline from "@/components/about/OurStoryTimeline";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Traam and Beyond — our story and the heritage of Kashmiri craftsmanship.",
};

export default async function AboutPage() {
  const content = await getAboutContent();
  const { craftHeritage } = content;

  return (
    <div>
      {/* Full-bleed timeline — covers full viewport width */}
      <section id="introduction" className="relative z-10">
        <OurStoryTimeline />
      </section>

      {/* Craft Heritage — constrained width, own dark background */}
      <section id="craft-heritage" className="bg-[#1a130a] px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-5xl sm:text-6xl text-cream mb-6">
              Craft Heritage of Kashmir
            </h2>
          </ScrollReveal>
          {craftHeritage.body ? (
            <ScrollReveal delay={0.1}>
              <p className="text-stone text-lg leading-relaxed text-justify whitespace-pre-line">
                {craftHeritage.body}
              </p>
            </ScrollReveal>
          ) : null}
        </div>
      </section>
    </div>
  );
}
