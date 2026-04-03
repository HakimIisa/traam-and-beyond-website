import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import CategoryHighlights from "@/components/home/CategoryHighlights";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { getAllCategories } from "@/lib/firebase/categories";
import { getHomeContent } from "@/lib/firebase/site-content";

export const metadata: Metadata = {
  title: "Traam and Beyond — Kashmiri Handcrafted Items",
  description:
    "Discover a curated collection of authentic Kashmiri handcrafted items — copper, silver, jade, papier-mâché, terracotta jewellery, and more.",
};

export default async function HomePage() {
  const [categories, content] = await Promise.all([
    getAllCategories(),
    getHomeContent(),
  ]);

  return (
    <>
      <HeroSection content={content.hero} />

      {/* Intro */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl text-walnut font-semibold mb-4">
          {content.intro.title}
        </h2>
        <p className="text-stone leading-relaxed text-lg">
          {content.intro.body}
        </p>
      </section>

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
