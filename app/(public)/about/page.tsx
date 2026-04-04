import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import EnquiryForm from "@/components/forms/EnquiryForm";
import { getAboutContent } from "@/lib/firebase/about-content";

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
      <h1 className="text-5xl font-semibold text-walnut mb-6">{content.intro.heading}</h1>

      <div className="prose prose-lg max-w-none text-stone leading-relaxed space-y-6">
        <p>{content.intro.paragraph1}</p>
        <p>{content.intro.paragraph2}</p>
        <p>{content.intro.paragraph3}</p>

        <h2 className="text-3xl font-semibold text-walnut pt-4">
          {content.crafts.heading}
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 not-prose">
          {crafts.map((craft) => (
            <div key={craft.name} className="bg-cream-dark rounded-sm p-5">
              <p className="font-semibold text-walnut mb-1">{craft.name}</p>
              <p className="text-sm text-stone leading-relaxed">{craft.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Enquiry */}
      <div className="mt-16 bg-cream-dark rounded-sm p-8 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold text-walnut mb-2 text-center">
          {content.enquiry.title}
        </h2>
        <p className="text-stone text-center text-sm mb-6">
          {content.enquiry.subtitle}
        </p>
        <EnquiryForm type="general" />
      </div>
    </div>
  );
}
