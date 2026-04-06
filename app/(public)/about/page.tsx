import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import EnquiryForm from "@/components/forms/EnquiryForm";
import { getAboutContent } from "@/lib/firebase/about-content";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Traam and Beyond — our story and the heritage of Kashmiri craftsmanship.",
};

export default async function AboutPage() {
  const content = await getAboutContent();

  const crafts = [
    content.crafts.copper,
    content.crafts.silver,
    content.crafts.jade,
    content.crafts.papierMache,
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <ScrollReveal>
        <h1 className="font-display text-5xl font-semibold text-cream mb-6">{content.intro.heading}</h1>
      </ScrollReveal>

      <div className="prose prose-lg max-w-none text-stone leading-relaxed space-y-6">
        <ScrollReveal delay={0.05}>
          <p>{content.intro.paragraph1}</p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p>{content.intro.paragraph2}</p>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p>{content.intro.paragraph3}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <h2 className="font-display text-3xl font-semibold text-cream pt-4">
            {content.crafts.heading}
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6 not-prose">
          {crafts.map((craft, index) => (
            <ScrollReveal key={craft.name} delay={index * 0.1}>
              <div className="bg-walnut-light rounded-sm p-5">
                <p className="font-semibold text-cream mb-1">{craft.name}</p>
                <p className="text-sm text-stone leading-relaxed">{craft.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Enquiry */}
      <ScrollReveal delay={0.1}>
        <div className="mt-16 bg-walnut-light rounded-sm p-8 max-w-xl mx-auto">
          <h2 className="font-display text-2xl font-semibold text-cream mb-2 text-center">
            {content.enquiry.title}
          </h2>
          <p className="text-stone text-center text-sm mb-6">
            {content.enquiry.subtitle}
          </p>
          <EnquiryForm type="general" />
        </div>
      </ScrollReveal>
    </div>
  );
}
