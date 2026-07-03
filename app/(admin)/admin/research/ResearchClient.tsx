"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import DeleteResearchItemButton from "./DeleteResearchItemButton";
import type { ResearchItem } from "@/types";

const SECTIONS = [
  { slug: "adaptive-reuse", label: "Adaptive Reuse" },
  { slug: "reinterpretation", label: "Reinterpretation" },
  { slug: "graphic-design", label: "Graphic Design" },
];

interface Props {
  items: ResearchItem[];
}

export default function ResearchClient({ items }: Props) {
  const [selectedSection, setSelectedSection] = useState<string>("all");

  const filtered =
    selectedSection === "all"
      ? items
      : items.filter((item) => item.sectionSlug === selectedSection);

  return (
    <>
      {/* Section filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedSection("all")}
          className={cn(
            "px-4 py-2 rounded-sm text-sm transition-colors border",
            selectedSection === "all"
              ? "bg-walnut text-cream border-walnut"
              : "bg-white text-stone border-cream-dark hover:border-walnut hover:text-walnut"
          )}
        >
          All
          <span className="ml-2 text-xs opacity-70">{items.length}</span>
        </button>
        {SECTIONS.map((sec) => {
          const count = items.filter((i) => i.sectionSlug === sec.slug).length;
          return (
            <button
              key={sec.slug}
              onClick={() => setSelectedSection(sec.slug)}
              className={cn(
                "px-4 py-2 rounded-sm text-sm transition-colors border",
                selectedSection === sec.slug
                  ? "bg-walnut text-cream border-walnut"
                  : "bg-white text-stone border-cream-dark hover:border-walnut hover:text-walnut"
              )}
            >
              {sec.label}
              <span className="ml-2 text-xs opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white border border-cream-dark rounded-sm overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-stone text-sm p-8 text-center">
            {selectedSection === "all"
              ? "No research items yet. Add your first item or seed existing ones."
              : "No items in this section yet."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-cream-dark bg-cream">
              <tr>
                <th className="text-left px-4 py-3 text-stone font-medium">Image</th>
                <th className="text-left px-4 py-3 text-stone font-medium">Title</th>
                <th className="text-left px-4 py-3 text-stone font-medium">Section</th>
                <th className="text-right px-4 py-3 text-stone font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {filtered.map((item) => {
                const sectionLabel = SECTIONS.find((s) => s.slug === item.sectionSlug)?.label ?? item.sectionSlug;
                return (
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
                    <td className="px-4 py-3 text-stone">{sectionLabel}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/research/${item.id}`}
                          className="text-xs px-3 py-1.5 border border-walnut text-walnut rounded-sm hover:bg-walnut/5 transition-colors"
                        >
                          Edit
                        </Link>
                        <DeleteResearchItemButton id={item.id} title={item.title} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
