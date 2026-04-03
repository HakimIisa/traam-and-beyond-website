"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Item } from "@/types";
import EnquiryDialog from "@/components/forms/EnquiryDialog";

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <>
      <article className="group flex flex-col sm:flex-row items-stretch gap-0 hover:bg-cream-dark/40 transition-colors duration-300 py-8 first:pt-0 last:pb-0">
        {/* Image */}
        <Link
          href={`/category/${item.categorySlug}/${item.id}`}
          className="relative w-full sm:w-56 flex-shrink-0 aspect-square sm:aspect-auto sm:h-52 overflow-hidden rounded-xl bg-cream-dark block"
        >
          {item.images[0] ? (
            <Image
              src={item.images[0]}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, 224px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone/30 text-sm">
              No image
            </div>
          )}
        </Link>

        {/* Text */}
        <div className="flex flex-col justify-center sm:pl-10 pt-5 sm:pt-0 flex-1">
          <Link href={`/category/${item.categorySlug}/${item.id}`}>
            <h3 className="text-2xl font-semibold text-walnut group-hover:text-terracotta transition-colors mb-3">
              {item.title}
            </h3>
          </Link>
          <p className="text-stone text-sm leading-relaxed max-w-lg line-clamp-3">
            {item.description}
          </p>

          <div className="mt-5 flex items-center gap-4 flex-wrap">
            <Badge
              variant="outline"
              className="border-stone/30 text-stone font-normal"
            >
              {formatPrice(item.price, item.notForSale)}
            </Badge>

            <button
              onClick={() => setEnquiryOpen(true)}
              className="inline-flex items-center gap-1.5 text-terracotta text-sm font-medium group-hover:gap-3 transition-all duration-300"
            >
              Enquire <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </article>

      <EnquiryDialog
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        item={{ id: item.id, title: item.title }}
      />
    </>
  );
}
