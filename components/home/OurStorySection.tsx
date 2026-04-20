import Image from "next/image";
import type { AboutContent } from "@/types/about-content";

interface OurStorySectionProps {
  content: AboutContent["introduction"];
}

const MOBILE_P1 =
  "In 2004, my mother bought me a copper bowl for three hundred Indian rupees in Srinagar. She had no way of knowing, and nor did I, that she had brought me not just a bowl, but inspired the beginning of something beautiful and meaningful……";

const MOBILE_P2 =
  "This is a space for the handcrafted Kashmiri masterpieces, left behind or forgotten, their stories fading away quietly, and our legacy worth remembering";

export default function OurStorySection({ content }: OurStorySectionProps) {
  return (
    <>
      {/* ── MOBILE: fixed background plane ──────────────────────────────────── */}
      <div className="lg:hidden fixed inset-0 z-[1] bg-[#FAF6F0] flex flex-col items-center justify-center">

        {/* Content window */}
        <div className="w-full flex flex-col">

          <Image
            src="/OurStory1.png"
            alt="Kashmiri craft detail"
            width={2480}
            height={1752}
            className="w-full h-auto"
            sizes="100vw"
          />

          <div className="px-6 py-5 text-center space-y-3">
            <p className="text-[#1a130a] text-base leading-relaxed">
              {MOBILE_P1}
            </p>
            <p className="text-[#D4A017] text-base leading-relaxed font-semibold">
              {MOBILE_P2}
            </p>
          </div>

          <Image
            src="/OurStory2.png"
            alt="Kashmiri craft detail"
            width={2480}
            height={1745}
            className="w-full h-auto"
            sizes="100vw"
          />

        </div>
      </div>

      {/* ── DESKTOP: existing layout (unchanged) ────────────────────────────── */}
      <section className="hidden lg:block bg-[#FAF6F0] my-[10px]">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <h2 className="font-display text-6xl text-[#1a130a] font-semibold text-center">
            Our Story
          </h2>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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
    </>
  );
}
