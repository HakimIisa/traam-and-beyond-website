"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FeaturedCarouselProps {
  images: string[];
}

export default function FeaturedCarousel({ images }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(
    Math.floor(images.length / 2)
  );

  const handleNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  React.useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(handleNext, 4000);
    return () => clearInterval(timer);
  }, [handleNext, images.length]);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full py-16 md:py-20 overflow-hidden bg-[#1a130a]">
      {/* Background glow — brand colors */}
      <div className="absolute inset-0 z-0 opacity-20" aria-hidden="true">
        <div className="absolute top-1/2 left-[-10%] -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(248,232,210,0.35),rgba(255,255,255,0))]" />
        <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(248,232,210,0.3),rgba(255,255,255,0))]" />
      </div>

      {/* Showcase */}
      <div className="relative z-10 w-full h-72 sm:h-72 md:h-80 lg:h-[42rem] flex items-center justify-center [perspective:1000px]">
        {images.map((image, index) => {
          const offset = index - currentIndex;
          const total = images.length;
          let pos = (offset + total) % total;
          if (pos > Math.floor(total / 2)) pos = pos - total;

          const isCenter = pos === 0;
          const isAdjacent = Math.abs(pos) === 1;

          return (
            <div
              key={image + index}
              className="absolute w-[300px] h-[300px] sm:w-[300px] sm:h-[300px] md:w-64 md:h-64 lg:w-[38rem] lg:h-[38rem] transition-all duration-500 ease-in-out flex items-center justify-center"
              style={{
                transform: `
                  translateX(${pos * 45}%)
                  scale(${isCenter ? 1 : isAdjacent ? 0.85 : 0.7})
                  rotateY(${pos * -10}deg)
                `,
                zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                opacity: isCenter ? 1 : isAdjacent ? 0.4 : 0,
                filter: isCenter ? "blur(0px)" : "blur(4px)",
                visibility: Math.abs(pos) > 1 ? "hidden" : "visible",
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={`Featured ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 224px, 288px"
                  className="object-contain"
                />
              </div>
            </div>
          );
        })}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous"
              className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 text-cream hover:text-terracotta transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next"
              className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 text-cream hover:text-terracotta transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
