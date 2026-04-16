"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import type { AboutContent } from "@/types/about-content";

interface OurStorySectionProps {
  content: AboutContent["introduction"];
}

export default function OurStorySection({ content }: OurStorySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Text scrolls up to reveal all paragraphs — calibrated to section/content height
  const textY = useTransform(scrollYProgress, [0, 1], ["0vh", "-42vh"]);

  return (
    <div ref={containerRef} className="relative h-[100vw] lg:h-[calc(100vh+400px)]">

      {/* Mobile: normal 1:1 box. Desktop: 70vh sticky box */}
      <div className="h-[100vw] lg:sticky lg:top-0 lg:h-[70vh] overflow-hidden flex flex-col">

        {/* Title — outside animation, pinned at top */}
        <div className="shrink-0 max-w-6xl mx-auto w-full px-8 lg:px-16 pt-8 lg:pt-10 pb-4 lg:pb-4">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl text-cream">
            Our Story
          </h2>
        </div>

        {/* Content row — centered together, text 2/3 + image 1/3 */}
        <div className="flex-1 overflow-hidden max-w-6xl mx-auto w-full flex">

          {/* Text panel */}
          <div className="w-2/3 h-full">

            {/* Mobile: plain scroll, no motion transform, scroll contained within panel */}
            <div className="lg:hidden h-full overflow-y-auto overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-6 pb-6 pt-2">
              <div className="text-stone text-sm leading-relaxed text-justify space-y-4">
                <p>{content.paragraph1}</p>
                <p>{content.paragraph2}</p>
                <p>{content.paragraph3}</p>
                <p>{content.paragraph4}</p>
                <p>{content.paragraph5}</p>
              </div>
            </div>

            {/* Desktop: scroll-linked motion, clipped by overflow-hidden */}
            <div className="hidden lg:block h-full overflow-hidden">
              <motion.div style={{ y: textY }} className="px-16 pb-8 pt-2">
                <div className="text-stone text-lg leading-relaxed text-justify space-y-6">
                  <p>{content.paragraph1}</p>
                  <p>{content.paragraph2}</p>
                  <p>{content.paragraph3}</p>
                  <p>{content.paragraph4}</p>
                  <p>{content.paragraph5}</p>
                </div>
              </motion.div>
            </div>

          </div>

          {/* Image panel — stays fixed */}
          <div className="w-1/3 h-full relative">
            <Image
              src="/OurStoryImg.jpeg"
              alt="Our Story"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 33vw, calc(72rem / 3)"
            />
            {/* Fade at left edge where text meets image */}
            <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-walnut to-transparent pointer-events-none" />
          </div>

        </div>

      </div>
    </div>
  );
}
