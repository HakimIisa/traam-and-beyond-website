"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemImageGalleryProps {
  images: string[];
  title: string;
}

export default function ItemImageGallery({
  images,
  title,
}: ItemImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-cream-dark rounded-xl flex items-center justify-center text-stone/40">
        No image
      </div>
    );
  }

  function prev() {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }
  function next() {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  return (
    <>
      {/* Main image */}
      <div
        className="relative aspect-square overflow-hidden rounded-xl cursor-zoom-in bg-cream-dark"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={images[activeIndex]}
          alt={`${title} — image ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-cream/80 hover:bg-cream rounded-full p-1 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-cream/80 hover:bg-cream rounded-full p-1 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors",
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
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-3xl bg-walnut border-none p-2">
          <div className="relative aspect-square">
            <Image
              src={images[activeIndex]}
              alt={`${title} — image ${activeIndex + 1}`}
              fill
              sizes="800px"
              className="object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-cream/20 hover:bg-cream/40 rounded-full p-2 transition-colors"
                >
                  <ChevronLeft size={22} className="text-cream" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-cream/20 hover:bg-cream/40 rounded-full p-2 transition-colors"
                >
                  <ChevronRight size={22} className="text-cream" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
