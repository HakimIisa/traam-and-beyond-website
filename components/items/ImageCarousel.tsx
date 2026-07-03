"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ImageCarouselProps {
  images: string[];
  title: string;
  sizes: string;
  dotsPosition?: "inside" | "below";
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%" }),
};

const transition = { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const };

export default function ImageCarousel({
  images,
  title,
  sizes,
  dotsPosition = "below",
}: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const total = images.length;

  const navigate = (e: React.MouseEvent | React.TouchEvent, dir: 1 | -1) => {
    e.preventDefault();
    e.stopPropagation();
    setDirection(dir);
    setCurrent((prev) => (prev + dir + total) % total);
  };

  const goTo = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      navigate(e, delta > 0 ? 1 : -1);
    }
    setTouchStartX(null);
  };

  const dots = (
    <div
      className="flex items-center justify-center gap-1.5 lg:gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      {Array.from({ length: Math.max(total, 1) }).map((_, i) => (
        <button
          key={i}
          onClick={(e) => goTo(e, i)}
          aria-label={`Image ${i + 1}`}
          className={`rounded-full transition-all duration-200 lg:hover:scale-150 ${
            i === current
              ? "w-2 h-2 lg:w-3 lg:h-3 bg-terracotta"
              : "w-1.5 h-1.5 lg:w-2 lg:h-2 bg-cream/30 hover:bg-cream/60"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div>
      <div
        className="relative w-full aspect-square overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="absolute inset-0"
          >
            {images[current] ? (
              <Image
                src={images[current]}
                alt={`${title} — image ${current + 1}`}
                fill
                sizes={sizes}
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-walnut-light flex items-center justify-center">
                <span className="text-stone/30 text-4xl">✦</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {dotsPosition === "inside" && total > 0 && (
          <div className="absolute bottom-3 inset-x-0 z-10 flex justify-center">
            {dots}
          </div>
        )}
      </div>

      {dotsPosition === "below" && total > 0 && (
        <div className="pt-2">{dots}</div>
      )}
    </div>
  );
}
