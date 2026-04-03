import type { Metadata } from "next";
import EnquiryForm from "@/components/forms/EnquiryForm";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Traam and Beyond — our story and the heritage of Kashmiri craftsmanship.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-5xl font-semibold text-walnut mb-6">Our Story</h1>

      <div className="prose prose-lg max-w-none text-stone leading-relaxed space-y-6">
        <p>
          Traam and Beyond was born from a deep love for Kashmir&apos;s artistic
          heritage — a heritage that spans centuries and is carried forward by
          generations of dedicated artisans.
        </p>
        <p>
          The word <em>Traam</em> (ترام) refers to copper in Kashmiri — one of
          the oldest crafts of the valley. Our collection begins there, but
          reaches far beyond: into silver filigree work, jade carvings,
          papier-mâché (papier-mâché), terracotta jewellery, and ancient coins
          that hold stories of dynasties past.
        </p>
        <p>
          Every item in our collection is carefully sourced directly from
          craftsmen and families who have practiced these arts for generations.
          We believe that acquiring a handcrafted item is not just a purchase —
          it is an act of preserving culture.
        </p>

        <h2 className="text-3xl font-semibold text-walnut pt-4">
          The Crafts
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 not-prose">
          {[
            {
              name: "Copper (Traam)",
              desc: "Hand-hammered copper vessels, trays, and decorative items shaped by khar (coppersmiths) using techniques unchanged for centuries.",
            },
            {
              name: "Silver",
              desc: "Intricate filigree and engraved silverwork — rings, pendants, boxes, and ornamental pieces.",
            },
            {
              name: "Jade",
              desc: "Carved jade objects ranging from small figurines to decorative bowls, sourced and finished with extraordinary precision.",
            },
            {
              name: "Papier-mâché",
              desc: "Lacquered papier-mâché boxes, vases, and decorative pieces painted with floral and geometric motifs in vivid natural pigments.",
            },
          ].map((craft) => (
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
          Have a Question?
        </h2>
        <p className="text-stone text-center text-sm mb-6">
          We&apos;re happy to share more about any piece or our story.
        </p>
        <EnquiryForm type="general" />
      </div>
    </div>
  );
}
