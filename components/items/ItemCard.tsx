"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Item } from "@/types";
import EnquiryDialog from "@/components/forms/EnquiryDialog";

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

interface ItemCardProps {
  item: Item;
  index: number;
}

export default function ItemCard({ item, index }: ItemCardProps) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const isOdd = index % 2 === 1;

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
          <Link href={`/category/${item.categorySlug}/${item.id}`} className="block">
            <motion.div variants={childVariants} className="relative w-full aspect-square overflow-hidden">
              {item.images[0] ? (
                <Image
                  src={item.images[0]}
                  alt={item.title}
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

            <motion.div variants={childVariants} className="px-4 sm:px-6 pt-5 pb-10">
              <h3 className="font-display text-3xl text-cream mb-2 group-hover:text-terracotta transition-colors">
                {item.title}
              </h3>
              <p className="text-stone text-sm leading-relaxed line-clamp-3 mb-3 whitespace-pre-line text-justify">
                {item.description}
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <Badge variant="outline" className="border-stone/30 text-stone font-normal">
                  {formatPrice(item.price, item.notForSale)}
                </Badge>
                <button
                  onClick={(e) => { e.preventDefault(); setEnquiryOpen(true); }}
                  className="inline-flex items-center gap-1.5 text-terracotta text-sm font-medium"
                >
                  Enquire <ArrowRight size={14} />
                </button>
              </div>
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
        <Link href={`/category/${item.categorySlug}/${item.id}`} className="block">
          <div className={`flex items-stretch ${isOdd ? "flex-row-reverse" : ""}`}>
            <motion.div variants={childVariants} className="relative w-[35%] aspect-square overflow-hidden">
              {item.images[0] ? (
                <Image
                  src={item.images[0]}
                  alt={item.title}
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
              className="w-[65%] flex flex-col justify-center px-16 bg-walnut"
            >
              <h3 className="font-display text-6xl text-cream mb-4 group-hover:text-terracotta transition-colors">
                {item.title}
              </h3>
              <p className="text-stone leading-relaxed mb-4 line-clamp-4 whitespace-pre-line text-justify">
                {item.description}
              </p>
              <div className="flex items-center gap-4 flex-wrap mb-2">
                <Badge variant="outline" className="border-stone/30 text-stone font-normal">
                  {formatPrice(item.price, item.notForSale)}
                </Badge>
              </div>
              <button
                onClick={(e) => { e.preventDefault(); setEnquiryOpen(true); }}
                className="inline-flex items-center gap-2 text-terracotta group-hover:gap-4 transition-all duration-300 w-fit"
              >
                Enquire <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>
        </Link>
      </motion.div>

      <EnquiryDialog
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        item={{ id: item.id, title: item.title }}
      />
    </>
  );
}
