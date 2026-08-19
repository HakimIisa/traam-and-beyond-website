"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { scrollToElement } from "./scrollToElement";
import StoryBlock from "./StoryBlock";
import StoriesTOC from "./StoriesTOC";
import StoriesImagePanel from "./StoriesImagePanel";
import StoriesMobileDrawer from "./StoriesMobileDrawer";
import type { StoryItem } from "@/types";

interface StoriesPageClientProps {
  stories: StoryItem[];
}

export default function StoriesPageClient({ stories }: StoriesPageClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const scrollDirRef = useRef<"up" | "down">("down");
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      scrollDirRef.current = window.scrollY > lastY ? "down" : "up";
      lastY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const registerRef = useCallback((index: number, el: HTMLDivElement | null) => {
    blockRefs.current[index] = el;
  }, []);

  const navigate = useCallback((index: number) => {
    const el = blockRefs.current[index];
    if (el) scrollToElement(el);
  }, []);

  if (stories.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="font-display text-3xl sm:text-6xl text-cream mb-6 text-center">Stories</h1>
        <p className="text-stone text-lg leading-relaxed text-center">
          Stories are being written. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-[#1a130a] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 lg:pb-16">
        <h1 className="font-display text-3xl sm:text-6xl text-cream text-center">Stories</h1>
      </div>

      <StoriesMobileDrawer
        stories={stories}
        activeIndex={activeIndex}
        open={drawerOpen}
        setOpen={setDrawerOpen}
        onNavigate={navigate}
      />

      {/*
        Single shared list of StoryBlocks — no breakpoint duplication, so there is
        exactly one useInView/ref per story regardless of viewport. Mobile: this
        container is plain block flow (TOC/ImagePanel are internally `hidden lg:block`
        and simply don't render). Desktop (lg:): a true 3-column grid — TOC | main | image
        panel — each column gets its own explicit track, so `main`'s internal
        `max-w-2xl mx-auto` centers correctly regardless of how wide the side
        columns are (a flex-based main+imagePanel wrapper made main's centering
        drift whenever the image panel's width changed).
      */}
      <div className="lg:relative lg:grid lg:grid-cols-[380px_1fr_440px] xl:grid-cols-[440px_1fr_500px] lg:gap-x-8 xl:gap-x-10 max-w-[2400px] mx-auto lg:px-6 pb-16 lg:pb-24">
        <StoriesTOC
          stories={stories}
          activeIndex={activeIndex}
          onNavigate={navigate}
          hoveredIndex={hoveredIndex}
          onHoverChange={setHoveredIndex}
        />

        <main className="lg:min-w-0">
          {stories.map((story, i) => (
            <StoryBlock
              key={story.id}
              story={story}
              index={i}
              setActiveIndex={setActiveIndex}
              setImageIndex={setImageIndex}
              scrollDirRef={scrollDirRef}
              registerRef={registerRef}
            />
          ))}
        </main>

        <StoriesImagePanel stories={stories} imageIndex={imageIndex} />

        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ gridColumn: "2 / 4" }}
              className="hidden lg:block absolute inset-0 z-30 pointer-events-none backdrop-blur-md bg-black/30"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
