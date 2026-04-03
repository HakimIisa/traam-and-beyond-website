"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      <article className="group relative flex flex-col">
        {/* Image */}
        <Link href={`/category/${item.categorySlug}/${item.id}`}>
          <div className="relative aspect-square overflow-hidden bg-cream-dark rounded-sm">
            {item.images[0] ? (
              <Image
                src={item.images[0]}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone/40 text-sm">
                No image
              </div>
            )}

            {/* Hover overlay with Enquire (desktop only) */}
            <div className="absolute inset-0 bg-walnut/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-end p-3">
              <Button
                size="sm"
                className="w-full bg-cream text-walnut hover:bg-terracotta hover:text-cream transition-colors text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  setEnquiryOpen(true);
                }}
              >
                Enquire
              </Button>
            </div>
          </div>
        </Link>

        {/* Info */}
        <div className="mt-3 flex flex-col gap-1 px-0.5">
          <Link href={`/category/${item.categorySlug}/${item.id}`}>
            <h3 className="text-sm font-medium text-walnut line-clamp-1 hover:text-terracotta transition-colors">
              {item.title}
            </h3>
          </Link>
          <p className="text-xs text-stone line-clamp-2 leading-relaxed">
            {item.description}
          </p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <Badge
              variant="outline"
              className="text-xs border-stone/30 text-stone font-normal"
            >
              {formatPrice(item.price, item.notForSale)}
            </Badge>

            {/* Mobile Enquire button (always visible) */}
            <Button
              size="sm"
              variant="outline"
              className="md:hidden text-xs border-terracotta text-terracotta hover:bg-terracotta hover:text-cream h-7 px-3"
              onClick={() => setEnquiryOpen(true)}
            >
              Enquire
            </Button>
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
