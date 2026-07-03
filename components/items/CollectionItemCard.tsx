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

export default function CollectionItemCard({ item }: { item: Item }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-60px" }}
      className="group"
    >
      <Link href={`/category/${item.categorySlug}/${item.id}`} className="block">
        <ImageCarousel
          images={item.images}
          title={item.title}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        <div className="pt-3 pb-2 text-center">
          <h3 className="font-display text-xl lg:text-2xl text-cream group-hover:text-terracotta transition-colors duration-200">
            {item.title}
          </h3>
          {item.titleKashmiri && (
            <p
              className="font-display text-base lg:text-lg text-stone mt-1 group-hover:text-terracotta transition-colors duration-200"
              dir="rtl"
              lang="ks"
            >
              {item.titleKashmiri}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
