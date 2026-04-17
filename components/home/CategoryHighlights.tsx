"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types";
import type { HomeContent } from "@/types/home-content";
import { ScrollReveal } from "@/components/ScrollReveal";

const cardVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 1.0 } },
};

const childVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const },
  },
};

interface CategoryHighlightsProps {
  categories: Category[];
  content: HomeContent["collections"];
}

export default function CategoryHighlights({ categories, content }: CategoryHighlightsProps) {
  if (categories.length === 0) return null;

  return (
    <section id="collections" className="py-16 bg-[#1a130a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="font-display text-6xl text-cream font-semibold mb-2 text-center">{content.title}</h2>
          <p className="text-stone mb-12 text-center">{content.subtitle}</p>
        </ScrollReveal>
      </div>

      <div className="flex flex-col">
        {categories.map((cat, index) => (
          <div key={cat.id}>
            {/* Mobile: full-width stacked card */}
            <div className="lg:hidden">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: "-60px" }}
                className="group"
              >
                <Link href={`/category/${cat.slug}`} className="block">
                  <motion.div variants={childVariants} className="relative w-full aspect-square overflow-hidden">
                    {cat.coverImage ? (
                      <Image
                        src={cat.coverImage}
                        alt={cat.name}
                        fill
                        sizes="100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-walnut-light flex items-center justify-center">
                        <span className="text-stone/30 text-4xl">✦</span>
                      </div>
                    )}
                  </motion.div>

                  <motion.div variants={childVariants} className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-10">
                    <h3 className="font-display text-3xl text-cream group-hover:text-terracotta transition-colors duration-300 mb-2">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-stone text-base leading-relaxed whitespace-pre-line text-justify">{cat.description}</p>
                    )}
                    <span className="text-terracotta text-sm mt-3 inline-flex items-center gap-2">
                      Explore Collection <ArrowRight size={14} />
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
              <div className="border-b border-cream-dark/20 mx-4 sm:mx-6" />
            </div>

            {/* Desktop: alternating 35/65 split */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-60px" }}
              className="hidden lg:block group"
            >
              <Link href={`/category/${cat.slug}`} className="block">
                <div className={`flex items-stretch ${index % 2 === 1 ? "flex-row-reverse" : ""}`}>
                  <motion.div variants={childVariants} className="relative w-[35%] aspect-square overflow-hidden">
                    {cat.coverImage ? (
                      <Image
                        src={cat.coverImage}
                        alt={cat.name}
                        fill
                        sizes="35vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-walnut-light flex items-center justify-center">
                        <span className="text-stone/30 text-4xl">✦</span>
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    variants={childVariants}
                    className="w-[65%] flex flex-col justify-center px-16 bg-[#1a130a]"
                  >
                    <h3 className="font-display text-4xl text-cream group-hover:text-terracotta transition-colors duration-300 mb-4">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-stone leading-relaxed mb-6 whitespace-pre-line text-justify">{cat.description}</p>
                    )}
                    <span className="text-terracotta inline-flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                      Explore Collection <ArrowRight size={16} />
                    </span>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
