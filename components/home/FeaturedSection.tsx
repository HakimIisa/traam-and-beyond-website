"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function FeaturedSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    const update = () => {
      const h = container.clientHeight;
      const w = container.clientWidth;
      // Mobile only: align text to the top edge of the centered square image
      if (w < 640) {
        const offset = Math.max(0, (h - w) / 2 + 8);
        overlay.style.paddingTop = `${offset}px`;
      } else {
        overlay.style.paddingTop = "";
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full bg-[#FAF6F0]">
      <Image
        src="/CoverNilmath.jpeg"
        alt="Nilmath — Kashmir"
        fill
        sizes="100vh"
        className="object-contain object-center"
        priority
      />

      <div
        ref={overlayRef}
        className="absolute inset-0 flex flex-col items-center justify-start sm:pt-14 lg:pt-20 px-6 lg:px-16 text-center [text-shadow:0_1px_6px_rgba(255,255,255,0.9),0_0px_12px_rgba(255,255,255,0.7)]"
      >
        <p className="text-[#0a0a0a] text-sm sm:text-lg lg:text-xl font-bold leading-snug [text-shadow:0_0px_4px_rgba(255,255,255,1),0_0px_10px_rgba(255,255,255,1),0_0px_20px_rgba(255,255,255,1),0_0px_30px_rgba(255,255,255,0.9)]">
          नित्यशौण्डजनोपेतं सतां हृदयवल्लभम् ॥ ४९ ॥
        </p>
        <p className="text-[#0a0a0a] text-xs sm:text-base lg:text-lg mt-2 leading-snug [text-shadow:0_0px_4px_rgba(255,255,255,1),0_0px_10px_rgba(255,255,255,1),0_0px_20px_rgba(255,255,255,1),0_0px_30px_rgba(255,255,255,0.9)]">
          nityaśauṇḍajanopetaṃ satāṃ hṛdayavallabham ॥ 49 ॥
        </p>
        <p className="text-[#D4A017] text-xs sm:text-base lg:text-lg mt-5 leading-relaxed italic max-w-xl [text-shadow:0_0px_4px_rgba(0,0,0,1),0_0px_10px_rgba(0,0,0,1),0_0px_20px_rgba(0,0,0,1),0_0px_30px_rgba(0,0,0,0.9)]">
          … [Kashmir] is always crowded with people fond of drinks and is dear to the hearts of good men.
        </p>
        <p className="text-[#D4A017] text-[11px] sm:text-sm lg:text-base mt-2 [text-shadow:0_0px_4px_rgba(0,0,0,1),0_0px_10px_rgba(0,0,0,1),0_0px_20px_rgba(0,0,0,1),0_0px_30px_rgba(0,0,0,0.9)]">
          Nilamata Purana, around AD 500-700
        </p>
      </div>
    </div>
  );
}
