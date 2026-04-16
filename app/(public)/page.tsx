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

      {/* Desktop spacer — gives Our Story time to scroll away before Our Collections enters */}
      <div className="hidden lg:block h-[15vh]" />

      <CategoryHighlights categories={categories} content={content.collections} />

      {/* General Enquiry */}
      <section className="bg-cream-dark py-16">
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
