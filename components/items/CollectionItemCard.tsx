"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Item } from "@/types";
import ImageCarousel from "@/components/items/ImageCarousel";

const fadeUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function CollectionItemCard({
  item,
  index = 0,
}: {
  item: Item;
  index?: number;
}) {
  const isOdd = index % 2 === 1;

  return (
    <>
      {/* Mobile: unchanged square card */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-60px" }}
        className="group lg:hidden"
      >
        <Link href={`/category/${item.categorySlug}/${item.id}`} className="block">
          <ImageCarousel
            images={item.images}
            title={item.title}
            sizes="100vw"
          />

          <div className="pt-3 pb-2 text-center">
            <h3 className="font-display text-xl text-cream group-hover:text-terracotta transition-colors duration-200">
              {item.title}
            </h3>
            {item.titleKashmiri && (
              <p
                className="font-display text-base text-stone mt-1 group-hover:text-terracotta transition-colors duration-200"
                dir="rtl"
                lang="ks"
              >
                {item.titleKashmiri}
              </p>
            )}
          </div>
        </Link>
      </motion.div>

      {/* Desktop: alternating 35/65 split, matching Research page layout */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-60px" }}
        className="hidden lg:block group"
      >
        <Link href={`/category/${item.categorySlug}/${item.id}`} className="block">
          <div className={`flex items-stretch ${isOdd ? "flex-row-reverse" : ""}`}>
            <div className="w-[35%]">
              <ImageCarousel
                images={item.images}
                title={item.title}
                sizes="35vw"
              />
            </div>

            <div className="w-[65%] flex flex-col px-16 bg-walnut">
              <div style={{ flexBasis: "61.8%" }} className="shrink-0 flex flex-col justify-end">
                <h3 className={`font-display text-6xl text-cream group-hover:text-terracotta transition-colors ${isOdd ? "text-right" : "text-left"}`}>
                  {item.title}
                </h3>
              </div>
              <div style={{ flexBasis: "38.2%" }} className="shrink-0 flex flex-col justify-start">
                {item.titleKashmiri && (
                  <p
                    className={`font-display text-3xl text-stone mt-1 group-hover:text-terracotta transition-colors ${isOdd ? "text-right" : "text-left"}`}
                    dir="rtl"
                    lang="ks"
                  >
                    {item.titleKashmiri}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </>
  );
}
