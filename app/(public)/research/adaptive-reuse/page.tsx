import type { Metadata } from "next";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Adaptive Reuse",
  description: "Research on adaptive reuse of Kashmiri crafts.",
};

export default function AdaptiveReusePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <ScrollReveal>
        <h1 className="font-display text-6xl sm:text-7xl text-cream mb-6">Adaptive Reuse</h1>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <p className="text-stone text-lg leading-relaxed">Coming soon.</p>
      </ScrollReveal>
    </div>
  );
}
