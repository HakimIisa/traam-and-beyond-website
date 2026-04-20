import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import HeroSection from "@/components/home/HeroSection";
import OurStorySection from "@/components/home/OurStorySection";
import CategoryHighlights from "@/components/home/CategoryHighlights";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { getAllCategories } from "@/lib/firebase/categories";
import { getHomeContent } from "@/lib/firebase/site-content";
import { getAboutContent } from "@/lib/firebase/about-content";

export const metadata: Metadata = {
  title: "Traam and Beyond — Kashmiri Handcrafted Items",
  description:
    "Discover a curated collection of authentic Kashmiri handcrafted items — copper, silver, jade, papier-mâché, terracotta jewellery, and more.",
};

export default async function HomePage() {
  const [categories, content, aboutContent] = await Promise.all([
    getAllCategories(),
    getHomeContent(),
    getAboutContent(),
  ]);

  return (
    <>
      <HeroSection content={content.hero} />

      <OurStorySection content={aboutContent.introduction} />

      {/* "Our Story" title strip — scrolls over the cream panel, mobile only */}
      <div className="relative z-[2] bg-walnut lg:hidden flex items-center justify-center py-10">
        <h2 className="font-display text-5xl text-cream font-semibold text-center px-4">
          Our Story
        </h2>
      </div>

      {/* Scroll runway — gives Our Story (fixed mobile background) time to be visible */}
      <div className="h-screen lg:hidden" />

      {/* "Read Our Story" button — appears above Collections, mobile only */}
      <div className="relative z-[2] bg-walnut lg:hidden flex items-center justify-center px-8 py-6">
        <a
          href="/about"
          className="inline-block w-full px-8 py-3 bg-terracotta hover:bg-terracotta-light text-cream text-sm tracking-wide transition-colors rounded-sm text-center"
        >
          Read Our Story ›››
        </a>
      </div>

      <CategoryHighlights categories={categories} content={content.collections} />

      {/* General Enquiry */}
      <section className="relative z-[2] bg-cream-dark py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl text-walnut font-semibold mb-2 text-center">
            {content.enquiry.title}
          </h2>
          <p className="text-stone text-center mb-8">
            {content.enquiry.subtitle}
          </p>
          <EnquiryForm type="general" />
        </div>
      </section>
    </>
  );
}
