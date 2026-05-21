"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import type { Category } from "@/types";
import type { HomeContent } from "@/types/home-content";
import { ScrollReveal } from "@/components/ScrollReveal";

interface CategoryHighlightsProps {
  categories: Category[];
  content: HomeContent["collections"];
}

const URDU_NAMES: Record<string, string> = {
  "copperware":        "کاپر ویئر",
  "papier-mch":        "پیپر ماشی",
  "silverware":        "سلور ویئر",
  "enamelware":        "اینامل ویئر",
  "terracotta":        "ٹیراکوٹا",
  "green-serpentine":  "گرین سرپینٹائن",
  "coins":             "سکے",
  "shawls":            "شالیں",
  "jewellery":         "زیورات",
  "carpets":           "قالین",
  "willow-wicker":     "بید کی ٹوکری سازی",
  "wood-work":         "لکڑی کا کام",
  "brass-ware":        "پیتل کے برتن",
};

export default function CategoryHighlights({ categories, content }: CategoryHighlightsProps) {
  if (categories.length === 0) return null;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const [thumbLeft, setThumbLeft] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(30);
  const [dragging, setDragging] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrollActiveIndex, setScrollActiveIndex] = useState<number | null>(null);
  const [isLg, setIsLg] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );

  // Breakpoint tracking
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsLg(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsLg(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Mobile: detect which card is closest to the scroll container centre
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const detectActive = () => {
      const centre = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const cardCentre = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(cardCentre - centre);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setScrollActiveIndex(closest);
    };

    detectActive();
    el.addEventListener("scroll", detectActive, { passive: true });
    return () => el.removeEventListener("scroll", detectActive);
  }, [categories.length]);

  // Update scrollbar thumb
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const updateThumb = () => {
      const ratio = el.clientWidth / el.scrollWidth;
      const w = ratio * 100;
      const maxLeft = (1 - ratio) * 100;
      const scrollRatio = el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth);
      setThumbWidth(w);
      setThumbLeft(scrollRatio * maxLeft);
    };

    updateThumb();
    el.addEventListener("scroll", updateThumb, { passive: true });
    window.addEventListener("resize", updateThumb);
    return () => {
      el.removeEventListener("scroll", updateThumb);
      window.removeEventListener("resize", updateThumb);
    };
  }, []);

  // Global mouse/touch drag handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !scrollContainerRef.current || !trackRef.current) return;
      const el = scrollContainerRef.current;
      const trackWidth = trackRef.current.clientWidth;
      const scrollableWidth = el.scrollWidth - el.clientWidth;
      const ratio = el.clientWidth / el.scrollWidth;
      const maxThumbPx = trackWidth * (1 - ratio);
      const deltaScroll = ((e.clientX - dragStartX.current) / maxThumbPx) * scrollableWidth;
      el.scrollLeft = Math.max(0, Math.min(scrollableWidth, dragStartScrollLeft.current + deltaScroll));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || !scrollContainerRef.current || !trackRef.current) return;
      const el = scrollContainerRef.current;
      const trackWidth = trackRef.current.clientWidth;
      const scrollableWidth = el.scrollWidth - el.clientWidth;
      const ratio = el.clientWidth / el.scrollWidth;
      const maxThumbPx = trackWidth * (1 - ratio);
      const deltaScroll = ((e.touches[0].clientX - dragStartX.current) / maxThumbPx) * scrollableWidth;
      el.scrollLeft = Math.max(0, Math.min(scrollableWidth, dragStartScrollLeft.current + deltaScroll));
    };

    const stopDragging = () => {
      isDragging.current = false;
      setDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", stopDragging);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDragging);
    };
  }, []);

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    setDragging(true);
    dragStartX.current = e.clientX;
    dragStartScrollLeft.current = scrollContainerRef.current?.scrollLeft ?? 0;
  };

  const handleThumbTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    setDragging(true);
    dragStartX.current = e.touches[0].clientX;
    dragStartScrollLeft.current = scrollContainerRef.current?.scrollLeft ?? 0;
  };

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * (el.clientWidth / 3.2), behavior: "smooth" });
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging.current || !scrollContainerRef.current || !trackRef.current) return;
    const el = scrollContainerRef.current;
    const trackRect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - trackRect.left;
    const ratio = el.clientWidth / el.scrollWidth;
    const thumbPx = trackRect.width * ratio;
    const maxLeft = trackRect.width - thumbPx;
    const scrollRatio = Math.max(0, Math.min(1, (clickX - thumbPx / 2) / maxLeft));
    el.scrollLeft = scrollRatio * (el.scrollWidth - el.clientWidth);
  };

  return (
    <section id="collections" className="relative z-[2] py-16 bg-[#1a130a]">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex justify-center mb-8">
            <Image
              src="/IsbandHomePage.png"
              alt="Kashmiri isband vessel"
              width={1254}
              height={1254}
              className="w-[420px] h-auto sm:w-[490px] lg:w-[560px]"
            />
          </div>
          <h2 className="font-display text-6xl text-cream font-semibold mb-2 text-center">{content.title}</h2>
          <p className="text-stone mb-6 text-justify lg:text-center">{content.subtitle}</p>
          <div className="border-t border-white/5 mb-12" />
        </ScrollReveal>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12 [&::-webkit-scrollbar]:hidden bg-[#0a0a0a]"
        style={{ scrollbarWidth: "none" } as React.CSSProperties}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {categories.map((cat, i) => {
          const isActive = !isLg && scrollActiveIndex === i;
          const isDimmed = isLg
            ? hoveredIndex !== null && hoveredIndex !== i
            : scrollActiveIndex !== null && scrollActiveIndex !== i;

          return (
            <motion.div
              key={cat.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="shrink-0 w-[70vw] lg:w-[30vw] group"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, root: scrollContainerRef }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setHoveredIndex(i)}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.05 : 0.9,
                  opacity: isDimmed ? 0.5 : 1,
                }}
                whileHover={isLg ? { scale: 1.05 } : {}}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/category/${cat.slug}`} className="block">
                  <div className="relative w-full aspect-square overflow-hidden">
                    {cat.coverImage ? (
                      <Image
                        src={cat.coverImage}
                        alt={cat.name}
                        fill
                        sizes="(min-width: 1024px) 30vw, 70vw"
                        className={`object-cover transition-transform duration-700 lg:group-hover:scale-110 ${
                          isActive ? "scale-110" : ""
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full bg-walnut-light flex items-center justify-center">
                        <span className="text-stone/30 text-4xl">✦</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 pb-2 text-center">
                    <h3 className="font-display text-3xl lg:text-4xl text-stone/70 group-hover:text-terracotta transition-colors duration-300 underline decoration-transparent decoration-1 underline-offset-4 group-hover:decoration-terracotta transition-[text-decoration-color] duration-300">
                      {cat.name}
                    </h3>
                    {URDU_NAMES[cat.slug] && (
                      <p
                        className="text-stone/70 text-[24px] lg:text-[26px] mt-1 group-hover:text-terracotta transition-colors duration-300"
                        dir="rtl"
                        lang="ur"
                      >
                        {URDU_NAMES[cat.slug]}
                      </p>
                    )}
                    <p className="text-terracotta text-sm mt-2 tracking-wide lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                      Explore →
                    </p>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Custom scrollbar with arrows */}
      <div className="flex items-center gap-4 mx-4 sm:mx-6 lg:mx-8 mt-1">
        <button
          onClick={() => scrollByCard(-1)}
          className="shrink-0 text-cream/50 hover:text-cream transition-colors duration-200"
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} />
        </button>

        <div
          ref={trackRef}
          className="relative flex-1 h-3 flex items-center cursor-pointer"
          onClick={handleTrackClick}
        >
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-stone/20" />
          <div
            className={`absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-cream transition-[width] duration-200 ease-out ${
              dragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{ left: `${thumbLeft}%`, width: `${thumbWidth}%` }}
            onMouseDown={handleThumbMouseDown}
            onTouchStart={handleThumbTouchStart}
          />
        </div>

        <button
          onClick={() => scrollByCard(1)}
          className="shrink-0 text-cream/50 hover:text-cream transition-colors duration-200"
          aria-label="Scroll right"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
