import Image from "next/image";
import type { AboutContent } from "@/types/about-content";

interface OurStorySectionProps {
  content: AboutContent["introduction"];
}

export default function OurStorySection({ content }: OurStorySectionProps) {
  return (
    <section className="bg-[#FAF6F0] my-[10px]">

      {/* Title */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <h2 className="font-display text-6xl text-[#1a130a] font-semibold text-center">
          Our Story
        </h2>
      </div>

      {/* Mobile: full-bleed — image and text scroll together as one unit */}
      <div className="lg:hidden aspect-square w-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex items-start">
        <div className="w-1/3 shrink-0">
          <Image
            src="/SW3.png"
            alt="Our Story"
            width={621}
            height={2480}
            className="w-full h-auto"
            sizes="33vw"
          />
        </div>
        <div className="w-2/3 pl-4 pr-4 py-4 text-[#1a130a] text-base leading-relaxed text-justify space-y-3">
          <p>{content.paragraph1}</p>
          <p>{content.paragraph2}</p>
          <p>{content.paragraph3}</p>
          <p>{content.paragraph4}</p>
          <p>{content.paragraph5}</p>
        </div>
      </div>

      {/* Desktop: image 1/3 left, text 2/3 right */}
      <div className="hidden lg:block max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-stretch gap-0">
          <div className="relative w-1/3 shrink-0 min-h-[500px]">
            <Image
              src="/SW1.png"
              alt="Our Story"
              fill
              className="object-cover"
              sizes="33vw"
            />
          </div>
          <div className="w-2/3 text-[#1a130a] text-base leading-relaxed text-justify space-y-5 pl-10">
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
