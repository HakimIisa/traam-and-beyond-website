"use client";

import Link from "next/link";
import Image from "next/image";
import DeleteStoryButton from "./DeleteStoryButton";
import type { StoryItem } from "@/types";

interface Props {
  items: StoryItem[];
}

export default function StoriesClient({ items }: Props) {
  return (
    <div className="bg-white border border-cream-dark rounded-sm overflow-hidden">
      {items.length === 0 ? (
        <p className="text-stone text-sm p-8 text-center">
          No stories yet. Add your first one.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead className="border-b border-cream-dark bg-cream">
            <tr>
              <th className="text-left px-4 py-3 text-stone font-medium">Image</th>
              <th className="text-left px-4 py-3 text-stone font-medium">Heading</th>
              <th className="text-left px-4 py-3 text-stone font-medium">Sub-heading</th>
              <th className="text-right px-4 py-3 text-stone font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-cream/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="w-12 h-12 rounded-sm overflow-hidden bg-cream-dark flex-shrink-0">
                    {item.image && (
                      <Image
                        src={item.image}
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
                <td className="px-4 py-3 text-stone max-w-xs">
                  <span className="line-clamp-2">{item.subtitle}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/stories/${item.id}`}
                      className="text-xs px-3 py-1.5 border border-walnut text-walnut rounded-sm hover:bg-walnut/5 transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteStoryButton id={item.id} title={item.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
