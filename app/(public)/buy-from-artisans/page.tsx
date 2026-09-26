import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BazarJajeerHero } from "@/components/bazar-jajeer/Hero";
import { BazarJajeerFeaturedCrafts } from "@/components/bazar-jajeer/FeaturedCrafts";

export const metadata: Metadata = {
  title: "Buy from the Artisans",
  description: "Bazar Jajeer — a digital marketplace for Kashmiri crafts, connecting artisans directly with buyers.",
};

export default function BuyFromArtisansPage() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <ScrollReveal>
          <h1 className="font-display text-3xl sm:text-6xl text-cream mb-6 text-center">
            Buy from the Artisans
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-stone leading-relaxed text-center mb-4">
            A dedicated marketplace for Kashmiri crafts —{" "}
            <span className="text-cream">Bazar Jajeer</span> — connects artisans
            directly with buyers.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p className="text-stone leading-relaxed text-center max-w-2xl mx-auto">
            Every purchase there happens directly between you and an
            independent artisan or shop — Traam and Beyond is not a party to
            those sales. It exists to spotlight new, contemporary Kashmiri
            craftsmanship, not the antiquities shown on this site. Bazar
            Jajeer is still being built and is not yet live for purchases.
          </p>
        </ScrollReveal>
      </div>

      {/* Side margins (desktop only) mark this as a separate site embedded here, not native content */}
      <div className="px-0 lg:px-[120px]">
        <BazarJajeerHero />
        <BazarJajeerFeaturedCrafts />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        {/* Shop by Category */}
        <ScrollReveal>
          <h3 className="font-display text-2xl sm:text-3xl text-cream text-center mb-4">
            Browse by Category
          </h3>
          <p className="text-stone leading-relaxed text-center max-w-xl mx-auto mb-10">
            Copper, papier-mâché, silverware, enamelware and more — each craft
            has its own shelf on Bazar Jajeer.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <figure>
            <div className="relative w-full aspect-[1906/911] rounded-sm overflow-hidden border border-white/10">
              <Image
                src="/BazarJajeer/HomeShopByCategory.jpg"
                alt="Bazar Jajeer — Shop by Category: Copper Ware, Papier Mache, Silverware, Enamelware, and Terracotta"
                fill
                sizes="(min-width: 1024px) 960px, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="text-stone/60 text-xs lg:text-sm italic mt-3 text-center">
              Shop by Category, as it appears on Bazar Jajeer.
            </figcaption>
          </figure>
        </ScrollReveal>

        <div className="border-t border-white/10 mt-16 mb-16" />

        {/* Mobile */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <ScrollReveal>
            <h3 className="font-display text-2xl sm:text-3xl text-cream mb-4 text-center lg:text-left">
              Designed for Mobile, Too
            </h3>
            <p className="text-stone leading-relaxed text-center lg:text-left">
              Whether you&apos;re browsing at a desk or from a phone, Bazar
              Jajeer carries the same unhurried, gallery-like feel — built for
              discovering a craft, not just checking out.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <figure>
              <div className="relative w-full aspect-[359/773] max-w-[240px] mx-auto rounded-sm overflow-hidden border border-white/10">
                <Image
                  src="/BazarJajeer/MobileHome.jpg"
                  alt="Bazar Jajeer on mobile"
                  fill
                  sizes="240px"
                  className="object-cover"
                />
              </div>
            </figure>
          </ScrollReveal>
        </div>

        {/* CTA */}
        <ScrollReveal className="text-center mt-20 mb-16">
          <a
            href="https://bazarjajeer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-dark text-cream px-6 py-3 rounded-sm tracking-wide transition-colors"
          >
            Visit Bazar Jajeer →
          </a>
        </ScrollReveal>

        {/* Developer credit */}
        <ScrollReveal>
          <div className="border-t border-white/10 pt-8 text-center">
            <Link
              href="/developer"
              className="text-xs text-stone hover:text-cream transition-colors"
            >
              Bazar Jajeer is being built by{" "}
              <span className="font-display text-base text-cream">Hakim Iisa</span>{" "}
              · Director – SEER.{" "}
              <span className="underline underline-offset-2">Know more.</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </>
  );
}
