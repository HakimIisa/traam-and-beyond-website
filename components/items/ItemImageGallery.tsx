"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ItemImageGalleryProps {
  images: string[];
  title: string;
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%" }),
};

const transition = { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const };

export default function ItemImageGallery({
  images,
  title,
}: ItemImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-cream-dark rounded-xl flex items-center justify-center text-stone/40">
        No image
      </div>
    );
  }

  const total = images.length;

  const navigate = (dir: 1 | -1) => {
    setDirection(dir);
    setActiveIndex((i) => (i + dir + total) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      navigate(delta > 0 ? 1 : -1);
    }
    setTouchStartX(null);
  };

  const goTo = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const thumbnails = (thumbSize: string) => (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {images.map((img, i) => (
        <button
          key={i}
          onClick={(e) => goTo(e, i)}
          className={cn(
            `relative flex-shrink-0 ${thumbSize} rounded-xl overflow-hidden border-2 transition-colors`,
            i === activeIndex ? "border-terracotta" : "border-transparent"
          )}
        >
          <Image
            src={img}
            alt={`${title} thumbnail ${i + 1}`}
            fill
            sizes="64px"
            className="object-cover"
          />
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Main image */}
      <div
        className="relative aspect-square overflow-hidden rounded-xl cursor-zoom-in bg-cream-dark"
        onClick={() => setLightboxOpen(true)}
      >
        {/* Desktop: static, no swipe (unchanged) */}
        <div className="hidden lg:block absolute inset-0">
          <Image
            src={images[activeIndex]}
            alt={`${title} — image ${activeIndex + 1}`}
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
        </div>

        {/* Mobile: swipeable */}
        <div
          className="lg:hidden absolute inset-0"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="absolute inset-0"
            >
              <Image
                src={images[activeIndex]}
                alt={`${title} — image ${activeIndex + 1}`}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && <div className="mt-3">{thumbnails("w-16 h-16")}</div>}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-3xl bg-black border-none shadow-none p-0 gap-0">
          <div className="relative aspect-square">
            {/* Desktop: static, no swipe (unchanged) */}
            <div className="hidden lg:block absolute inset-0">
              <Image
                src={images[activeIndex]}
                alt={`${title} — image ${activeIndex + 1}`}
                fill
                sizes="800px"
                className="object-contain"
              />
            </div>

            {/* Mobile: swipeable */}
            <div
              className="lg:hidden absolute inset-0"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[activeIndex]}
                    alt={`${title} — image ${activeIndex + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          {images.length > 1 && (
            <div className="p-4 pt-3">{thumbnails("w-16 h-16")}</div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
