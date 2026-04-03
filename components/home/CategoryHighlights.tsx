import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types";
import type { HomeContent } from "@/types/home-content";

interface CategoryHighlightsProps {
  categories: Category[];
  content: HomeContent["collections"];
}

export default function CategoryHighlights({ categories, content }: CategoryHighlightsProps) {
  if (categories.length === 0) return null;

  return (
    <section id="collections" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl text-walnut font-semibold mb-2">{content.title}</h2>
      <p className="text-stone mb-12">{content.subtitle}</p>

      <div className="flex flex-col divide-y divide-cream-dark">
        {categories.map((cat, index) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group flex flex-col sm:flex-row items-stretch gap-0 hover:bg-cream-dark/40 transition-colors duration-300 py-8 first:pt-0 last:pb-0"
          >
            {/* Image */}
            <div className="relative w-full sm:w-56 flex-shrink-0 aspect-square sm:aspect-auto sm:h-48 overflow-hidden rounded-sm bg-cream-dark">
              {cat.coverImage ? (
                <Image
                  src={cat.coverImage}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 224px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-stone/30 text-4xl">✦</span>
                </div>
              )}
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center sm:pl-10 pt-5 sm:pt-0 flex-1">
              <h3 className="text-2xl font-semibold text-walnut group-hover:text-terracotta transition-colors mb-3">
                {cat.name}
              </h3>
              {cat.description ? (
                <p className="text-stone text-sm leading-relaxed max-w-lg">
                  {cat.description}
                </p>
              ) : (
                <p className="text-stone/40 text-sm italic">No description yet.</p>
              )}
              <span className="inline-flex items-center gap-1.5 text-terracotta text-sm mt-5 font-medium group-hover:gap-3 transition-all duration-300">
                Explore Collection <ArrowRight size={15} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
