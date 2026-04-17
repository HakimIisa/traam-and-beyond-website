"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import type { HomeContent } from "@/types/home-content";

interface HeroSectionProps {
  content: HomeContent["hero"];
}

export default function HeroSection({ content }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Desktop bowl: vertical rise + horizontal drift + scale (unchanged)
  const bowlY = useTransform(scrollYProgress, [0, 0.7], ["45vh", "0vh"]);
  const bowlX = useTransform(scrollYProgress, [0, 0.7], ["26vw", "0vw"]);
  const bowlScale = useTransform(scrollYProgress, [0, 0.7], [0.7, 1]);

  // Mobile bowl: starts solid in lower viewport, rises to near top, fades, shrinks 5%
  const bowlYMobile = useTransform(scrollYProgress, [0, 0.7], ["15vh", "-20vh"]);
  const bowlOpacityMobile = useTransform(scrollYProgress, [0, 0.7], [1, 0.4]);
  const bowlScaleMobile = useTransform(scrollYProgress, [0, 0.7], [1, 0.95]);

  // Mobile logo: starts above text (small), grows large + rises to overlay bowl
  const logoScaleMobile = useTransform(scrollYProgress, [0, 0.7], [1, 4.5]);
  const logoYMobile = useTransform(scrollYProgress, [0, 0.7], ["-38vh", "-17vh"]);

  // Mobile text: starts above center, moves down as bowl+logo take over
  const textScaleMobile = useTransform(scrollYProgress, [0, 0.7], [0.85, 1]);
  const textYMobile = useTransform(scrollYProgress, [0, 0.7], ["-20vh", "25vh"]);

  // Desktop text scale (unchanged)
  const textScaleDesktop = useTransform(scrollYProgress, [0, 0.7], [0.7, 1]);

  return (
    <div ref={containerRef} className="relative h-[calc(100vh+500px)]">
    <section className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">

      {/* Mobile bowl: solid at bottom on load, uses object-center so it aligns with logo at end */}
      <motion.div
        style={{ y: bowlYMobile, opacity: bowlOpacityMobile, scale: bowlScaleMobile }}
        className="lg:hidden absolute inset-y-0 left-0 w-full"
      >
        <Image
          src="/hero-vessel.png"
          alt="Kashmiri copper vessel"
          fill
          priority
          className="object-contain object-center"
          sizes="100vw"
        />
      </motion.div>

      {/* Desktop bowl: diagonal rise (unchanged) */}
      <motion.div style={{ y: bowlY, x: bowlX, scale: bowlScale }} className="hidden lg:block absolute inset-y-0 left-0 w-[48%] opacity-40">
        <Image
          src="/hero-vessel.png"
          alt="Kashmiri copper vessel"
          fill
          priority
          className="object-contain object-left-bottom"
          sizes="48vw"
        />
      </motion.div>

      {/* Left-to-right darkening gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black" />

      {/* Mobile logo: starts bottom-center (small), grows + rises to overlay bowl */}
      <motion.div
        style={{ scale: logoScaleMobile, y: logoYMobile }}
        className="lg:hidden absolute z-20 inset-0 flex items-center justify-center pointer-events-none"
      >
        <Image src="/LOGO.png" alt="Traam and Beyond" width={480} height={480} className="h-48 w-auto" />
      </motion.div>

      {/* Mobile text: starts above center, moves down */}
      <motion.div
        style={{ scale: textScaleMobile, y: textYMobile }}
        className="lg:hidden relative z-10 text-center px-4 max-w-3xl mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-6xl font-semibold text-cream leading-tight mb-4"
        >
          {content.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-saffron text-lg sm:text-xl leading-relaxed mb-6 max-w-xl mx-auto"
        >
          {content.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-cream/80 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto whitespace-pre-line"
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
      </motion.div>

      {/* Desktop text: logo + all content, scale only (unchanged) */}
      <motion.div
        style={{ scale: textScaleDesktop }}
        className="hidden lg:block relative z-10 text-center px-4 max-w-3xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="-mb-[4.25rem] flex justify-center"
        >
          <Image src="/LOGO.png" alt="Traam and Beyond" width={480} height={240} className="h-48 sm:h-60 w-auto" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-6xl lg:text-8xl font-semibold text-cream leading-tight mb-4"
        >
          {content.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-saffron text-lg sm:text-xl leading-relaxed mb-6 max-w-xl mx-auto"
        >
          {content.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-cream/80 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto whitespace-pre-line"
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
      </motion.div>

    </section>
    </div>
  );
}
