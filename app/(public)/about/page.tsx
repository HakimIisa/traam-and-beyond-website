import type { Metadata } from "next";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Traam and Beyond — our story and the heritage of Kashmiri craftsmanship.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

      <section id="introduction" className="mb-20">
        <ScrollReveal>
          <h1 className="font-display text-6xl sm:text-7xl text-cream mb-6">Introduction</h1>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-stone text-lg leading-relaxed">
            Content coming soon.
          </p>
        </ScrollReveal>
      </section>

      <section id="craft-heritage">
        <ScrollReveal>
          <h2 className="font-display text-5xl sm:text-6xl text-cream mb-6">
            Craft Heritage of Kashmir
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-stone text-lg leading-relaxed">
            Content coming soon.
          </p>
        </ScrollReveal>
      </section>

    </div>
  );
}
