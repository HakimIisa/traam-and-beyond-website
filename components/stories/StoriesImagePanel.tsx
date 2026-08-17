"use client";

import Image from "next/image";
import type { StoryItem } from "@/types";

interface StoriesImagePanelProps {
  stories: StoryItem[];
  imageIndex: number;
}

export default function StoriesImagePanel({ stories, imageIndex }: StoriesImagePanelProps) {
  return (
    <div className="hidden lg:block sticky top-24 h-[calc(100vh-7rem)] w-full">
      <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-[#0a0a0a]">
        {stories.map((story, i) =>
          story.image ? (
            <Image
              key={story.id}
              src={story.image}
              alt={story.title}
              fill
              sizes="(min-width: 1280px) 500px, 440px"
              priority={i === 0}
              className={`object-cover transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                imageIndex === i ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : null
        )}
      </div>
    </div>
  );
}
