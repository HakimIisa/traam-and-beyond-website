"use client";

import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "lucide-react";
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

interface StoriesMobileDrawerProps {
  stories: StoryItem[];
  activeIndex: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  onNavigate: (index: number) => void;
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE } },
};

export default function StoriesMobileDrawer({
  stories,
  activeIndex,
  open,
  setOpen,
  onNavigate,
}: StoriesMobileDrawerProps) {
  return (
    <>
      {/* Same button toggles open/closed — doubles as the close control, so no
          separate header/box chrome is needed around the list itself. */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close contents" : "Open contents"}
        className="lg:hidden fixed top-20 right-4 z-[95] flex items-center justify-center w-11 h-11 rounded-full bg-[#1a130a]/80 border border-white/10 text-cream backdrop-blur-sm shadow-lg"
      >
        {open ? <X size={18} /> : <List size={18} />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden fixed inset-0 z-[90] bg-black/50 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />
            {/*
              No card/box chrome (background, border, shadow, header bar) — this is
              meant to read as the same unboxed dot+heading list used on desktop
              (StoriesTOC.tsx), just hidden until the button is pressed and anchored
              to grow outward from the top-right corner where the button lives.
            */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{ transformOrigin: "top right" }}
              className="lg:hidden fixed top-32 right-4 max-w-[75vw] max-h-[70vh] z-[92] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            >
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-5 py-2"
              >
                {stories.map((story, i) => (
                  <motion.button
                    key={story.id}
                    type="button"
                    variants={rowVariants}
                    onClick={() => {
                      onNavigate(i);
                      setOpen(false);
                    }}
                    className="flex items-start gap-3 w-full text-left"
                  >
                    <div className="pt-1">
                      <OrganicDot active={activeIndex === i} />
                    </div>
                    <span
                      className={`text-base leading-snug ${
                        activeIndex === i ? "text-terracotta" : "text-cream"
                      }`}
                    >
                      {story.title}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
