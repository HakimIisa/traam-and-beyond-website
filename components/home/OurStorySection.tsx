import Image from "next/image";
import type { AboutContent } from "@/types/about-content";

interface OurStorySectionProps {
  content: AboutContent["introduction"];
}

export default function OurStorySection({ content }: OurStorySectionProps) {
  return (
    <section className="bg-[#FAF6F0] my-[10px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Title — centered, same size as Our Collections */}
        <h2 className="font-display text-6xl text-[#1a130a] font-semibold mb-10 text-center">
          Our Story
        </h2>

        {/* Mobile: 1:1 square box, image left half / text right half */}
        <div className="lg:hidden aspect-square w-full flex overflow-hidden">
          <div className="relative w-1/2 shrink-0 h-full">
            <Image
              src="/SW1.png"
              alt="Our Story"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
          <div className="w-1/2 h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pl-4 pr-2 py-4 text-[#1a130a] text-xs leading-relaxed text-left space-y-3">
            <p>{content.paragraph1}</p>
            <p>{content.paragraph2}</p>
            <p>{content.paragraph3}</p>
            <p>{content.paragraph4}</p>
            <p>{content.paragraph5}</p>
          </div>
        </div>

        {/* Desktop: image 1/3 left, text 2/3 right */}
        <div className="hidden lg:flex items-stretch gap-0">
          <div className="relative w-1/3 shrink-0 min-h-[500px]">
            <Image
              src="/SW1.png"
              alt="Our Story"
              fill
              className="object-cover"
              sizes="33vw"
            />
          </div>
          <div className="w-2/3 text-[#1a130a] text-lg leading-relaxed text-justify space-y-5 pl-10">
            <p>{content.paragraph1}</p>
            <p>{content.paragraph2}</p>
            <p>{content.paragraph3}</p>
            <p>{content.paragraph4}</p>
            <p>{content.paragraph5}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
