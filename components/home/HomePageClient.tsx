"use client";

import { useRef, useState, useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import OurStorySection from "@/components/home/OurStorySection";
import FeaturedSection from "@/components/home/FeaturedSection";
import ThirdFeaturedSection from "@/components/home/ThirdFeaturedSection";
import CategoryHighlights from "@/components/home/CategoryHighlights";
import ResearchHighlights from "@/components/home/ResearchHighlights";
import StoriesHighlights, { type StoryCard } from "@/components/home/StoriesHighlights";
import EnquiryForm from "@/components/forms/EnquiryForm";
import type { HomeContent } from "@/types/home-content";
import type { AboutContent } from "@/types/about-content";
import type { Category, FeaturedPanelNumber } from "@/types";

interface Props {
  categories: Category[];
  content: HomeContent;
  aboutContent: AboutContent;
  /** Featured carousel images per panel: 1 = above Collections, 2 = above Research, 3 = above Stories */
  featuredPanels: Record<FeaturedPanelNumber, string[]>;
  stories: StoryCard[];
}

// Which background panel is currently showing through the transparent gaps
// 0 = Our Story, 1 = Featured, 2 = Third Featured
type Panel = 0 | 1 | 2;

export default function HomePageClient({ categories, content, aboutContent, featuredPanels, stories }: Props) {
  const [panel, setPanel] = useState<Panel>(0);
  const buttonStripRef = useRef<HTMLDivElement>(null);
  const researchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const featuredTrigger = buttonStripRef.current;
    const thirdTrigger = researchRef.current;
    if (!featuredTrigger || !thirdTrigger) return;

    let current: Panel = 0;

    // Each trigger is an opaque block that fully covers the sticky background once its
    // top edge reaches the viewport top — that's the moment it's safe to swap panels.
    const check = () => {
      const next: Panel =
        thirdTrigger.getBoundingClientRect().top <= 0
          ? 2
          : featuredTrigger.getBoundingClientRect().top <= 0
            ? 1
            : 0;
      if (next === current) return;
      current = next;
      setPanel(next);
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
      {/* Sticky background — OurStory, Featured and Third Featured panels crossfade based on scroll */}
      <div className="sticky top-0 h-screen z-[1] overflow-hidden">
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            panel === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <OurStorySection content={aboutContent.introduction} />
        </div>
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            panel === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <FeaturedSection />
        </div>
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            panel === 2 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ThirdFeaturedSection />
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
          className="bg-[#1a130a] px-8 py-[12px] lg:py-[16px]"
        />

        {/* Our Collections — opaque */}
        <div className="pointer-events-auto">
          <CategoryHighlights categories={categories} content={content.collections} featuredImages={featuredPanels[1]} />
        </div>

        {/* Transparent gap 2 — Featured visible beneath */}
        <div className="aspect-square lg:h-[85vh] w-full" />

        {/* Research — opaque; ref fires the Featured → Third Featured switch */}
        <div ref={researchRef} className="pointer-events-auto">
          <ResearchHighlights featuredImages={featuredPanels[2]} />
        </div>

        {/* Transparent gap 3 — Third Featured visible beneath */}
        <div className="aspect-square lg:h-[85vh] w-full" />

        {/* Stories — opaque; omitted until at least one story exists */}
        {stories.length > 0 && (
          <div className="pointer-events-auto">
            <StoriesHighlights stories={stories} featuredImages={featuredPanels[3]} />
          </div>
        )}

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
