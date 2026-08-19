"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useInView, motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { scrollToElement } from "./scrollToElement";
import type { StoryItem } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;
const PREVIEW_WORD_COUNT = 14;

interface StoryBlockProps {
  story: StoryItem;
  index: number;
  setActiveIndex: (i: number) => void;
  setImageIndex: (i: number) => void;
  scrollDirRef: React.RefObject<"up" | "down">;
  registerRef: (index: number, el: HTMLDivElement | null) => void;
}

export default function StoryBlock({
  story,
  index,
  setActiveIndex,
  setImageIndex,
  scrollDirRef,
  registerRef,
}: StoryBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  // Timeline / TOC active state: fires when panel is at viewport center
  const isCentered = useInView(ref, { margin: "-45% 0px -45% 0px" });
  // Image swap: fires when panel is in upper portion — symmetric via scrollDirRef
  const isNearTop = useInView(ref, { margin: "0px 0px -90% 0px" });

  useEffect(() => {
    if (isCentered) setActiveIndex(index);
  }, [isCentered, index, setActiveIndex]);

  useEffect(() => {
    if (isNearTop) {
      setImageIndex(index);
    } else if (index > 0 && scrollDirRef.current === "up") {
      setImageIndex(index - 1);
    }
  }, [isNearTop, index, setImageIndex, scrollDirRef]);

  useEffect(() => {
    registerRef(index, ref.current);
    return () => registerRef(index, null);
  }, [index, registerRef]);

  const paragraphs = story.body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const previewText = (paragraphs[0] ?? "").split(/\s+/).slice(0, PREVIEW_WORD_COUNT).join(" ");

  // Collapsing shrinks the block's height without moving its top edge, so the
  // page's current scroll *position* (in pixels) ends up pointing at whatever
  // used to be much further down — re-anchor to this story's top, same as a
  // TOC click. Deliberately NOT done synchronously in the click handler: the
  // collapse's exit animation and a concurrent scroll animation would then run
  // at the same time, racing against each other — the browser's smooth-scroll
  // target gets computed against the *pre-collapse* (taller) document, but the
  // document is actively shrinking underneath it as both animations play, so
  // the scroll can overshoot or land somewhere past where it should. Waiting
  // for the collapse's exit animation to actually finish (AnimatePresence's
  // onExitComplete) means the scroll only ever runs once the layout is
  // already stable at its final (short) height.
  const pendingCollapseScrollRef = useRef(false);

  function handleCollapse() {
    pendingCollapseScrollRef.current = true;
    setExpanded(false);
  }

  function handleCollapseExitComplete() {
    if (pendingCollapseScrollRef.current) {
      pendingCollapseScrollRef.current = false;
      if (ref.current) scrollToElement(ref.current);
    }
  }

  return (
    <div
      ref={ref}
      className={`w-full px-6 lg:px-0 ${index === 0 ? "pt-8 lg:pt-4" : "pt-16 lg:pt-20"} pb-16 lg:pb-20 ${
        index > 0 ? "border-t border-white/10" : ""
      }`}
    >
      {/*
        lg:+: the outer flex+justify-center centers this block within `main`'s own
        grid track, then the extra ml-[…] nudges it further right by exactly half the
        width difference between the TOC (380/440px) and image panel (440/500px)
        columns — compensating for those two side columns being unequal widths so the
        text ends up centered on the *page*, not just on the (off-center) middle track.
      */}
      <div className="lg:flex lg:justify-center">
        <div className="max-w-2xl w-full mx-auto lg:mx-0 lg:ml-[30px] text-left space-y-6">
          <div>
            <h3 className="font-display text-3xl lg:text-4xl text-cream mb-2">{story.title}</h3>
            <p className="text-terracotta text-base lg:text-lg font-semibold">{story.subtitle}</p>
          </div>

          {story.image && (
            <div className="lg:hidden relative w-full aspect-square rounded-sm overflow-hidden">
              <Image
                src={story.image}
                alt={story.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          )}

          {/* Desktop: story body always shown in full — unchanged. */}
          <div className="hidden lg:block space-y-6">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="text-[#DAC4A1] text-lg leading-relaxed text-justify">
                {paragraph}
              </p>
            ))}
          </div>

          {/*
            Mobile: truncated preview + "Read full story" by default, expands to the
            full body in place. AnimatePresence itself stays permanently mounted here
            (only its direct children are conditional) — mounting/unmounting the
            AnimatePresence wrapper alongside its child is what silently breaks exit
            animations (hit this exact bug earlier with the TOC hover preview).
          */}
          <div className="lg:hidden relative">
            <AnimatePresence mode="wait" initial={false} onExitComplete={handleCollapseExitComplete}>
              {!expanded ? (
                <motion.p
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="text-[#DAC4A1] text-base leading-relaxed text-justify"
                >
                  {previewText}…{" "}
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    aria-expanded={false}
                    className="text-terracotta underline underline-offset-2"
                  >
                    Read full story →
                  </button>
                </motion.p>
              ) : (
                <motion.div
                  key="full"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="space-y-6 pr-8">
                    {paragraphs.map((paragraph, i) => (
                      <p key={i} className="text-[#DAC4A1] text-base leading-relaxed text-justify">
                        {paragraph}
                      </p>
                    ))}
                    <button
                      type="button"
                      onClick={handleCollapse}
                      aria-expanded={true}
                      className="text-terracotta underline underline-offset-2"
                    >
                      See less
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/*
              Kept outside AnimatePresence/the height-animating container on purpose:
              it's a sibling of the overflow-hidden motion.div above, not a descendant,
              so it's never clipped while that container's height is still animating in.
            */}
            {expanded && (
              <button
                type="button"
                onClick={handleCollapse}
                aria-label="Close full story"
                className="absolute top-0 right-0 p-3 -m-3 text-stone hover:text-terracotta transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
