import type { Metadata } from "next";
import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getAboutContent } from "@/lib/firebase/about-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Traam and Beyond — our story and the heritage of Kashmiri craftsmanship.",
};

export default async function AboutPage() {
  const content = await getAboutContent();
  const { introduction, craftHeritage } = content;

  return (
    <div className="relative">
      {/* Background image — desktop only, pinned at top of page, scrolls away naturally */}
      <div className="hidden lg:block absolute top-0 left-0 w-[48%] h-screen opacity-40 pointer-events-none z-0">
        <Image
          src="/hero-vessel.png"
          alt="Kashmiri copper vessel"
          fill
          className="object-contain object-left-bottom"
          sizes="48vw"
        />
      </div>

      {/* Gradient — desktop only, covers full page height for consistent background */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black/20 to-black pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

        <section id="introduction" className="mb-20">
          <ScrollReveal>
            <h1 className="font-display text-6xl sm:text-7xl text-cream mb-10">Our Story</h1>
          </ScrollReveal>

          <div className="text-stone text-lg leading-relaxed text-justify">
            <p className="mb-6">{introduction.paragraph1}</p>

            {/* Bowl image — mobile only, between paragraph 1 and 2 */}
            <div className="block lg:hidden relative w-full h-72 my-8">
              <Image
                src="/about-vessel.png"
                alt="Kashmiri copper vessel"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            <p className="mb-6">{introduction.paragraph2}</p>
            <p className="mb-6">{introduction.paragraph3}</p>
            <p className="mb-6">{introduction.paragraph4}</p>
            <p>{introduction.paragraph5}</p>
          </div>
        </section>

        <section id="craft-heritage" className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
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
        </section>

      </div>
    </div>
  );
}
