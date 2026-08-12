"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ImageCarousel from "@/components/items/ImageCarousel";
import type { ResearchItem } from "@/types";

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

interface ResearchItemCardProps {
  item: ResearchItem;
  sectionSlug: string;
  index: number;
  showDescription?: boolean;
}

export default function ResearchItemCard({
  item,
  sectionSlug,
  index,
  showDescription = true,
}: ResearchItemCardProps) {
  const isOdd = index % 2 === 1;
  const href = `/research/${sectionSlug}/${item.slug}`;

  return (
    <>
      {/* Mobile: full-width stacked card */}
      <div className="lg:hidden">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-60px" }}
          className="group"
        >
          <Link href={href} className="block">
            <motion.div variants={childVariants}>
              <ImageCarousel
                images={item.images}
                title={item.title}
                sizes="100vw"
              />
            </motion.div>

            <motion.div variants={childVariants} className="px-4 sm:px-6 pt-5 pb-10 text-center">
              <h3 className="font-display text-3xl text-cream group-hover:text-terracotta transition-colors">
                {item.title}
              </h3>
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
        <Link href={href} className="block">
          <div className={`flex items-stretch ${isOdd ? "flex-row-reverse" : ""}`}>
            <motion.div variants={childVariants} className="w-[35%]">
              <ImageCarousel
                images={item.images}
                title={item.title}
                sizes="35vw"
              />
            </motion.div>

            {showDescription ? (
              <motion.div
                variants={childVariants}
                className="w-[65%] flex flex-col justify-center px-16 bg-walnut"
              >
                <h3 className="font-display text-6xl text-cream mb-3 group-hover:text-terracotta transition-colors">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-stone leading-relaxed line-clamp-4 whitespace-pre-line text-justify">
                    {item.description}
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div variants={childVariants} className="w-[65%] flex flex-col px-16 bg-walnut">
                <div style={{ flexBasis: "61.8%" }} className="shrink-0 flex flex-col justify-end">
                  <h3
                    className={`font-display text-6xl text-cream group-hover:text-terracotta transition-colors translate-y-1/2 ${
                      isOdd ? "text-right" : "text-left"
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>
                <div style={{ flexBasis: "38.2%" }} className="shrink-0" />
              </motion.div>
            )}
          </div>
        </Link>
      </motion.div>
    </>
  );
}
