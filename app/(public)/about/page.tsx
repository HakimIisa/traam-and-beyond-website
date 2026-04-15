import type { Metadata } from "next";
import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Traam and Beyond — our story and the heritage of Kashmiri craftsmanship.",
};

export default function AboutPage() {
  return (
    <div className="relative">
      {/* Left-to-right darkening gradient — matches hero section */}
      <div className="fixed inset-0 bg-gradient-to-r from-transparent to-black/80 pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

      <section id="introduction" className="mb-20">
        <ScrollReveal>
          <h1 className="font-display text-6xl sm:text-7xl text-cream mb-10">Introduction</h1>
        </ScrollReveal>

        <div className="text-stone text-lg leading-relaxed">

          {/* Desktop: image floated right, text wraps around */}
          <div className="hidden lg:block float-right ml-10 mb-6 w-[380px]">
            <Image
              src="/about-vessel.png"
              alt="Antique Kashmiri copper vessel"
              width={600}
              height={800}
              className="w-full h-auto object-contain"
            />
          </div>

          <p className="mb-6">
            It was during a casual evening stroll in Srinagar with my mother in 2004 that we passed by this shop selling Kashmiri copperware. My eyes fell upon an antique bowl with hand engraved and enamelled floral rim, it's patina worn off, just sitting there on a shelf among its fresh counterparts. Someone had sold it by weight, in exchange for something new, a practice not uncommon even today. My mom got me that for 300 Indian rupees and it became the first item in my collection that I still cherish.
          </p>

          {/* Mobile: image between p1 and p2 */}
          <div className="lg:hidden my-8">
            <Image
              src="/about-vessel.png"
              alt="Antique Kashmiri copper vessel"
              width={600}
              height={800}
              className="w-full max-w-xs mx-auto h-auto object-contain"
            />
          </div>

          <p className="mb-6">
            Since I was a kid, growing up in a cultural context full of arts and crafts, I subconsciously was developing a taste for Kashmiri handicrafts. Learning about them was my solace. It inspired me to collect Kashmiri antiques as a hobby, which I have unceasingly pursued ever since.
          </p>
          <p className="mb-6">
            Even during my education as an architect, the aspect of Kashmiri vernacular architecture that went hand in hand with its handicrafts always amazed me. Much of my local work is therefore aimed at incorporating tractional handicrafts into contemporary architectural practices as a means to their revival.
          </p>
          <p className="mb-6">
            However, seeing many of the crafts dead, and the rapid decline in the quality of the ones still being produced, I felt the need to document these masterpieces across different mediums, with an idea of creating a repository, not just of the objects, but their stories, as evidence of a legacy worth remembering, for the new generation to see, and hopefully be inspired from, just as I was.
          </p>
          <p>
            Although most of the items in my collection are sourced locally, many have also been brought from Europe and America, back home where they belong.
          </p>
          <div className="clear-both" />
        </div>
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
    </div>
  );
}
