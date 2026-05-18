"use client";

import { useEffect, useRef } from "react";
import OurStorySection from "./OurStorySection";
import FeaturedSection from "./FeaturedSection";
import type { AboutContent } from "@/types/about-content";

interface Props {
  ourStoryContent: AboutContent["introduction"];
}

export default function BackgroundController({ ourStoryContent }: Props) {
  const ourStoryRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ourStory = ourStoryRef.current;
    const featured = featuredRef.current;
    if (!ourStory || !featured) return;

    featured.style.opacity = "0";
    featured.style.pointerEvents = "none";

    const sentinel = document.getElementById("featured-start-sentinel");
    if (!sentinel) return;

    let current = false;

    const check = () => {
      // Switch to Featured exactly when sentinel's top edge reaches viewport top
      // (solid section has scrolled up to fully cover the fixed panel)
      const show = sentinel.getBoundingClientRect().top <= 0;
      if (show === current) return;
      current = show;
      ourStory.style.opacity = show ? "0" : "1";
      ourStory.style.pointerEvents = show ? "none" : "";
      featured.style.opacity = show ? "1" : "0";
      featured.style.pointerEvents = show ? "" : "none";
    };

    window.addEventListener("scroll", check, { passive: true });
    document.addEventListener("scroll", check, { passive: true });
    check();

    return () => {
      window.removeEventListener("scroll", check);
      document.removeEventListener("scroll", check);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1]">
      <div ref={ourStoryRef} className="absolute inset-0">
        <OurStorySection content={ourStoryContent} />
      </div>
      <div ref={featuredRef} className="absolute inset-0">
        <FeaturedSection />
      </div>
    </div>
  );
}
