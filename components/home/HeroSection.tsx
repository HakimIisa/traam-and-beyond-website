"use client";

import { motion } from "framer-motion";
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
          backgroundImage: `radial-gradient(circle at 1px 1px, #F8E8D2 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-saffron text-sm tracking-[0.25em] uppercase mb-4"
        >
          {content.tagline}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-6xl lg:text-8xl font-semibold text-cream leading-tight mb-6"
        >
          {content.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-cream/70 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto"
        >
          {content.subtext}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href="#collections"
            className="inline-block w-full sm:w-auto px-8 py-3 bg-terracotta hover:bg-terracotta-light text-cream text-sm tracking-wide transition-colors rounded-sm"
          >
            {content.ctaLabel}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
