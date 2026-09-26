"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, animate, useMotionValue, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BAZAR_CATEGORIES, CRAFT_ITEMS, type BazarCategory, type CraftItem } from "./craftData";

// Ported from Bazar Jajeer's own components/customer/home/FeaturedCrafts.tsx
// — an infinitely-looping, ambient-auto-drifting horizontal carousel (the
// list is rendered twice back-to-back; whenever the drag/autoplay position
// crosses one copy's width, it's nudged back by exactly that width — an
// invisible jump since both copies are pixel-identical). Colors are hardcoded
// to Bazar Jajeer's real hex values (this site's Tailwind theme doesn't
// define tokens like `olive`/`mustard`) rather than remapped onto Traam and
// Beyond's own palette, so this reproduces the real site rather than a
// reinterpretation of it. See docs/summary-fourth-build.md.

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const HEIGHT_CLASS: Record<CraftItem["size"], string> = {
  xl: "h-[clamp(260px,40vw,500px)]",
  lg: "h-[clamp(220px,34vw,440px)]",
  md: "h-[clamp(170px,26vw,340px)]",
  sm: "h-[clamp(130px,20vw,260px)]",
};

const ALIGN_CLASS: Record<CraftItem["align"], string> = {
  top: "self-start",
  center: "self-center",
  bottom: "self-end",
};

function CraftTile({
  category,
  itemRef,
}: {
  category: BazarCategory;
  itemRef?: (el: HTMLDivElement | null) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const item = CRAFT_ITEMS[category.slug];
  if (!item) return null;

  const textBlock = (
    <div className="w-[clamp(150px,16vw,220px)] shrink-0">
      <h3 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.15] text-[#D1C7B5]">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white">{item.line}</p>
    </div>
  );

  const imageBlock = (
    <div
      className={cn("relative shrink-0 overflow-hidden", HEIGHT_CLASS[item.size])}
      style={{ transform: `rotate(${item.rotate}deg)`, aspectRatio: item.aspect }}
    >
      <Image
        src={item.image}
        alt={item.alt}
        fill
        sizes="(max-width: 640px) 45vw, 400px"
        className="object-contain scale-[0.9]"
      />
    </div>
  );

  return (
    <motion.div
      ref={itemRef}
      variants={shouldReduceMotion ? undefined : fadeUp}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, margin: "0px -10% 0px 0px" }}
      className={cn("flex shrink-0", ALIGN_CLASS[item.align])}
    >
      <div
        className={cn(
          "flex items-center gap-x-6 md:gap-x-8",
          item.textPos === "right" ? "flex-row" : "flex-row-reverse"
        )}
      >
        {imageBlock}
        {textBlock}
      </div>
    </motion.div>
  );
}

// Ambient auto-drift speed (px/ms) and how long after any manual interaction
// (drag or an arrow click) it waits before drifting again.
const AUTOPLAY_SPEED = 0.035;
const RESUME_DELAY_MS = 500;
const STEP_DURATION = 0.4;

export function BazarJajeerFeaturedCrafts() {
  const categories = BAZAR_CATEGORIES;
  const shouldReduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const setItemRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      itemRefs.current[index] = el;
    },
    []
  );

  const x = useMotionValue(0);
  const setWidthRef = useRef(0);
  const offsetsRef = useRef<number[]>([0]);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setWidthRef.current = track.scrollWidth / 2;
    const points = itemRefs.current
      .slice(0, categories.length)
      .filter((el): el is HTMLElement => !!el)
      .map((el) => el.offsetLeft);
    offsetsRef.current = points.length ? points : [0];
  }, [categories.length]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    return x.on("change", (v) => {
      const w = setWidthRef.current;
      if (w <= 0) return;
      let next = v;
      while (next <= -w) next += w;
      while (next > 0) next -= w;
      if (next !== v) x.set(next);
    });
  }, [x]);

  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) return;
    let raf = 0;
    let last: number | null = null;
    const tick = (ts: number) => {
      if (last === null) last = ts;
      const dt = ts - last;
      last = ts;
      if (!pausedRef.current) x.set(x.get() - AUTOPLAY_SPEED * dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shouldReduceMotion, x]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  const pause = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  }, []);

  const scheduleResume = useCallback(() => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY_MS);
  }, []);

  const scrollByStep = useCallback(
    (direction: 1 | -1) => {
      const offsets = offsetsRef.current;
      const w = setWidthRef.current;
      if (!offsets.length || w <= 0) return;
      pause();

      const current = -x.get();
      let targetOffset: number;
      if (direction === 1) {
        const next = offsets.find((o) => o > current + 0.5);
        targetOffset = next !== undefined ? next : offsets[0] + w;
      } else {
        const prevList = offsets.filter((o) => o < current - 0.5);
        targetOffset = prevList.length ? prevList[prevList.length - 1] : offsets[offsets.length - 1] - w;
      }

      let target = -targetOffset;
      if (target <= -w) {
        x.set(x.get() + w);
        target += w;
      } else if (target > 0) {
        x.set(x.get() - w);
        target -= w;
      }

      animate(x, target, shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0.15, duration: STEP_DURATION });
      scheduleResume();
    },
    [x, pause, scheduleResume, shouldReduceMotion]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      pause();
      x.set(x.get() - e.deltaX);
      scheduleResume();
    },
    [x, pause, scheduleResume]
  );

  return (
    <section id="featured" className="relative overflow-hidden bg-[#6E6B41] py-10 md:py-14">
      <div className="px-6 md:px-12">
        <span className="text-[11px] tracking-[0.2em] text-white">THE LIVING HERITAGE</span>
        <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] text-[#D1C7B5]">
          Crafted by Hand, Passed Through Time
        </h2>
      </div>

      <div className="group/track relative mt-10 md:mt-14">
        <div
          ref={viewportRef}
          role="region"
          aria-label="Featured Kashmiri crafts"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") scrollByStep(1);
            if (e.key === "ArrowLeft") scrollByStep(-1);
          }}
          onWheel={handleWheel}
          className="h-[clamp(260px,38dvh,360px)] overflow-hidden md:h-[clamp(380px,56dvh,560px)]"
        >
          <motion.div
            ref={trackRef}
            drag="x"
            dragMomentum={false}
            onDragStart={pause}
            onDragEnd={scheduleResume}
            style={{ x }}
            className="flex h-full items-stretch gap-x-[clamp(16px,2.5vw,40px)] pl-6 pr-[clamp(16px,2.5vw,40px)] md:pl-12"
          >
            {[...categories, ...categories].map((category, i) => (
              <CraftTile
                key={`${category.id}-${i < categories.length ? "a" : "b"}`}
                category={category}
                itemRef={i < categories.length ? setItemRef(i) : undefined}
              />
            ))}
          </motion.div>
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#6E6B41] to-transparent md:w-20" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#6E6B41] to-transparent md:w-20" />

        <button
          type="button"
          onClick={() => scrollByStep(-1)}
          aria-label="Scroll left"
          className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#1A1008]/40 text-[#D1C7B5] opacity-0 backdrop-blur-sm transition-[opacity,background-color] duration-300 hover:bg-[#1A1008]/60 group-hover/track:opacity-100 md:flex"
        >
          <ChevronLeft size={26} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={() => scrollByStep(1)}
          aria-label="Scroll right"
          className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#1A1008]/40 text-[#D1C7B5] opacity-0 backdrop-blur-sm transition-[opacity,background-color] duration-300 hover:bg-[#1A1008]/60 group-hover/track:opacity-100 md:flex"
        >
          <ChevronRight size={26} strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}
