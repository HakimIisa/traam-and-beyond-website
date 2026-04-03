import type { HomeContent } from "@/types/home-content";

interface HeroSectionProps {
  content: HomeContent["hero"];
}

export default function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-walnut">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #FAF6F0 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <p className="text-saffron text-sm tracking-[0.25em] uppercase mb-4">
          {content.tagline}
        </p>
        <h1 className="text-cream text-5xl sm:text-6xl lg:text-7xl font-semibold leading-tight mb-6">
          {content.headline}
        </h1>
        <p className="text-cream/70 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
          {content.subtext}
        </p>
        <a
          href="#collections"
          className="inline-block px-8 py-3 bg-terracotta hover:bg-terracotta-light text-cream text-sm tracking-wide transition-colors rounded-sm"
        >
          {content.ctaLabel}
        </a>
      </div>
    </section>
  );
}
