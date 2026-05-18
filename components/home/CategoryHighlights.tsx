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

export default function CategoryHighlights({ categories, content }: CategoryHighlightsProps) {
  if (categories.length === 0) return null;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const [thumbLeft, setThumbLeft] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(30);
  const [dragging, setDragging] = useState(false);

  // Update thumb position and width from container scroll state
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

  // Click on the track (not thumb) to jump to that position
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
          <p className="text-stone mb-12 text-justify lg:text-center">{content.subtitle}</p>
        </ScrollReveal>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-8 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" } as React.CSSProperties}
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            className="shrink-0 w-[70vw] lg:w-[30vw] group"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, root: scrollContainerRef }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={`/category/${cat.slug}`} className="block">
              <div className="relative w-full aspect-square overflow-hidden">
                {cat.coverImage ? (
                  <Image
                    src={cat.coverImage}
                    alt={cat.name}
                    fill
                    sizes="(min-width: 1024px) 30vw, 70vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-walnut-light flex items-center justify-center">
                    <span className="text-stone/30 text-4xl">✦</span>
                  </div>
                )}
              </div>

              <div className="pt-4 pb-2 text-center">
                <h3 className="font-display text-3xl lg:text-4xl text-cream group-hover:text-terracotta transition-colors duration-300">
                  {cat.name}
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Custom scrollbar with arrows */}
      <div className="flex items-center gap-4 mx-4 sm:mx-6 lg:mx-8 mt-1">
        <button
          onClick={() => scrollByCard(-1)}
          className="shrink-0 text-stone/50 hover:text-cream transition-colors duration-200"
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
            className={`absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-terracotta transition-[width] duration-200 ease-out ${
              dragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{ left: `${thumbLeft}%`, width: `${thumbWidth}%` }}
            onMouseDown={handleThumbMouseDown}
            onTouchStart={handleThumbTouchStart}
          />
        </div>

        <button
          onClick={() => scrollByCard(1)}
          className="shrink-0 text-stone/50 hover:text-cream transition-colors duration-200"
          aria-label="Scroll right"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
