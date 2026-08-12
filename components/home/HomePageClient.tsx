"use client";

import { useRef, useState, useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import OurStorySection from "@/components/home/OurStorySection";
import FeaturedSection from "@/components/home/FeaturedSection";
import CategoryHighlights from "@/components/home/CategoryHighlights";
import ResearchHighlights from "@/components/home/ResearchHighlights";
import EnquiryForm from "@/components/forms/EnquiryForm";
import type { HomeContent } from "@/types/home-content";
import type { AboutContent } from "@/types/about-content";
import type { Category } from "@/types";

interface Props {
  categories: Category[];
  content: HomeContent;
  aboutContent: AboutContent;
}

export default function HomePageClient({ categories, content, aboutContent }: Props) {
  const [showFeatured, setShowFeatured] = useState(false);
  const buttonStripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = buttonStripRef.current;
    if (!trigger) return;

    let current = false;

    const check = () => {
      const show = trigger.getBoundingClientRect().top <= 0;
      if (show === current) return;
      current = show;
      setShowFeatured(show);
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
    <div className="relative w-full bg-[#1a130a]">
      {/* Sticky background — OurStory and Featured panels crossfade based on scroll */}
      <div className="sticky top-0 h-screen z-[1] overflow-hidden">
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            showFeatured ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <OurStorySection content={aboutContent.introduction} />
        </div>
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            showFeatured ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <FeaturedSection />
        </div>
      </div>

      {/* Foreground — pulled up to overlap sticky background. pointer-events-none here so the
          transparent gaps let clicks reach the sticky layer beneath (e.g. the Our Story link);
          each opaque child re-enables pointer-events-auto for itself. */}
      <div className="relative z-[2] -mt-[100vh] pointer-events-none">
        {/* HeroSection — opaque (bg-walnut), all animations unchanged */}
        <div className="pointer-events-auto">
          <HeroSection content={content.hero} />
        </div>

        {/* Transparent gap 1 — OurStory visible beneath */}
        <div className="aspect-square lg:h-[85vh] w-full" />

        {/* Trigger strip — first opaque element after gap 1; ref fires the crossfade switch */}
        <div
          ref={buttonStripRef}
          className="bg-[#1a130a] px-8 py-6"
        />

        {/* Our Collections — opaque */}
        <div className="pointer-events-auto">
          <CategoryHighlights categories={categories} content={content.collections} />
        </div>

        {/* Transparent gap 2 — Featured visible beneath */}
        <div className="aspect-square lg:h-[85vh] w-full" />

        {/* Research — opaque */}
        <div className="pointer-events-auto">
          <ResearchHighlights />
        </div>

        {/* General Enquiry — opaque */}
        <section className="bg-cream-dark py-16 pointer-events-auto">
          <div className="max-w-xl mx-auto px-4 sm:px-6">
            <p className="text-stone text-center mb-8">{content.enquiry.subtitle}</p>
            <EnquiryForm type="general" />
          </div>
        </section>
      </div>
    </div>
  );
}
