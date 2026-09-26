"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Ported from Bazar Jajeer's own components/customer/home/Hero.tsx — see
// docs/summary-fourth-build.md for what was changed and why (colors hardcoded
// to Bazar Jajeer's real hex values since this site's Tailwind theme doesn't
// define those tokens; the negative top-margin trick was dropped since this
// site's Navbar is already transparent-over-hero at the top of the page,
// unlike Bazar Jajeer's own layout which needed it).

const SCALE_RANGE: number[] = [0, 0.5];
const SCALE_OUTPUT: number[] = [0.42, 1];
const SCRIM_RANGE: number[] = [0, 0.5];
const SCRIM_OUTPUT: number[] = [0.35, 0.85];
const CUE_RANGE: number[] = [0, 0.06];
const CUE_OUTPUT: number[] = [1, 0];
const TITLE_RANGE: number[] = [0.12, 0.3];
const TITLE_Y_OUTPUT: number[] = [24, 0];
const OPACITY_OUTPUT: number[] = [0, 1];
const SUBTITLE_RANGE: number[] = [0.3, 0.48];
const SUBTITLE_Y_OUTPUT: number[] = [16, 0];
const CTA_RANGE: number[] = [0.62, 0.8];
const CTA_Y_OUTPUT: number[] = [16, 0];

/**
 * Framer Motion 12 + React 19: plain CSS style keys (e.g. `opacity`) bound via
 * `style={{ opacity: motionValue }}` can fail to stay in sync with the DOM after
 * the source value settles at a clamped bound, while transform-shorthand keys
 * (x/y/scale) do not. Driving opacity imperatively through a ref sidesteps it.
 */
function useLiveOpacity<T extends HTMLElement>(value: MotionValue<number>, staticValue: number, reduceMotion: boolean) {
  const ref = useRef<T>(null);

  useMotionValueEvent(value, "change", (v) => {
    if (!reduceMotion && ref.current) ref.current.style.opacity = String(v);
  });

  useEffect(() => {
    if (ref.current) ref.current.style.opacity = String(reduceMotion ? staticValue : value.get());
  }, [reduceMotion, value, staticValue]);

  return ref;
}

export function BazarJajeerHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, SCALE_RANGE, SCALE_OUTPUT);
  const scrimOpacity = useTransform(scrollYProgress, SCRIM_RANGE, SCRIM_OUTPUT);
  const cueOpacity = useTransform(scrollYProgress, CUE_RANGE, CUE_OUTPUT);

  const titleY = useTransform(scrollYProgress, TITLE_RANGE, TITLE_Y_OUTPUT);
  const titleOpacity = useTransform(scrollYProgress, TITLE_RANGE, OPACITY_OUTPUT);

  const subtitleY = useTransform(scrollYProgress, SUBTITLE_RANGE, SUBTITLE_Y_OUTPUT);
  const subtitleOpacity = useTransform(scrollYProgress, SUBTITLE_RANGE, OPACITY_OUTPUT);

  const ctaY = useTransform(scrollYProgress, CTA_RANGE, CTA_Y_OUTPUT);
  const ctaOpacity = useTransform(scrollYProgress, CTA_RANGE, OPACITY_OUTPUT);

  const scrimRef = useLiveOpacity<HTMLDivElement>(scrimOpacity, 0.7, !!shouldReduceMotion);
  const cueRef = useLiveOpacity<HTMLDivElement>(cueOpacity, 0, !!shouldReduceMotion);
  const titleRef = useLiveOpacity<HTMLHeadingElement>(titleOpacity, 1, !!shouldReduceMotion);
  const subtitleRef = useLiveOpacity<HTMLParagraphElement>(subtitleOpacity, 1, !!shouldReduceMotion);
  const ctaRef = useLiveOpacity<HTMLDivElement>(ctaOpacity, 1, !!shouldReduceMotion);

  return (
    <section ref={containerRef} className="relative h-[180vh]">
      <div className="sticky top-0 h-dvh w-full overflow-hidden bg-[#1A1008]">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale: shouldReduceMotion ? 1 : scale, transformOrigin: "center center" }}
        >
          {/* Both videos are always in the DOM; a CSS breakpoint (not a JS
              media-query check) decides which one is visible, so the correct
              poster shows immediately with no hydration delay. */}
          <video
            className="hidden h-full w-full object-cover md:block"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/BazarJajeer/hero-poster.jpg"
          >
            <source src="/BazarJajeer/hero.webm" type="video/webm" />
            <source src="/BazarJajeer/hero.mp4" type="video/mp4" />
          </video>
          <video
            className="block h-full w-full object-cover md:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/BazarJajeer/hero-mobile-poster.jpg"
          >
            <source src="/BazarJajeer/hero-mobile.mp4" type="video/mp4" />
          </video>
        </motion.div>

        <div
          ref={scrimRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1A1008] via-[#1A1008]/35 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-[10%] px-6 text-right md:bottom-[14%] md:left-16 md:right-auto md:max-w-2xl md:px-0 md:text-left">
          <motion.h2
            ref={titleRef}
            style={{ y: shouldReduceMotion ? 0 : titleY }}
            className="font-display text-5xl leading-[1.05] tracking-[0.02em] text-[#D1C7B5] brightness-125 [text-shadow:0_2px_4px_rgb(0_0_0_/_0.9),0_8px_24px_rgb(0_0_0_/_0.8)] md:text-7xl lg:text-8xl"
          >
            Bazar Jajeer
          </motion.h2>

          <motion.p
            ref={subtitleRef}
            style={{ y: shouldReduceMotion ? 0 : subtitleY }}
            className="mt-4 text-base tracking-[0.06em] text-[#B07E1E] brightness-125 [text-shadow:0_1px_3px_rgb(0_0_0_/_0.9),0_4px_16px_rgb(0_0_0_/_0.75)] md:mt-6 md:text-xl"
          >
            Kashmiri Crafts. Artisan Stories.
          </motion.p>

          <motion.div
            ref={ctaRef}
            style={{ y: shouldReduceMotion ? 0 : ctaY }}
            className="mt-8 flex flex-col items-end gap-4 md:mt-10 md:flex-row md:flex-wrap md:items-center"
          >
            <Link
              href="#featured"
              className="inline-flex items-center gap-2 bg-[#9C5D3C] px-6 py-3 text-sm tracking-[0.08em] text-[#1A1008] shadow-lg transition-colors hover:bg-[#B5703A]"
            >
              View Crafts
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
            <a
              href="https://bazarjajeer.com/shops"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 border border-white/10 bg-[#1A1008]/40 px-6 py-3 text-sm tracking-[0.08em] text-[#D1C7B5] shadow-lg backdrop-blur-sm transition-colors",
                "hover:border-[#9C5D3C] hover:text-[#9C5D3C]"
              )}
            >
              View Shops
            </a>
          </motion.div>
        </div>

        <div
          ref={cueRef}
          aria-hidden
          className="absolute inset-x-0 bottom-[60px] flex justify-center text-[#B5A898] md:bottom-[76px]"
        >
          <ArrowDown size={16} strokeWidth={1.5} className={cn(!shouldReduceMotion && "animate-bounce")} />
        </div>
      </div>
    </section>
  );
}
