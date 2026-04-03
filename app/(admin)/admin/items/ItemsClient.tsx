"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import DeleteItemButton from "./DeleteItemButton";
import type { Item, Category } from "@/types";

interface Props {
  items: Item[];
  categories: Category[];
}

export default function ItemsClient({ items, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filtered =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.categoryId === selectedCategory);

  return (
    <>
      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory("all")}
          className={cn(
            "px-4 py-2 rounded-sm text-sm transition-colors border",
            selectedCategory === "all"
              ? "bg-walnut text-cream border-walnut"
              : "bg-white text-stone border-cream-dark hover:border-walnut hover:text-walnut"
          )}
        >
          All
          <span className="ml-2 text-xs opacity-70">{items.length}</span>
        </button>
        {categories.map((cat) => {
          const count = items.filter((i) => i.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-sm text-sm transition-colors border",
                selectedCategory === cat.id
                  ? "bg-walnut text-cream border-walnut"
                  : "bg-white text-stone border-cream-dark hover:border-walnut hover:text-walnut"
              )}
            >
              {cat.name}
              <span className="ml-2 text-xs opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white border border-cream-dark rounded-sm overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-stone text-sm p-8 text-center">
            {selectedCategory === "all"
              ? "No items yet. Add your first item."
              : "No items in this category yet."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-cream-dark bg-cream">
              <tr>
                <th className="text-left px-4 py-3 text-stone font-medium">Image</th>
                <th className="text-left px-4 py-3 text-stone font-medium">Title</th>
                <th className="text-left px-4 py-3 text-stone font-medium">Category</th>
                <th className="text-left px-4 py-3 text-stone font-medium">Price</th>
                <th className="text-right px-4 py-3 text-stone font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-cream/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-sm overflow-hidden bg-cream-dark flex-shrink-0">
                      {item.images[0] && (
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-walnut max-w-xs">
                    <span className="line-clamp-2">{item.title}</span>
                  </td>
                  <td className="px-4 py-3 text-stone">{item.categoryName}</td>
                  <td className="px-4 py-3 text-stone text-xs">
                    {formatPrice(item.price, item.notForSale)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/items/${item.id}`}
                        className="text-xs px-3 py-1.5 border border-walnut text-walnut rounded-sm hover:bg-walnut/5 transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteItemButton id={item.id} title={item.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
