"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { StoryItem } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

function OrganicDot({ active }: { active: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 12 12"
      className={`shrink-0 transition-all duration-700 ease-out drop-shadow-md ${
        active ? "text-terracotta scale-125 fill-current" : "text-stone/30 fill-current scale-75"
      }`}
    >
      <path d="M6.2 0.8 C8.5 0.5 11 2 11.2 5 C11.5 8 9.5 11 6.5 11.2 C3.5 11.5 0.5 9.5 0.8 6 C1 3 3.5 1.5 6.2 0.8 Z" />
    </svg>
  );
}

interface StoriesTOCProps {
  stories: StoryItem[];
  activeIndex: number;
  onNavigate: (index: number) => void;
  hoveredIndex: number | null;
  onHoverChange: (index: number | null) => void;
}

export default function StoriesTOC({
  stories,
  activeIndex,
  onNavigate,
  hoveredIndex,
  onHoverChange,
}: StoriesTOCProps) {
  return (
    <div className="hidden lg:block sticky top-24 h-[calc(100vh-7rem)] shrink-0">
      <div
        className="h-full overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
        onMouseLeave={() => onHoverChange(null)}
      >
        <div className="flex flex-col gap-6 py-2">
          {stories.map((story, i) => {
            const isHovered = hoveredIndex === i;
            const isDimmed = hoveredIndex !== null && !isHovered;
            return (
              <motion.button
                key={story.id}
                type="button"
                layout
                onMouseEnter={() => onHoverChange(i)}
                onClick={() => onNavigate(i)}
                animate={{ opacity: isDimmed ? 0.4 : 1 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex items-start gap-3 w-full text-left group"
              >
                <div className="pt-1.5">
                  <OrganicDot active={activeIndex === i} />
                </div>

                {/* Image slot — dot stays put, this opens up (width AND height, both
                    start at 0 so rows stay compact until hovered) between the dot and
                    the shifting-right text, holding the hover-preview thumbnail. */}
                <motion.div
                  layout
                  initial={false}
                  animate={{ width: isHovered ? 220 : 0, height: isHovered ? 220 : 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="shrink-0 relative overflow-hidden rounded-sm"
                >
                  <AnimatePresence>
                    {isHovered && story.image && (
                      <motion.div
                        key={story.id}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="absolute inset-0 shadow-lg rounded-sm overflow-hidden"
                      >
                        <Image
                          src={story.image}
                          alt={story.title}
                          fill
                          sizes="220px"
                          className="object-cover"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div layout className="flex-1 min-w-0">
                  <motion.p
                    layout
                    initial={false}
                    animate={{ fontSize: isHovered ? "1rem" : "1.25rem" }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className={`leading-snug transition-colors duration-300 ${
                      activeIndex === i ? "text-terracotta" : "text-cream group-hover:text-terracotta"
                    }`}
                  >
                    {story.title}
                  </motion.p>
                  <AnimatePresence>
                    {isHovered && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="text-stone text-xs lg:text-sm mt-1 leading-snug"
                      >
                        {story.subtitle}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
